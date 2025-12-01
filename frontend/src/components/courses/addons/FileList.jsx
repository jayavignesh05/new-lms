import React, { useState, useEffect, useRef } from "react";
import {
  FaFilePdf,
  FaChevronRight,
  FaChevronLeft,
  FaExpand,
  FaCompress,
  FaArrowsUpDown,
  FaRegFileLines,
} from "react-icons/fa6";
import { Document, Page, pdfjs } from "react-pdf";

import Spinner from "../../courses/Spinner";
// 1. CSS Imports
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// 2. VITE WORKER SETUP (This fixes the 404/MIME error)
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const FileList = ({ resources, base_api }) => {
  const [activeFile, setActiveFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const [viewMode, setViewMode] = useState("single");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const viewerContainerRef = useRef(null);

  useEffect(() => {
    if (resources && resources.length > 0) {
      const cleanBase = base_api.replace(/\/api$/, "");
      const urlSuffix = resources[0].url_or_id || ""; 
      // Fix: Ensure we have a valid string before setting state
      if(urlSuffix) {
          setActiveFile(`${cleanBase}${urlSuffix}`);
      }
    }
  }, [resources, base_api]);

  useEffect(() => {
    setPageNumber(1);
  }, [activeFile]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error enabling full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleEsc = () => {
      if (!document.fullscreenElement) setIsFullScreen(false);
    };
    document.addEventListener("fullscreenchange", handleEsc);
    return () => document.removeEventListener("fullscreenchange", handleEsc);
  }, []);

  return (
    <div
      className={`file-viewer-container ${
        isFullScreen ? "fullscreen-mode" : ""
      }`}
      ref={viewerContainerRef}
    >
      {/* LEFT SIDE: LIST */}
      {!isFullScreen && (
        <div className="file-sidebar">
          <h4 className="sidebar-title">Course Materials</h4>
          <div className="file-list-scroll">
            {resources.map((res) => {
              const cleanBase = base_api.replace(/\/api$/, "");
              const fullUrl = `${cleanBase}${res.url_or_id}`;
              const isActive = activeFile === fullUrl;

              return (
                <div
                  key={res.id}
                  className={`file-list-item ${isActive ? "active" : ""}`}
                  onClick={() => setActiveFile(fullUrl)}
                >
                  <div className="file-icon">
                    <FaFilePdf />
                  </div>
                  <span className="file-name">{res.title}</span>
                  {isActive && <FaChevronRight className="active-indicator" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      
      <div
        className="file-preview-area"
        onContextMenu={(e) => e.preventDefault()}
      >
        
        {activeFile ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* TOOLBAR */}
            <div className="pdf-controls">
              {viewMode === "single" && (
                <>
                  <button
                    className="pdf-btn"
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    <FaChevronLeft /> Prev
                  </button>
                  <span>
                    Page {pageNumber} of {numPages || "--"}
                  </span>
                  <button
                    className="pdf-btn"
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    Next <FaChevronRight />
                  </button>
                </>
              )}

              <div className="pdf-divider"></div>

              <button
                className={`pdf-btn ${
                  viewMode === "scroll" ? "active-btn" : ""
                }`}
                onClick={() =>
                  setViewMode(viewMode === "single" ? "scroll" : "single")
                }
                title="Toggle Scroll/Single Page"
              >
                {viewMode === "single" ? (
                  <FaArrowsUpDown />
                ) : (
                  <FaRegFileLines />
                )}
                {viewMode === "single" ? " Scroll View" : " Single Page"}
              </button>

              <button className="pdf-btn" onClick={toggleFullScreen}>
                {isFullScreen ? <FaCompress /> : <FaExpand />}
                {isFullScreen ? " Exit" : " Fullscreen"}
              </button>
            </div>

            {/* RENDER AREA */}
            <div className="pdf-render-area">
              <Document
                file={activeFile}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<Spinner fullPage={false} />}
                error={
                  <div style={{ color: "white", marginTop: "20px" }}>
                    Failed to load PDF.
                  </div>
                }
              >
                {viewMode === "single" ? (
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    scale={isFullScreen ? 1.2 : 1.0}
                  />
                ) : (
                  Array.from(new Array(numPages), (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={isFullScreen ? 1.2 : 1.0}
                      className="pdf-page-scroll"
                    />
                  ))
                )}
              </Document>
            </div>
          </div>
        ) : (
          <div className="no-file-selected">
            <FaFilePdf size={40} color="#cbd5e1" />
            <p>Select a file to view</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;