import { sendEmail } from "./utils/emailService.js";

const testEmail = async () => {
  try {
    await sendEmail("africannationsleague@gmail.com", "Test Email", "This is a test from African Nations League app!");
    console.log("Test email sent successfully!");
  } catch (err) {
    console.error("Test email failed:", err.message);
  }
};

testEmail();
