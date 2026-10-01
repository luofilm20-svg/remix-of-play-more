import { createFileRoute } from "@tanstack/react-router";
import {
  Captions,
  ChevronRight,
  Info,
  Maximize,
  MoreVertical,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import horizonPoster from "@/assets/horizon-poster.jpg";
import trailerAsset from "@/assets/beyond-the-horizon.mp4.asset.json";
import { Button } from "@/components/ui/button";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beyond the Horizon — Trailer Player" },
      { name: "description", content: "Watch the cinematic trailer for Beyond the Horizon." },
      { property: "og:title", content: "Beyond the Horizon — Trailer Player" },
      { property: "og:description", content: "Watch the cinematic trailer for Beyond the Horizon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const DURATION = 30;

function formatTime(seconds: number) {
  return `0:${Math.floor(seconds).toString().padStart(2, "0")}`;
}

function Index() {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(DURATION);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      void video.play().catch(() => setPlaying(false));
    } else {
      video.pause();
    }
  }, [playing]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === " " || event.key.toLowerCase() === "k") {
        event.preventDefault();
        togglePlayback();
      }
      if (event.key.toLowerCase() === "m") setMuted((current) => !current);
      if (event.key.toLowerCase() === "f") enterFullscreen();
      if (event.key === "ArrowRight" && videoRef.current) videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 5);
      if (event.key === "ArrowLeft" && videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const togglePlayback = () => {
    if (elapsed >= duration && videoRef.current) videoRef.current.currentTime = 0;
    setPlaying((current) => !current);
  };

  const watchFull = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    setElapsed(0);
    setPlaying(true);
    void playerRef.current?.requestFullscreen?.();
  };

  const enterFullscreen = () => {
    void playerRef.current?.requestFullscreen?.();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <section
        ref={playerRef}
        aria-label="Beyond the Horizon trailer"
        className="group relative aspect-video w-full max-w-[1580px] overflow-hidden bg-player-surface shadow-2xl"
      >
        <video
          ref={videoRef}
          src={trailerAsset.url}
          poster={horizonPoster}
          autoPlay
          muted={muted}
          playsInline
          onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || DURATION)}
          onEnded={() => setPlaying(false)}
          onClick={togglePlayback}
          aria-label="Beyond the Horizon video trailer"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-player-surface/55 via-transparent to-player-surface/95" />

        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-player-surface/80 to-transparent px-5 pb-16 pt-5 sm:px-7">
          <h1 className="truncate text-lg font-medium text-player-ink sm:text-xl">Beyond the Horizon — Official Trailer</h1>
        </div>

        {!playing && (
          <Button
            variant="player"
            size="playerIcon"
            onClick={togglePlayback}
            aria-label={elapsed >= duration ? "Replay trailer" : "Play trailer"}
            className="absolute left-1/2 top-1/2 h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 border-0 bg-player-surface/75"
          >
            {elapsed >= duration ? <RotateCcw className="size-8" /> : <Play className="size-8 fill-current" />}
          </Button>
        )}

        {showMore && (
          <aside className="absolute bottom-24 left-4 w-[min(24rem,calc(100%-2rem))] rounded-sm bg-player-surface/95 p-5 text-player-ink shadow-2xl sm:left-6">
            <Button variant="playerGhost" size="icon" onClick={() => setShowMore(false)} aria-label="Close details" className="absolute right-2 top-2">
              <X />
            </Button>
            <p className="mb-3 text-xs font-semibold uppercase text-player-soft">About this trailer</p>
            <h2 className="text-xl font-semibold">Beyond the Horizon</h2>
            <p className="mt-2 text-sm leading-6 text-player-soft">A lone explorer follows an ancient map into a valley where every path leads to a new beginning.</p>
          </aside>
        )}

        {showSettings && (
          <div className="absolute bottom-20 right-4 w-64 rounded-sm bg-player-surface/95 py-2 text-sm text-player-ink shadow-2xl sm:right-6">
            <div className="flex items-center justify-between px-4 py-3"><span>Playback speed</span><span className="text-player-soft">Normal ›</span></div>
            <div className="flex items-center justify-between px-4 py-3"><span>Quality</span><span className="text-player-soft">1080p HD ›</span></div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-player-surface/95 via-player-surface/45 to-transparent px-3 pb-2 pt-16 sm:px-5">
          <div className="mb-3 flex items-end justify-between gap-4 px-1">
            <div className="min-w-0 text-player-ink">
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded-sm bg-player-ink px-1.5 py-0.5 text-xs font-bold text-player-surface">Ad</span>
                <span className="font-medium">Beyond the Horizon</span>
              </div>
              <button type="button" onClick={() => setShowMore((current) => !current)} className="mt-1 flex items-center gap-1 text-xs text-player-soft hover:text-player-ink sm:text-sm">
                An original adventure film <Info className="size-3.5" />
              </button>
            </div>
            <Button variant="playerCta" onClick={watchFull} className="h-10 shrink-0 sm:h-11 sm:px-6">
              Watch full <ChevronRight aria-hidden="true" />
            </Button>
          </div>
          <button
            type="button"
            aria-label="Seek trailer"
            onClick={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              const nextTime = ((event.clientX - bounds.left) / bounds.width) * duration;
              setElapsed(nextTime);
              if (videoRef.current) videoRef.current.currentTime = nextTime;
            }}
            className="group/track flex h-3 w-full cursor-pointer items-center"
          >
            <span className="relative h-[3px] w-full bg-player-track transition-[height] group-hover/track:h-[5px]">
              <span className="absolute inset-y-0 left-0 bg-player-brand" style={{ width: `${(elapsed / duration) * 100}%` }} />
              <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-player-brand opacity-0 group-hover/track:opacity-100" style={{ left: `${(elapsed / duration) * 100}%` }} />
            </span>
          </button>

          <div className="flex h-11 items-center text-player-ink">
            <Button title={playing ? "Pause (k)" : "Play (k)"} variant="playerGhost" size="icon" onClick={togglePlayback} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
            </Button>
            <Button title={muted ? "Unmute (m)" : "Mute (m)"} variant="playerGhost" size="icon" onClick={() => setMuted((current) => !current)} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX /> : <Volume2 />}
            </Button>
            <span className="ml-1 text-xs tabular-nums text-player-ink">{formatTime(elapsed)} / {formatTime(duration)}</span>
            <div className="ml-auto flex items-center">
              <Button title="More" variant="playerGhost" size="icon" onClick={() => setShowMore((current) => !current)} aria-label="More"><MoreVertical /></Button>
              <Button title="Subtitles/closed captions" variant="playerGhost" size="icon" aria-label="Subtitles"><Captions /></Button>
              <Button title="Settings" variant="playerGhost" size="icon" onClick={() => setShowSettings((current) => !current)} aria-label="Settings"><Settings /></Button>
              <Button title="Picture in picture" variant="playerGhost" size="icon" className="hidden sm:inline-flex" onClick={() => void videoRef.current?.requestPictureInPicture?.()} aria-label="Picture in picture"><PictureInPicture2 /></Button>
              <Button title="Full screen (f)" variant="playerGhost" size="icon" onClick={enterFullscreen} aria-label="Full screen"><Maximize /></Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
