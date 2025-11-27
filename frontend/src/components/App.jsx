import "./App.css";
// import '../output.css'
import { Route, Routes,Link  } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Layout from "./layout";
import ProfilePage from "../pages/ProfilePage";
import MyCertificates from "../pages/MyCertificates";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Contact from "../pages/Contact";
import CourseDetail from "../components/courses/coursesdetails";
import QuizPlay from "../components/courses/QuizPlay";
import ProtectedRoute from "../components/proctedrouter";
import TestPage from '../pages/TestPage';
import HistoryPage from "../pages/HistoryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          
          <Route path="/home" element={<Home />} />
          <Route path="/certificates" element={<MyCertificates />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/course/:courseCode" element={<CourseDetail />} />
          <Route path="/quiz-play/:courseId" element={<QuizPlay />} />
          <Route path="/assessment-history" element={<HistoryPage />} />
          <Route path="/test" element={<TestPage />} />

        </Route>
      </Route>
    </Routes>
  );
}

export default App;
