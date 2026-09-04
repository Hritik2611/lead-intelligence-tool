import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createLead } from "../services/api";

const AddLead = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    contact: "",
    role: "",
    industry: "SaaS",
    location: "",
    employees: "",
    revenue: "",
    website: "",
    email: "",
    phone: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createLead({
        ...formData,
        employees: Number(formData.employees),
      });

      navigate("/leads");
    } catch (error) {
      console.error(error);
      setError("Failed to create lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => navigate("/leads")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Leads
      </button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Add New Lead
        </h1>

        <p className="mt-1 text-slate-500">
          Add a company and contact. The lead score will be
          calculated automatically.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl shadow-sm p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Company *
            </label>

            <input
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g. Acme Technologies"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Contact *
            </label>

            <input
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Role *
            </label>

            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              placeholder="e.g. CTO"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Industry *
            </label>

            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SaaS">SaaS</option>
              <option value="Technology">Technology</option>
              <option value="Marketing">Marketing</option>
              <option value="Analytics">Analytics</option>
              <option value="FinTech">FinTech</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Location *
            </label>

            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g. Bangalore, India"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Employees */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Employees *
            </label>

            <input
              type="number"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              required
              min="1"
              placeholder="e.g. 150"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Revenue */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Revenue *
            </label>

            <input
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              required
              placeholder="e.g. $15M"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Website
            </label>

            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@example.com"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Phone
            </label>

            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              LinkedIn
            </label>

            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end mt-6 pt-5 border-t border-slate-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            <Plus size={18} />

            {loading ? "Creating..." : "Create Lead"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddLead;