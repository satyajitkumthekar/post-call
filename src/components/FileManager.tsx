import { useEffect, useState } from 'react';
import { Trash2, Video, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  bucket_id: string;
  file_path: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  created_at: string;
}

interface FileManagerProps {
  bucketId?: 'main-videos' | 'video-testimonials' | 'text-testimonial-images';
  refreshTrigger?: number;
}

export default function FileManager({ bucketId, refreshTrigger }: FileManagerProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('uploaded_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (bucketId) {
        query = query.eq('bucket_id', bucketId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [bucketId, refreshTrigger]);

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm(`Delete ${file.file_name}?`)) return;

    setDeletingId(file.id);
    try {
      const { error: storageError } = await supabase.storage
        .from(file.bucket_id)
        .remove([file.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      setFiles(prev => prev.filter(f => f.id !== file.id));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => {
        const isVideo = file.file_type.startsWith('video/');
        const isImage = file.file_type.startsWith('image/');

        return (
          <div
            key={file.id}
            className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
              {isVideo && (
                <video
                  src={file.url}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              )}
              {isImage && (
                <img
                  src={file.url}
                  alt={file.file_name}
                  className="w-full h-full object-cover"
                />
              )}
              {!isVideo && !isImage && (
                <div className="text-gray-400">
                  {isVideo ? <Video className="h-12 w-12" /> : <ImageIcon className="h-12 w-12" />}
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
                {file.file_name}
              </h3>
              <p className="text-xs text-gray-500 mb-2">
                {formatFileSize(file.file_size)} • {formatDate(file.created_at)}
              </p>
              <div className="text-xs text-gray-400 mb-3 truncate">
                {file.bucket_id.replace(/-/g, ' ')}
              </div>

              <div className="flex gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View
                </a>
                <button
                  onClick={() => handleDelete(file)}
                  disabled={deletingId === file.id}
                  className="px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors disabled:opacity-50"
                >
                  {deletingId === file.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
