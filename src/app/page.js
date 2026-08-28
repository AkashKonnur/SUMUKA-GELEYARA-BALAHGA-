import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Stats from "@/components/public/Stats";
import About from "@/components/public/About";
import Journey from "@/components/public/Journey";
import Events from "@/components/public/Events";
import LiveUpdates from "@/components/public/LiveUpdates";
import Gallery from "@/components/public/Gallery";
import Donation from "@/components/public/Donation";
import Location from "@/components/public/Location";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";
import { readData } from "@/lib/data";
import {
  fallbackSiteInfo,
  fallbackEvents,
  fallbackAnnouncements,
  fallbackJourney,
  fallbackDonation,
  fallbackLocation,
} from "@/lib/fallbackData";

// Revalidate every 30 seconds so public site reflects admin changes quickly.
// After an admin save, the next visitor (within 30s) will trigger a fresh DB read.
export const revalidate = 30;

export default async function HomePage() {
  // Read data from persistent MongoDB storage (server-side).
  // Falls back to beautiful static data if DB is unavailable.
  let siteInfo = fallbackSiteInfo;
  let events = fallbackEvents;
  let announcements = fallbackAnnouncements;
  let journey = fallbackJourney;
  let donation = fallbackDonation;
  let location = fallbackLocation;
  let gallery = [];

  try {
    const [
      dbSiteInfo,
      dbEvents,
      dbAnnouncements,
      dbJourney,
      dbDonation,
      dbLocation,
      dbGallery,
    ] = await Promise.all([
      readData("siteInfo"),
      readData("events"),
      readData("announcements"),
      readData("journey"),
      readData("donation"),
      readData("location"),
      readData("gallery"),
    ]);

    if (dbSiteInfo && Object.keys(dbSiteInfo).length > 0) siteInfo = { ...fallbackSiteInfo, ...dbSiteInfo };
    if (Array.isArray(dbEvents) && dbEvents.length > 0) events = dbEvents;
    if (Array.isArray(dbAnnouncements) && dbAnnouncements.length > 0) announcements = dbAnnouncements;
    if (Array.isArray(dbJourney) && dbJourney.length > 0) journey = dbJourney;
    if (dbDonation && Object.keys(dbDonation).length > 0) donation = { ...fallbackDonation, ...dbDonation };
    if (dbLocation && Object.keys(dbLocation).length > 0) location = { ...fallbackLocation, ...dbLocation };
    if (Array.isArray(dbGallery)) gallery = dbGallery;
  } catch {
    // If MongoDB is unavailable, the public site renders using fallback data.
  }

  return (
    <div className="min-h-screen bg-cream text-text-body flex flex-col selection:bg-gold selection:text-ink">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero */}
        <Hero siteInfo={siteInfo} />

        {/* Stats counter badge */}
        <Stats />

        {/* 2. About */}
        <About siteInfo={siteInfo} />

        {/* 3. 11-Year Journey */}
        <Journey journey={journey} />

        {/* 4. Events (Day 1 / 2 / 3) */}
        <Events events={events} />

        {/* 5. Live Updates */}
        <LiveUpdates announcements={announcements} />

        {/* 6. Gallery */}
        <Gallery gallery={gallery} />

        {/* 7. Donation */}
        <Donation donation={donation} />

        {/* 8. Location (Google Maps) */}
        <Location location={location} />

        {/* 9. Contact */}
        <Contact siteInfo={siteInfo} />
      </main>

      <Footer />
    </div>
  );
}
