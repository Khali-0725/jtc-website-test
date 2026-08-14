import { useState } from 'react';
import { Figure } from '../Figure';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  url?: string;
  poster?: string;
  title: string;
}

/* Renders a poster with a play button; on activation swaps in the
   embedded player. If no URL is provided, shows a "coming soon" state.
   Supports YouTube/Vimeo/Facebook embeds and direct video files. */
function toEmbedUrl(url: string): { type: 'iframe' | 'video'; src: string } {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return { type: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };
  // Facebook videos / reels / watch links — use the official video plugin.
  // The video must be PUBLIC for the plugin to render it.
  if (/(?:facebook\.com|fb\.watch)\//.test(url)) {
    return {
      type: 'iframe',
      src: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        url,
      )}&show_text=false&autoplay=true`,
    };
  }
  return { type: 'video', src: url };
}

export function VideoPlayer({ url, poster, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  if (playing && url) {
    const embed = toEmbedUrl(url);
    return (
      <div className={styles.frame}>
        {embed.type === 'iframe' ? (
          <iframe
            className={styles.media}
            src={embed.src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video className={styles.media} src={embed.src} controls autoPlay>
            <track kind="captions" />
          </video>
        )}
      </div>
    );
  }

  return (
    <div className={styles.frame}>
      <Figure src={poster} alt={title} ratio="16/9" overlay rounded={false} />
      {url ? (
        <button className={styles.play} onClick={() => setPlaying(true)} aria-label={`Play: ${title}`}>
          <span className={styles.playIcon}>▶</span>
        </button>
      ) : (
        <span className={styles.soon}>Video coming soon</span>
      )}
    </div>
  );
}
