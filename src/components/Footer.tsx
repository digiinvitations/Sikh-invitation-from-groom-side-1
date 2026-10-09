import React, { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Heart, Instagram, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { WeddingData } from "../types";
import { ContactAd } from "./ContactAd";

interface FooterProps {
  data: WeddingData;
}

export function Footer({ data }: FooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const celebratedRef = useRef(false);

  const triggerCelebration = () => {
    // Elegant Sikh wedding floral & gold celebration burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.85, x: 0.5 },
      colors: ["#D4AF37", "#F8E8EB", "#F4C2C2", "#800020", "#FFD700"],
      zIndex: 100000,
    });
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.85 },
        colors: ["#D4AF37", "#F4C2C2", "#800020"],
        zIndex: 100000,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.85 },
        colors: ["#D4AF37", "#F4C2C2", "#800020"],
        zIndex: 100000,
      });
    }, 250);
  };

  useEffect(() => {
    // 1. Intersection Observer for footer visibility
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !celebratedRef.current) {
            celebratedRef.current = true;
            triggerCelebration();
          }
        });
      },
      { threshold: 0.05 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    // 2. Direct bottom-of-page scroll trigger
    const handleScrollEnd = () => {
      const scrollPos = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollPos >= docHeight - 80 && !celebratedRef.current) {
        celebratedRef.current = true;
        triggerCelebration();
      } else if (scrollPos < docHeight - 400) {
        // Reset when user scrolls back up so celebration can trigger again if they reach the bottom!
        celebratedRef.current = false;
      }
    };

    window.addEventListener("scroll", handleScrollEnd, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollEnd);
    };
  }, []);

  return (
    <footer ref={footerRef} className="py-12 bg-blush-light border-t border-pink-border flex flex-col items-center text-center px-4 relative overflow-hidden">
      {/* Interactive celebratory burst button */}
      <button
        onClick={triggerCelebration}
        type="button"
        className="mb-6 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 border border-pink-accent/40 text-burgundy font-serif text-xs font-bold uppercase tracking-widest shadow-2xs hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title="Shower blessings with flower petals"
      >
        <Sparkles className="w-3.5 h-3.5 text-pink-accent" />
        <span>Shower Blessings 🎉</span>
      </button>

      <div className="mb-4 flex flex-col items-center">
        <span className="font-serif text-[11px] uppercase tracking-[0.25em] text-wine-dark/70 font-semibold mb-1">
          Love &amp; Regards
        </span>
        <h4 className="font-serif text-2xl font-bold text-wine-dark tracking-wide">
          {data.familyRegards || "Bhusari Family"}
        </h4>
      </div>

      <h5 className="font-script text-2xl text-wine-dark mb-3">
        {data.groom.name} &amp; {data.bride.name}
      </h5>
      
      <div className="flex items-center gap-2 opacity-60 mb-8">
        <div className="w-8 h-[1px] bg-wine-dark"></div>
        <Heart className="w-3 h-3 text-wine-dark fill-wine-dark" />
        <div className="w-8 h-[1px] bg-wine-dark"></div>
      </div>
      
      {/* Direct Contact Advertisement with WhatsApp & Instagram Icons */}
      <ContactAd />

      <Link 
        to="/admin" 
        className="absolute bottom-4 right-4 opacity-10 hover:opacity-100 transition-opacity p-2 text-wine-dark"
        title="Admin Panel"
      >
        <Settings className="w-4 h-4" />
      </Link>
    </footer>
  );
}
