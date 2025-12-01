import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import test_data from "./ques.json";

export default function ReviewPage() {
  const data = test_data.preview;
  const [expanded, setExpanded] = useState({});

  return (
    <div className="max-h-[80vh] overflow-y-auto p-1">
      <div className="space-y-6">
        {data.map((item, index) => {
          const q = item.course_concept_level_question_banks;
          const correct = item.correct_answer;
          const user = item.given_answer;
          const isExpanded = expanded[item.id] || false;

          return (
            <div
              key={item.id}
              className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 relative"
            >
              {!user && (<div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
 Unanswered
 </div>)}

              <div className="mb-4">
                <p className="text-sm text-gray-500 font-semibold">
                  Question {index + 1}
                </p>
                <p className="text-md font-semibold text-gray-800 mt-1">
                  {q.name}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {q.course_concept_level_question_bank_options.map((opt) => {
                  const isCorrect = opt.id === correct;
                  const isUser = opt.id === user;

                  const base =
 "w-full p-3 rounded-lg border flex justify-between items-center";
                  const style = isCorrect
 ? "border-green-500 bg-green-50 text-green-600"
                    : isUser
                    ? "border-red-500 bg-red-50 text-red-600"
                    : "border-gray-300 bg-gray-50 text-gray-800";

                  return (
                    <div key={opt.id} className={`${base} ${style}`}>
                      <span className="text-sm">{opt.name}</span>

                      {isCorrect && <FaCheckCircle className="text-green-600 text-xl" />}
                      {isUser && !isCorrect && <FaTimesCircle className="text-red-600 text-xl" />}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg ">
                <p className="text-sm font-bold text-blue-700 mb-1" >
                  Explanation:
                </p>

                <p className="text-sm text-blue-900 leading-relaxed ">
                  {isExpanded ? q.justification : q.justification.slice(0, 250)}
                  {!isExpanded && q.justification.length > 250 && (
                    <>
                      ...{" "}
                      <button
                        onClick={() => setExpanded({ ...expanded, [item.id]: true })}
                        className="text-blue-600 font-medium"
                      >
                        Read More
                      </button>
                    </>
                  )}

                  {isExpanded && (
                    <button
                      onClick={() => setExpanded({ ...expanded, [item.id]: false })}
                      className="text-blue-600 font-medium ml-2"
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

    </div>
  );
}
