import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  User,
  MapPin,
  Users,
  Mail,
  Phone,
  Globe,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  Bookmark,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { generateAIEmail, getLeadById } from "../services/api";

const LeadDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [aiEmail, setAiEmail] = useState("");
  const [aiError, setAiError] = useState("");

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fetch lead
  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLeadById(id);

        setLead(data);

        // Check if lead is already saved
        const savedIds = JSON.parse(
          localStorage.getItem("savedLeadIds") || "[]"
        );

        setSaved(savedIds.includes(data._id));
      } catch (error) {
        console.error(error);
        setError("Failed to load lead");
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  // Save / Remove lead
  const handleSaveLead = () => {
    if (!lead) return;

    const savedIds = JSON.parse(
      localStorage.getItem("savedLeadIds") || "[]"
    );

    if (saved) {
      const updatedIds = savedIds.filter(
        (savedId) => savedId !== lead._id
      );

      localStorage.setItem(
        "savedLeadIds",
        JSON.stringify(updatedIds)
      );

      setSaved(false);
    } else {
      if (!savedIds.includes(lead._id)) {
        savedIds.push(lead._id);
      }

      localStorage.setItem(
        "savedLeadIds",
        JSON.stringify(savedIds)
      );

      setSaved(true);
    }
  };

  // Generate AI Email
  const handleGenerateEmail = async () => {
    if (!lead) return;

    try {
      setGeneratingEmail(true);
      setAiError("");
      setAiEmail("");

      const result = await generateAIEmail(lead);

      setAiEmail(result.email);
    } catch (error) {
      console.error(error);

      setAiError(
        error.message || "Failed to generate AI email"
      );
    } finally {
      setGeneratingEmail(false);
    }
  };

  // Copy generated email
  const handleCopyEmail = async () => {
    if (!aiEmail) return;

    try {
      await navigator.clipboard.writeText(aiEmail);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          Loading lead...
        </p>
      </div>
    );
  }

  // Error state
  if (error || !lead) {
    return (
      <div>
        <button
          onClick={() => navigate("/leads")}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Leads
        </button>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600">
            {error || "Lead not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate("/leads")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4"
          >
            <ArrowLeft size={17} />
            Back to Leads
          </button>

          <h1 className="text-2xl font-bold text-slate-900">
            {lead.company}
          </h1>

          <p className="mt-1 text-slate-500">
            Lead intelligence and AI-powered outreach.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveLead}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
            saved
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Bookmark size={18} />

          {saved ? "Saved Lead" : "Save Lead"}
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Lead Information */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              Lead Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Company */}
              <div className="flex items-start gap-3">
                <Building2
                  size={20}
                  className="text-slate-400 mt-0.5"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Company
                  </p>

                  <p className="font-medium text-slate-900">
                    {lead.company}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3">
                <User
                  size={20}
                  className="text-slate-400 mt-0.5"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Contact
                  </p>

                  <p className="font-medium text-slate-900">
                    {lead.contact}
                  </p>

                  <p className="text-sm text-slate-500">
                    {lead.role}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin
                  size={20}
                  className="text-slate-400 mt-0.5"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Location
                  </p>

                  <p className="font-medium text-slate-900">
                    {lead.location}
                  </p>
                </div>
              </div>

              {/* Employees */}
              <div className="flex items-start gap-3">
                <Users
                  size={20}
                  className="text-slate-400 mt-0.5"
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Employees
                  </p>

                  <p className="font-medium text-slate-900">
                    {lead.employees}
                  </p>
                </div>
              </div>

              {/* Industry */}
              <div>
                <p className="text-xs text-slate-500">
                  Industry
                </p>

                <p className="font-medium text-slate-900 mt-1">
                  {lead.industry}
                </p>
              </div>

              {/* Revenue */}
              <div>
                <p className="text-xs text-slate-500">
                  Revenue
                </p>

                <p className="font-medium text-slate-900 mt-1">
                  {lead.revenue}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              Contact Information
            </h2>

            <div className="space-y-4">
              {/* Email */}
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail
                    size={19}
                    className="text-slate-400"
                  />

                  <a
                    href={`mailto:${lead.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              )}

              {/* Phone */}
              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone
                    size={19}
                    className="text-slate-400"
                  />

                  <a
                    href={`tel:${lead.phone}`}
                    className="text-slate-700 hover:text-blue-600"
                  >
                    {lead.phone}
                  </a>
                </div>
              )}

              {/* Website */}
              {lead.website && (
                <div className="flex items-center gap-3">
                  <Globe
                    size={19}
                    className="text-slate-400"
                  />

                  <a
                    href={lead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {lead.website}
                  </a>
                </div>
              )}

              {/* LinkedIn */}
              {lead.linkedin && (
                <div className="flex items-center gap-3">
                  <ExternalLink
                    size={19}
                    className="text-slate-400"
                  />

                  <a
                    href={lead.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* AI Outreach Email */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={20}
                    className="text-purple-600"
                  />

                  <h2 className="text-lg font-semibold text-slate-900">
                    AI Outreach Email
                  </h2>
                </div>

                <p className="text-sm text-slate-500 mt-1">
                  Generate a personalized email using Gemini AI.
                </p>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateEmail}
                disabled={generatingEmail}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                <Sparkles size={17} />

                {generatingEmail
                  ? "Generating..."
                  : "Generate AI Email"}
              </button>
            </div>

            {/* AI Error */}
            {aiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-600">
                  {aiError}
                </p>
              </div>
            )}

            {/* Generated Email */}
            {aiEmail && (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {/* Email Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-700">
                    Generated Email
                  </p>

                  <button
                    onClick={handleCopyEmail}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {/* Email Content */}
                <div className="p-5">
                  <p className="text-sm leading-6 text-slate-700 whitespace-pre-line">
                    {aiEmail}
                  </p>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!aiEmail &&
              !generatingEmail &&
              !aiError && (
                <div className="border border-dashed border-slate-300 rounded-lg p-8 text-center">
                  <Sparkles
                    size={28}
                    className="mx-auto text-slate-300 mb-3"
                  />

                  <p className="text-sm text-slate-500">
                    Click "Generate AI Email" to create a
                    personalized outreach message.
                  </p>
                </div>
              )}
          </div>
        </div>

        {/* Right Section - Lead Score */}
        <div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">
              Lead Score
            </h2>

            {/* Score Circle */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-8 border-blue-100">
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {lead.score}
                  </p>

                  <p className="text-xs text-slate-400">
                    / 100
                  </p>
                </div>
              </div>

              {/* Priority */}
              <div className="mt-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                    lead.priority === "HOT"
                      ? "bg-red-50 text-red-600"
                      : lead.priority === "WARM"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {lead.priority}
                </span>
              </div>
            </div>

            {/* Score Breakdown */}
            {lead.scoreReasons?.length > 0 && (
              <div className="mt-6 pt-5 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">
                  Score Breakdown
                </h3>

                <div className="space-y-3">
                  {lead.scoreReasons.map(
                    (reason, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />

                        <p className="text-sm text-slate-600">
                          {reason}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;