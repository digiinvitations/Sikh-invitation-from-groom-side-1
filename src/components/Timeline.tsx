import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { HeartDivider } from "./HeartDivider";
import { FadeInSection } from "./FadeInSection";
import { EventDetails } from "../types";
import { Clock, MapPin, CalendarHeart, Calendar, Sparkles } from "lucide-react";
import { parseCeremonyDate, formatAuspiciousTime, sortWeddingEvents } from "../utils";

interface TimelineProps {
  events: EventDetails[];
}

// Map ceremonial titles to traditional icons
const getEmoji = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("kirtan") || t.includes("darbar")) return "ੴ";
  if (t.includes("haldi")) return "🌻";
  if (t.includes("ring") || t.includes("sagan")) return "💍";
  if (t.includes("sangeet") || t.includes("music") || t.includes("dance")) return "🎵";
  if (t.includes("wedding") || t.includes("anand") || t.includes("karaj")) return "🕊️";
  if (t.includes("reception") || t.includes("party")) return "🥂";
  return "✨";
};

export function Timeline({ events }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Automatic real-time scroll tracking for the dragging lotus 🪷
  useEffect(() => {
    let animId: number;

    const updateLotusProgress = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Start gliding when timeline enters 70% of viewport
      // Reach the end when timeline reaches 30% of viewport
      const startOffset = vh * 0.7;
      const endOffset = vh * 0.3;
      const totalSpan = rect.height + (startOffset - endOffset);
      const currentSpan = startOffset - rect.top;

      const progress = Math.min(Math.max(currentSpan / totalSpan, 0), 1);
      setScrollProgress(progress);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(updateLotusProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    updateLotusProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (!events || events.length === 0) return null;

  // Chronologically sort events systematically by exact date and auspicious time
  const sortedEvents = sortWeddingEvents(events);

  const lotusTopPx = `calc(${scrollProgress * 100}% * 0.92 + 20px)`;
  const spineHeight = `${scrollProgress * 100}%`;
  const lotusRotation = Math.sin(scrollProgress * Math.PI * 4) * 10;

  return (
    <section className="py-20 px-4 sm:px-6 bg-blush-main flex flex-col items-center overflow-hidden">
      <FadeInSection className="w-full max-w-lg flex flex-col items-center">
        <CalendarHeart className="w-8 h-8 text-wine-dark mb-3 opacity-80" strokeWidth={1.5} />
        
        <h2 className="font-script text-4xl sm:text-5xl text-wine-dark text-center drop-shadow-sm font-bold">
          Program Timeline
        </h2>
        
        <p className="font-serif text-xs uppercase tracking-[0.22em] text-wine-dark/75 mt-1 font-semibold">
          Ceremony Schedule &amp; Auspicious Timings
        </p>

        <HeartDivider />

        {/* Systematic Vertical Timeline Stream */}
        <div ref={containerRef} className="w-full mt-10 relative">
          {/* Base Continuous Golden Timeline Spine */}
          <div className="absolute left-5 sm:left-6 top-6 bottom-8 w-1 bg-gradient-to-b from-pink-accent/20 via-burgundy/20 to-pink-accent/20 -translate-x-1/2 rounded-full overflow-hidden">
            {/* Active illuminated golden trail filled as lotus drags down */}
            <div 
              style={{ height: spineHeight }}
              className="w-full bg-gradient-to-b from-[#D4AF37] via-[#8F1736] to-[#D4AF37] rounded-full transition-all duration-75"
            />
          </div>

          {/* Automatic Dragging Floating Lotus 🪷 Gliding Along the Spine as User Scrolls */}
          <div
            style={{ 
              top: lotusTopPx,
              transform: `translate(-50%, -50%) rotate(${lotusRotation}deg)`,
              transition: "top 0.12s ease-out, transform 0.15s ease-out"
            }}
            className="absolute left-5 sm:left-6 z-30 pointer-events-none flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              {/* Sacred glowing aura */}
              <div className="absolute w-10 h-10 rounded-full bg-pink-400/30 blur-xs animate-ping" />
              <div className="absolute w-9 h-9 rounded-full bg-gradient-to-tr from-pink-200 via-white to-amber-100 shadow-md ring-2 ring-pink-400/60" />
              <span className="relative z-10 text-2xl sm:text-3xl select-none filter drop-shadow-[0_2px_8px_rgba(158,38,61,0.45)]">
                🪷
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {sortedEvents.map((item, index) => {
              const emoji = getEmoji(item.title);
              const dateInfo = parseCeremonyDate(item.date, item.time);
              const auspiciousTime = formatAuspiciousTime(item.time);
              const isWedding = 
                item.title.toLowerCase().includes("wedding") || 
                item.title.toLowerCase().includes("anand") || 
                item.title.toLowerCase().includes("karaj");

              const isHaldiRing = 
                (item.title.toLowerCase().includes("haldi") && (item.title.toLowerCase().includes("sagan") || item.title.toLowerCase().includes("ring"))) ||
                (item.time.toLowerCase().includes("haldi") && (item.time.toLowerCase().includes("sagan") || item.time.toLowerCase().includes("ring"))) ||
                (item.time.toLowerCase().includes("12:30") && (item.time.toLowerCase().includes("8:00") || item.time.toLowerCase().includes("8 pm")));

              return (
                <FadeInSection
                  key={item.id || index}
                  delay={index * 80}
                  threshold={0.08}
                  rootMargin="0px 0px -30px 0px"
                  className="relative flex items-start gap-3.5 sm:gap-5 w-full pl-0.5 sm:pl-2"
                >
                  {/* Milestone Pin on Central Spine */}
                  <div className="relative z-10 flex-shrink-0 mt-2 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-burgundy shadow-sm text-sm sm:text-base ring-4 ring-pink-accent/15">
                    <span className="select-none">{emoji}</span>
                  </div>

                  {/* Full-Width Systematic Milestone Card */}
                  <div className={`flex-1 p-4 sm:p-5 rounded-2xl bg-white/95 border shadow-2xs backdrop-blur-xs transition-shadow hover:shadow-md ${
                    isWedding 
                      ? 'border-[#D9A6B2] ring-2 ring-[#D9A6B2]/40 bg-gradient-to-b from-white to-[#FDF4F6]' 
                      : 'border-pink-border/80'
                  }`}>
                    
                    {/* Special Anand Karaj Badge */}
                    {isWedding && (
                      <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#8F1736] text-white shadow-2xs">
                        <span className="font-serif text-[10px] font-bold uppercase tracking-widest">
                          ੴ Sacred Anand Karaj Ceremony ੴ
                        </span>
                      </div>
                    )}

                    {/* 1. Dedicated High-Contrast Systematic Date & Auspicious Time Banner */}
                    <div className="w-full bg-[#FDF2F4] border border-[#F3C4CE] rounded-xl p-3 sm:p-3.5 mb-3.5 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        {/* High-Visibility Calendar Date Display */}
                        <div className="flex items-center gap-3">
                          {/* Calendar Box */}
                          <div className="flex flex-col items-center justify-center bg-white border-2 border-[#8F1736]/40 rounded-lg px-2.5 py-1 min-w-[54px] shadow-xs">
                            <span className="text-[10px] sm:text-[10.5px] font-serif uppercase tracking-widest font-black text-[#8F1736] leading-none">
                              {dateInfo.monthShort || "NOV"}
                            </span>
                            <span className="text-2xl sm:text-[26px] font-serif font-black text-[#6B0F24] leading-tight mt-0.5">
                              {dateInfo.dayNumber || "10"}
                            </span>
                          </div>

                          {/* Day of the Week & Formatted Date */}
                          <div className="flex flex-col text-left">
                            <span className="text-xs sm:text-[13px] font-serif font-black text-[#8F1736] uppercase tracking-[0.15em] leading-tight">
                              {dateInfo.dayOfWeek || "Ceremony Day"}
                            </span>
                            <span className="text-sm sm:text-base font-serif font-extrabold text-[#3D141E] tracking-wide mt-0.5 leading-snug">
                              {dateInfo.dateFormatted || item.date}
                            </span>
                          </div>
                        </div>

                        {/* Auspicious Time Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#8F1736] text-white shadow-xs self-start sm:self-auto">
                          <Clock className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                          <span className="font-serif text-xs sm:text-[13px] font-bold tracking-wide">
                            {isHaldiRing ? "12:30 PM & 8:00 PM" : (auspiciousTime || item.time)}
                          </span>
                        </div>
                      </div>

                      {/* For Haldi, Sagan & Ring Ceremony: 2 Dedicated Timings */}
                      {isHaldiRing && (
                        <div className="mt-2.5 pt-2 border-t border-[#F3C4CE]/80 flex flex-wrap items-center gap-2 text-left">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100/90 text-amber-950 border border-amber-300/80 shadow-2xs">
                            <span className="text-sm select-none">🌻</span>
                            <span className="font-serif text-xs font-bold text-amber-900">Haldi Ceremony:</span>
                            <span className="font-serif text-xs font-black text-[#8F1736]">12:30 PM</span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-100/90 text-[#8F1736] border border-pink-300/80 shadow-2xs">
                            <span className="text-sm select-none">💍</span>
                            <span className="font-serif text-xs font-bold text-[#8F1736]">Sagan &amp; Ring:</span>
                            <span className="font-serif text-xs font-black text-[#8F1736]">8:00 PM</span>
                          </div>
                        </div>
                      )}

                      {/* For Wedding Ceremony: Auspicious Schedule Breakdown */}
                      {isWedding && (
                        <div className="mt-2.5 pt-2 border-t border-[#F3C4CE]/80 flex flex-wrap items-center gap-x-3 gap-y-1 text-left text-[11.5px] sm:text-xs font-serif text-[#5E1A29]">
                          <span className="font-bold text-[#8F1736]">🚗 Barat: 10:00 AM</span>
                          <span className="text-pink-border">•</span>
                          <span className="font-bold text-[#8F1736]">🕊️ Anand Karaj: 12:00 PM</span>
                          <span className="text-pink-border">•</span>
                          <span className="font-bold text-[#8F1736]">🍽️ Lunch: Orchha</span>
                        </div>
                      )}
                    </div>

                    {/* 2. Ceremony Title */}
                    <h3 className="font-script text-3xl sm:text-4xl text-wine-dark leading-tight mb-2 drop-shadow-2xs text-left">
                      {item.title}
                    </h3>

                    {/* 3. Venue Location */}
                    {item.location && (
                      <div className="flex items-start gap-1.5 text-xs sm:text-[13px] text-wine-dark/85 font-serif mt-1 text-left">
                        <MapPin className="w-3.5 h-3.5 text-pink-accent shrink-0 mt-0.5" />
                        <span className="font-medium leading-relaxed">{item.location}</span>
                      </div>
                    )}

                    {/* 4. Timeline Description / Ritual Notes */}
                    {item.description && (
                      <p className="mt-2.5 pt-2.5 border-t border-pink-border/40 text-xs sm:text-[13px] text-text-body font-serif italic leading-relaxed text-left">
                        &ldquo;{item.description}&rdquo;
                      </p>
                    )}
                  </div>
                </FadeInSection>
              );
            })}
          </div>
        </div>
      </FadeInSection>
    </section>
  );
}
