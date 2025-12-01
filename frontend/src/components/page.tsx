"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import test_data from "./ques.json";


export default function ExamPage() {
 
  const data = test_data.preview;
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showReview, setShowReview]= useState(true);


 

  return (
    <>
     {showReview && <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Review Answers</h1>

      <div className="space-y-6">
        {data.map((item, index) => {
          const q = item.course_concept_level_question_banks;
          const correct = item.correct_answer;
          const user = item.given_answer;
          const isExpanded = expanded[item.id] || false;


          return (
            <div key={item.id} className="bg-white shadow-md rounded-xl p-6 border border-gray-200 relative">
               {!user && (
  <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
    Unanswered
  </div>
)}
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 font-semibold">Question {index + 1}</p>
                <p className="text-md font-semibold text-gray-800 mt-1">{q.name}</p>
              </div>

             
              <div className="space-y-3 mt-4">
                {q.course_concept_level_question_bank_options.map((opt) => {
                  const isCorrect = opt.id === correct;
                  const isUser = opt.id === user;

                  const baseStyles =
                    "w-full p-3 rounded-lg border flex justify-between items-center";

                  const statusStyles = isCorrect
                    ? "border-green-500 bg-green-50 text-green-500"
                    : isUser
                    ? "border-red-500 bg-red-50 text-red-500"
                    : "border-gray-300 bg-gray-50 text-gray-800";

                  return (
                    <div key={opt.id} className={`${baseStyles} ${statusStyles}`}>
                      <span className="text-sm">{opt.name}</span>

                      {isCorrect && (
                        <FaCheckCircle className="text-green-600 text-xl" />
                      )}

                      {isUser && !isCorrect && (
                        <FaTimesCircle className="text-red-600 text-xl" />
                      )}
                    </div>
                  );
                })}
              </div>

            
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-bold text-blue-700 mb-1">
                 Explanation:
                </p>
      <p className="text-sm text-blue-900 leading-relaxed">
  {isExpanded
    ? q.justification
    : q.justification.slice(0, 250)
  }

  {!isExpanded && q.justification.length > 250 && (
    <>
      ...{" "}
      <button
        onClick={() =>
          setExpanded({ ...expanded, [item.id]: true })
        }
        className="text-blue-600 font-medium cursor-pointer"
      >
        Read More
      </button>
    </>
  )}

  {isExpanded && (
    <button
      onClick={() =>
        setExpanded({ ...expanded, [item.id]: false })
      }
      className="text-blue-600 font-medium ml-2 cursor-pointer"
    >
      Read Less
    </button>
  )}
</p>

              </div>

            </div>
          );
        })}
      </div>
    </div>}</>
  
  );
}
