import React, { useState } from "react";
import { Heart, Sparkles, Phone, Check, Copy, ExternalLink } from "lucide-react";

export function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.45 1.28 4.95L2 22l5.22-1.3c1.44.75 3.06 1.18 4.82 1.18 5.52 0 10-4.48 10-10s-4.48-10-10-10zm5.84 14.18c-.24.68-1.22 1.25-1.74 1.3-.49.05-1.12.08-3.62-.96-3.19-1.32-5.24-4.57-5.4-4.78-.16-.21-1.3-1.73-1.3-3.3 0-1.57.82-2.34 1.11-2.66.29-.32.64-.4.86-.4.22 0 .43 0 .61.01.19.01.44-.07.69.53.25.6.86 2.09.93 2.25.08.16.13.35.03.56-.1.21-.16.34-.31.52-.16.18-.33.4-.47.54-.16.16-.33.33-.14.65.19.32.84 1.38 1.8 2.23 1.24 1.1 2.29 1.45 2.62 1.61.33.16.52.14.71-.08.19-.22.82-.95 1.04-1.28.22-.33.44-.27.73-.16.3.11 1.87.88 2.19 1.04.32.16.54.24.62.38.08.14.08.8-.16 1.48z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function ContactAd() {
  const [copied, setCopied] = useState(false);
  const phoneNumber = "9456411569";
  const formattedPhone = "+91 9456411569";
  const instagramHandle = "@digiinvitations_";
  const instagramUrl = "https://www.instagram.com/digiinvitations_?igsi=MWh1ZnZhMm1xNnNkdw==";
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(
    "Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh! I saw the digital wedding invitation website and would love to create one with digiinvitations_."
  )}`;

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-6 px-1">
      {/* Advertisement Container Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-white via-[#FFF9FA] to-[#FFF0F3] p-5 border-2 border-[#D4AF37]/40 shadow-lg shadow-wine-dark/5 text-center overflow-hidden">
        {/* Subtle decorative golden corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/60 rounded-tl-xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/60 rounded-tr-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/60 rounded-bl-xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/60 rounded-br-xl pointer-events-none" />

        {/* Floating Top Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 border border-[#D4AF37]/40 text-[10px] font-serif font-bold text-wine-dark uppercase tracking-widest mb-3 shadow-2xs">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Advertisement • Digital Invitations</span>
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
        </div>

        {/* Heading & Value Proposition */}
        <h4 className="font-serif text-lg sm:text-xl font-bold text-wine-dark tracking-tight leading-snug">
          Want a Website Like This?
        </h4>
        <p className="font-serif text-xs text-wine-dark/80 mt-1 leading-relaxed">
          Get your custom wedding website with animated timeline, music, RSVP &amp; live Google Maps!
        </p>

        {/* Required Attribution & Contact Text */}
        <div className="mt-3 py-2 px-3 rounded-xl bg-white/80 border border-pink-border flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-wine-dark uppercase tracking-wide">
            <span>Created with</span>
            <Heart className="w-3.5 h-3.5 text-pink-accent fill-pink-accent inline-block animate-pulse" />
            <span>by <span className="text-burgundy font-extrabold underline decoration-[#D4AF37]">digiinvitations_</span></span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-extrabold text-[#8F1736]">
            <span>To Create Yours Contact:</span>
            <a 
              href={`tel:${phoneNumber}`} 
              className="text-burgundy hover:underline tracking-wider font-mono text-sm"
            >
              {phoneNumber}
            </a>
          </div>
        </div>

        {/* Direct Contact Icons Advertisement Action Grid */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {/* WhatsApp Direct Contact Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            title="Chat directly on WhatsApp"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <WhatsAppIcon className="w-5 h-5 text-white drop-shadow-xs" />
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase font-serif">
              WhatsApp
            </span>
            <span className="text-[9.5px] opacity-90 font-mono tracking-tight mt-0.5">
              {phoneNumber}
            </span>
          </a>

          {/* Instagram Direct Contact Button */}
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-sm hover:shadow-md hover:brightness-105 transition-all active:scale-95 cursor-pointer"
            title="Visit Instagram Profile"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <InstagramIcon className="w-5 h-5 text-white drop-shadow-xs" />
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase font-serif">
              Instagram
            </span>
            <span className="text-[9.5px] opacity-90 font-mono tracking-tight mt-0.5">
              {instagramHandle}
            </span>
          </a>
        </div>

        {/* Quick Direct Actions: Call Now & Copy Number */}
        <div className="mt-3 flex items-center justify-center gap-2 pt-2 border-t border-pink-border/60">
          <a
            href={`tel:${phoneNumber}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D4AF37]/50 text-wine-dark hover:bg-blush-light text-[11px] font-serif font-bold shadow-2xs active:scale-95 transition-all"
          >
            <Phone className="w-3 h-3 text-[#8F1736]" />
            <span>Call: {phoneNumber}</span>
          </a>

          <button
            type="button"
            onClick={handleCopyPhone}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border border-pink-border text-wine-dark/80 hover:bg-blush-light text-[11px] font-serif font-medium transition-all cursor-pointer"
            title="Copy contact phone number"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-wine-dark/60" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
