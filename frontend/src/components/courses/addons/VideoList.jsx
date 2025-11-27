import React, { useState } from "react";
import { FaPlayCircle, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa"; 
// import "../../../pages/home.css"; 

const VideoList = ({ resources, base_api, courseName }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleOpenVideo = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const getVideoUrl = (video) => {
    if (!video || !video.url_or_id) return "";
    const cleanBase = base_api.replace(/\/api$/, ""); 
    return `${cleanBase}${video.url_or_id}`;
  };

  // --- NEW LOGIC FOR NEXT/PREV ---
  const getCurrentIndex = () => {
    return resources.findIndex((res) => res.id === selectedVideo?.id);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const index = getCurrentIndex();
    if (index < resources.length - 1) {
      setSelectedVideo(resources[index + 1]);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const index = getCurrentIndex();
    if (index > 0) {
      setSelectedVideo(resources[index - 1]);
    }
  };

  const currentIndex = selectedVideo ? getCurrentIndex() : -1;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === resources.length - 1;

  return (
    <div className="addon-group">
      <div className="resources-list">
        {resources.map((res) => (
          <div key={res.id} className="video-row-card" onClick={() => handleOpenVideo(res)}>
            {/* Left: Thumbnail */}
            <div className="video-preview-left">
               <video 
                 src={getVideoUrl(res)} 
                 className="mini-video-player"
                 muted 
                 preload="metadata" 
               />
               <div className="preview-overlay"></div>
            </div>

            {/* Center: Info */}
            <div className="video-info-center">
              <span className="course-sub-name">{courseName}</span>
              <h4 className="video-main-title">{res.title}</h4>
            </div>

            {/* Right: Play Icon */}
            <div className="play-btn-right">
              <FaPlayCircle />
            </div>
          </div>
        ))}
      </div>

      {/* --- Video Modal Popup --- */}
      {selectedVideo && (
        <div className="video-modal-overlay" onClick={handleCloseVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <h3>{courseName} - {selectedVideo.title}</h3>
              <button className="close-btn" onClick={handleCloseVideo}>
                <FaTimes />
              </button>
            </div>

            {/* --- NEW PLAYER CONTAINER WITH BUTTONS --- */}
            <div className="player-container">
              
              {/* Previous Button */}
              <button 
                className={`vid-nav-btn prev ${isFirst ? 'disabled' : ''}`} 
                onClick={handlePrev}
                disabled={isFirst}
              >
                <FaChevronLeft />
              </button>

              {/* Video Player */}
              <div className="video-wrapper">
                <video
                  key={selectedVideo.id} // Key change forces video reload
                  width="100%"
                  height="450"
                  controls
                  autoPlay
                  controlsList="nodownload"
                  style={{ display: "block", backgroundColor: "black" }}
                >
                  <source src={getVideoUrl(selectedVideo)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Next Button */}
              <button 
                className={`vid-nav-btn next ${isLast ? 'disabled' : ''}`} 
                onClick={handleNext}
                disabled={isLast}
              >
                <FaChevronRight />
              </button>

            </div>
            {/* ----------------------------------------- */}

          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList;