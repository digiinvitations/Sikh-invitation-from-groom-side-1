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
        
        {/* Dynamic White Shade Overlay */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[0.5px] transition-opacity duration-500 opacity-100" />
        
        {/* Soft luminous white veil when video ends */}
        {data.heroVideoUrl && (
          <div className={`absolute inset-0 bg-gradient-to-b from-white/60 via-white/70 to-white/90 transition-opacity duration-1000 ${isEnded ? 'opacity-100' : 'opacity-0'}`} />
        )}

        {/* White bottom gradient blending into the next section */}
        <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-t pointer-events-none transition-colors duration-1000 from-white via-white/80 to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between px-6 text-center w-full max-w-lg mx-auto pt-8 pb-6 min-h-[100svh] opacity-100 select-none">
        
        {/* Top & Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full my-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            {/* Sacred Sikh Invocation */}
            <div className="flex flex-col items-center mb-2">
              <IkOnkarSymbol
                customLogoUrl={data.heroLogoUrl}
                className="h-16 sm:h-20 md:h-24 w-auto max-w-[230px] object-contain drop-shadow-md select-none pointer-events-none transition-transform duration-300"
              />
              <span className="text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-wine-dark/80 font-serif mt-1.5 font-bold">
                Ik Onkar • Satgur Prasad
              </span>
            </div>

            <p className="font-serif text-wine-dark text-sm sm:text-base italic my-2 max-w-[340px] leading-relaxed font-normal opacity-90 whitespace-pre-line drop-shadow-2xs">
              {data.heroMessage}
            </p>
            
            <div className="flex items-center justify-center gap-3 opacity-60 my-2.5">
              <div className="h-[1px] w-14 bg-wine-dark"></div>
              <Heart className="w-3.5 h-3.5 text-wine-dark fill-wine-dark" />
              <div className="h-[1px] w-14 bg-wine-dark"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="flex flex-col items-center justify-center w-full"
          >
            {/* Groom First (Priority) */}
            <h1 className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-wine-dark drop-shadow-sm leading-tight">
              {data.groom.name}
            </h1>
            <div className="font-serif flex flex-col items-center gap-1 mt-1 mb-2 text-center">
              <p className="text-sm sm:text-base font-bold text-burgundy tracking-wide leading-snug max-w-[340px]">
                {data.groom.parents}
              </p>
              {data.groom.education && <p className="text-xs sm:text-sm text-wine-dark/80 leading-tight">{data.groom.education}</p>}
              {data.groom.profession && <p className="text-xs sm:text-sm text-wine-dark/80 leading-tight">{data.groom.profession}</p>}
            </div>
            
            <span className="font-script text-3xl sm:text-4xl md:text-5xl text-pink-accent my-1.5 select-none">&amp;</span>
            
            {/* Bride */}
            <h1 className="font-script text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-wine-dark drop-shadow-sm leading-tight mt-1">
              {data.bride.name}
            </h1>
            <div className="font-serif flex flex-col items-center gap-1 mt-1 text-center">
              <p className="text-sm sm:text-base font-bold text-burgundy tracking-wide leading-snug max-w-[340px]">
                {data.bride.parents}
              </p>
              {data.bride.education && <p className="text-xs sm:text-sm text-wine-dark/80 leading-tight">{data.bride.education}</p>}
              {data.bride.profession && <p className="text-xs sm:text-sm text-wine-dark/80 leading-tight">{data.bride.profession}</p>}
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-auto pt-2 flex flex-col items-center select-none"
        >
          <span className="text-xs font-serif text-wine-dark uppercase tracking-[0.2em] mb-1">Scroll</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-wine-dark" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
