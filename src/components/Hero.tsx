import { motion } from "motion/react";
import { Heart, ArrowDown } from "lucide-react";
import { WeddingData } from "../types";
import { IkOnkarSymbol } from "./IkOnkarSymbol";
import { useState, useRef, useEffect } from "react";

interface HeroProps {
  data: WeddingData;
  shouldPlayVideo?: boolean;
  onVideoEnd?: () => void;
  isReady?: boolean;
}

export function Hero({ data, shouldPlayVideo = true, onVideoEnd, isReady = true }: HeroProps) {
  // Always make text visible immediately, while gracefully allowing animation
  const [showText, setShowText] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attempt instant video playback on mount and whenever props update
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlayVideo && isReady) {
      // Ensure muted and playsInline are strictly enforced for instant browser autoplay policy
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Hero video autoplay fallback:", err);
          // If browser policy blocked unmuted autoplay or paused, retry muted immediately
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }
  }, [shouldPlayVideo, isReady, data.heroVideoUrl]);

  const handleTimeUpdate = () => {
    // Keep text visible at all times
    if (!showText) setShowText(true);
  };

  const handleEnded = () => {
    setIsEnded(true);
    setShowText(true);
    if (onVideoEnd) onVideoEnd();
  };

  const specialInvitee =
    !data.invitedBy ||
    data.invitedBy.toLowerCase().includes("jasmer") ||
    data.invitedBy.toLowerCase().includes("grandmother")
      ? "Tirajveer Singh & Mehrajveer Singh"
      : data.invitedBy;

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-white">
      {/* Background Video or Image */}
      <div className="absolute inset-0 z-0 bg-white">
        {data.heroVideoUrl ? (
          <video
            ref={videoRef}
            src={data.heroVideoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            className="w-full h-full object-cover transform-gpu backface-hidden"
            style={{ willChange: "transform, opacity" }}
          />
        ) : (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop')" }}
          />
        )}
        
        {/* Dynamic White Shade Overlay - perfectly balanced contrast for text readability without obscuring video */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] transition-opacity duration-500 opacity-100" />
        
        {/* Soft luminous white veil when video ends */}
        {data.heroVideoUrl && (
          <div className={`absolute inset-0 bg-gradient-to-b from-white/60 via-white/70 to-white/90 transition-opacity duration-1000 ${isEnded ? 'opacity-100' : 'opacity-0'}`} />
        )}

        {/* White bottom gradient blending into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t pointer-events-none transition-colors duration-1000 from-white via-white/80 to-transparent z-10" />
      </div>

      {/* Content: Visible immediately with refined, snappy entrance */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-md mx-auto pt-12 pb-6 h-full min-h-[100svh] opacity-100">
        
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-12">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* Sacred Sikh Invocation / Background-Removed Religious Logo */}
            <div className="flex flex-col items-center mb-3">
              <IkOnkarSymbol
                customLogoUrl={data.heroLogoUrl}
                className="h-16 md:h-20 w-auto max-w-[200px] object-contain drop-shadow-md select-none pointer-events-none transition-transform duration-300"
              />
              <span className="text-[10px] tracking-[0.25em] uppercase text-wine-dark/85 font-serif mt-1.5 font-bold">
                Ik Onkar • Satgur Prasad
              </span>
            </div>

            {/* Special Invitation Callout - Big & Bold */}
            <div className="mb-4 px-5 py-2.5 rounded-2xl bg-white/95 border border-pink-border/90 shadow-2xs backdrop-blur-xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-serif uppercase tracking-[0.25em] text-wine-dark/75 font-semibold mb-0.5">
                Special Invitation
              </span>
              <span className="text-base sm:text-lg md:text-xl font-serif font-extrabold text-burgundy tracking-wide leading-snug drop-shadow-2xs">
                {specialInvitee}
              </span>
            </div>

            <p className="font-serif text-wine-dark text-[14px] italic mb-4 max-w-[300px] leading-relaxed font-normal opacity-95 whitespace-pre-line drop-shadow-2xs">
              {data.heroMessage}
            </p>
            
            <div className="flex items-center justify-center gap-3 opacity-60 mb-6">
              <div className="h-[1px] w-12 bg-wine-dark"></div>
              <Heart className="w-3 h-3 text-wine-dark fill-wine-dark" />
              <div className="h-[1px] w-12 bg-wine-dark"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col items-center justify-center w-full"
          >
            {/* Groom First (Priority) */}
            <h1 className="font-script text-6xl text-wine-dark drop-shadow-sm leading-none">
              {data.groom.name}
            </h1>
            <div className="font-serif flex flex-col items-center gap-1 mt-2.5 mb-5 text-center px-2">
              <p className="text-sm sm:text-base md:text-[17px] font-bold text-burgundy tracking-wide leading-snug max-w-[340px]">
                {data.groom.parents}
              </p>
              {data.groom.education && <p className="text-xs text-wine-dark/80">{data.groom.education}</p>}
              {data.groom.profession && <p className="text-xs text-wine-dark/80">{data.groom.profession}</p>}
            </div>
            
            <span className="font-script text-3xl text-pink-accent my-1">&amp;</span>
            
            {/* Bride */}
            <h1 className="font-script text-6xl text-wine-dark drop-shadow-sm leading-none mt-3">
              {data.bride.name}
            </h1>
            <div className="font-serif flex flex-col items-center gap-1 mt-2.5 text-center px-2">
              <p className="text-sm sm:text-base md:text-[17px] font-bold text-burgundy tracking-wide leading-snug max-w-[340px]">
                {data.bride.parents}
              </p>
              {data.bride.education && <p className="text-xs text-wine-dark/80">{data.bride.education}</p>}
              {data.bride.profession && <p className="text-xs text-wine-dark/80">{data.bride.profession}</p>}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 flex flex-col items-center"
        >
          <span className="text-[10px] font-serif text-wine-dark uppercase tracking-[0.3em] mb-2 font-semibold">Scroll</span>
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-wine-dark" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
