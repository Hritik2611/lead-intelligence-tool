const calculateLeadScore = (lead) => {
  let employeeScore = 0;
  let revenueScore = 0;
  let roleScore = 0;
  let industryScore = 0;

  // 1. Employee Score - 25 points
  if (lead.employees >= 200) {
    employeeScore = 25;
  } else if (lead.employees >= 100) {
    employeeScore = 20;
  } else if (lead.employees >= 50) {
    employeeScore = 15;
  } else if (lead.employees >= 20) {
    employeeScore = 10;
  } else {
    employeeScore = 5;
  }

  // 2. Revenue Score - 25 points
  const revenue = parseFloat(
    String(lead.revenue).replace(/[^0-9.]/g, "")
  );

  if (revenue >= 20) {
    revenueScore = 25;
  } else if (revenue >= 10) {
    revenueScore = 20;
  } else if (revenue >= 5) {
    revenueScore = 15;
  } else if (revenue >= 2) {
    revenueScore = 10;
  } else {
    revenueScore = 5;
  }

  // 3. Role Score - 25 points
  const role = String(lead.role || "").toLowerCase();

  const decisionMakerRoles = [
    "ceo",
    "cto",
    "cfo",
    "coo",
    "founder",
    "co-founder",
    "president",
    "vp",
    "vice president",
    "director",
    "head",
  ];

  const isDecisionMaker = decisionMakerRoles.some((keyword) =>
    role.includes(keyword)
  );

  if (isDecisionMaker) {
    roleScore = 25;
  } else if (
    role.includes("manager") ||
    role.includes("lead")
  ) {
    roleScore = 15;
  } else {
    roleScore = 8;
  }

  // 4. Industry Score - 25 points
  const targetIndustries = [
    "saas",
    "technology",
    "analytics",
    "fintech",
  ];

  if (
    targetIndustries.includes(
      String(lead.industry || "").toLowerCase()
    )
  ) {
    industryScore = 25;
  } else {
    industryScore = 15;
  }

  // Final score
  const totalScore =
    employeeScore +
    revenueScore +
    roleScore +
    industryScore;

  // Priority
  let priority = "COLD";

  if (totalScore >= 80) {
    priority = "HOT";
  } else if (totalScore >= 60) {
    priority = "WARM";
  }

  return {
    score: totalScore,
    priority,
    scoreReasons: [
      `Employee size contributed ${employeeScore}/25 points`,
      `Revenue contributed ${revenueScore}/25 points`,
      `Contact role contributed ${roleScore}/25 points`,
      `Industry fit contributed ${industryScore}/25 points`,
    ],
  };
};

module.exports = calculateLeadScore;