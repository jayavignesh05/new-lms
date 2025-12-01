import React, { useState } from "react";
import {
  FaArrowLeft,
  FaEye,
  FaTools,
  FaClipboardList,
  FaHashtag,
  FaRegClock,
  FaStopwatch,
  FaQuestionCircle,
  FaTrophy,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { historyData } from "../components/certificate/historyData";
import { Pagination, ConfigProvider } from "antd";
import ReviewPage from "../components/test/review";

const HistoryPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;
  const currentData = historyData.slice(indexOfFirstItem, indexOfLastItem);

  const onPageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const courseName =
    historyData.length > 0
      ? historyData[0].user_courses.course_title_codes.course_criteria_titles
          .name
      : "Course History";

  const courseCode =
    historyData.length > 0
      ? historyData[0].user_courses.course_title_codes.course_code
      : "";

  const tableHeaders = [
    {
      label: "Exam Type",
      icon: <FaClipboardList className="text-orange-400" />,
    },
    { label: "Mock No", icon: <FaHashtag className="text-orange-400" /> },
    {
      label: "ExamDuration\n(min)",
      icon: <FaRegClock className="text-orange-400" />,
    },
    {
      label: "Duration\n(min)",
      icon: <FaStopwatch className="text-orange-400" />,
    },
    {
      label: "Total Question",
      icon: <FaQuestionCircle className="text-orange-400" />,
    },
    { label: "Marks", icon: <FaTrophy className="text-orange-400" /> },
    { label: "Status", icon: <FaInfoCircle className="text-orange-400" /> },
    { label: "Action", icon: <FaTools className="text-orange-400" /> },
  ];

  const getStatusBadge = (status) => {
    if (status === 2) {
      return (
        <span className="bg-[#4caf50] text-white text-[11px] font-bold px-3 py-1 rounded-full">
          Completed
        </span>
      );
    } else {
      return (
        <span className="bg-orange-400 text-white text-[11px] font-bold px-4 py-1 rounded-full">
          Pending
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex justify-center font">
      <div className="w-full max-w-6xl flex flex-col gap-7">
        <div className="flex gap-1 align-items-center text-center">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-white/20 p-2 rounded-full transition duration-200"
          >
            <FaArrowLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="text-gray-600 m-0 text-4xl text-center">History</h2>
        </div>

        <div className="bg-orange-100 rounded-3xl shadow-sm border border-gray-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h2 className="text-gray-800 font-bold text-base uppercase tracking-wide">
              {courseName}
            </h2>
            <p className="text-gray-500 text-xs m-0 font-medium">
              CODE: <span className="text-gray-700">{courseCode}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-700 text-xs font-bold uppercase bg-gray-50">
                  {tableHeaders.map((head, index) => (
                    <th
                      key={index}
                      className={`px-6 py-4 ${
                        index === 0 ? "text-left" : "text-center"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          index === 0 ? "justify-start" : "justify-center"
                        }`}
                      >
                        {head.icon}
                        <span className="whitespace-pre-line">
                          {head.label}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {item.master_exam_types.name.replace(" - ", " -\n")}
                    </td>

                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      Mock - {item.mock_no}
                    </td>

                    <td className="px-6 py-4 text-center font-medium">
                      {Math.floor(
                        item.course_assessment_question_duration_in_seconds / 60
                      )}
                    </td>

                    <td className="px-6 py-4 text-center font-medium">
                      {Math.floor(item.assessment_duration_in_seconds / 60)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {item.question_count}
                    </td>

                    <td className="px-6 py-4 text-center font-medium">
                      {item.marks}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(item.status)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setShowReviewModal(true)}
                        className="text-gray-400 hover:text-orange-400 transition p-2 border border-gray-300 rounded-full ml-2"
                      >
                        <FaEye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-white flex justify-end">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#f7c326",
                  borderRadius: 4,
                },
              }}
            >
              <Pagination
                current={currentPage}
                total={historyData.length}
                pageSize={pageSize}
                onChange={onPageChange}
                showSizeChanger
                showQuickJumper
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`
                }
                pageSizeOptions={["5", "10", "20"]}
              />
            </ConfigProvider>
          </div>
        </div>
      </div>
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-9999">
          <div className="bg-white rounded-xl shadow-lg w-[95%] max-w-5xl relative pl-4 pr-4 pb-4">
            <div className="sticky top-0 z-50 bg-white py-4 px-2 border-b flex items-center justify-space-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Review Answers
              </h2>

              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-3 right-0 font-semibold text-gray-600 hover:text-gray-800 p-2 rounded-full cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <ReviewPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
