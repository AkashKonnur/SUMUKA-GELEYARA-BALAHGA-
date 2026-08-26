// Fallback data used when Firebase is not connected.
// This ensures the public site renders beautifully even without a Firebase project.

export const fallbackSiteInfo = {
  about: "Sumuka Geleyara Balaga is a vibrant community in Bengaluru that has celebrated the spirit of Lord Ganesha for over a decade. What began as a small neighborhood gathering has grown into one of the most beloved Ganeshotsava celebrations in Kengeri, uniting families through devotion, culture, and service.",
  contactPhone: "+91 XXXXX XXXXX",
  contactEmail: "sumukageleyarabalaga@gmail.com",
  heroTaglineEn: "11 Years of Faith • Devotion • Unity",
  heroTaglineKn: "11 ವರ್ಷಗಳ ಭಕ್ತಿ • ಭಾವನೆ • ಏಕತೆ",
  heroCopyEn: "Celebrating eleven remarkable years of togetherness. Join us for three divine days where tradition, devotion and our community come alive.",
  heroCopyKn: "ಹನ್ನೊಂದು ವರ್ಷಗಳ ಒಗ್ಗಟ್ಟು ಮತ್ತು ಭಕ್ತಿಯ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮ್ಮನ್ನು ಆತ್ಮೀಯವಾಗಿ ಸ್ವಾಗತಿಸುತ್ತೇವೆ.",
};

export const fallbackEvents = [
  {
    id: "day1",
    dayNumber: 1,
    date: "14 SEPTEMBER",
    title: "The Arrival",
    items: [
      { time: "08:00 AM", title: "Ganesh Pratishthapane", description: "The sacred installation and opening of Ganeshotsava." },
      { time: "10:30 AM", title: "Special Pooja", description: "Traditional rituals and prayers." },
      { time: "01:00 PM", title: "Prasada Distribution", description: "Community prasada service." },
      { time: "06:30 PM", title: "Opening Ceremony", description: "Official celebration begins with the community." },
      { time: "08:00 PM", title: "Cultural Program", description: "An evening of music and performances." },
    ],
  },
  {
    id: "day2",
    dayNumber: 2,
    date: "15 SEPTEMBER",
    title: "The Celebration",
    items: [
      { time: "08:00 AM", title: "Special Pooja", description: "Morning devotional rituals." },
      { time: "11:00 AM", title: "Community Activities", description: "Programs bringing devotees and families together." },
      { time: "01:00 PM", title: "Prasada Distribution", description: "Community prasada service." },
      { time: "06:00 PM", title: "Cultural Events", description: "Featured cultural performances." },
      { time: "08:15 PM", title: "Evening Program", description: "Special celebration program." },
    ],
  },
  {
    id: "day3",
    dayNumber: 3,
    date: "16 SEPTEMBER",
    title: "The Finale",
    items: [
      { time: "08:00 AM", title: "Final Rituals", description: "Morning rituals of the final day." },
      { time: "11:30 AM", title: "Special Celebrations", description: "Community gathering and devotional activities." },
      { time: "01:00 PM", title: "Prasada Distribution", description: "Final-day prasada service." },
      { time: "07:30 PM", title: "Maha Aarti", description: "Grand evening aarti with all devotees." },
      { time: "09:00 PM", title: "Closing Ceremony", description: "Closing the 11th-year celebration." },
    ],
  },
];

export const fallbackAnnouncements = [
  { id: "1", text: "Welcome to the official website of Sumuka Geleyara Balaga — celebrating our 11th year of Ganeshotsava!", createdAt: new Date() },
  { id: "2", text: "The final program timings will be updated here as they are confirmed by the organizers.", createdAt: new Date() },
  { id: "3", text: "Use the Event Map section to find parking, prasada distribution, first aid and the help desk.", createdAt: new Date() },
];

export const fallbackJourney = [
  { year: 2016, tagline: "A humble beginning — the first Ganesh idol, a handful of devoted friends.", order: 1 },
  { year: 2017, tagline: "Growing stronger — the neighborhood joined in, doubling our celebration.", order: 2 },
  { year: 2018, tagline: "Cultural programs added — music and dance became part of our tradition.", order: 3 },
  { year: 2019, tagline: "First large-scale Ganeshotsava — over 500 devotees gathered.", order: 4 },
  { year: 2020, tagline: "Devotion during adversity — intimate worship at home during the pandemic.", order: 5 },
  { year: 2021, tagline: "Virtual poojas connected our community across distances.", order: 6 },
  { year: 2022, tagline: "Grand return — the community reunited with renewed energy and faith.", order: 7 },
  { year: 2023, tagline: "Expanding traditions — new cultural events and community service initiatives.", order: 8 },
  { year: 2024, tagline: "A milestone year — elaborate decorations and record attendance.", order: 9 },
  { year: 2025, tagline: "10th Anniversary — a decade of devotion celebrated with grandeur.", order: 10 },
  { year: 2026, tagline: "11th Year — a legacy of faith, devotion, and unity continues.", order: 11 },
];

export const fallbackLocation = {
  address: "158/78, Valagerahalli, Subash Nagar, Kengeri Satellite Town, Bengaluru, Karnataka 560060",
  lat: 12.9137,
  lng: 77.4871,
  mapNote: "Located in the heart of Kengeri Satellite Town",
};

export const fallbackDonation = {
  upiId: "example@upi",
  upiName: "Sumuka Geleyara Balaga",
  instructions: "Scan the QR code below using any UPI app (PhonePe, GPay, Paytm) to contribute. Every donation helps us celebrate our community traditions.",
};
