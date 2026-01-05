import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/protectedRoute";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";
import EditPortfolio from "./pages/EditPortfolio";
import PublishedPortfolio from "./pages/PublishedPortfolio";

function AppContent() {
  const location = useLocation();
  
  // Hide navbar on published portfolio pages
  const hideNavbar = location.pathname.startsWith('/portfolio/') && !location.pathname.startsWith('/portfolio/edit');
  
  return (
    <>
      {! hideNavbar && <Navbar />}
      <Routes>
        <Route path="/edit/:portfolioId" element={<EditPortfolio />} />
        <Route path="/portfolio/:portfolioId" element={<PublishedPortfolio />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={<Templates />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;