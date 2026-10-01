import { createFileRoute } from "@tanstack/react-router";
import { ListVideo, Maximize2, Pause, Play, RotateCcw, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

import kimotePoster from "@/assets/kimote-poster.jpg.asset.json";
import { Button } from "@/components/ui/button";

const TRAILER_URL = "https://pub-eb00261df49f466a9e5efee154650b48.r2.dev/trailers/80f921c5-2b36-4daa-92fd-1c88f2452c21-KIMOTE_OFFICIAL_TRAILER.mp4";
const FULL_URL = "https://hassanmageye.com/films/kimote";
const MORE_URL = "https://hassanmageye.com/films";
const SYNOPSIS = "Born into a family renowned for generations of barkcloth craftsmanship, young Kimera faces a difficult choice when his father urges him to abandon their ancestral trade in search of a better future. Refusing to let the family's heritage disappear, Kimera sets out to transform barkcloth from a fabric associated primarily with funerary traditions into a symbol of cultural pride and contemporary African identity. As he challenges deeply rooted customs and his father's expectations, he discovers that preserving tradition sometimes requires the courage to reinvent it. A story of cultural inheritance, generational conflict and the determination to build a future without abandoning the past.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Watch Kimote Full Movie by Hassan Mageye" },
      { name: "description", content: "Watch the official trailer for Kimote (2025), a film about barkcloth, cultural inheritance, and the courage to reinvent tradition." },
      { property: "og:title", content: "Watch Kimote Full Movie by Hassan Mageye" },
      { property: "og:description", content: "Watch the official trailer for Kimote (2025), a film about barkcloth, cultural inheritance, and the courage to reinvent tradition." },
      { property: "og:type", content: "video.movie" },
      { name: "twitter:card", content: "summary_large_image" },
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

  const play = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    setEnded(false);
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
        <section ref={playerRef} aria-label="Kimote official trailer" className="relative aspect-[4/3] w-full overflow-hidden bg-player-surface text-player-ink sm:aspect-video sm:rounded-lg">
          <video
            ref={videoRef}
            src={TRAILER_URL}
            poster={kimotePoster.url}
            preload="metadata"
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
            onPlay={() => { setPlaying(true); setEnded(false); setError(false); }}
            onPause={() => setPlaying(false)}
            onEnded={() => { setPlaying(false); setEnded(true); setElapsed(videoRef.current?.duration ?? 0); }}
            onError={() => setError(true)}
            onClick={togglePlayback}
            aria-label="Kimote official trailer video"
            className="absolute inset-0 h-full w-full object-contain"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-player-surface/75 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-player-surface/90 to-transparent" />
          <div className="pointer-events-none absolute left-4 top-3 text-sm font-semibold sm:left-6 sm:top-5 sm:text-base">KIMOTE (2025) · Official trailer</div>

          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-player-surface/85 p-5 text-center">
              <p className="text-sm font-medium">The trailer couldn’t play here.</p>
              <Button variant="playerPill" onClick={() => { setError(false); videoRef.current?.load(); void play(); }}>Try again</Button>
              <Button variant="playerPill" asChild><a href={TRAILER_URL} target="_blank" rel="noopener noreferrer">Open trailer</a></Button>
            </div>
          ) : ended ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-player-surface/90 p-4 text-center sm:gap-5">
              <p className="text-sm font-medium text-player-soft">Kimote · 2025</p>
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
              <a href={FULL_URL} target="_blank" rel="noopener noreferrer"><Play className="fill-current" /> Watch Kimote full movie</a>
            </Button>
            <Button asChild variant="secondary" className="h-12 w-full rounded-full px-6 text-sm sm:w-auto">
              <a href={MORE_URL} target="_blank" rel="noopener noreferrer"><ListVideo /> More videos</a>
            </Button>
          </div>
          <article className="mt-9 max-w-3xl text-player-surface">
            <h1 className="text-2xl font-bold sm:text-3xl">About KIMOTE (2025)</h1>
            <p className="mt-4 text-base leading-7">{SYNOPSIS}</p>
          </article>
        </div>
      </div>
    </main>
  );
}
