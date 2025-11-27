import React, { useState } from "react";
import { FaAward, FaSpinner, FaCheck } from "react-icons/fa6";
import "../courses/addons.css"; // Ensure CSS is imported

const AnimatedBtn = ({ onClick, label = "Get Certificate" }) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [progress, setProgress] = useState(0);

  const handleClick = async () => {
    if (status !== 'idle') return;

    setStatus('loading');
    setProgress(0);

    // 1. Start Visual Progress (0% -> 90%)
    // This runs independently to show activity
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90; 
        return prev + 1;
      });
    }, 20);

    try {
      // 2. Run the actual Logic (passed from parent)
      // We 'await' here until the PDF generation is totally done
      await onClick(); 

      // 3. Finish Animation (100%)
      clearInterval(interval);
      setProgress(100);
      
      // Small delay before showing success checkmark
      setTimeout(() => {
          setStatus('success');
      }, 200);

      // Reset button after 3.5 seconds
      setTimeout(() => {
        setStatus('idle');
        setProgress(0);
      }, 3500);

    } catch (error) {
      console.error(error);
      clearInterval(interval);
      setStatus('idle');
    }
  };

  return (
    <div className="cert-btn-wrapper">
      <div className={`btn-glow ${status === 'success' ? 'glow-success' : ''}`}></div>
      
      <button 
        className={`animated-cert-btn ${status}`} 
        onClick={handleClick}
        disabled={status !== 'idle'}
      >
        {/* Progress Bar */}
        <div 
          className="btn-progress-bar" 
          style={{ width: `${progress}%`, opacity: status === 'loading' ? 1 : 0 }}
        ></div>

        {/* Content */}
        <div className="btn-content">
          {/* IDLE */}
          <div className={`btn-state ${status === 'idle' ? 'visible' : 'hidden'}`}>
            <FaAward className="btn-icon bounce" />
            <span>{label}</span>
          </div>

          {/* LOADING */}
          <div className={`btn-state ${status === 'loading' ? 'visible' : 'hidden'}`}>
            <FaSpinner className="btn-icon spin" />
            <span>Processing... {progress}%</span>
          </div>

          {/* SUCCESS */}
          <div className={`btn-state ${status === 'success' ? 'visible' : 'hidden'}`}>
            <FaCheck className="btn-icon" />
            <span>Downloaded</span>
          </div>
        </div>
      </button>
    </div>
  );
};

export default AnimatedBtn;