import './App.css'
// import '../output.css'
import { Route, Routes } from "react-router-dom";
import Login from '../pages/login';
import Home from '../pages/home';
import Layout from './layout';
import ProfilePage from '../pages/ProfilePage';

function App() {
  return (
    <Routes>
      {/* Public routes that don't use the layout */}
      <Route path="/login" element={<Login/>} />
      

      {/* Private routes that use the common layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

 

export default App
