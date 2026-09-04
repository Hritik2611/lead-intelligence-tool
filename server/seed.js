const mongoose = require("mongoose");
require("dotenv").config();

const Lead = require("./models/Lead");

const leads = [
  {
    company: "NovaTech",
    contact: "Aarav Sharma",
    role: "CTO",
    industry: "Technology",
    location: "Bangalore, India",
    employees: 250,
    revenue: "$25M",
    website: "https://novatech.com",
    email: "aarav@novatech.com",
    phone: "+91 9876543210",
    linkedin: "https://linkedin.com",
    score: 94,
    priority: "HOT",
    scoreReasons: [
      "Technology-focused company",
      "Large employee base",
      "Decision-maker identified",
      "High revenue potential",
    ],
  },
  {
    company: "CloudWorks",
    contact: "Priya Verma",
    role: "VP Engineering",
    industry: "SaaS",
    location: "Mumbai, India",
    employees: 180,
    revenue: "$18M",
    website: "https://cloudworks.com",
    email: "priya@cloudworks.com",
    phone: "+91 9876543211",
    linkedin: "https://linkedin.com",
    score: 89,
    priority: "HOT",
    scoreReasons: [
      "Strong SaaS fit",
      "Senior decision-maker",
      "Growing company",
    ],
  },
  {
    company: "GrowthLabs",
    contact: "Rahul Mehta",
    role: "CEO",
    industry: "Marketing",
    location: "Delhi, India",
    employees: 120,
    revenue: "$12M",
    website: "https://growthlabs.com",
    email: "rahul@growthlabs.com",
    phone: "+91 9876543212",
    linkedin: "https://linkedin.com",
    score: 82,
    priority: "HOT",
    scoreReasons: [
      "Decision-maker identified",
      "Strong business potential",
      "Relevant industry",
    ],
  },
  {
    company: "DataBridge",
    contact: "Sneha Kapoor",
    role: "Head of Data",
    industry: "Analytics",
    location: "Pune, India",
    employees: 90,
    revenue: "$9M",
    website: "https://databridge.com",
    email: "sneha@databridge.com",
    phone: "+91 9876543213",
    linkedin: "https://linkedin.com",
    score: 76,
    priority: "WARM",
    scoreReasons: [
      "Analytics-focused company",
      "Relevant decision-maker",
      "Medium company size",
    ],
  },
  {
    company: "FinEdge",
    contact: "Vikram Singh",
    role: "Product Director",
    industry: "FinTech",
    location: "Gurgaon, India",
    employees: 75,
    revenue: "$7M",
    website: "https://finedge.com",
    email: "vikram@finedge.com",
    phone: "+91 9876543214",
    linkedin: "https://linkedin.com",
    score: 71,
    priority: "WARM",
    scoreReasons: [
      "FinTech industry",
      "Relevant product role",
      "Good revenue potential",
    ],
  },
  {
    company: "BrightScale",
    contact: "Ananya Gupta",
    role: "Growth Manager",
    industry: "SaaS",
    location: "Hyderabad, India",
    employees: 60,
    revenue: "$5M",
    website: "https://brightscale.com",
    email: "ananya@brightscale.com",
    phone: "+91 9876543215",
    linkedin: "https://linkedin.com",
    score: 68,
    priority: "WARM",
    scoreReasons: [
      "SaaS company",
      "Growth-focused role",
      "Potential expansion opportunity",
    ],
  },
  {
    company: "MarketFlow",
    contact: "Karan Malhotra",
    role: "Marketing Manager",
    industry: "Marketing",
    location: "Chennai, India",
    employees: 35,
    revenue: "$3M",
    website: "https://marketflow.com",
    email: "karan@marketflow.com",
    phone: "+91 9876543216",
    linkedin: "https://linkedin.com",
    score: 54,
    priority: "COLD",
    scoreReasons: [
      "Small company size",
      "Moderate revenue potential",
    ],
  },
  {
    company: "CodeNest",
    contact: "Rohan Joshi",
    role: "Engineering Manager",
    industry: "Technology",
    location: "Noida, India",
    employees: 25,
    revenue: "$2M",
    website: "https://codenest.com",
    email: "rohan@codenest.com",
    phone: "+91 9876543217",
    linkedin: "https://linkedin.com",
    score: 48,
    priority: "COLD",
    scoreReasons: [
      "Small employee base",
      "Low revenue potential",
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Lead.deleteMany();

    await Lead.insertMany(leads);

    console.log(`${leads.length} leads inserted successfully`);

    await mongoose.connection.close();

    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:");
    console.error(error.message);

    process.exit(1);
  }
};

seedDatabase();