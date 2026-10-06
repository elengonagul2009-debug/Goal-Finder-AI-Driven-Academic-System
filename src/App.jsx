import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/GetStarted.jsx";
import Signup from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import Academic from "./pages/Academic.jsx";
import Class10Details from "./pages/Tenth.jsx";
import After10Options from "./pages/After10Options.jsx";
import ConSchl from "./pages/ConSchl.jsx";       // Continue School page
import AcademicQuiz from "./pages/AcademicQuiz.jsx";   
import HighStream from "./pages/HighStream";
import Diploma from "./pages/Diploma.jsx";
import DiplomaQuiz from "./pages/DiplomaQuiz.jsx";
import DipStream from "./pages/DipStream.jsx";
// import Diploma from "./pages/Diploma.jsx";      // (optional) create later
// import Quiz from "./pages/Quiz.jsx";            // (optional) create later

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Main */}
        <Route path="/academic" element={<Academic />} />

        {/* 10th flow */}
        <Route path="/class-10" element={<Class10Details />} />
        <Route path="/after-10" element={<After10Options />} />
        <Route path="/class-10/continue-school" element={<ConSchl />} />
        <Route path="/quiz" element={<AcademicQuiz />} />
        <Route path="/highstream" element={<HighStream />} />
        <Route path="/class-10/diploma" element={<Diploma />} />
        <Route path="/diploma/quiz" element={<DiplomaQuiz />} />
        <Route path="/diploma/result" element={<DipStream />} />
        {/* <Route path="/class-10/diploma" element={<Diploma />} /> */}
        {/* <Route path="/quiz" element={<Quiz />} /> */}

        {/* safety: any unknown path → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}