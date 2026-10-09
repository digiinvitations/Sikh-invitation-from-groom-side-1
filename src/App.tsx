import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Hero } from './components/Hero';
import { InvitationMessage } from './components/InvitationMessage';
import { FamilyBlessings } from './components/FamilyBlessings';
import { MusicControl } from './components/MusicControl';
import { ScratchCardSection } from './components/ScratchCard';
import { Countdown } from './components/Countdown';
import { Events } from './components/Events';
import { Timeline } from './components/Timeline';
import { Venue } from './components/Venue';
import { RSVP } from './components/RSVP';
import { ClosingMessage } from './components/ClosingMessage';
import { Footer } from './components/Footer';
import { getWeddingData } from './services/db';
import { WeddingData } from './types';
import { AdminPanel } from './components/AdminPanel';
import { FallingPetals } from './components/FallingPetals';
import { FadeInSection } from './components/FadeInSection';
import { Preloader } from './components/Preloader';

function PublicView() {
  const [data, setData] = useState<WeddingData | null>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isHeroEnded, setIsHeroEnded] = useState(false);
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);

  useEffect(() => {
    async function loadData() {
      const dbData = await getWeddingData();
      
      // Clean up broken pixabay links that might be cached in Firestore
      if (dbData.heroVideoUrl?.includes("pixabay.com")) dbData.heroVideoUrl = "";
      if (dbData.musicUrl?.includes("pixabay.com")) dbData.musicUrl = "";
      
      // Ensure special invitation name is always Tirajveer Singh & Mehrajveer Singh
      if (!dbData.invitedBy || dbData.invitedBy.toLowerCase().includes("jasmer") || dbData.invitedBy.toLowerCase().includes("grandmother")) {
        dbData.invitedBy = "Tirajveer Singh & Mehrajveer Singh";
      }

      setData(dbData);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (data?.remixName) {
      document.title = data.remixName;
    }
    if (data?.ogImageUrl) {
      // Find or create og:image meta tag
      let ogImageMeta = document.querySelector('meta[property="og:image"]');
      if (!ogImageMeta) {
        ogImageMeta = document.createElement('meta');
        ogImageMeta.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageMeta);
      }
      ogImageMeta.setAttribute('content', data.ogImageUrl);
      
      // Some platforms also use twitter:image
      let twImageMeta = document.querySelector('meta[name="twitter:image"]');
      if (!twImageMeta) {
        twImageMeta = document.createElement('meta');
        twImageMeta.setAttribute('name', 'twitter:image');
        document.head.appendChild(twImageMeta);
      }
      twImageMeta.setAttribute('content', data.ogImageUrl);
    }
  }, [data]);

  if (!data) {
    return (
      <Preloader
        onLoaded={() => {}}
        names="Jaspreet & Jasmeet"
      />
    );
  }

  const coupleNames = data?.groom?.name && data?.bride?.name
    ? `${data.groom.name.split(" ")[0]} & ${data.bride.name.split(" ")[0]}`
    : "Jaspreet & Jasmeet";

  return (
    <div className="w-full bg-blush-main relative mx-auto max-w-md shadow-2xl overflow-hidden sm:my-0 min-h-[100svh]">
      {/* Royal Preloader: Pre-downloads hero background video and provides instant seamless reveal */}
      {!isPreloaderComplete && (
        <Preloader
          videoUrl={data.heroVideoUrl}
          logoUrl={data.heroLogoUrl}
          names={coupleNames}
          onLoaded={() => setIsPreloaderComplete(true)}
        />
      )}

      {/* Falling Flower Petals Ambient Overlay throughout the entire app */}
      <FallingPetals />

      {/* Website Background Music (autostarts smoothly once preloader completes) */}
      <MusicControl musicUrl={data.musicUrl} shouldPlay={isPreloaderComplete} />

      {/* Main Content - User lands directly on the actual wedding website with zero lag */}
      <main className={`w-full min-h-[100svh] bg-blush-main relative overflow-hidden transition-opacity duration-700 ${isPreloaderComplete ? 'opacity-100' : 'opacity-95'}`}>
        <Hero
          data={data}
          shouldPlayVideo={isPreloaderComplete}
          isReady={isPreloaderComplete}
          onVideoEnd={() => setIsHeroEnded(true)}
        />
        <FadeInSection threshold={0.08} rootMargin="0px 0px -30px 0px">
          <InvitationMessage message={data.invitationMessage} isHeroEnded={isHeroEnded} />
        </FadeInSection>
        <ScratchCardSection data={data} onReveal={() => setIsScratched(true)} />
        {/* Family Blessings Details Section - Placed just below the scratch heart as requested */}
        <FadeInSection threshold={0.05} rootMargin="0px 0px -30px 0px">
          <FamilyBlessings data={data} />
        </FadeInSection>
        {isScratched && <Countdown targetDate={data.weddingDate} />}
        
        {/* Main Wedding Sections with IntersectionObserver fade-in animations */}
        <FadeInSection threshold={0.05} rootMargin="0px 0px -30px 0px">
          <Events events={data.events} />
        </FadeInSection>
        <FadeInSection threshold={0.05} rootMargin="0px 0px -30px 0px">
          <Timeline events={data.events} />
        </FadeInSection>
        <FadeInSection threshold={0.05} rootMargin="0px 0px -30px 0px">
          <Venue venue={data.venue} />
        </FadeInSection>

        <FadeInSection threshold={0.05} rootMargin="0px 0px -30px 0px">
          <RSVP data={data} />
        </FadeInSection>
        <FadeInSection threshold={0.05} rootMargin="0px 0px -30px 0px">
          <ClosingMessage data={data} />
        </FadeInSection>
        <Footer data={data} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}


