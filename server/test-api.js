const axios = require("axios");

const newLead = {
  company: "TestCompany",
  contact: "Test User",
  role: "CEO",
  industry: "SaaS",
  location: "Bangalore, India",
  employees: 50,
  revenue: "$5M",
  website: "https://testcompany.com",
  email: "test@testcompany.com",
  phone: "+91 9999999999",
  linkedin: "https://linkedin.com",
  score: 75,
  priority: "WARM",
  scoreReasons: [
    "Good company size",
    "Relevant industry",
  ],
};

const testAPI = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/leads",
      newLead
    );

    console.log("Lead created successfully:");
    console.log(response.data);
  } catch (error) {
    console.error("API test failed:");
    console.error(error.response?.data || error.message);
  }
};

testAPI();   