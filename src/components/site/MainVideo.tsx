import { MAIN_VIDEO } from '../../data/mainVideo';
import { BUNNY_LIBRARY_ID } from '../../data/stories';

// The main video streams from Bunny and plays in Bunny's own player, so one tap on the player starts it
// with sound on every phone and computer. Bunny handles the streaming and picks the right quality.
export default function MainVideo() {
  return (
    <div id="video" className="scroll-mt-24">
      <div className="relative aspect-video w-full overflow-hidden rounded-panel bg-ink shadow-lift">
        <iframe
          src={`https://player.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${MAIN_VIDEO.bunnyId}?autoplay=false&preload=true&responsive=true`}
          title="Watch this first: the introduction video"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <b className="whitespace-nowrap font-display font-semibold">Watch this first.</b>
        <span className="font-label text-xs tabular-nums text-muted">{MAIN_VIDEO.length}</span>
      </div>
    </div>
  );
}
