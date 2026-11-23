import { useEffect, useMemo, useState } from 'react';
import {
  Play,
  Film,
  Image as ImageIcon,
  MessageSquare,
  Star,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Download,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UploadedFile {
  id: string;
  bucket_id: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  url: string;
  thumbnail_url: string | null;
  testimonial_name: string | null;
  testimonial_designation: string | null;
  created_at: string;
}

interface StoryPanel {
  id: string;
  image_url: string;
  sequence_order: number;
  created_at: string;
}

interface MediaItem {
  id: string;
  kind: 'video' | 'image';
  url: string;
  thumbnailUrl: string | null;
  title: string;
  subtitle: string | null;
  section: string;
  createdAt: string;
}

type SectionKey = 'main-videos' | 'video-testimonials' | 'text-testimonial-images' | 'story-panels';

const SECTIONS: { key: SectionKey; label: string; description: string }[] = [
  { key: 'main-videos', label: 'Main Video', description: 'The featured video on the homepage' },
  { key: 'video-testimonials', label: 'Video Testimonials', description: 'Client video stories on the homepage' },
  { key: 'text-testimonial-images', label: 'Message Wall', description: 'Screenshots of client messages' },
  { key: 'story-panels', label: 'Story Panels', description: 'Image panels from the book story sequence' },
];

function formatBytes(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function VideoTile({ item }: { item: MediaItem }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-xl group"
      style={{
        backgroundColor: '#131316',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 300ms ease, transform 300ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
    >
      <div className="relative aspect-video" style={{ backgroundColor: '#0A0A0B' }}>
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6" style={{ color: 'rgba(201,168,76,0.6)' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#8A8680' }}>
              Could not load
            </span>
          </div>
        ) : (
          <>
            <video
              src={item.url}
              className="w-full h-full object-cover"
              playsInline
              controls={isPlaying}
              preload="metadata"
              poster={item.thumbnailUrl ?? undefined}
              onError={() => setHasError(true)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: 'rgba(10,10,11,0.35)' }}
                onClick={() => setIsPlaying(true)}
              >
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-300 group-hover:scale-110"
                  style={{
                    border: '1.5px solid rgba(201,168,76,0.5)',
                    backgroundColor: 'rgba(201,168,76,0.1)',
                  }}
                >
                  <Play className="w-5 h-5 ml-0.5" style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="px-4 py-3">
        <p
          className="truncate"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '0.82rem', color: '#F0EDE8' }}
          title={item.title}
        >
          {item.title}
        </p>
        {item.subtitle && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.72rem', color: '#8A8680', marginTop: '2px' }}>
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function ImageTile({ item, aspect }: { item: MediaItem; aspect: string }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative overflow-hidden rounded-xl group"
      style={{
        backgroundColor: '#131316',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 300ms ease, transform 300ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div className={aspect} style={{ backgroundColor: '#0A0A0B' }}>
        <img
          src={item.url}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="px-4 py-3">
        <p
          className="truncate"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: '0.82rem', color: '#F0EDE8' }}
          title={item.title}
        >
          {item.title}
        </p>
        {item.subtitle && (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.72rem', color: '#8A8680', marginTop: '2px' }}>
            {item.subtitle}
          </p>
        )}
      </div>
    </a>
  );
}

function SectionBlock({
  section,
  items,
}: {
  section: { key: SectionKey; label: string; description: string };
  items: MediaItem[];
}) {
  const isVideo = section.key === 'main-videos' || section.key === 'video-testimonials';

  return (
    <section style={{ marginBottom: '56px' }}>
      <div className="flex items-center gap-3 mb-1.5">
        {isVideo ? (
          <Film className="w-4 h-4" style={{ color: '#C9A84C' }} />
        ) : (
          <ImageIcon className="w-4 h-4" style={{ color: '#C9A84C' }} />
        )}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontSize: '1.5rem',
            color: '#F0EDE8',
          }}
        >
          {section.label}
        </h2>
        <span
          className="px-2.5 py-0.5 rounded-full"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.08em',
            color: '#C9A84C',
            backgroundColor: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.25)',
          }}
        >
          {items.length}
        </span>
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.8rem', color: '#8A8680', marginBottom: '20px' }}>
        {section.description}
      </p>

      <div
        className={
          section.key === 'text-testimonial-images'
            ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'
            : section.key === 'story-panels'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
        }
      >
        {items.map((item) =>
          item.kind === 'video' ? (
            <VideoTile key={item.id} item={item} />
          ) : (
            <ImageTile key={item.id} item={item} aspect={section.key === 'text-testimonial-images' ? 'aspect-[3/4]' : 'aspect-square'} />
          )
        )}
      </div>
    </section>
  );
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [storyPanels, setStoryPanels] = useState<StoryPanel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState<'all' | SectionKey>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [filesResult, storyResult] = await Promise.all([
          supabase
            .from('uploaded_files')
            .select('*')
            .in('bucket_id', ['main-videos', 'video-testimonials', 'text-testimonial-images'])
            .order('created_at', { ascending: false }),
          supabase
            .from('story_panels')
            .select('id, image_url, sequence_order, created_at')
            .order('sequence_order', { ascending: true }),
        ]);

        if (filesResult.error) throw filesResult.error;
        if (storyResult.error) throw storyResult.error;

        setFiles(filesResult.data ?? []);
        setStoryPanels(storyResult.data ?? []);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const grouped: Record<SectionKey, MediaItem[]> = useMemo(() => {
    const map: Record<SectionKey, MediaItem[]> = {
      'main-videos': [],
      'video-testimonials': [],
      'text-testimonial-images': [],
      'story-panels': [],
    };

    for (const f of files) {
      map[f.bucket_id as SectionKey].push({
        id: f.id,
        kind: f.file_type?.startsWith('video/') ? 'video' : 'image',
        url: f.url,
        thumbnailUrl: f.thumbnail_url,
        title: f.testimonial_name || f.file_name,
        subtitle:
          f.bucket_id === 'video-testimonials'
            ? f.testimonial_designation
            : formatBytes(f.file_size) || null,
        section: f.bucket_id,
        createdAt: f.created_at,
      });
    }

    for (const p of storyPanels) {
      map['story-panels'].push({
        id: p.id,
        kind: 'image',
        url: p.image_url,
        thumbnailUrl: null,
        title: `Panel ${p.sequence_order}`,
        subtitle: formatDate(p.created_at),
        section: 'story-panels',
        createdAt: p.created_at,
      });
    }

    return map;
  }, [files, storyPanels]);

  const totalCount = useMemo(
    () => Object.values(grouped).reduce((sum, items) => sum + items.length, 0),
    [grouped]
  );

  const goHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

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
              onClick={goHome}
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              aria-label="Back to homepage"
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
            Media Library
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6" style={{ paddingTop: '48px', paddingBottom: '96px' }}>
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-4 h-4" style={{ color: '#C9A84C' }} />
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
            Everything in one place
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
          Media Library
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: '0.9rem', color: '#8A8680', lineHeight: 1.7, maxWidth: '560px' }}>
          All videos and images used across the site — the homepage video, client video testimonials, the message wall, and story panels. Click any video to play it, or any image to view it full size.
        </p>

        <button
          onClick={() => {
            window.history.pushState({}, '', '/media/videos');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 400,
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            color: '#C9A84C',
            backgroundColor: 'rgba(201,168,76,0.05)',
            border: '1px solid rgba(201,168,76,0.3)',
          }}
        >
          <Download className="w-4 h-4" />
          Download video assets
        </button>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2" style={{ margin: '32px 0 40px' }}>
          <button
            onClick={() => setFilter('all')}
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              color: filter === 'all' ? '#0A0A0B' : '#C9A84C',
              backgroundColor: filter === 'all' ? '#C9A84C' : 'rgba(201,168,76,0.05)',
              border: '1px solid rgba(201,168,76,0.3)',
            }}
          >
            All
            <span
              className="px-1.5 rounded-full"
              style={{
                fontSize: '0.6rem',
                backgroundColor: filter === 'all' ? 'rgba(10,10,11,0.15)' : 'rgba(201,168,76,0.12)',
              }}
            >
              {totalCount}
            </span>
          </button>
          {SECTIONS.map((s) => {
            const count = grouped[s.key].length;
            if (count === 0) return null;
            const isActive = filter === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setFilter(s.key)}
                className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: '0.75rem',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  color: isActive ? '#0A0A0B' : '#C9A84C',
                  backgroundColor: isActive ? '#C9A84C' : 'rgba(201,168,76,0.05)',
                  border: '1px solid rgba(201,168,76,0.3)',
                }}
              >
                {s.label}
                <span
                  className="px-1.5 rounded-full"
                  style={{
                    fontSize: '0.6rem',
                    backgroundColor: isActive ? 'rgba(10,10,11,0.15)' : 'rgba(201,168,76,0.12)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center" style={{ padding: '96px 0' }}>
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: 'rgba(201,168,76,0.6)' }} />
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center gap-3" style={{ padding: '96px 0' }}>
            <AlertCircle className="w-8 h-8" style={{ color: 'rgba(201,168,76,0.6)' }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#8A8680' }}>
              Could not load the media library. Please refresh and try again.
            </p>
          </div>
        ) : totalCount === 0 ? (
          <div className="flex items-center justify-center" style={{ padding: '96px 0' }}>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5" style={{ color: 'rgba(201,168,76,0.5)' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#8A8680' }}>
                No media has been uploaded yet.
              </p>
            </div>
          </div>
        ) : (
          SECTIONS.filter((s) => (filter === 'all' ? true : filter === s.key)).map((s) => {
            const items = grouped[s.key];
            if (items.length === 0) return null;
            return <SectionBlock key={s.key} section={s} items={items} />;
          })
        )}
      </main>
    </div>
  );
}
