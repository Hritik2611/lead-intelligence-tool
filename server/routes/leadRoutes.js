const express = require("express");
const mongoose = require("mongoose");

const Lead = require("../models/Lead");
const calculateLeadScore = require("../utils/leadScoring");

const router = express.Router();

// ==========================================
// GET ALL LEADS
// ==========================================
router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("GET LEADS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
});

// ==========================================
// RECALCULATE ALL SCORES
// ==========================================
router.put("/recalculate-scores", async (req, res) => {
  try {
    const leads = await Lead.find();

    for (const lead of leads) {
      const result = calculateLeadScore(lead);

      lead.score = result.score;
      lead.priority = result.priority;
      lead.scoreReasons = result.scoreReasons;

      await lead.save();
    }

    res.status(200).json({
      success: true,
      message: "All lead scores recalculated successfully",
    });
  } catch (error) {
    console.error(
      "RECALCULATE SCORES ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to recalculate scores",
      error: error.message,
    });
  }
});

// ==========================================
// GET LEAD BY ID
// ==========================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("GET LEAD ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
});

// ==========================================
// CREATE LEAD
// ==========================================
router.post("/", async (req, res) => {
  try {
    const {
      company,
      contact,
      role,
      industry,
      location,
      employees,
      revenue,
      website,
      email,
      phone,
      linkedin,
    } = req.body;

    // Validation
    if (!company || !contact || !role) {
      return res.status(400).json({
        success: false,
        message: "Company, contact and role are required",
      });
    }

    // Prepare lead data
    const leadData = {
      company: company.trim(),
      contact: contact.trim(),
      role: role.trim(),

      industry: industry?.trim() || "Other",

      location: location?.trim() || "Unknown",

      employees: Number(employees) || 0,

      revenue: revenue || "0",

      website: website || "",
      email: email || "",
      phone: phone || "",
      linkedin: linkedin || "",
    };

    // Calculate score
    const result = calculateLeadScore(leadData);

    // Create lead
    const lead = await Lead.create({
      ...leadData,

      score: result.score,

      priority: result.priority,

      scoreReasons: result.scoreReasons,
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("=================================");
    console.error("CREATE LEAD ERROR");
    console.error("=================================");
    console.error(error);
    console.error("=================================");

    res.status(500).json({
      success: false,
      message: "Failed to create lead",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE LEAD
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("DELETE LEAD ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to delete lead",
      error: error.message,
    });
  }
});

module.exports = router;