import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./components/protectedRoute";
import Dashboard from "./pages/Dashboard";
import Templates from "./pages/Templates";

function App() {
  return (
    <AuthProvider>
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
      <Route path = "/edit/:portfolioId" element={<EditPortfolio />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/templates" element={<Templates />}/>
    </Routes>
    </Router>
    </AuthProvider>
  )
};

export default App;
