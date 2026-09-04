const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get all leads
export const getLeads = async () => {
  const response = await fetch(`${API_URL}/leads`);

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  const result = await response.json();
  return result.data;
};

// Get single lead
export const getLeadById = async (id) => {
  const response = await fetch(`${API_URL}/leads/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch lead");
  }

  const result = await response.json();
  return result.data;
};

// Create lead
export const createLead = async (lead) => {
  try {
    const response = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ||
          result.message ||
          `Failed to create lead (${response.status})`
      );
    }

    return result.data;
  } catch (error) {
    console.error("CREATE LEAD API ERROR:", error);
    throw error;
  }
};

// Delete lead
export const deleteLead = async (id) => {
  const response = await fetch(`${API_URL}/leads/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete lead");
  }

  return response.json();
};

// Generate AI outreach email
export const generateAIEmail = async (lead) => {
  const payload = {
    company: lead.company,
    contact: lead.contact,
    role: lead.role,
    industry: lead.industry || "",
    location: lead.location || "",
    employees: lead.employees || 0,
    revenue: lead.revenue || "",
    score: lead.score || 0,
    priority: lead.priority || "",
  };

  const response = await fetch(`${API_URL}/ai/generate-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to generate AI email"
    );
  }

  return result.data;
};