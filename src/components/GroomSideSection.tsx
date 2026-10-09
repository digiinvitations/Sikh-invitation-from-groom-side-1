import React from "react";
import { GroomSideDetails } from "../types";
import { HeartDivider } from "./HeartDivider";
import { Clock, MapPin, Sparkles, Heart, Users } from "lucide-react";

interface GroomSideSectionProps {
  groomSideDetails?: GroomSideDetails;
  groomName: string;
}

export function GroomSideSection({ groomSideDetails, groomName }: GroomSideSectionProps) {
  if (!groomSideDetails) return null;
  const {
    familyHeading,
    baraatAssemblyTime,
    baraatVenue,
    milniTime,
    receptionTime,
    receptionVenue,
    specialGroomNotes,
    familyMembers
  } = groomSideDetails;

  return (
    <section className="py-14 px-5 bg-gradient-to-b from-[#FFFDF9] via-blush-light to-white flex flex-col items-center text-center relative overflow-hidden border-y border-amber-200/50">
      {/* Decorative Golden Ambient Accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md mx-auto relative z-10 flex flex-col items-center">
        {/* Religious Invocation & Badge */}
        <div className="mb-3 px-4 py-1 rounded-full bg-amber-50 border border-amber-300/80 shadow-2xs flex items-center gap-1.5">
          <span className="text-amber-800 font-serif font-bold text-xs select-none">ੴ</span>
          <span className="text-[11px] font-serif font-bold text-amber-950 uppercase tracking-widest">
            Auspicious Celebrations &amp; Blessings
          </span>
        </div>

        <h2 className="font-script text-4xl text-wine-dark mt-1">
          Baraat &amp; Celebrations
        </h2>
        {familyHeading && (
          <p className="font-serif text-sm font-semibold text-burgundy mt-1">
            Hosted by {familyHeading}
          </p>
        )}

        <HeartDivider />

        {/* Ceremonial Event Cards */}
        <div className="w-full space-y-3.5 mt-5">
          {/* Sehra Bandi & Baraat */}
          {(baraatAssemblyTime || baraatVenue) && (
            <div className="p-4 rounded-xl bg-white/95 border border-amber-200/80 shadow-2xs text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base select-none">👑</span>
                <h3 className="font-serif font-bold text-wine-dark text-sm">
                  Sehra Bandi &amp; Baraat Departure
                </h3>
              </div>
              {baraatAssemblyTime && (
                <div className="flex items-center gap-1.5 text-xs text-text-body/85 font-sans mt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Assembly &amp; Departure: <strong>{baraatAssemblyTime}</strong></span>
                </div>
              )}
              {baraatVenue && (
                <div className="flex items-start gap-1.5 text-xs text-text-body/85 font-sans mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>Departure Venue: <strong>{baraatVenue}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Anand Karaj & Milni */}
          <div className="p-4 rounded-xl bg-white/95 border border-amber-200/80 shadow-2xs text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base select-none">🌸</span>
              <h3 className="font-serif font-bold text-wine-dark text-sm">
                Milni &amp; Anand Karaj Ceremony
              </h3>
            </div>
            {milniTime && (
              <div className="flex items-center gap-1.5 text-xs text-text-body/85 font-sans mt-1">
                <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Milni Swagat: <strong>{milniTime}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-text-body/85 font-sans mt-1">
              <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Sacred Anand Karaj: <strong>12:00 PM</strong></span>
            </div>
            <div className="flex items-start gap-1.5 text-xs text-text-body/85 font-sans mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>Venue: <strong>Gurdwara Singh Sabha, Sipri Bazar</strong></span>
            </div>
          </div>

          {/* Lunch & Reception */}
          {(receptionTime || receptionVenue) && (
            <div className="p-4 rounded-xl bg-white/95 border border-amber-200/80 shadow-2xs text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base select-none">🥂</span>
                <h3 className="font-serif font-bold text-wine-dark text-sm">
                  Celebratory Lunch &amp; Welcoming
                </h3>
              </div>
              {receptionTime && (
                <div className="flex items-center gap-1.5 text-xs text-text-body/85 font-sans mt-1">
                  <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Time: <strong>{receptionTime}</strong></span>
                </div>
              )}
              {receptionVenue && (
                <div className="flex items-start gap-1.5 text-xs text-text-body/85 font-sans mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>Venue: <strong>{receptionVenue}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Special Family Notes */}
          {specialGroomNotes && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-300/60 shadow-2xs text-center font-serif">
              <div className="flex items-center justify-center gap-1 mb-1 text-amber-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-xs uppercase font-bold tracking-wider">Ceremony Details</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs italic text-wine-dark leading-relaxed whitespace-pre-line">
                &ldquo;{specialGroomNotes}&rdquo;
              </p>
            </div>
          )}

          {/* Complete Family Names & Blessings Card */}
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#FFFDF8] via-white to-[#FDF7F8] border border-amber-200 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1.5 mb-3 text-burgundy">
              <Users className="w-4 h-4 text-amber-700" />
              <span className="text-xs sm:text-[13px] font-serif uppercase tracking-[0.2em] font-extrabold text-wine-dark">
                Family Blessings &amp; Cordial Invitation
              </span>
            </div>

            <div className="w-16 h-0.5 bg-amber-300/80 mx-auto mb-4" />

            {/* Special Invitation */}
            <div className="mb-4 pb-3.5 border-b border-amber-100">
              <span className="text-[10.5px] uppercase tracking-widest font-serif font-bold text-wine-dark/70 block mb-0.5">
                Special Invitation
              </span>
              <p className="font-serif font-extrabold text-base sm:text-lg text-burgundy tracking-wide">
                Tirajveer Singh &amp; Mehrajveer Singh
              </p>
            </div>

            {/* Grandparents & Elders */}
            <div className="mb-4 pb-3.5 border-b border-amber-100 space-y-1">
              <span className="text-[10.5px] uppercase tracking-widest font-serif font-bold text-wine-dark/70 block">
                Respected Grandparents &amp; Elders
              </span>
              <p className="font-serif font-bold text-sm sm:text-base text-wine-dark">
                S. Inder Singh Bhusari &amp; Sita Rani
              </p>
              <p className="font-serif text-xs sm:text-sm text-wine-dark/85 font-medium">
                Grand Uncle: <strong className="text-wine-dark">Joginder Singh Bhusari</strong>
              </p>
            </div>

            {/* Groom's Parents */}
            <div className="mb-4 pb-3.5 border-b border-amber-100 space-y-1">
              <span className="text-[10.5px] uppercase tracking-widest font-serif font-bold text-wine-dark/70 block">
                Respected Parents
              </span>
              <p className="font-serif font-bold text-sm sm:text-base text-wine-dark">
                S. Kuldeep Singh Bhusari &amp; Sdn. Ravinder Kaur
              </p>
            </div>

            {/* Brother & Sister-in-law */}
            <div className="mb-4 pb-3.5 border-b border-amber-100 space-y-1">
              <span className="text-[10.5px] uppercase tracking-widest font-serif font-bold text-wine-dark/70 block">
                Brother &amp; Sister-in-law (Bhabhi Ji)
              </span>
              <p className="font-serif font-bold text-sm sm:text-base text-wine-dark">
                S. Inderdeep Singh Bhusari &amp; Sdn. Ishavjeet Kaur
              </p>
            </div>

            {/* Taya Ji & Tayi Ji & Family */}
            <div className="mb-4 pb-3.5 border-b border-amber-100 space-y-1">
              <span className="text-[10.5px] uppercase tracking-widest font-serif font-bold text-wine-dark/70 block">
                Respected Elders &amp; Family
              </span>
              <p className="font-serif font-bold text-xs sm:text-sm text-wine-dark">
                Dr. Ranjeet Singh Bhusari (Taya Ji) &amp; Sdn. Manjeet Kaur (Tayi Ji)
              </p>
              <p className="font-serif text-xs sm:text-sm text-wine-dark/85 font-medium">
                Dr. Taranpreet Singh Bhusari &amp; Dr. Hargeet Kaur
              </p>
            </div>

            {/* Bride Side Family */}
            <div className="mb-3 space-y-1">
              <span className="text-[10.5px] uppercase tracking-widest font-serif font-bold text-wine-dark/70 block">
                Bride Side Respected Family
              </span>
              <p className="font-serif font-bold text-xs sm:text-sm text-wine-dark">
                S. Paramjeet Singh Gandhi &amp; Sdn. Rupinder Kaur
              </p>
            </div>

            {/* Closing regards */}
            <div className="mt-4 pt-3 border-t border-amber-200/60">
              <span className="text-[10px] uppercase tracking-[0.25em] font-serif font-bold text-wine-dark/60 block mb-0.5">
                With Warm Compliments
              </span>
              <p className="font-serif font-bold text-sm text-burgundy">
                Bhusari Family &amp; Relatives
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
