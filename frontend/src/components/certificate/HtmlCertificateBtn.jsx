import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FaAward, FaSpinner } from "react-icons/fa6";
import "../courses/addons.css";
import caddLogo from "../../assets/caddcentre.svg";

const HtmlCertificateBtn = ({ studentName, courseName }) => {
  const [loading, setLoading] = useState(false);
  const certificateRef = useRef(null);

  const handleDownload = async () => {
    setLoading(true);
    const element = certificateRef.current;

    try {
     
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true, 
        backgroundColor: "#8f8f8fff"
      });

      
      const imgData = canvas.toDataURL("image/png");

     
      const pdf = new jsPDF("l", "mm", "a4"); 
      
      
      const pdfWidth = 297; 
      const pdfHeight = 210;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${courseName.replace(/\s+/g, "_")}_Certificate.pdf`);

    } catch (error) {
      console.error("Certificate Error:", error);
      alert("Failed to generate certificate.");
    } finally {
      setLoading(false);
    }
  };

  // Get today's date
  const today = new Date().toLocaleDateString("en-GB", {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <>
      {/* --- THE BUTTON (Visible) --- */}
      <button 
        className="cert-download-btn" 
        onClick={handleDownload} 
        disabled={loading}
      >
        {loading ? <FaSpinner className="fa-spin" /> : <FaAward />}
        <span>{loading ? "Generating..." : "Get Certificate"}</span>
      </button>

      {/* --- THE CERTIFICATE DESIGN (Hidden off-screen) --- */}
      <div style={{ position: "absolute", top: "-10000px", left: "-10000px" }}>
        <div ref={certificateRef} className="certificate-container">
          
          <div className="cert-border"></div>
          
          <div className="cert-content">
            {/* Logo */}
            <img src={caddLogo} alt="Logo" className="cert-logo" />

            <h1>CERTIFICATE OF COMPLETION</h1>
            <p className="cert-subtitle">This certificate is proudly presented to</p>

            {/* DYNAMIC STUDENT NAME */}
            <h2 className="student-name">{studentName}</h2>

            <p className="cert-text">
              For successfully completing the course requirements for
            </p>

            {/* DYNAMIC COURSE NAME */}
            <h3 className="course-title">{courseName}</h3>

            <div className="cert-footer">
              <div className="cert-date">
                <span className="line">{today}</span>
                <span className="label">Date</span>
              </div>
              
              <div className="cert-signature">
                {/* You can add a signature image here */}
                <span className="line sign-line">Admin Signature</span>
                <span className="label">Authorized Signature</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default HtmlCertificateBtn;