import React from "react";
import { FaLink, FaExternalLinkAlt, FaGlobe } from "react-icons/fa";
// import "./reference.css"; 

const ReferenceList = ({ resources }) => {
  
  const handleOpenLink = (url) => {
    if (url) {
      // Ensure the URL has a protocol
      const fullUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `https://${url}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  // If no resources, show empty state
  if (!resources || resources.length === 0) {
    return <p className="text-center text-muted">No reference links available.</p>;
  }

  return (
    <div className="addon-group">
      <div className="resources-list">
        {resources.map((res) => (
          <div key={res.id} className="interactive-row-card">
            
            {/* Icon Box */}
            <div className="interactive-icon-box link-style">
              <FaGlobe />
            </div>

            {/* Title & Info */}
            <div className="interactive-info">
              <h4 className="interactive-title">{res.title}</h4>
              <span className="interactive-subtitle">
                 {res.url_or_id} {/* Showing URL purely for reference */}
              </span>
            </div>

            {/* Button */}
            <button 
              className="interactive-btn link-btn-style" 
              onClick={() => handleOpenLink(res.url_or_id)}
            >
              Visit <FaExternalLinkAlt style={{ marginLeft: "8px" }} />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferenceList;