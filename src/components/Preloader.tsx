import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart } from "lucide-react";
import { IkOnkarSymbol } from "./IkOnkarSymbol";

interface PreloaderProps {
  videoUrl?: string;
  onLoaded: () => void;
  logoUrl?: string;
  names?: string;
}

export function Preloader({ videoUrl, onLoaded, logoUrl, names = "Jaspreet & Jasmeet" }: PreloaderProps) {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState("Preparing Holy Invitation...");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    let videoProgressInterval: NodeJS.Timeout;

    // Minimum display time ensures aesthetic satisfaction, but we don't stall unnecessarily
    const startTime = Date.now();
    const MIN_DISPLAY_MS = 1400;
    const MAX_TIMEOUT_MS = 6500; // Fallback so nobody is ever stuck on slow networks

    const finishPreloader = () => {
      if (isCancelled) return;
      setProgress(100);
      setStatusText("Entering Celebration...");
      setTimeout(() => {
        if (!isCancelled) {
          setIsFinished(true);
          setTimeout(() => {
            if (!isCancelled) {
              onLoaded();
            }
          }, 650); // allow smooth fade-out exit animation
        }
      }, 350);
    };

    // If there is a video URL, we pre-download & buffer it completely
    if (videoUrl) {
      setStatusText("Downloading Welcome Cinematics...");

      // Smooth simulated progress ramp while network buffer loads
      let currentVirtual = 15;
      videoProgressInterval = setInterval(() => {
        if (currentVirtual < 88) {
          currentVirtual += Math.floor(Math.random() * 5) + 3;
          setProgress((prev) => Math.max(prev, Math.min(currentVirtual, 88)));
        }
      }, 120);

      // Strategy 1: Create a hidden Video element and monitor canplaythrough / buffered
      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;
      video.src = videoUrl;

      // Strategy 2: Pre-fetch video via fetch/blob in background for instant browser cache warm-up
      fetch(videoUrl, { mode: "cors", cache: "force-cache" })
        .then((response) => {
          if (!response.ok) return;
          // Reading response ensures bytes hit disk/memory cache
          return response.blob();
        })
        .catch(() => {
          // CORS or external host might block fetch; video element handles it natively anyway
        });

      let loadedHandled = false;
      const handleVideoReady = () => {
        if (loadedHandled || isCancelled) return;
        loadedHandled = true;
        clearInterval(videoProgressInterval);

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_DISPLAY_MS - elapsed);

        setTimeout(() => {
          finishPreloader();
        }, remainingTime);
      };

      video.addEventListener("canplaythrough", handleVideoReady, { once: true });
      video.addEventListener("loadeddata", () => {
        // At least first frames downloaded
        setProgress((prev) => Math.max(prev, 65));
      });
      video.addEventListener("error", () => {
        // If error (e.g. offline/broken url), gracefully continue
        handleVideoReady();
      });

      // Force video element to start buffering
      video.load();

      // Failsafe timeout so nobody is stuck if network is throttled
      const maxTimer = setTimeout(() => {
        handleVideoReady();
      }, MAX_TIMEOUT_MS);

      return () => {
        isCancelled = true;
        clearInterval(videoProgressInterval);
        clearTimeout(maxTimer);
        video.src = "";
        video.load();
      };
    } else {
      // No video URL: quick smooth aesthetic loader
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            finishPreloader();
            return 100;
          }
          return prev + 15;
        });
      }, 100);

      return () => {
        isCancelled = true;
        clearInterval(interval);
      };
    }
  }, [videoUrl, onLoaded]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="wedding-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-[#FDF5F5] via-[#F8E8EA] to-[#F3D7DC] text-wine-dark px-6 select-none overflow-hidden"
          style={{ willChange: "opacity, transform" }}
        >
          {/* Subtle Golden Ambient Glows */}
          <div className="absolute w-72 h-72 rounded-full bg-pink-200/40 blur-3xl pointer-events-none -top-10 -left-10 animate-pulse" />
          <div className="absolute w-80 h-80 rounded-full bg-amber-100/60 blur-3xl pointer-events-none -bottom-10 -right-10 animate-pulse" />

          {/* Luxury Corner Filigree Borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-wine-dark/30 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-wine-dark/30 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-wine-dark/30 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-wine-dark/30 rounded-br-xl pointer-events-none" />

          {/* Central Card */}
          <div className="relative z-10 flex flex-col items-center max-w-xs text-center w-full">
            {/* Sacred Symbol */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative mb-3"
            >
              <div className="w-20 h-20 rounded-full bg-white/80 shadow-md border border-pink-border flex items-center justify-center p-3 relative">
                <IkOnkarSymbol
                  customLogoUrl={logoUrl}
                  className="w-12 h-12 object-contain"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-wine-dark/30"
                />
              </div>
            </motion.div>

            {/* Sacred Blessing Text */}
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.28em] text-wine-dark/80 font-serif font-bold mb-1"
            >
              Ik Onkar • Satgur Prasad
            </motion.span>

            {/* Wedding Couple Name */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="font-script text-3xl sm:text-4xl text-wine-dark mb-4 drop-shadow-2xs"
            >
              {names}
            </motion.h2>

            {/* Elegant Divider */}
            <div className="flex items-center justify-center gap-2 w-32 mb-5 opacity-70">
              <div className="h-[1px] flex-1 bg-wine-dark/40" />
              <Heart className="w-3 h-3 text-pink-accent fill-pink-accent" />
              <div className="h-[1px] flex-1 bg-wine-dark/40" />
            </div>

            {/* Progress Container */}
            <div className="w-full bg-white/70 backdrop-blur-xs p-3.5 rounded-2xl border border-pink-border/80 shadow-sm flex flex-col items-center">
              <div className="w-full bg-wine-dark/10 h-1.5 rounded-full overflow-hidden mb-2 relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-wine-dark via-burgundy to-pink-accent rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-[11px] font-serif font-semibold text-wine-dark/80 px-1">
                <span className="flex items-center gap-1.5 truncate">
                  <Sparkles className="w-3 h-3 text-amber-600 animate-spin" />
                  {statusText}
                </span>
                <span className="font-mono text-[10px] text-wine-dark font-bold ml-2">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Gentle Subtext */}
            <p className="text-[10px] tracking-widest uppercase font-serif text-wine-dark/60 mt-3 font-medium">
              Royal Sikh Wedding Invitation
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
