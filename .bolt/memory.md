# Project memory

## Product intent & audience

- Story/book-driven marketing site with client testimonials and a narrative "story sequence."
- Audience: prospective clients/readers; site uses video testimonials and client message screenshots as social proof.
- Media library page (`/media`) centralizes all site media for easy access.
- Dedicated video downloads page (`/media/videos`) lets users browse and download all video assets.

## Brand personality & voice

- Dark, gold-accented visual identity; premium and production-worthy.
- Client-facing, trust-building tone centered on real stories and testimonials.

## Visual design & UX direction

- Dark theme with gold accents throughout the site.
- Filter row with category counts for media browsing.
- Click-to-expand images (lightbox-style) for message wall screenshots.
- Embedded video players for main video and video testimonials.
- "Back" button pattern to return to homepage from subpages.
- Video downloads page: video cards with thumbnail, name, file size, individual Download buttons; gold "Download all" button for sequential download.
- Per-card download status feedback: green "Downloaded" checkmark on success, red "tap to retry" on failure.
- Lucide React icons used for UI elements and logos.
- Tailwind CSS for styling; no additional UI theme packages.

## Decisions, constraints & rationale

- Framework: Vite + React (JSX).
- Media is stored in and pulled live from a database, not hardcoded.
- Media categories identified: 1 main homepage video, 6 video testimonials, 21 message wall images, 18 story panel images.
- Written text testimonials on the homepage are typed directly into the page (not stored as media files), so excluded from the media library.
- `/media` route added and wired into app navigation/header.
- `/media/videos` route added as a subpage of media library; linked via "Download video assets" button on `/media`.
- Downloads triggered sequentially; browser may prompt for multi-file save permission.

## Open questions & assumptions

- Should written text testimonials be migrated into the database for inclusion in the media library?
- Should the media library page be public or restricted to admins/internal use?
- Are there additional media assets on other pages beyond the homepage not yet accounted for?
- Should media library support upload/management, or is it display/download-only?
- Should a similar bulk-download page be created for image assets (message wall, story panels)?