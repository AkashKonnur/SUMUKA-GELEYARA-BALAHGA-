// Fallback data used when MongoDB is not connected or returns empty data.
// THIS IS THE REPOSITORY-BACKED SOURCE OF TRUTH for permanent website content.
// These values survive Render sleep/restart/redeploy because they are Git-tracked.
// Admin Panel can override at runtime via MongoDB, but this file is the permanent default.

// ─── PERMANENT IMAGE CONSTANTS ─────────────────────────────────────────────────

const YEAR_IMAGES = {
  2016: "https://lh3.googleusercontent.com/pw/AP1GczP6XYqXgspx_-5YaqRXJRuIHvxpoffK8OWOoSmVE3HI4RQckZlg7Ojw5lqU0lrSwJ5iCxx-8Kv11n0s1GKNAL28UUc71IDB0BmWyZYvl3sag6_54mbTSYEda7vP-i-WVQEypsRUZrprURGG1jBxhCgu=w1260-h945-s-no-gm?authuser=0",
  2017: "https://lh3.googleusercontent.com/pw/AP1GczOEF7y1dnfkCsSSD17vDyiHjZOcYNhtf9W05B-Q1pmzsFKevzmsoZlnlpya-JroByszOro_VZOLjEJj9n7o0-LFuEs2tweBD1YKA6j0tyAwLBYM5hvSGkelmQ59G2Bp-qxeU53I7sPqXT7S41GQ3Lrg0w=w1260-h945-s-no-gm?authuser=0",
  2018: "https://lh3.googleusercontent.com/pw/AP1GczMFy2lD81keVp96CgzHgXjJyftz_HgH-Uh_PLpEXlS5IjPUm0_JKjQ83q9Vvt6NhgRrGVTTzkCGndlBRbiempYV5bh4M6bSIzYF_A5QzuMnVHJzT2oprfHdVDwhVAiyhYm-BpyLSQrbkLO3TXYd0cst_Q=w1260-h945-s-no-gm?authuser=0",
  2019: "https://lh3.googleusercontent.com/pw/AP1GczO17Sr5ZOIJHxKwKehpmOG1Nb8ZCZfr7e3RNBSveuSgEYW0_GX6xtgIBsRGmAJ4eu3jdTG0Vs859gh6dlliy2Qy_Ec-Ub3GixTCi2a3lJ9kNtB5ES8nXnTCLXX6WRRGjmtSxnBOKoUbuZ1z4tCEhIwonw=w1260-h945-s-no-gm?authuser=0",
  2020: "https://lh3.googleusercontent.com/pw/AP1GczPvBRuHfZJlT9ho1wBQUdQmeS9mhVZBrmvjqoRUuSgbJ8OYo7k49G9mOISW4J2WqH4PmMwjnK4e4jJnHWXuviTO3vI6ESm6DCWbTyyE605EVO4zaovat7s8hE2kDxUadDe3W9hZmTiG7ZUOXBJqJZ15Uw=w1920-h864-s-no-gm?authuser=0",
  2021: "https://lh3.googleusercontent.com/pw/AP1GczM_h9pvW8hA8H3zpeqZxt3GyerthIqGFZmOmWn0VQYNPushHiwDfs86P6i-VZDdg-46Hshh5B-sJPZKX-ZCHNV2ulPxRrjQORgjCvpgrcgOCz-xexROKdxobKmjUQFF8tX9oNjgPBnYGQqnarrfhJyBbQ=w1260-h945-s-no-gm?authuser=0",
  2022: "https://lh3.googleusercontent.com/pw/AP1GczOgxZtIO4cs7F0RAShXD6cc1R_P0B9PIfWdHzlPsWrnXmZQLbSvoJfw_Qwv5YJSDatC_BawML7qShAusozSPr4Q6alb3d5tKBCZ16FTsPPObgYT_fsmrhsbMyDGVrQRDyNthgId9WW5hWYOTJi3XCQi=w1260-h945-s-no-gm?authuser=0",
  2023: "https://lh3.googleusercontent.com/pw/AP1GczMD9zFvBj4Dqsdf4jOXqWnzhLMf07BOfwQKLMcDcdF1hhEl3q70qk2qChntWYErPmIXi0PyfoHPONYvEN8Fabqxblq8mMydE101a3qobsSQCSHLpuB9Q_67G8GXp-Qbf5aMNI8ourupXH8k6x_oBOQa=w709-h945-s-no-gm?authuser=0",
  2024: "https://lh3.googleusercontent.com/pw/AP1GczMKCpQ4ZlrTacE0_ijeflQV55Xt_Sw5bb3M7ML5Xxzj3HWg1QPuYF_OhILnLamm0ryzeC6RR_46ZBPOeR4ZVtiivIoxRiw_zbsSbmnrFU_YhVwFd8mHj1dVFUVaLsRov9Df-wR2CJpWUmlTVXVf2yQQ=w709-h945-s-no-gm?authuser=0",
  2025: "https://lh3.googleusercontent.com/pw/AP1GczMNbvA3jIWC75YCE2-cMj7tpLqaHffzJbmFACSK1SFEEDgMmY3b2F6ULau35vexnt5mTh6lJt9TY_wjsbugWrLe3XcfdZ8A65T3WaiuVZw6JGJlKDg4Uc-piIXowVdA1sHF4rUe8Kjzkzam0xnKnQd-Ww=w709-h945-s-no-gm?authuser=0",
  2026: null, // Image not yet available — will be added when ready
};

const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/pw/AP1GczMR0JhcNb1olBvSS7VNe70Yb5bAw1jvEfilALztMVksYUvbm990yc6h3-rmcIW_6fVejCOK-1MU8jeeR5r7eps6lEPisGS4ImsPn12LihKi0bxK7Z9sitnJ-uEgCj9YiuRob9wKdxuLxQZMLpArhTC=w1260-h945-s-no-gm?authuser=0";

const QR_CODE_URL =
  "https://lh3.googleusercontent.com/pw/AP1GczMypOlx8QcRKh8eJazYyNqaq9KtJT9rJSCxiVH_gHUZLAh23mYtKQAMJ-aa68J6NaSXJDav9DFryCrGVTlkXrorLSwHI274jmw1m7CKhHi0vTtzYTAIOdbl-Bz7hv8aYwc0krH1Au6SsyIWHL-3LFQ=w536-h613-s-no-gm?authuser=0";

// ─── SITE INFO ──────────────────────────────────────────────────────────────────

export const fallbackSiteInfo = {
  about: "Sumuka Geleyara Balaga is a vibrant community in Bengaluru that has celebrated the spirit of Lord Ganesha for over a decade. What began as a small neighborhood gathering has grown into one of the most beloved Ganeshotsava celebrations in Kengeri, uniting families through devotion, culture, and service.",
  // Primary contact
  contactPhone: "+91 77956 76274",
  contactName: "Kiran",
  // Secondary contact
  contact2Phone: "+91 88929 83068",
  contact2Name: "Sagar",
  contactEmail: "sumukageleyarabalaga@gmail.com",
  heroTaglineEn: "11 Years of Faith • Devotion • Unity",
  heroTaglineKn: "11 ವರ್ಷಗಳ ಭಕ್ತಿ • ಭಾವನೆ • ಏಕತೆ",
  heroCopyEn: "Celebrating eleven remarkable years of togetherness. Join us for three divine days where tradition, devotion and our community come alive.",
  heroCopyKn: "ಹನ್ನೊಂದು ವರ್ಷಗಳ ಒಗ್ಗಟ್ಟು ಮತ್ತು ಭಕ್ತಿಯ ಸಂಭ್ರಮಕ್ಕೆ ನಿಮ್ಮನ್ನು ಆತ್ಮೀಯವಾಗಿ ಸ್ವಾಗತಿಸುತ್ತೇವೆ.",
  // Permanent hero background image — repository-backed
  backgroundImageUrl: HERO_IMAGE_URL,
};

// ─── EVENTS ─────────────────────────────────────────────────────────────────────

export const fallbackEvents = [
  {
    id: "day1",
    dayNumber: 1,
    date: "14 SEPTEMBER",
    title: "ರೋಮಾಂಚಕ ಆಟಗಳು · ಮೋಜಿನ ಚಟುವಟಿಕೆಗಳು · ಅದ್ಭುತ ಬಹುಮಾನಗಳು",
    subtitle: "EXCITING GAMES · FUN ACTIVITIES · AMAZING PRIZES",
    taglines: [
      { kn: "ಆಟಗಳು ಮತ್ತು ಮೋಜಿನ ಚಟುವಟಿಕೆಗಳು", en: "GAMES & FUN ACTIVITIES" },
      { kn: "ಎಲ್ಲರಿಗೂ ಆತ್ಮೀಯ ಸ್ವಾಗತ", en: "OPEN TO ALL" },
      { kn: "ಗೆಲ್ಲಲು ರೋಮಾಂಚಕ ಬಹುಮಾನಗಳು", en: "EXCITING PRIZES TO BE WON" },
      { kn: "ಭಾಗವಹಿಸುವವರಿಗೆ ವಿಶೇಷ ಉಡುಗೊರೆಗಳು", en: "SPECIAL GIFTS FOR PARTICIPANTS" },
      { kn: "ಭಾಗವಹಿಸಿ · ಆಟವಾಡಿ · ಗೆಲ್ಲಿ!", en: "PARTICIPATE · PLAY · WIN!" },
    ],
    items: [
      { time: "", title: "ಗಣಪತಿ ಪ್ರತಿಷ್ಠಾಪನೆ", description: "GANAPATI STHAPANA" },
      { time: "", title: "ಬೆಳಗಿನ ಪೂಜೆ · ಬೆಳಗಿನ ಆರತಿ", description: "MORNING POOJA · MORNING AARTI" },
      { time: "", title: "ಮಕ್ಕಳ ಚಟುವಟಿಕೆಗಳು · ಆಟಗಳು ಮತ್ತು ಮೋಜಿನ ಚಟುವಟಿಕೆಗಳು", description: "KIDS ACTIVITIES · GAMES & FUN ACTIVITIES" },
      { time: "", title: "ಯುವಕರ ಚಟುವಟಿಕೆಗಳು · ಮಹಿಳೆಯರ ಚಟುವಟಿಕೆಗಳು", description: "YOUTH ACTIVITIES · LADIES ACTIVITIES" },
      { time: "", title: "ಪ್ರತಿಭಾ ಪ್ರದರ್ಶನ", description: "TALENT PERFORMANCE" },
      { time: "", title: "ಬಹುಮಾನ ವಿತರಣೆ", description: "PRIZE DISTRIBUTION" },
      { time: "", title: "ಸಂಜೆ ಆರತಿ", description: "EVENING AARTI" },
      { time: "", title: "ಸಾಂಸ್ಕೃತಿಕ ಸಂಜೆ", description: "CULTURAL EVENING" },
    ],
  },
  {
    id: "day2",
    dayNumber: 2,
    date: "15 SEPTEMBER",
    title: "ಹಾಡಿ · ನೃತ್ಯ ಮಾಡಿ · ಪ್ರದರ್ಶಿಸಿ · ಮಿಂಚಿರಿ!",
    subtitle: "SING · DANCE · PERFORM · SHINE!",
    taglines: [
      { kn: "ಹಾಡುಗಾರಿಕೆಯ ಪ್ರದರ್ಶನ", en: "SINGING PERFORMANCE" },
      { kn: "ನೃತ್ಯ ಪ್ರದರ್ಶನ", en: "DANCE PERFORMANCE" },
      { kn: "ರಂಗೋಲಿ / ಚಿತ್ರಕಲೆ", en: "RANGOLI / DRAWING" },
      { kn: "ಪ್ರತಿಭಾ ಪ್ರದರ್ಶನ", en: "TALENT PERFORMANCE" },
    ],
    items: [
      { time: "", title: "ಬೆಳಗಿನ ಪೂಜೆ · ಬೆಳಗಿನ ಆರತಿ", description: "MORNING POOJA · MORNING AARTI" },
      { time: "", title: "ಪ್ರಸಾದ ವಿತರಣೆ", description: "PRASADA DISTRIBUTION" },
      { time: "", title: "ಹಾಡುಗಾರಿಕೆ · ನೃತ್ಯ", description: "SINGING · DANCING" },
      { time: "", title: "ರಂಗೋಲಿ / ಚಿತ್ರಕಲೆ", description: "RANGOLI / DRAWING" },
      { time: "", title: "ಪ್ರತಿಭಾ ಪ್ರದರ್ಶನ", description: "TALENT PERFORMANCE" },
      { time: "", title: "ನೃತ್ಯ ಪ್ರದರ್ಶನ", description: "DANCE PERFORMANCE" },
    ],
  },
  {
    id: "day3",
    dayNumber: 3,
    date: "16 SEPTEMBER",
    title: "ಭಕ್ತಿ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಸಂಭ್ರಮದ ಅದ್ಧೂರಿ ಆಚರಣೆ",
    subtitle: "A GRAND CELEBRATION OF DEVOTION, CULTURE & CELEBRATION",
    taglines: [
      { kn: "ಶ್ರೀ ಗಣೇಶ ವಿಸರ್ಜನಾ ಮೆರವಣಿಗೆ", en: "SHRI GANESHA VISARJANA PROCESSION" },
      { kn: "ಅದ್ಧೂರಿ ಸಮಾರೋಪಕ್ಕಾಗಿ ಎಲ್ಲರೂ ಒಂದಾಗಿ ಸೇರೋಣ!", en: "LET'S COME TOGETHER FOR A GRAND FINALE!" },
      { kn: "ಭಾಗವಹಿಸಿ · ಆಟವಾಡಿ · ಪ್ರದರ್ಶಿಸಿ · ಗೆಲ್ಲಿ · ಸಂಭ್ರಮಿಸಿ", en: "PARTICIPATE · PLAY · PERFORM · WIN · CELEBRATE" },
    ],
    items: [
      { time: "", title: "ಬೆಳಗಿನ ಪೂಜೆ · ಬೆಳಗಿನ ಆರತಿ", description: "MORNING POOJA · MORNING AARTI" },
      { time: "", title: "ಪ್ರಸಾದ ವಿತರಣೆ", description: "PRASADA DISTRIBUTION" },
      { time: "", title: "ಭಜನೆ", description: "BHAJAN" },
      { time: "", title: "ಅದ್ಧೂರಿ ಸಾಂಸ್ಕೃತಿಕ ಕಾರ್ಯಕ್ರಮ", description: "GRAND CULTURAL PROGRAM" },
      { time: "", title: "ಮಹಾ ಆರತಿ", description: "GRAND AARTI" },
      { time: "", title: "ಪ್ರಸಾದ", description: "PRASADA" },
      { time: "", title: "ಶ್ರೀ ಗಣೇಶ ವಿಸರ್ಜನಾ ಮೆರವಣಿಗೆ", description: "SHRI GANESHA VISARJANA PROCESSION" },
      { time: "", title: "ಗಣೇಶ ವಿಸರ್ಜನೆ", description: "GANESHA VISARJANA" },
    ],
  },
];

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────────

export const fallbackAnnouncements = [
  { id: "1", text: "Welcome to the official website of Sumuka Geleyara Balaga — celebrating our 11th year of Ganeshotsava!", createdAt: new Date() },
  { id: "2", text: "The final program timings will be updated here as they are confirmed by the organizers.", createdAt: new Date() },
  { id: "3", text: "Use the Event Map section to find parking, prasada distribution, first aid and the help desk.", createdAt: new Date() },
];

// ─── JOURNEY (Year-wise images 2016–2026) ─────────────────────────────────────────

export const fallbackJourney = [
  { year: 2016, tagline: "A humble beginning — the first Ganesh idol, a handful of devoted friends.", order: 1, photo: YEAR_IMAGES[2016] },
  { year: 2017, tagline: "Growing stronger — the neighborhood joined in, doubling our celebration.", order: 2, photo: YEAR_IMAGES[2017] },
  { year: 2018, tagline: "Cultural programs added — music and dance became part of our tradition.", order: 3, photo: YEAR_IMAGES[2018] },
  { year: 2019, tagline: "First large-scale Ganeshotsava — over 500 devotees gathered.", order: 4, photo: YEAR_IMAGES[2019] },
  { year: 2020, tagline: "Devotion during adversity — intimate worship at home during the pandemic.", order: 5, photo: YEAR_IMAGES[2020] },
  { year: 2021, tagline: "Virtual poojas connected our community across distances.", order: 6, photo: YEAR_IMAGES[2021] },
  { year: 2022, tagline: "Grand return — the community reunited with renewed energy and faith.", order: 7, photo: YEAR_IMAGES[2022] },
  { year: 2023, tagline: "Expanding traditions — new cultural events and community service initiatives.", order: 8, photo: YEAR_IMAGES[2023] },
  { year: 2024, tagline: "A milestone year — elaborate decorations and record attendance.", order: 9, photo: YEAR_IMAGES[2024] },
  { year: 2025, tagline: "10th Anniversary — a decade of devotion celebrated with grandeur.", order: 10, photo: YEAR_IMAGES[2025] },
  { year: 2026, tagline: "11th Year — a legacy of faith, devotion, and unity continues.", order: 11, photo: YEAR_IMAGES[2026] },
];

// ─── GALLERY / MOMENTS ──────────────────────────────────────────────────────────
// Moments 1, 2, 3, 5, 6, 7, 9 only. Moments 4 and 8 are intentionally absent.

export const fallbackGallery = [
  {
    id: "moment-1",
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczMkKlDTGY0UQuNzNLpu4mmuxuY7rksksPVw9rJpY68I6ERpvzAsz14OnutaqPRPIlDE7kSleQbajewbefVZu-UYgOhteH5wVoNSUivlNXNhmG04_Bvu_HmP2J8tTSkTI90-qtvBq52gpcco3BcSbktW=w1260-h945-s-no-gm?authuser=0",
    caption: "Ganeshotsava Moment 1",
  },
  {
    id: "moment-2",
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPUz4S2RxpwCi0bqd-H1jxrwrrpd9vCUYX1KQbcRTWyyP4whNUodVwp2m95yXDHgq58qguqP9XJm_-uLu5YjS0klYaPZjBOtSQRmlJ1Kdo_Gek4AChqVFmTVWhxOxNTaPvGSx_TVDVg1u3jH9WxVXIq=w1920-h864-s-no-gm?authuser=0",
    caption: "Ganeshotsava Moment 2",
  },
  {
    id: "moment-3",
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPwymQAsk5szJGcbVbP_Zzd__7dP-y_F47C1gCGbv7kA7ecjJj3WAlkK5heSkWlxV9PAzoHS_FvMzgzZJdlNi9k2pBu7fbJANphWvmc5IgDUh58O53zKj3-qm4JW4j0iC8A2X2oj2TUhbUEO6pLNl3NUw=w1260-h945-s-no-gm?authuser=0",
    caption: "Ganeshotsava Moment 3",
  },
  {
    id: "moment-5",
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczNyy7LdcFYvNUymqFwmAdI83u6aUiNsZkwSHc4HgYZsKPrtZtAFxx0P8wvO9GloosUxJs-GNa9CRAcoXXJnmMxShclOVbZRKzsHFpr4lVd3kaD9EeVZgkkFFxq2BNHIfapUiytLUGvKT8T15v0JHaqGRA=w1260-h945-s-no-gm?authuser=0",
    caption: "Ganeshotsava Moment 5",
  },
  {
    id: "moment-6",
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczNNkx12qN5NXGU9aX0iXLNzIocm-b_Q4BND2xX_tMl1_j-CFQfqpp3wETtAd4WqHTPVMaB_Gmf7bpev0JHU5C8gWTrPSR6B4zC0Q1gUea-6z1rdmDUSV0msrTyUhuoihIy23gsp1-JJZJNpDGnoAEeu=w1260-h945-s-no-gm?authuser=0",
    caption: "Ganeshotsava Moment 6",
  },
  {
    id: "moment-7",
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczOgspByMpP3mBAyXxMq9HhjLILXGUY1U4NOEjaslafH7MGC8SAsDhXAIQ1tkANS3xqxCBLx5NaDlTnlvRK602QVFOzmEdJPEn3XwIUZKVFpsL07QZC5pJZM2H23dCQIopS3i2apv7rF0740DI-g4Ryz=w1920-h880-s-no-gm?authuser=0",
    caption: "Ganeshotsava Moment 7",
  },
  {
    id: "moment-9",
    imageUrl: "https://lh3.googleusercontent.com/pw/AP1GczPNspfnBjCYqxIlvut_BVsXgcOFvCFW8WN68Gg_eSTZ-l_MY_3NoODY_z-vWzDiFE6u6iUB675vm2QUT-BOM-dQsU8ZsOg_gbf_DkSJz_K5corJKLpnizKbz5R0AkI4gfL2a6lu5gMVKBQpTkqEsnD4=w1920-h880-s-no-gm?authuser=0",
    caption: "Ganeshotsava Moment 9",
  },
];

// ─── LOCATION ────────────────────────────────────────────────────────────────────

export const fallbackLocation = {
  address: "158/78, Valagerahalli, Subash Nagar, Kengeri Satellite Town, Bengaluru, Karnataka 560060",
  lat: 12.9137,
  lng: 77.4871,
  mapNote: "Located in the heart of Kengeri Satellite Town",
};

// ─── DONATION (QR Code only — payment system removed) ───────────────────────────

export const fallbackDonation = {
  upiId: null,
  upiName: "Sumuka Geleyara Balaga",
  qrImageUrl: QR_CODE_URL,
  instructions: "Scan the QR code below using any UPI app to contribute to Ganeshotsava. Every donation helps us celebrate our community traditions.",
};
