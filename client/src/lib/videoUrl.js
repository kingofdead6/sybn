/**
 * Turns a YouTube or Vimeo URL into its embed form, so an admin can paste the
 * link they copied from the browser rather than hand-writing an embed path.
 *
 * Returns null for anything else — a direct MP4 on our own storage, say —
 * which the caller then plays as a video file instead of framing.
 */
export function embedUrl(url) {
  if (!url) return null;

  const youtube = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`;

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;

  return null;
}
