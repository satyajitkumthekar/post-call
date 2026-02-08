import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Video, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FileUploaderProps {
  bucketId: 'main-videos' | 'video-testimonials' | 'text-testimonial-images';
  onUploadComplete?: () => void;
}

interface UploadStatus {
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  url?: string;
}

interface PendingFile {
  file: File;
  previewUrl: string;
}

export default function FileUploader({ bucketId, onUploadComplete }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [testimonialName, setTestimonialName] = useState('');
  const [testimonialDesignation, setTestimonialDesignation] = useState('');
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = bucketId === 'text-testimonial-images'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'video/mp4,video/webm,video/ogg';

  const isVideoTestimonial = bucketId === 'video-testimonials';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      loadFile(file);
    }
  };

  const loadFile = async (file: File) => {
    setIsLoadingFile(true);

    try {
      const previewUrl = URL.createObjectURL(file);
      setPendingFile({ file, previewUrl });
    } catch (error) {
      console.error('Error loading file:', error);
      alert('Failed to load file. Please try again.');
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleFiles = async (files: File[]) => {
    if (files.length > 0) {
      loadFile(files[0]);
    }
  };

  const handleAddFile = async () => {
    if (!pendingFile) return;

    if (isVideoTestimonial && !testimonialName.trim()) {
      alert('Please enter the testimonial name');
      return;
    }

    const file = pendingFile.file;

    const uploadStatus: UploadStatus = {
      file,
      status: 'uploading',
      progress: 0
    };

    setUploads(prev => [...prev, uploadStatus]);
    const uploadIndex = uploads.length;

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to upload files');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file with progress tracking
      const { error: uploadError } = await supabase.storage
        .from(bucketId)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message || JSON.stringify(uploadError)}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketId)
        .getPublicUrl(filePath);

      const insertData: any = {
        bucket_id: bucketId,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        url: publicUrl,
        uploaded_by: user.id
      };

      if (isVideoTestimonial && testimonialName) {
        insertData.testimonial_name = testimonialName;
        insertData.testimonial_designation = testimonialDesignation;
      }

      const { error: dbError } = await supabase
        .from('uploaded_files')
        .insert(insertData);

      if (dbError) throw dbError;

      setUploads(prev => {
        const newUploads = [...prev];
        newUploads[uploadIndex] = {
          ...newUploads[uploadIndex],
          status: 'success',
          progress: 100,
          url: publicUrl
        };
        return newUploads;
      });

      if (onUploadComplete) {
        onUploadComplete();
      }

      setPendingFile(null);
      setTestimonialName('');
      setTestimonialDesignation('');
      URL.revokeObjectURL(pendingFile.previewUrl);

    } catch (error) {
      setUploads(prev => {
        const newUploads = [...prev];
        newUploads[uploadIndex] = {
          ...newUploads[uploadIndex],
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Upload failed'
        };
        return newUploads;
      });
    }
  };

  const handleCancelPending = () => {
    if (pendingFile) {
      URL.revokeObjectURL(pendingFile.previewUrl);
      setPendingFile(null);
    }
  };

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index));
  };

  const bucketLabels = {
    'main-videos': 'Main Videos',
    'video-testimonials': 'Video Testimonials',
    'text-testimonial-images': 'Text Testimonial Images'
  };

  return (
    <div className="space-y-4">
      {isVideoTestimonial && (
        <div className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={testimonialName}
              onChange={(e) => setTestimonialName(e.target.value)}
              placeholder="Enter person's name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!!pendingFile || uploads.some(u => u.status === 'uploading')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation
            </label>
            <input
              type="text"
              value={testimonialDesignation}
              onChange={(e) => setTestimonialDesignation(e.target.value)}
              placeholder="Enter designation/role"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!!pendingFile || uploads.some(u => u.status === 'uploading')}
            />
          </div>
        </div>
      )}

      {isLoadingFile && (
        <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Loading file...</p>
          </div>
        </div>
      )}

      {pendingFile && !isLoadingFile && (
        <div className="border-2 border-blue-500 rounded-lg p-4 bg-blue-50">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {bucketId === 'text-testimonial-images' ? (
                <img
                  src={pendingFile.previewUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Video className="w-10 h-10 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate mb-1">
                {pendingFile.file.name}
              </p>
              <p className="text-xs text-gray-600">
                {(pendingFile.file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {isVideoTestimonial && (
                <div className="mt-2 text-xs text-gray-600">
                  <p><strong>Name:</strong> {testimonialName || 'Not set'}</p>
                  {testimonialDesignation && <p><strong>Designation:</strong> {testimonialDesignation}</p>}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddFile}
                disabled={uploads.some(u => u.status === 'uploading') || (isVideoTestimonial && !testimonialName.trim())}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
              <button
                onClick={handleCancelPending}
                disabled={uploads.some(u => u.status === 'uploading')}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!pendingFile && !isLoadingFile && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Upload to {bucketLabels[bucketId]}
          </p>
          <p className="text-sm text-gray-500">
            Drag and drop files here, or click to browse
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-white border rounded-lg"
            >
              {upload.status === 'uploading' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
              )}
              {upload.status === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {upload.status === 'error' && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {upload.file.name}
                </p>
                {upload.status === 'uploading' && (
                  <div className="mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium w-12 text-right">
                        {upload.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {(upload.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
                {upload.status === 'error' && upload.error && (
                  <p className="text-xs text-red-500">{upload.error}</p>
                )}
                {upload.status === 'success' && (
                  <p className="text-xs text-green-600">Upload complete</p>
                )}
              </div>

              <button
                onClick={() => removeUpload(index)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
