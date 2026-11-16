import { useEffect, useRef, useState } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

export function MusicPlayer({ src, title, autoPlay = false }: { src?: string; title: string; autoPlay?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const [available, setAvailable] = useState(Boolean(src));
  const [prevPlaying, setPrevPlaying] = useState(false);

  useEffect(() => {
    setAvailable(Boolean(src));
  }, [src]);

  useEffect(() => {
    const a = audioRef.current;
    if (a) a.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [autoPlay]);

  useEffect(() => {
    if (playing !== prevPlaying) {
      setPrevPlaying(playing);
    }
  }, [playing, prevPlaying]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = !a.muted;
    setMuted(a.muted);
    setShowVolume(false);
  };

  return (
    <div className="glass rounded-2xl p-3 flex items-center gap-3">
      <button
        onClick={toggle}
        disabled={!available}
        className="w-11 h-11 rounded-full flex items-center justify-center glass-btn !p-0 text-[color:var(--gold)] hover:text-foreground transition disabled:opacity-50"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Music size={12} />
          <span className={cn("transition-opacity duration-300", playing ? "opacity-100" : "opacity-70")}>
            {playing ? "Now playing" : "Paused"}
          </span>
        </div>
        <p className="text-sm truncate gold-text font-medium">{title}</p>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            showVolume ? "max-h-8 mt-1" : "max-h-0"
          )}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setMuted(false);
            }}
            disabled={!available}
            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />
        </div>
      </div>
      <button
        onClick={() => setShowVolume((v) => !v)}
        disabled={!available}
        className="w-9 h-9 rounded-full flex items-center justify-center glass-btn !p-0 text-muted-foreground hover:text-foreground transition disabled:opacity-50"
        aria-label="Volume"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      {src && (
        <audio ref={audioRef} src={src} loop preload="none" />
      )}
    </div>
  );
}