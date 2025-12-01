import React, { useState } from "react";
import jsPDF from "jspdf";
import CertDownloadButton from "./CertDownloadButton";

const HtmlCertificateBtn = ({ studentName, courseName }) => {
  const [loading, setLoading] = useState(false);

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url + "?t=" + new Date().getTime();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Could not load image at ${url}`));
    });
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleDownload = async () => {
    setLoading(true);

    try {
      await wait(600);
      await generatePdfLogic();
      setLoading(false);
    } catch (error) {
      console.error("PDF Error", error);
      alert("Failed to generate PDF. Check if 'caddcentre.png' is in public folder.");
      setLoading(false);
    }
  };

  const generatePdfLogic = async () => {
    const doc = new jsPDF("l", "mm", "a4");
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    const BLUE = "#1e3a8a";
    const GOLD = "#c6a355";
    const GREY = "#64748b";

    let logoImg;
    try {
      logoImg = await loadImage("../../../src/assets/caddcentre.png");
    } catch {
      console.warn("Logo not found, proceeding without it.");
    }

    doc.setFillColor(BLUE);
    doc.triangle(0, 0, 60, 0, 0, 60, "F");
    doc.setFillColor(BLUE);
    doc.triangle(width, height, width - 60, height, width, height - 60, "F");
    doc.setFillColor(GOLD);
    doc.triangle(width, 0, width - 30, 0, width, 30, "F");
    doc.setFillColor(GOLD);
    doc.triangle(0, height, 30, height, 0, height - 30, "F");
    doc.setDrawColor(GOLD);
    doc.setLineWidth(1.5);
    doc.rect(15, 15, width - 30, height - 30);
    doc.setDrawColor(BLUE);
    doc.setLineWidth(0.5);
    doc.rect(18, 18, width - 36, height - 36);

    if (logoImg) {
      const logoW = 40;
      const logoH = 15;
      doc.addImage(logoImg, "PNG", (width / 2) - (logoW / 2), 25, logoW, logoH);
    }

    doc.setFont("times", "bold");
    doc.setFontSize(36);
    doc.setTextColor(BLUE);
    doc.text("CERTIFICATE", width / 2, 60, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(GOLD);
    doc.setCharSpace(2);
    doc.text("OF COMPLETION", width / 2, 68, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setCharSpace(0);
    doc.setFontSize(12);
    doc.setTextColor(GREY);
    doc.text("This is to certify that", width / 2, 85, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.setTextColor(BLUE);
    doc.setDrawColor(GOLD);
    doc.setLineWidth(0.5);
    doc.line((width / 2) - 50, 102, (width / 2) + 50, 102);
    doc.text(studentName.toUpperCase(), width / 2, 98, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(GREY);
    doc.text("Has successfully completed the course requirements for", width / 2, 115, { align: "center" });

    doc.setFont("times", "bolditalic");
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42);
    doc.text(courseName, width / 2, 130, { align: "center" });

    const sealX = width - 50;
    const sealY = 135;
    doc.setDrawColor(GOLD);
    doc.setLineWidth(1);
    doc.circle(sealX, sealY, 12);
    doc.setLineWidth(0.3);
    doc.circle(sealX, sealY, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(GOLD);
    doc.text("VALID", sealX, sealY + 1, { align: "center", angle: 0 });

    const today = new Date().toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });

    const footerY = 170;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(BLUE);
    doc.text(today, 60, footerY, { align: "center" });
    
    doc.setDrawColor(GREY);
    doc.setLineWidth(0.5);
    doc.line(40, footerY + 2, 80, footerY + 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(GREY);
    doc.text("Date of Issue", 60, footerY + 8, { align: "center" });

    doc.setFont("times", "italic");
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text("Director", width - 60, footerY, { align: "center" });
    
    doc.line(width - 80, footerY + 2, width - 40, footerY + 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(GREY);
    doc.text("Authorized Signature", width - 60, footerY + 8, { align: "center" });

    doc.save(`${courseName.replace(/\s+/g, "_")}_Certificate.pdf`);
  };

  return <CertDownloadButton onClick={handleDownload} isGenerating={loading} />;
};

export default HtmlCertificateBtn;
