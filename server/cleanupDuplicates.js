require("dotenv").config();

const mongoose = require("mongoose");
const Lead = require("./models/Lead");

const cleanupDuplicates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const leads = await Lead.find().sort({ createdAt: -1 });

    const seenCompanies = new Set();
    const duplicateIds = [];

    for (const lead of leads) {
      const companyName = lead.company.trim().toLowerCase();

      if (seenCompanies.has(companyName)) {
        duplicateIds.push(lead._id);
      } else {
        seenCompanies.add(companyName);
      }
    }

    if (duplicateIds.length === 0) {
      console.log("No duplicate leads found.");
      return;
    }

    const result = await Lead.deleteMany({
      _id: { $in: duplicateIds },
    });

    console.log(
      `${result.deletedCount} duplicate leads deleted successfully.`
    );

    console.log(
      `${seenCompanies.size} unique companies remain.`
    );
  } catch (error) {
    console.error("Duplicate cleanup failed:");
    console.error(error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

cleanupDuplicates();