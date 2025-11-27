import React from "react";
import "./contact.css";
import { IoCallOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

function Contact() {
  return (
    <div className="contact-container">
      <header className="contact-header">
        <h1>Get in Touch</h1>
        <p>
          We're here to help. Contact us by phone, email, or use the form below.
        </p>
      </header>

      <section className="contact-info-section">
        <div className="w-50 flex flex-column gap-3">
          <div className="contact-info-card">
            <div className="card-icon">
              <IoCallOutline />
            </div>
            <div className="card-text">
              <h3>Phone</h3>
              <p>+91 98765 43210</p>
            </div>
          </div>
          <div className="contact-info-card">
            <div className="card-icon">
              <MdOutlineEmail />
            </div>
            <div className="card-text">
              <h3>Email</h3>
              <p>support@caddcentre.com</p>
            </div>
          </div>
        </div>
        <div className="w-50">
          <div className="flex justify-center">
            <img src="/contactus.jpg" alt="Contact Us" className="w-50 h-50" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
