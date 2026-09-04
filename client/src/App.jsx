import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetails from "./pages/LeadDetails";
import SavedLeads from "./pages/SavedLeads";
import AddLead from "./pages/AddLead";
import RealCompanies from "./pages/RealCompanies";

import Layout from "./layouts/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          <Route path="/leads" element={<Leads />} />

          <Route path="/leads/new" element={<AddLead />} />

          <Route path="/leads/:id" element={<LeadDetails />} />

          <Route path="/saved-leads" element={<SavedLeads />} />

          <Route
            path="/real-companies"
            element={<RealCompanies />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;