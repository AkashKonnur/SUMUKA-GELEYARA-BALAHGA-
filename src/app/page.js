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
import {
  fallbackSiteInfo,
  fallbackEvents,
  fallbackAnnouncements,
  fallbackJourney,
  fallbackDonation,
  fallbackLocation,
} from "@/lib/fallbackData";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let siteInfo = fallbackSiteInfo;
  let events = fallbackEvents;
  let announcements = fallbackAnnouncements;
  let journey = fallbackJourney;
  let donation = fallbackDonation;
  let location = fallbackLocation;
  let gallery = [];

  // Try to load dynamic data from Firestore if available
  try {
    const {
      getSiteInfo,
      getEvents,
      getAnnouncements,
      getJourney,
      getDonation,
      getLocation,
      getGallery,
    } = await import("@/lib/firestore");

    const [
      dbSiteInfo,
      dbEvents,
      dbAnnouncements,
      dbJourney,
      dbDonation,
      dbLocation,
      dbGallery,
    ] = await Promise.allSettled([
      getSiteInfo(),
      getEvents(),
      getAnnouncements(),
      getJourney(),
      getDonation(),
      getLocation(),
      getGallery(),
    ]);

    if (dbSiteInfo.status === "fulfilled" && dbSiteInfo.value) siteInfo = { ...fallbackSiteInfo, ...dbSiteInfo.value };
    if (dbEvents.status === "fulfilled" && dbEvents.value?.length) events = dbEvents.value;
    if (dbAnnouncements.status === "fulfilled" && dbAnnouncements.value?.length) announcements = dbAnnouncements.value;
    if (dbJourney.status === "fulfilled" && dbJourney.value?.length) journey = dbJourney.value;
    if (dbDonation.status === "fulfilled" && dbDonation.value) donation = { ...fallbackDonation, ...dbDonation.value };
    if (dbLocation.status === "fulfilled" && dbLocation.value) location = { ...fallbackLocation, ...dbLocation.value };
    if (dbGallery.status === "fulfilled" && dbGallery.value?.length) gallery = dbGallery.value;
  } catch {
    // If Firestore fails or not yet connected, use fallbacks seamlessly
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
