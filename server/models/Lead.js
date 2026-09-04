const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    contact: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    industry: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    employees: {
      type: Number,
      required: true,
    },

    revenue: {
      type: String,
      required: true,
    },

    website: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    priority: {
      type: String,
      enum: ["HOT", "WARM", "COLD"],
      required: true,
    },

    scoreReasons: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);