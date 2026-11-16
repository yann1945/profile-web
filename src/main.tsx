import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { Crown, ExternalLink, Volume2, VolumeX } from "lucide-react";
import { FaYoutube, FaInstagram, FaFacebook, FaSpotify, FaGithub, FaSteam, FaTiktok, FaDiscord } from "react-icons/fa";
import { CursorGlow } from "./components/CursorGlow";
import { DiscordCard } from "./components/DiscordCard";
import { ThemeToggle } from "./components/ThemeToggle";
import { siteConfig } from "./config/siteConfig";
import "./styles.css";

const DISCORD_USER_ID = "808509401803259916";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaSpotify,
  FaGithub,
  FaSteam,
  FaDiscord,
};

const socials = siteConfig.socials.filter((s) => s.enabled).map((s) => ({
  ...s,
  icon: iconMap[s.icon] || FaGithub,
}));

function App() {
  const [entered, setEntered] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Putar backsound setelah klik "Click to Enter" (user gesture)
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (entered) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [entered]);

  // Sinkronkan mute ke elemen audio
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background video */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="/background.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="fixed inset-0 z-0 bg-background/50 backdrop-blur-sm" aria-hidden />
      <CursorGlow />
      <ThemeToggle />

      {/* Background music (hidden) */}
      <audio ref={audioRef} src="/backsound.mp3" loop preload="auto" muted={muted} />

      {/* Mute Button — tepat di bawah tombol change theme */}
      <button
        type="button"
        onClick={() => setMuted((prev) => !prev)}
        className="fixed top-20 right-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full cursor-pointer transition-all duration-200 hover:scale-125 active:scale-90"
        aria-label={muted ? "Unmute" : "Mute"}
        title={muted ? "Nyalakan suara" : "Matikan suara"}
      >
        {muted ? (
          <VolumeX size={22} className="text-[color:var(--gold)] drop-shadow-[0_2px_8px_rgba(255,215,0,0.4)]" />
        ) : (
          <Volume2 size={22} className="text-[color:var(--gold)] drop-shadow-[0_2px_8px_rgba(255,215,0,0.4)]" />
        )}
      </button>

      {/* Click-to-enter overlay */}
      {!entered && (
        <button
          type="button"
          onClick={() => setEntered(true)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-md cursor-pointer fade-in select-none"
          aria-label="Enter site"
        >
          <p className="gold-text text-2xl md:text-3xl font-semibold tracking-widest uppercase">
            Click to Enter
          </p>
          <p className="text-xs text-muted-foreground tracking-wider">
            Memasuki Kerajaan Digital
          </p>
        </button>
      )}

      {entered && (
        <main className="relative z-10 mx-auto max-w-xl px-5 py-12 md:py-20 flex flex-col gap-6">
          <header className="flex flex-col items-center text-center fade-in">
            <div className="relative mb-5">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-70"
                style={{ background: "var(--primary-glow)" }}
                aria-hidden
              />
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full p-[3px] bg-gradient-to-br from-[color:var(--gold)] via-[color:var(--primary-glow)] to-[color:var(--primary)]">
                <div className="w-full h-full rounded-full bg-[color:var(--background)] flex items-center justify-center overflow-hidden">
                  {siteConfig.profileImage ? (
                    <img
                      src={siteConfig.profileImage}
                      alt={siteConfig.title}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <Crown size={48} className="text-[color:var(--gold)]" />
                  )}
                </div>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight gold-text">
              {siteConfig.title}
            </h1>
            <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-sm fade-in-delay-1">
              {siteConfig.description}
            </p>
          </header>

          {/* Discord Profile Card */}
          <section className="fade-in-delay-1">
            <DiscordCard userId={DISCORD_USER_ID} />
          </section>

          {/* Discord Server Card */}
          <section className="fade-in-delay-2">
            <a
              href={siteConfig.discordServer}
              target="_blank"
              rel="noreferrer"
              className="glass rounded-2xl p-4 flex items-center gap-4 social-tile group w-full"
              title={`Join ${siteConfig.discordServerName}`}
            >
              <img
                src={siteConfig.discordServerIcon}
                alt={siteConfig.discordServerName}
                className="w-14 h-14 rounded-full border border-[color:var(--gold)]/30 object-cover"
                loading="lazy"
              />
              <div className="flex-1 min-w-0 text-center">
                <p className="font-semibold truncate gold-text">{siteConfig.discordServerName} - Discord Server</p>
                <p className="text-[11px] mt-0.5 text-muted-foreground/80 flex items-center justify-center gap-1 font-medium">
                  (Join Now)
                  <ExternalLink size={13} className="text-muted-foreground/60 group-hover:text-foreground transition" />
                </p>
              </div>
              <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                Join →
              </span>
            </a>
          </section>

          {/* Sociabuzz Card */}
          {siteConfig.sociabuzz && (
            <section className="fade-in-delay-2">
              <a
                href={siteConfig.sociabuzz}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-2xl p-4 flex items-center gap-4 social-tile group w-full"
                title="Support on SociaBuzz"
              >
                <img
                  src="/sociabuzz.jpg"
                  alt="SociaBuzz"
                  className="w-14 h-14 rounded-full border border-[color:var(--gold)]/30 object-cover"
                />
                <div className="flex-1 min-w-0 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <p className="font-semibold truncate gold-text">Support on SociaBuzz</p>
                  </div>
                  <p className="text-[11px] mt-0.5 text-muted-foreground/80 flex items-center justify-center gap-1 font-medium">
                    (Support)
                    <ExternalLink size={13} className="text-muted-foreground/60 group-hover:text-foreground transition" />
                  </p>
                </div>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                  Support →
                </span>
              </a>
            </section>
          )}

          {/* WhatsApp Channel */}
          {siteConfig.whatsAppChannel && (
            <section className="fade-in-delay-2">
              <a
                href={siteConfig.whatsAppChannel}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-2xl p-4 flex items-center gap-4 social-tile group w-full"
                title="WhatsApp Channel"
              >
                <img
                  src="/whatsapp-channel.jpg"
                  alt="WhatsApp Channel"
                  className="w-14 h-14 rounded-full border border-[color:var(--green)]/30 object-cover"
                />
                <div className="flex-1 min-w-0 text-center">
                  <p className="font-semibold truncate gold-text">Joki/Akun murah dan terpercaya</p>
                  <p className="text-[11px] mt-0.5 text-muted-foreground/80 flex items-center justify-center gap-1 font-medium">
                    (Join Channel)
                  </p>
                </div>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition">
                  Join →
                </span>
              </a>
            </section>
          )}

          {/*

*/}

          {/* Social Icons (paling bawah, di bawah music player) */}
          <section className="flex flex-wrap justify-center gap-5 fade-in-delay-3">
            {socials.map(({ label, href, icon: Icon, color, enabled }) => {
                // Remove text for YouTube, Instagram, TikTok, Facebook (keep icon only)
                const showLabel = !['YT', 'IG', 'TT', 'FB'].includes(label);
                // Skip disabled socials
                if (!enabled) return null;
                return (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="social-icon"
                    style={{ color }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon size={26} />
                      {showLabel && <span className="text-xs text-muted-foreground">{label}</span>}
                    </div>
                  </a>
                );
              })}
          </section>

          <footer className="text-center text-[11px] text-muted-foreground/70 mt-4 fade-in-delay-3">
            © {new Date().getFullYear()} hazeL · Sweet Home
          </footer>
        </main>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
