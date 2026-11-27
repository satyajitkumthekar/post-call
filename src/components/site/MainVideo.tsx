import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatLength, pauseOtherVideos } from '../../lib/media';
import { PlayIcon } from './ui';

type Status = 'loading' | 'ready' | 'error';

// The main video comes from the "main-videos" bucket, the same place the admin page uploads it to.
export default function MainVideo() {
  const [src, setSrc] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [started, setStarted] = useState(false);
  const [length, setLength] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from('uploaded_files')
      .select('url')
      .eq('bucket_id', 'main-videos')
      .maybeSingle()
      .then(
        ({ data, error }) => {
          if (!alive) return;
          if (error || !data?.url) {
            setStatus('error');
          } else {
            setSrc(data.url);
            setStatus('ready');
          }
        },
        () => {
          if (alive) setStatus('error');
        },
      );
    return () => {
      alive = false;
    };
  }, []);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    video.play().catch(() => setStarted(false));
  };

  return (
    <div id="video" className="scroll-mt-24">
      <div className="relative aspect-video w-full overflow-hidden rounded-panel bg-ink shadow-lift">
        {src && (
          <video
            ref={videoRef}
            src={`${src}#t=0.1`}
            preload="metadata"
            playsInline
            controls={started}
            controlsList="nodownload"
            onLoadedMetadata={(e) => setLength(formatLength(e.currentTarget.duration))}
            onPlay={(e) => pauseOtherVideos(e.currentTarget)}
            onEnded={() => setStarted(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {!started && (
          <>
            {status !== 'ready' && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(145deg,#14311F_0%,#0E2417_48%,#163A26_100%)]"
              >
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(250,250,247,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,247,.14)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(130%_90%_at_50%_50%,#000_20%,transparent_78%)]" />
                <div className="absolute left-1/2 top-1/2 aspect-square w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(198,244,50,.17),rgba(198,244,50,0))]" />
              </div>
            )}
            <button
              type="button"
              onClick={play}
              disabled={status !== 'ready'}
              aria-label="Play the introduction video"
              className="group absolute inset-0 grid place-items-center focus-visible:outline-none disabled:cursor-default"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-volt text-ink shadow-[0_10px_36px_rgba(0,0,0,.3)] transition-transform duration-200 group-hover:scale-[1.07] group-focus-visible:outline group-focus-visible:outline-[3px] group-focus-visible:outline-offset-4 group-focus-visible:outline-paper group-disabled:opacity-60 group-disabled:group-hover:scale-100 sm:h-[84px] sm:w-[84px]">
                <PlayIcon className="ml-1 h-6 w-6 sm:h-[30px] sm:w-[26px]" />
              </span>
            </button>
            {length && (
              <span className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-paper/15 bg-ink/60 px-[11px] py-[5px] font-label text-xs tabular-nums text-paper backdrop-blur">
                {length}
              </span>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1" role="status">
        {status === 'error' ? (
          <span className="text-sm text-muted">The video did not load. Refresh the page to try again.</span>
        ) : (
          <>
            <b className="whitespace-nowrap font-display font-semibold">Watch this first.</b>
            <span className="text-sm text-muted">It covers what we do, how it works, and who it isn&rsquo;t for.</span>
          </>
        )}
      </div>
    </div>
  );
}
