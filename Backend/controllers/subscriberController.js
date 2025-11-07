// controllers/subscriberController.js
import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../utils/emailService.js";

// Subscribe to match updates
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check for duplicates
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed" });
    }

    // Save subscriber
    const subscriber = await Subscriber.create({ email });

    // Try sending welcome email
    try {
      await sendEmail(
        email,
        "Welcome to African Nations League Updates!",
        "Thank you for subscribing! You’ll receive notifications when new matches are simulated."
      );
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message);
      return res.status(500).json({ message: "Subscribed, but failed to send email." });
    }

    res.status(201).json({ message: "Subscribed successfully! Email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Subscription failed. Please try again." });
  }
};




