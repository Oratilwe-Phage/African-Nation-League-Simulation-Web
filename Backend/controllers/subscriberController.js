// controllers/subscriberController.js
import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../utils/emailService.js";

// Subscribe to match updates
export const subscribe = async (req, res, next) => {
  console.log("📨 Received subscription request:", req.body);

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if already subscribed
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    // Save new subscriber
    await Subscriber.create({ email });

    // Send welcome email
    try {
      await sendEmail(
        email,
        "Welcome to African Nations League Updates!",
        "Thank you for subscribing! You’ll receive notifications when new matches are simulated."
      );
    } catch (emailErr) {
      console.error("❗ Email sending failed:", emailErr.message);
      return res.status(500).json({
        message: "Subscribed, but failed to send the welcome email.",
      });
    }

    return res.status(201).json({
      message: "Subscribed successfully! A welcome email has been sent.",
    });

  } catch (err) {
    console.error("❗ Subscription Error:", err);
    return res.status(500).json({ message: "Subscription failed. Please try again." });
  }
};





