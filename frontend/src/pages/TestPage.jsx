import React from "react";
import {
  FaArrowLeft,
  FaHistory,
  FaClock,
  FaQuestionCircle,
  FaLayerGroup,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TestPage = () => {
  const navigate = useNavigate();

  const assessmentData = [
    {
      id: 1,
      title: "Course on CAPM® Certificate Exam Preparatory Training",
      questions: 150,
      duration: "03:00:00 Hours",
      mockType: "Mock - 1",
      expiryDate: "May 21, 2125",
      buttonText: "Resume",
      isExpired: false,
    },
    {
      id: 2,
      title: "Course on PMP® Certificate Exam Preparatory Training",
      questions: 180,
      duration: "03:50:00 Hours",
      mockType: "Mock - 1",
      expiryDate: "June 2, 2125",
      buttonText: "Resume",
      isExpired: false,
    },
    {
      id: 3,
      title: "Mock Exam for PMP",
      questions: 180,
      duration: "03:50:00 Hours",
      mockType: "Mock - 1",
      expiryDate: "October 3, 2025",
      buttonText: "Resume",
      isExpired: true,
    },
  ];

  return (
    <div className="p-6 flex justify-center font-sans">
      <div className="w-full max-w-6xl flex flex-col gap-8">
        {/* --- HEADER (Orange Gradient) --- */}
       <div className="flex gap-1 align-items-center text-center">
               <button  onClick={() => navigate(-1)} className="hover:bg-white/20 p-2 rounded-full transition duration-200">
                 <FaArrowLeft size={24}  className="text-[#f06508d0]"/>
               </button>
               <h2 className="text-[#f06508d0] m-0 text-4xl text-center">
                History
               </h2>
             </div>

        {/* --- CARDS LIST --- */}
        <div className="flex flex-col gap-6">
          {assessmentData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-all duration-300 relative"
            >
              {/* Decorative Left Border */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  item.isExpired ? "bg-gray-300" : "bg-[#f7b12683]"
                }`}
              ></div>

              <div className="p-6 pl-8 sm:p-8 sm:pl-10 ">
                {/* 1. TITLE */}
                <div className="mb-6">
                  <h2 className="text-gray-800 font-bold text-lg leading-snug">
                    {item.title}
                  </h2>
                </div>

                {/* 2. DETAILS GRID (Icons + Text) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
                  {/* Questions */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <FaQuestionCircle />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Questions
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {item.questions}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <FaClock />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">
                        Duration
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {item.duration}
                      </p>
                    </div>
                  </div>

                  {/* Mock Type Dropdown */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      <FaLayerGroup />
                    </div>
                    <div className="w-full max-w-[140px]">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">
                        Mock Type
                      </p>
                      <div className="relative">
                        <select
                          className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-1 px-2 pr-6 rounded text-sm font-semibold focus:outline-none focus:border-orange-400 cursor-pointer"
                          defaultValue={item.mockType}
                        >
                          <option>{item.mockType}</option>
                          <option>Mock - 2</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <svg
                            className="fill-current h-3 w-3"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. FOOTER (Divider + Actions) */}
                <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Expiry Date */}
                  <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md">
                    {item.isExpired ? "Expired on:" : "Expiring on:"}{" "}
                    <span
                      className={`font-bold ${
                        item.isExpired ? "text-red-500" : "text-orange-700"
                      }`}
                    >
                      {item.expiryDate}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 w-full sm:w-auto justify-center sm:justify-end">
                    {/* Resume Button */}
                    <button
                      className={`text-white text-sm font-bold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200
                        ${
                          item.isExpired
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#f7a726cb] hover:bg-orange-700 hover:shadow-md"
                        }
                      `}
                      disabled={item.isExpired}
                    >
                      {item.buttonText}
                    </button>

                    {/* History Button */}
                    <button
                      onClick={() => navigate("/assessment-history")}
                      className="bg-white text-orange-700 text-sm font-bold py-2.5 px-5 rounded-lg border border-orange-200 hover:bg-orange-50 transition-all duration-200 flex items-center gap-2"
                    >
                      <FaHistory className="text-orange-500" /> History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestPage;
