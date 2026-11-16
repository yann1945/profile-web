import { useEffect, useState } from "react";

type Lanyard = {
  discord_user: {
    id: string;
    username: string;
    global_name?: string | null;
    display_name?: string | null;
    discriminator: string;
    avatar: string | null;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
};

type ErrorKind = null | "not_monitored" | "network";

const STATUS_COLOR: Record<string, string> = {
  online: "oklch(0.72 0.18 145)",
  idle: "oklch(0.78 0.16 80)",
  dnd: "oklch(0.65 0.22 25)",
  offline: "oklch(0.55 0.02 60)",
};

const STATUS_LABEL: Record<string, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

export function DiscordCard({ userId }: { userId: string }) {
  const [data, setData] = useState<Lanyard | null>(null);
  const [error, setError] = useState<ErrorKind>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        if (!active) return;
        if (json.success) {
          setData(json.data);
          setError(null);
        } else if (json?.error?.code === "user_not_monitored") {
          setError("not_monitored");
        } else {
          setError("network");
        }
      } catch {
        if (active) setError("network");
      }
    };
    load();
    const id = setInterval(load, 30000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [userId]);

  const avatar = data?.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.${data.discord_user.avatar.startsWith("a_") ? "gif" : "png"}?size=128`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  const username = data?.discord_user.display_name || data?.discord_user.global_name || data?.discord_user.username || "Loading...";
  const tag = data ? `@${data.discord_user.username}` : "";
  const status = data?.discord_status || "offline";

  if (error === "not_monitored") {
    return (
      <a
        href="https://discord.gg/lanyard"
        target="_blank"
        rel="noreferrer"
        className="glass rounded-2xl p-4 flex items-center gap-4 social-tile group"
      >
        <div className="w-14 h-14 rounded-full border border-[color:var(--gold)]/30 flex items-center justify-center bg-background/40 text-2xl">
          ⚠️
        </div>
        <div className="flex-1 min-w-0 text-center">
          <p className="font-semibold gold-text">Discord belum termonitor</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Join server <span className="gold-text">discord.gg/lanyard</span> dengan akunmu
          </p>
          <p className="text-[11px] mt-0.5 text-muted-foreground/80">
            agar status real-time muncul di sini
          </p>
        </div>
        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
          Join →
        </span>
      </a>
    );
  }

  return (
    <a
      href={`https://discord.com/users/${userId}`}
      target="_blank"
      rel="noreferrer"
      className="glass rounded-2xl p-4 flex items-center gap-4 social-tile group"
    >
      <div className="relative">
        <img
          src={avatar}
          alt={username}
          className="w-14 h-14 rounded-full border border-[color:var(--gold)]/30"
          loading="lazy"
        />
        <span
          className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[color:var(--background)] pulse-dot"
          style={{ background: STATUS_COLOR[status] }}
          aria-label={STATUS_LABEL[status]}
        />
      </div>
      <div className="flex-1 min-w-0 text-center">
        <p className="font-semibold truncate gold-text">
          {username}{tag ? ` - ${tag}` : ""}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: STATUS_COLOR[status] }}>
          ● {STATUS_LABEL[status]}
        </p>
      </div>
      <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
        View Profile →
      </span>
    </a>
  );
}
