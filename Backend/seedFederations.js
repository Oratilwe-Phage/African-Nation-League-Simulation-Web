// seedFederations.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Federation from "./models/Federation.js";

dotenv.config();

const seedFederations = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Federation.deleteMany(); // clear existing

    await Federation.insertMany([
      {
        country: "Nigeria",
        managerName: "Jose Peseiro",
        representativeName: "Amaju Pinnick",
        email: "nigeria@cafleague.com",
      },
      {
        country: "Egypt",
        managerName: "Rui Vitória",
        representativeName: "Gamal Allam",
        email: "egypt@cafleague.com",
      },
      {
        country: "Senegal",
        managerName: "Aliou Cissé",
        representativeName: "Augustin Senghor",
        email: "senegal@cafleague.com",
      },
      {
        country: "Morocco",
        managerName: "Walid Regragui",
        representativeName: "Fouzi Lekjaa",
        email: "morocco@cafleague.com",
      },
      {
        country: "Ghana",
        managerName: "Chris Hughton",
        representativeName: "Kurt Okraku",
        email: "ghana@cafleague.com",
      },
      {
        country: "Cameroon",
        managerName: "Rigobert Song",
        representativeName: "Samuel Eto’o",
        email: "cameroon@cafleague.com",
      },
      {
        country: "South Africa",
        managerName: "Hugo Broos",
        representativeName: "Danny Jordaan",
        email: "southafrica@cafleague.com",
      },
    ]);

    console.log("✅ Federations added successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding federations:", err);
    process.exit(1);
  }
};

seedFederations();

