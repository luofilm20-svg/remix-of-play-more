import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  Captions,
  ChevronDown,
  ChevronRight,
  Forward,
  ListVideo,
  Maximize2,
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
import { Button } from "@/components/ui/button";

const TRAILER_URL =
  "https://pub-eb00261df49f466a9e5efee154650b48.r2.dev/trailers/80f921c5-2b36-4daa-92fd-1c88f2452c21-KIMOTE_OFFICIAL_TRAILER.mp4";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Watch Kimote Full Movie by Hassan Mageye" },
      { name: "description", content: "Watch the official trailer for Kimote." },
      { property: "og:title", content: "Watch Kimote Full Movie by Hassan Mageye" },
      { property: "og:description", content: "Watch the official trailer for Kimote." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const DURATION = 30;
const FULL_URL = "https://hassanmageye.com/films/kimote";
const MORE_URL = "https://hassanmageye.com/films";

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
  const [speed, setSpeed] = useState(1);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
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

  const seek = (clientX: number, rect: DOMRect) => {
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const nextTime = ratio * duration;
    setElapsed(nextTime);
    if (videoRef.current) videoRef.current.currentTime = nextTime;
  };

  const watchFull = () => {
    setPlaying(false);
    window.open(FULL_URL, "_blank", "noopener,noreferrer");
  };
  const moreVideos = () => window.open(MORE_URL, "_blank", "noopener,noreferrer");
  const share = async () => {
    const data = { title: "Watch Kimote Full Movie by Hassan Mageye", url: window.location.href };
    if (navigator.share) await navigator.share(data).catch(() => undefined);
    else await navigator.clipboard?.writeText(data.url);
  };
  const setRate = (r: number) => {
    setSpeed(r);
    if (videoRef.current) videoRef.current.playbackRate = r;
    setShowSettings(false);
  };

  const enterFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (playerRef.current?.requestFullscreen) {
      void playerRef.current.requestFullscreen();
      return;
    }
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    video?.webkitEnterFullscreen?.();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-player-page sm:justify-center sm:p-8">
      <section
        ref={playerRef}
        aria-label="Kimote official trailer"
        className="relative aspect-video max-h-[70svh] w-full overflow-hidden rounded-none bg-player-surface shadow-2xl sm:max-w-[1200px] sm:rounded-3xl"
      >
        <video
          ref={videoRef}
          src={TRAILER_URL}
          poster={horizonPoster}
          autoPlay
          muted={muted}
          playsInline
          onTimeUpdate={(event) => !dragging && setElapsed(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || DURATION)}
          onDurationChange={(event) => Number.isFinite(event.currentTarget.duration) && setDuration(event.currentTarget.duration)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setEnded(true);
          }}
          onClick={togglePlayback}
          aria-label="Kimote official trailer video"
          className="absolute inset-0 h-full w-full bg-black object-contain sm:object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-player-surface/40 via-transparent to-player-surface/60" />

        {/* End screen */}
        {ended && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-player-surface/85 px-6 text-center backdrop-blur-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-player-soft">Up next</p>
              <h2 className="mt-2 text-2xl font-semibold text-player-ink sm:text-3xl">Kimote</h2>
            </div>
            <a
              href={FULL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-full bg-player-brand px-7 text-base font-semibold text-primary-foreground shadow-2xl transition-transform hover:scale-105 sm:h-[4.5rem] sm:gap-3 sm:px-12 sm:text-xl"
            >
              <Play className="size-6 fill-current sm:size-7" aria-hidden="true" />
              Watch full
            </a>
            <Button
              variant="playerGlass"
              size="icon"
              className="size-12"
              onClick={replay}
              aria-label="Watch again"
            >
              <RotateCcw />
            </Button>
          </div>
        )}

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
              <p className="truncate text-sm font-medium text-player-ink sm:text-base">Kimote — Official Trailer</p>
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
            <p className="px-4 py-2 text-xs uppercase text-player-soft">Playback speed</p>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
              <button key={r} type="button" onClick={() => setRate(r)} className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-player-ink/10">
                <span>{r === 1 ? "Normal" : `${r}x`}</span>
                {speed === r && <span className="text-player-progress">●</span>}
              </button>
            ))}
          </div>
        )}

        {/* More details panel */}
        {showMore && (
          <aside className="absolute bottom-28 left-4 w-[min(24rem,calc(100%-2rem))] rounded-2xl bg-player-surface/95 p-5 text-player-ink shadow-2xl sm:left-6">
            <Button variant="playerGlass" size="icon" onClick={() => setShowMore(false)} aria-label="Close details" className="absolute right-2 top-2 size-8">
              <X />
            </Button>
            <p className="mb-3 text-xs font-semibold uppercase text-player-soft">About this trailer</p>
            <h2 className="text-xl font-semibold">Kimote</h2>
            <p className="mt-2 text-sm leading-6 text-player-soft">
              A lone explorer follows an ancient map into a valley where every path leads to a new beginning.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-player-ink/10 p-3">
              <ListVideo className="size-5 shrink-0" />
              <a href={MORE_URL} target="_blank" rel="noopener noreferrer" className="text-sm underline">More videos by Hassan Mageye</a>
            </div>
          </aside>
        )}

        {/* Bottom controls */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 sm:px-6 sm:pb-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Button
              variant="playerPill"
              onClick={watchFull}
              className="h-8 gap-1 px-3 text-xs font-medium sm:h-11 sm:gap-1.5 sm:px-5 sm:text-sm"
            >
              Watch full <ChevronRight className="size-4 sm:size-5" aria-hidden="true" />
            </Button>
            <Button variant="playerGlass" size="icon" className="size-10 sm:size-11" onClick={() => setShowMore(true)} aria-label="Up next queue">
              <ListVideo />
            </Button>
          </div>

          <div className="mb-1 flex justify-between text-xs font-medium tabular-nums text-player-ink">
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek trailer"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(elapsed)}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging(true);
              seek(event.clientX, event.currentTarget.getBoundingClientRect());
            }}
            onPointerMove={(event) => dragging && seek(event.clientX, event.currentTarget.getBoundingClientRect())}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            className="group/track flex h-6 w-full cursor-pointer touch-none items-center"
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
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button variant="playerGlass" size="icon" className={`size-10 ${vote === "up" ? "text-player-progress" : ""}`} onClick={() => setVote(vote === "up" ? null : "up")} aria-pressed={vote === "up"} aria-label="I like this">
                <ThumbsUp />
              </Button>
              <Button variant="playerGlass" size="icon" className={`size-10 ${vote === "down" ? "text-player-progress" : ""}`} onClick={() => setVote(vote === "down" ? null : "down")} aria-pressed={vote === "down"} aria-label="I dislike this">
                <ThumbsDown />
              </Button>
              <Button variant="playerGlass" size="icon" className="hidden size-10 sm:inline-flex" onClick={() => window.open(FULL_URL, "_blank", "noopener,noreferrer")} aria-label="Comments">
                <MessageSquare />
              </Button>
              <Button variant="playerGlass" size="icon" className="hidden size-10 sm:inline-flex" onClick={() => void share()} aria-label="Share">
                <Forward />
              </Button>
              <Button variant="playerGlass" size="icon" className={`hidden size-10 sm:inline-flex ${saved ? "text-player-progress" : ""}`} onClick={() => setSaved(!saved)} aria-pressed={saved} aria-label="Save">
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
              <Button variant="playerPill" onClick={moreVideos} className="h-10 px-4 text-sm font-medium sm:h-11 sm:px-5">
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
                <Maximize2 />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile: watch full movie button under the player */}
      <div className="w-full px-4 pt-4 sm:hidden">
        <a
          href={FULL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-player-brand text-base font-semibold text-primary-foreground shadow-xl transition-transform active:scale-95"
        >
          <Play className="size-5 fill-current" aria-hidden="true" />
          Watch Kimote full movie
        </a>
        <Button
          variant="playerPill"
          onClick={moreVideos}
          className="mt-3 h-12 w-full text-sm font-medium"
        >
          <ListVideo className="size-5" aria-hidden="true" />
          More videos
        </Button>
      </div>
    </main>
  );
}
