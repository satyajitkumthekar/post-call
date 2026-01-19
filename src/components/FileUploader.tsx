import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
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

export default function FileUploader({ bucketId, onUploadComplete }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = bucketId === 'text-testimonial-images'
    ? 'image/jpeg,image/png,image/webp,image/gif'
    : 'video/mp4,video/webm,video/ogg';

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
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const newUploads: UploadStatus[] = files.map(file => ({
      file,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploads(prev => [...prev, ...newUploads]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadIndex = uploads.length + i;

      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('You must be logged in to upload files');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketId)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucketId)
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('uploaded_files')
          .insert({
            bucket_id: bucketId,
            file_path: filePath,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            url: publicUrl,
            uploaded_by: user.id
          });

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
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

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
