import { createFileRoute } from "@tanstack/react-router";
import { ListVideo, Loader2, Maximize2, Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import tinkasStoryPoster from "@/assets/tinkas-story-poster.jpg.asset.json";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://kimote.hassanmageye.com";
const POSTER_URL = `${SITE_URL}${tinkasStoryPoster.url}`;
const TRAILER_URL = "https://pub-eb00261df49f466a9e5efee154650b48.r2.dev/trailers/af45635d-a542-402a-8910-53d42c040bbb-TINKA_S_STORY_OFFICIAL_TRAILER__1_.mp4";
const FULL_URL = "https://hassanmageye.com/films/tinkas-story";
const MORE_URL = "https://hassanmageye.com/films";
const SYNOPSIS = "Driven by grief and an unwavering belief in life after death, Tinka, a brilliant scientist, ventures beyond the boundaries of conventional science in a desperate attempt to bring her deceased husband back to life. Combining scientific experimentation with ancient rituals, she embarks on a dangerous journey into the unknown. But as her experiments begin to produce terrifying results, Tinka discovers that disturbing the boundary between life and death comes at a price. Caught between love, obsession, and supernatural forces she can no longer control, Tinka must confront the horrifying consequences of her quest to reunite with the man she refuses to let go.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Watch Tinka's Story Full Movie by Hassan Mageye" },
      { name: "description", content: "Watch the official trailer for Tinka's Story, a film written and directed by Hassan Mageye." },
      { property: "og:title", content: "Watch Tinka's Story Full Movie by Hassan Mageye" },
      { property: "og:description", content: "Watch the official trailer for Tinka's Story, a film written and directed by Hassan Mageye." },
      { property: "og:type", content: "video.movie" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: POSTER_URL },
      { property: "og:image:width", content: "1357" },
      { property: "og:image:height", content: "1920" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: POSTER_URL },
      { name: "keywords", content: "Tinka's Story, Tinkas Story movie, Tinka's Story trailer, Hassan Mageye, Ugandan film, African cinema" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://pub-eb00261df49f466a9e5efee154650b48.r2.dev" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Movie",
          name: "Tinka's Story",
          director: { "@type": "Person", name: "Hassan Mageye" },
          description: SYNOPSIS,
          url: SITE_URL,
          image: POSTER_URL,
          trailer: { "@type": "VideoObject", name: "Tinka's Story Official Trailer", contentUrl: TRAILER_URL, thumbnailUrl: POSTER_URL, description: SYNOPSIS, uploadDate: "2026-01-01" },
        }),
      },
    ],
  }),
  component: Index,
});

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}

function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // The video can finish loading before the page becomes interactive, so its
  // early events get missed. Re-read its real state on mount and keep in sync.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) setDuration(video.duration);
      setElapsed(video.currentTime);
      setPlaying(!video.paused && !video.ended);
      setLoading(video.readyState < 3 && !video.error);
      if (video.error) setError(true);
    };
    sync();
    const events = ["loadedmetadata", "durationchange", "timeupdate", "progress", "canplay", "canplaythrough", "playing", "waiting", "seeking", "seeked", "stalled"];
    events.forEach((e) => video.addEventListener(e, sync));
    const timer = window.setInterval(sync, 250);
    return () => {
      events.forEach((e) => video.removeEventListener(e, sync));
      window.clearInterval(timer);
    };
  }, []);

  const play = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    setEnded(false);
    if (video.readyState < 3) setLoading(true);
    try {
      await video.play();
      setError(false);
    } catch {
      setError(true);
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void play();
    else video.pause();
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + seconds));
    setElapsed(video.currentTime);
    if (video.currentTime < video.duration) setEnded(false);
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = seconds;
    setElapsed(video.currentTime);
    if (video.currentTime < video.duration) setEnded(false);
  };

  const enterFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (playerRef.current?.requestFullscreen) {
      void playerRef.current.requestFullscreen();
    } else {
      const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
      video?.webkitEnterFullscreen?.();
    }
  };

  return (
    <main className="min-h-screen bg-player-page pb-12 text-foreground sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <section ref={playerRef} aria-label="Tinka's Story official trailer" className="relative aspect-[4/3] w-full overflow-hidden bg-player-surface text-player-ink sm:aspect-video sm:rounded-lg">
          <video
            ref={videoRef}
            src={TRAILER_URL}
            poster={bedroomChainsPoster.url}
            preload="auto"
            playsInline
            muted={muted}
            onLoadedMetadata={(event) => {
              const value = event.currentTarget.duration;
              if (Number.isFinite(value)) setDuration(value);
            }}
            onDurationChange={(event) => {
              const value = event.currentTarget.duration;
              if (Number.isFinite(value)) setDuration(value);
            }}
            onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
            onLoadStart={() => setLoading(true)}
            onWaiting={() => setLoading(true)}
            onCanPlay={() => setLoading(false)}
            onPlaying={() => setLoading(false)}
            onSeeking={() => setLoading(true)}
            onSeeked={() => setLoading(false)}
            onPlay={() => { setPlaying(true); setEnded(false); setError(false); }}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setEnded(true); setElapsed(videoRef.current?.duration ?? 0); }}
            onError={() => setError(true)}
            onClick={togglePlayback}
            aria-label="Tinka's Story official trailer video"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-player-surface/75 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-player-surface/90 to-transparent" />
          <div className="pointer-events-none absolute left-4 top-3 text-sm font-semibold sm:left-6 sm:top-5 sm:text-base">Tinka's Story · Official trailer</div>

          {loading && !error && !ended && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 bg-player-surface/40">
              <Loader2 className="size-10 animate-spin text-player-ink sm:size-12" aria-hidden="true" />
              <p className="text-xs font-medium text-player-ink/90 sm:text-sm">Loading trailer…</p>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-player-surface/85 p-5 text-center">
              <p className="text-sm font-medium">The trailer couldn’t play here.</p>
              <Button variant="playerPill" onClick={() => { setError(false); videoRef.current?.load(); void play(); }}>Try again</Button>
              <Button variant="playerPill" asChild><a href={TRAILER_URL} target="_blank" rel="noopener noreferrer">Open trailer</a></Button>
            </div>
          ) : ended ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-player-surface/90 p-4 text-center sm:gap-5">
              <p className="text-sm font-medium text-player-soft">BedRoom Chains</p>
              <Button asChild className="h-12 rounded-full bg-player-brand px-6 text-sm font-semibold text-primary-foreground hover:bg-player-brand/90 sm:h-16 sm:px-10 sm:text-lg">
                <a href={FULL_URL} target="_blank" rel="noopener noreferrer"><Play className="fill-current" /> Watch Kimote full movie</a>
              </Button>
              <Button variant="playerGlass" size="icon" className="size-10" aria-label="Replay trailer" title="Replay trailer" onClick={() => void play()}><RotateCcw /></Button>
            </div>
          ) : (
            <>
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 sm:gap-5">
                <Button variant="playerGlass" size="icon" className="size-10 sm:size-12" onClick={() => skip(-5)} disabled={!duration} aria-label="Back 5 seconds" title="Back 5 seconds"><SkipBack /></Button>
                <Button variant="playerGlass" size="icon" className="size-14 sm:size-18" onClick={togglePlayback} aria-label={playing ? "Pause" : "Play"} title={playing ? "Pause" : "Play"}>{playing ? <Pause className="size-6 fill-current" /> : <Play className="size-6 fill-current" />}</Button>
                <Button variant="playerGlass" size="icon" className="size-10 sm:size-12" onClick={() => skip(5)} disabled={!duration} aria-label="Forward 5 seconds" title="Forward 5 seconds"><SkipForward /></Button>
              </div>
              <div className="absolute inset-x-0 bottom-0 px-4 pb-2 sm:px-6 sm:pb-4">
                <div className="mb-1 flex justify-between text-xs font-medium tabular-nums"><span>{formatTime(elapsed)}</span><span>{duration ? formatTime(duration) : "--:--"}</span></div>
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step="any"
                  value={Math.min(elapsed, duration || 1)}
                  disabled={!duration}
                  onChange={(event) => seek(Number(event.currentTarget.value))}
                  aria-label="Seek trailer"
                  className="h-3 w-full cursor-pointer accent-player-progress disabled:cursor-not-allowed"
                />
                <div className="mt-1 flex justify-between">
                  <Button variant="playerGlass" size="icon" className="size-9" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute" : "Mute"} title={muted ? "Unmute" : "Mute"}>{muted ? <VolumeX /> : <Volume2 />}</Button>
                  <Button variant="playerGlass" size="icon" className="size-9" onClick={enterFullscreen} aria-label="Full screen" title="Full screen"><Maximize2 /></Button>
                </div>
              </div>
            </>
          )}
        </section>

        <div className="px-4 pt-5 sm:px-0 sm:pt-7">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-13 w-full rounded-full bg-player-brand px-6 text-base font-semibold text-primary-foreground hover:bg-player-brand/90 sm:w-auto">
              <a href={FULL_URL} target="_blank" rel="noopener noreferrer"><Play className="fill-current" /> Watch Bedroom Chains full movie</a>
            </Button>
            <Button asChild variant="secondary" className="h-12 w-full rounded-full px-6 text-sm sm:w-auto">
              <a href={MORE_URL} target="_blank" rel="noopener noreferrer"><ListVideo /> More videos</a>
            </Button>
          </div>
          <article className="mt-9 max-w-3xl text-player-surface">
            <h1 className="text-2xl font-bold sm:text-3xl">About BedRoom Chains</h1>
            <p className="mt-4 text-base leading-7">{SYNOPSIS}</p>
          </article>
        </div>
      </div>
    </main>
  );
}
