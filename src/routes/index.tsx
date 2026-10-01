import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  Captions,
  ChevronDown,
  ChevronRight,
  Forward,
  ListVideo,
  MessageSquare,
  MoreHorizontal,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  Settings,
  SkipBack,
  SkipForward,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import horizonPoster from "@/assets/horizon-poster.jpg";
import trailerAsset from "@/assets/beyond-the-horizon.mp4.asset.json";
import { Button } from "@/components/ui/button";

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
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}

function Index() {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(DURATION);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [ended, setEnded] = useState(false);
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
      if (event.key === "ArrowRight") skip(5);
      if (event.key === "ArrowLeft") skip(-5);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const togglePlayback = () => {
    setEnded(false);
    if (elapsed >= duration && videoRef.current) videoRef.current.currentTime = 0;
    setPlaying((current) => !current);
  };

  const replay = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    setElapsed(0);
    setEnded(false);
    setPlaying(true);
  };

  const skip = (delta: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(duration, Math.max(0, videoRef.current.currentTime + delta));
  };

  const seek = (clientX: number, trackWidth: number) => {
    const nextTime = (clientX / trackWidth) * duration;
    setElapsed(nextTime);
    if (videoRef.current) videoRef.current.currentTime = nextTime;
  };

  const watchFull = () => {
    if (videoRef.current) videoRef.current.currentTime = 0;
    setElapsed(0);
    setEnded(false);
    setPlaying(true);
  };

  const enterFullscreen = () => {
    void playerRef.current?.requestFullscreen?.();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-player-page p-4 sm:p-8">
      <section
        ref={playerRef}
        aria-label="Beyond the Horizon trailer"
        className="group relative aspect-video w-full max-w-[1200px] overflow-hidden rounded-3xl bg-player-surface shadow-2xl"
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-player-surface/40 via-transparent to-player-surface/60" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 sm:p-5">
          <div className="flex min-w-0 items-start gap-3">
            <Button
              variant="playerGlass"
              size="icon"
              aria-label="Minimize player"
              className="size-9 shrink-0"
              onClick={() => (document.fullscreenElement ? void document.exitFullscreen() : undefined)}
            >
              <ChevronDown />
            </Button>
            <div className="min-w-0 pt-1.5">
              <p className="truncate text-sm font-medium text-player-ink sm:text-base">Beyond the Horizon</p>
              <div className="mt-2 h-1 w-24 rounded-full bg-player-ink/45 sm:w-32" />
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              title={muted ? "Unmute (m)" : "Mute (m)"}
              variant="playerGlass"
              size="icon"
              onClick={() => setMuted((current) => !current)}
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX /> : <Volume2 />}
            </Button>
            <Button
              title="Picture in picture"
              variant="playerGlass"
              size="icon"
              className="hidden sm:inline-flex"
              onClick={() => void videoRef.current?.requestPictureInPicture?.()}
              aria-label="Picture in picture"
            >
              <PictureInPicture2 />
            </Button>
            <Button title="Subtitles/closed captions" variant="playerGlass" size="icon" aria-label="Subtitles">
              <Captions />
            </Button>
            <Button
              title="Settings"
              variant="playerGlass"
              size="icon"
              onClick={() => setShowSettings((current) => !current)}
              aria-label="Settings"
            >
              <Settings />
            </Button>
          </div>
        </div>

        {/* Center playback controls */}
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 sm:gap-4">
          <Button variant="playerGlass" size="icon" className="size-10 sm:size-11" onClick={() => skip(-5)} aria-label="Back 5 seconds">
            <SkipBack className="fill-current" />
          </Button>
          <Button variant="playerGlass" size="icon" className="size-14 sm:size-16" onClick={togglePlayback} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="size-6 fill-current sm:size-7" /> : <Play className="size-6 fill-current sm:size-7" />}
          </Button>
          <Button variant="playerGlass" size="icon" className="size-10 sm:size-11" onClick={() => skip(5)} aria-label="Forward 5 seconds">
            <SkipForward className="fill-current" />
          </Button>
        </div>

        {/* Settings menu */}
        {showSettings && (
          <div className="absolute right-4 top-20 w-64 rounded-2xl bg-player-surface/95 py-2 text-sm text-player-ink shadow-2xl sm:right-6 sm:top-24">
            <div className="flex items-center justify-between px-4 py-3">
              <span>Playback speed</span>
              <span className="text-player-soft">Normal ›</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span>Quality</span>
              <span className="text-player-soft">1080p HD ›</span>
            </div>
          </div>
        )}

        {/* More details panel */}
        {showMore && (
          <aside className="absolute bottom-28 left-4 w-[min(24rem,calc(100%-2rem))] rounded-2xl bg-player-surface/95 p-5 text-player-ink shadow-2xl sm:left-6">
            <Button variant="playerGlass" size="icon" onClick={() => setShowMore(false)} aria-label="Close details" className="absolute right-2 top-2 size-8">
              <X />
            </Button>
            <p className="mb-3 text-xs font-semibold uppercase text-player-soft">About this trailer</p>
            <h2 className="text-xl font-semibold">Beyond the Horizon</h2>
            <p className="mt-2 text-sm leading-6 text-player-soft">
              A lone explorer follows an ancient map into a valley where every path leads to a new beginning.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-player-ink/10 p-3">
              <ListVideo className="size-5 shrink-0" />
              <p className="text-sm">More videos coming soon</p>
            </div>
          </aside>
        )}

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 sm:px-6 sm:pb-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Button variant="playerPill" onClick={watchFull} className="h-10 px-4 text-sm font-medium sm:h-11 sm:px-5">
              Watch full <ChevronRight aria-hidden="true" />
            </Button>
            <Button variant="playerGlass" size="icon" className="size-10 sm:size-11" onClick={() => setShowMore(true)} aria-label="Up next queue">
              <ListVideo />
            </Button>
          </div>

          <button
            type="button"
            aria-label="Seek trailer"
            onClick={(event) => seek(event.clientX, event.currentTarget.getBoundingClientRect().width)}
            className="group/track flex h-4 w-full cursor-pointer items-center"
          >
            <span className="relative h-1 w-full rounded-full bg-player-track">
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-player-progress"
                style={{ width: `${(elapsed / duration) * 100}%` }}
              />
              <span
                className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-player-progress"
                style={{ left: `${(elapsed / duration) * 100}%` }}
              />
            </span>
          </button>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button variant="playerGlass" size="icon" className="size-10" aria-label="I like this">
                <ThumbsUp />
              </Button>
              <Button variant="playerGlass" size="icon" className="size-10" aria-label="I dislike this">
                <ThumbsDown />
              </Button>
              <Button variant="playerGlass" size="icon" className="hidden size-10 sm:inline-flex" aria-label="Comments">
                <MessageSquare />
              </Button>
              <Button variant="playerGlass" size="icon" className="hidden size-10 sm:inline-flex" aria-label="Share">
                <Forward />
              </Button>
              <Button variant="playerGlass" size="icon" className="hidden size-10 sm:inline-flex" aria-label="Save">
                <Bookmark />
              </Button>
              <Button
                variant="playerGlass"
                size="icon"
                className="size-10"
                onClick={() => setShowMore((current) => !current)}
                aria-label="More"
              >
                <MoreHorizontal />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="playerPill" onClick={() => setShowMore(true)} className="h-10 px-4 text-sm font-medium sm:h-11 sm:px-5">
                More videos
              </Button>
              <Button
                title="Full screen (f)"
                variant="playerGlass"
                size="icon"
                className="size-10 sm:size-11"
                onClick={enterFullscreen}
                aria-label="Full screen"
              >
                <ListVideo />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
