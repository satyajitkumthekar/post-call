import { useEffect, useState } from 'react';
import { Download, Film, ArrowLeft, Loader2, CheckCircle2, AlertCircle, DownloadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VideoFile {
  id: string;
  bucket_id: string;
  file_name: string;
  file_size: number | null;
  url: string;
  thumbnail_url: string | null;
  testimonial_name: string | null;
  testimonial_designation: string | null;
}

const SECTION_LABELS: Record<string, string> = {
  'main-videos': 'Main Video',
  'video-testimonials': 'Video Testimonials',
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function downloadFile(file: VideoFile) {
  const response = await fetch(file.url);
  if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = file.file_name || 'video.mp4';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export default function VideoDownloads() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [bulkActive, setBulkActive] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from('uploaded_files')
          .select('id, bucket_id, file_name, file_size, url, thumbnail_url, testimonial_name, testimonial_designation')
          .in('bucket_id', ['main-videos', 'video-testimonials'])
          .order('created_at', { ascending: true });

        if (error) throw error;
        setVideos(data ?? []);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleDownloadOne = async (file: VideoFile) => {
    setDownloadingIds((prev) => new Set(prev).add(file.id));
    setFailedIds((prev) => {
      const next = new Set(prev);
      next.delete(file.id);
      return next;
    });
    try {
      await downloadFile(file);
      setDoneIds((prev) => new Set(prev).add(file.id));
    } catch {
      setFailedIds((prev) => new Set(prev).add(file.id));
    } finally {
      setDownloadingIds((prev) => {
        const next = new Set(prev);
        next.delete(file.id);
        return next;
      });
    }
  };

  const handleDownloadAll = async () => {
    setBulkActive(true);
    setBulkProgress(0);
    for (let i = 0; i < videos.length; i++) {
      const file = videos[i];
      await handleDownloadOne(file);
      setBulkProgress(i + 1);
      // Small pause so the browser handles multiple downloads reliably
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    setBulkActive(false);
  };

  const goBack = () => {
    window.history.pushState({}, '', '/media');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const totalSize = videos.reduce((sum, v) => sum + (v.file_size ?? 0), 0);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40"
        style={{
          backgroundColor: 'rgba(10,10,11,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Back to media library"
            >
              <ArrowLeft className="w-4 h-4" style={{ color: '#C9A84C' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', color: '#C9A84C', letterSpacing: '0.05em' }}>
                Back
              </span>
            </button>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '1.15rem',
                letterSpacing: '0.18em',
              }}
            >
              <span style={{ color: '#F0EDE8' }}>SUPERHUMAN</span>
              <span style={{ color: '#C9A84C' }}> LAB</span>
            </span>
          </div>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            Video Assets
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
        <div className="flex items-center gap-3 mb-2">
          <Film className="w-4 h-4" style={{ color: '#C9A84C' }} />
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#C9A84C',
            }}
          >
            Every video on the site
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: '#F0EDE8',
            lineHeight: 1.15,
            marginBottom: '8px',
          }}
        >
          Video Assets
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.9rem', color: '#8A8680', lineHeight: 1.7, maxWidth: '560px' }}>
          {isLoading
            ? 'Loading videos...'
            : `${videos.length} video${videos.length === 1 ? '' : 's'}${totalSize > 0 ? ` · ${formatBytes(totalSize)} total` : ''}. Download each one individually, or grab everything at once.`}
        </p>

        {!isLoading && videos.length > 1 && (
          <div style={{ margin: '28px 0 36px' }}>
            <button
              onClick={handleDownloadAll}
              disabled={bulkActive}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
                fontSize: '0.82rem',
                letterSpacing: '0.05em',
                cursor: bulkActive ? 'wait' : 'pointer',
                backgroundColor: bulkActive ? 'rgba(201,168,76,0.15)' : '#C9A84C',
                color: '#0A0A0B',
                border: '1px solid rgba(201,168,76,0.4)',
                opacity: bulkActive ? 0.8 : 1,
              }}
            >
              {bulkActive ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Downloading… {bulkProgress} of {videos.length}
                </>
              ) : (
                <>
                  <DownloadCloud className="w-4 h-4" />
                  Download all ({videos.length} videos)
                </>
              )}
            </button>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.7rem', color: '#5A5855', marginTop: '10px' }}>
              Videos download one after another — your browser may ask permission to download multiple files.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center" style={{ padding: '96px 0' }}>
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'rgba(201,168,76,0.6)' }} />
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center gap-3" style={{ padding: '96px 0' }}>
            <AlertCircle className="w-8 h-8" style={{ color: 'rgba(201,168,76,0.6)' }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#8A8680' }}>
              Could not load the videos. Please refresh and try again.
            </p>
          </div>
        ) : videos.length === 0 ? (
          <div className="flex items-center justify-center" style={{ padding: '96px 0' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#8A8680' }}>
              No videos have been uploaded yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((file) => {
              const isDownloading = downloadingIds.has(file.id);
              const isDone = doneIds.has(file.id);
              const isFailed = failedIds.has(file.id);
              return (
                <div
                  key={file.id}
                  className="relative overflow-hidden rounded-xl"
                  style={{
                    backgroundColor: '#131316',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="relative aspect-video" style={{ backgroundColor: '#0A0A0B' }}>
                    {file.thumbnail_url ? (
                      <img
                        src={file.thumbnail_url}
                        alt={file.testimonial_name || file.file_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video src={file.url} className="w-full h-full object-cover" preload="metadata" muted playsInline />
                    )}
                  </div>
                  <div className="px-4 py-4">
                    <p
                      className="truncate"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '0.88rem', color: '#F0EDE8' }}
                      title={file.testimonial_name || file.file_name}
                    >
                      {file.testimonial_name || file.file_name}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.72rem', color: '#8A8680', marginTop: '2px' }}>
                      {SECTION_LABELS[file.bucket_id] || file.bucket_id}
                      {file.testimonial_designation ? ` · ${file.testimonial_designation}` : ''}
                      {file.file_size ? ` · ${formatBytes(file.file_size)}` : ''}
                    </p>
                    <button
                      onClick={() => handleDownloadOne(file)}
                      disabled={isDownloading}
                      className="mt-3 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 400,
                        fontSize: '0.78rem',
                        letterSpacing: '0.04em',
                        cursor: isDownloading ? 'wait' : 'pointer',
                        backgroundColor: isDone ? 'rgba(74,222,128,0.08)' : 'rgba(201,168,76,0.08)',
                        color: isDone ? '#4ade80' : isFailed ? '#f87171' : '#C9A84C',
                        border: `1px solid ${isDone ? 'rgba(74,222,128,0.3)' : isFailed ? 'rgba(248,113,113,0.4)' : 'rgba(201,168,76,0.3)'}`,
                      }}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Preparing…
                        </>
                      ) : isDone ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Downloaded
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          {isFailed ? 'Failed — tap to retry' : 'Download'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
