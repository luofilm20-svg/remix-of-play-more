import { createFileRoute } from "@tanstack/react-router";
import {
  ChevronRight,
  Info,
  Maximize,
  Pause,
  Play,
  RotateCcw,
  Settings,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import horizonPoster from "@/assets/horizon-poster.jpg";
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
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        if (current >= DURATION - 0.1) {
          setPlaying(false);
          return DURATION;
        }
        return current + 0.1;
      });
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing]);

  const togglePlayback = () => {
    if (elapsed >= DURATION) setElapsed(0);
    setPlaying((current) => !current);
  };

  const watchFull = () => {
    setElapsed(0);
    setPlaying(true);
  };

  const enterFullscreen = () => {
    void playerRef.current?.requestFullscreen?.();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-0 sm:p-6 lg:p-10">
      <section
        ref={playerRef}
        aria-label="Beyond the Horizon trailer"
        className="group relative aspect-video w-full max-w-[1500px] overflow-hidden bg-player-surface shadow-2xl sm:rounded-md"
      >
        <img
          src={horizonPoster}
          alt="An explorer overlooking a mountain valley at sunrise"
          width={1536}
          height={864}
          className={`absolute inset-0 h-full w-full object-cover ${playing ? "trailer-image-playing" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-player-surface/30 via-transparent to-player-surface/95" />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 bg-gradient-to-b from-player-surface/85 to-transparent px-4 pb-16 pt-4 sm:px-7 sm:pt-6">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase text-player-soft">
              <span className="rounded-sm bg-player-ink px-1.5 py-0.5 text-player-surface">Ad</span>
              <span>Trailer · 0:30</span>
            </div>
            <h1 className="truncate text-lg font-semibold text-player-ink sm:text-2xl">Beyond the Horizon</h1>
            <p className="hidden text-sm text-player-soft sm:block">An original adventure film</p>
          </div>
          <Button variant="player" onClick={watchFull} className="shrink-0">
            Watch full <ChevronRight aria-hidden="true" />
          </Button>
        </div>

        {!playing && (
          <Button
            variant="player"
            size="playerIcon"
            onClick={togglePlayback}
            aria-label={elapsed >= DURATION ? "Replay trailer" : "Play trailer"}
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2"
          >
            {elapsed >= DURATION ? <RotateCcw className="size-7" /> : <Play className="size-7 fill-current" />}
          </Button>
        )}

        {showMore && (
          <aside className="absolute right-4 top-20 w-[min(22rem,calc(100%-2rem))] rounded-md border border-player-ink/20 bg-player-surface/95 p-5 text-player-ink shadow-2xl sm:right-7 sm:top-24">
            <Button variant="playerGhost" size="icon" onClick={() => setShowMore(false)} aria-label="Close details" className="absolute right-2 top-2">
              <X />
            </Button>
            <p className="mb-3 text-xs font-semibold uppercase text-player-soft">About this trailer</p>
            <h2 className="text-xl font-semibold">Beyond the Horizon</h2>
            <p className="mt-2 text-sm leading-6 text-player-soft">A lone explorer follows an ancient map into a valley where every path leads to a new beginning.</p>
          </aside>
        )}

        <div className="absolute inset-x-0 bottom-0 px-3 pb-3 sm:px-6 sm:pb-5">
          <button
            type="button"
            aria-label="Seek trailer"
            onClick={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect();
              setElapsed(((event.clientX - bounds.left) / bounds.width) * DURATION);
            }}
            className="group/track mb-2 flex h-4 w-full cursor-pointer items-center"
          >
            <span className="relative h-1 w-full bg-player-track transition-[height] group-hover/track:h-1.5">
              <span className="absolute inset-y-0 left-0 bg-player-brand" style={{ width: `${(elapsed / DURATION) * 100}%` }} />
            </span>
          </button>

          <div className="flex items-center gap-1 text-player-ink">
            <Button variant="playerGhost" size="icon" onClick={togglePlayback} aria-label={playing ? "Pause" : "Play"}>
              {playing ? <Pause className="fill-current" /> : <Play className="fill-current" />}
            </Button>
            <Button variant="playerGhost" size="icon" onClick={() => setMuted((current) => !current)} aria-label={muted ? "Unmute" : "Mute"}>
              {muted ? <VolumeX /> : <Volume2 />}
            </Button>
            <span className="ml-1 text-xs tabular-nums text-player-soft sm:text-sm">{formatTime(elapsed)} / 0:30</span>
            <div className="ml-auto flex items-center gap-0 sm:gap-1">
              <Button variant="playerGhost" onClick={() => setShowMore((current) => !current)} className="px-2 sm:px-3">
                <Info /> <span className="hidden sm:inline">More</span>
              </Button>
              <Button variant="playerGhost" size="icon" aria-label="Settings"><Settings /></Button>
              <Button variant="playerGhost" size="icon" onClick={enterFullscreen} aria-label="Full screen"><Maximize /></Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
