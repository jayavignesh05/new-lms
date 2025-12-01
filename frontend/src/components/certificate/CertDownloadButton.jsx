import React, { useState, useEffect } from "react";
import { FaDownload, FaCheck, FaSpinner } from "react-icons/fa6";
import "./cert-button.css";

const CertDownloadButton = ({ onClick, isGenerating }) => {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    if (isGenerating) {
      // START: Animation begins
      setStatus("loading");
      setProgress(0);

      // Fast Animation (updates every 30ms)
      interval = setInterval(() => {
        setProgress((prev) => {
          // IMPORTANT: Stop at 90% and WAIT for the parent to finish PDF
          if (prev >= 90) return 90; 
          return prev + 5; // Fast increment
        });
      }, 30);

    } else if (!isGenerating && status === "loading") {
      // FINISH: Parent says PDF is ready
      clearInterval(interval);
      setProgress(100);     // Jump to 100%
      setStatus("success"); // Show Green Tick
      
      // Reset button to normal after 3 seconds
      setTimeout(() => {
        setStatus("idle");
        setProgress(0);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [isGenerating, status]);

  return (
    <div className="cert-btn-wrapper">
      <div className={`btn-glow ${status === "success" ? "success-glow" : ""}`}></div>

      <button
        onClick={onClick}
        disabled={status !== "idle"}
        className={`smart-btn ${status}`}
      >
        {/* Progress Bar Background */}
        <div 
          className="progress-bg" 
          style={{ width: `${progress}%`, opacity: status === "loading" ? 1 : 0 }}
        />

        <div className="btn-inner">
          {/* IDLE State */}
          <div className={`state-content ${status === "idle" ? "active" : "inactive"}`}>
            <FaDownload className="icon-bounce" />
            <span>Get Certificate</span>
          </div>

          {/* LOADING State */}
          <div className={`state-content ${status === "loading" ? "active" : "inactive"}`}>
            <FaSpinner className="icon-spin" />
            <span>{Math.round(progress)}%</span>
          </div>

          {/* SUCCESS State */}
          <div className={`state-content ${status === "success" ? "active" : "inactive"}`}>
            <FaCheck className="icon-check" />
            <span>Done</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default CertDownloadButton;