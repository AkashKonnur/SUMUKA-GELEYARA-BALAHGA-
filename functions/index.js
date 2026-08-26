const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure SMTP transporter for admin notification emails
// Using Gmail App Password or SMTP environment config
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL || "sumukageleyarabalaga@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD || "your-app-password",
  },
});

/**
 * Triggered whenever a new announcement is posted in Firestore.
 * Broadcasts an FCM push notification to all subscribed topics
 * and sends an email confirmation to the admin.
 */
exports.onNewAnnouncement = functions.firestore
  .document("announcements/{announcementId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const text = data.text || "New update posted";

    // 1. Send push notification to all subscribed devices
    const message = {
      notification: {
        title: "Sumuka Geleyara Balaga — Live Update",
        body: text.length > 100 ? text.substring(0, 97) + "..." : text,
      },
      data: {
        url: "/#live",
        announcementId: context.params.announcementId,
      },
      topic: "announcements",
    };

    try {
      await admin.messaging().send(message);
      console.log("FCM broadcast sent successfully.");
    } catch (err) {
      console.error("Failed to send FCM broadcast:", err);
    }

    // 2. Send email notification to admin Gmail
    const mailOptions = {
      from: `"Sumuka CMS" <${process.env.ADMIN_EMAIL || "noreply@sumuka.com"}>`,
      to: process.env.ADMIN_EMAIL || "sumukageleyarabalaga@gmail.com",
      subject: "📢 New Announcement Published on Ganeshotsava 2026 Website",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #fdf8ee; color: #33150f;">
          <h2 style="color: #9a6522;">Sumuka Geleyara Balaga — Ganeshotsava 2026</h2>
          <p>A new announcement was just published to the live website:</p>
          <blockquote style="background: #fff; border-left: 4px solid #d9a946; padding: 12px 16px; margin: 16px 0;">
            ${text}
          </blockquote>
          <p style="font-size: 12px; color: #777;">Posted at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    try {
      await mailTransport.sendMail(mailOptions);
      console.log("Admin email notification sent successfully.");
    } catch (err) {
      console.error("Failed to send admin email:", err);
    }
  });
