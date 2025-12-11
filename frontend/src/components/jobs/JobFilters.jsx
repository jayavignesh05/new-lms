
import React, { useState } from "react";
import { FaFilter, FaRedo, FaBuilding, FaHome, FaLaptop } from "react-icons/fa";
import { Slider, ConfigProvider } from "antd";

const JobFilters = ({ filters, onToggleFilter, onClear, onSalaryChange }) => {
  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(1500000);
  const maxLimit = 1500000;

  const handleSliderChange = (value) => {
    const [newMin, newMax] = value;
    setMinSalary(newMin);
    setMaxSalary(newMax);
    if (onSalaryChange) onSalaryChange({ min: newMin, max: newMax });
  };

  const formatSalary = (value) => {
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value;
  };

  const sections = {
    salaryRanges: { title: "SALARY RANGE", isSlider: true },
    workModes: {
      title: "WORK MODE",
      options: [
        { label: "Onsite", value: "onsite" },
        { label: "Remote", value: "remote" },
        { label: "Hybrid", value: "hybrid" },
      ],
    },
    experienceLevels: {
      title: "EXPERIENCE LEVEL",
      options: [
        { label: "Fresher", value: "fresher" },
        { label: "1–3 Yrs", value: "1-3" },
        { label: "3–5 Yrs", value: "3-5" },
        { label: "5+ Yrs", value: "5+" },
      ],
    },
    jobTypes: {
      title: "JOB TYPE",
      options: [
        { label: "Full Time", value: "full-time" },
        { label: "Part Time", value: "part-time" },
        { label: "Internship", value: "internship" },
        { label: "Contract", value: "contract" },
        { label: "Freelance", value: "freelance" },
      ],
    },
    locations: {
      title: "LOCATION",
      options: [
        { label: "Chennai", value: "Chennai" },
        { label: "Bangalore", value: "Bangalore" },
        { label: "Hyderabad", value: "Hyderabad" },
        { label: "Mumbai", value: "Mumbai" },
        { label: "Delhi", value: "Delhi" },
      ],
    },
  };

  const isSelected = (key, value) => filters[key]?.includes(value);

  const getWorkModeIcon = (mode) => {
    if (mode === "onsite") return <FaBuilding className="w-3.5 h-3.5" />;
    if (mode === "remote") return <FaHome className="w-3.5 h-3.5" />;
    return <FaLaptop className="w-3.5 h-3.5" />;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-900 tracking-wide flex items-center gap-2">
          Filters
        </h2>
        <button
          onClick={() => {
            onClear();
            setMinSalary(0);
            setMaxSalary(maxLimit);
          }}
          className="text-xs font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1"
        >
          <FaRedo className="text-[10px]" /> Clear all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {Object.entries(sections).map(([key, section]) => {
          const selectedCount = filters[key]?.length || 0;

          return (
            <div
              key={key}
              className="border border-gray-100 rounded-2xl p-3 md:p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-gray-400 tracking-[0.14em]">
                  {section.title}
                </p>
                {!section.isSlider &&
                  key !== "experienceLevels" &&
                  key !== "workModes" &&
                  selectedCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium">
                      {selectedCount} selected
                    </span>
                  )}
              </div>

              {section.isSlider ? (
                <div className="mt-3 px-1">
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">
                      Range
                    </span>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-800">
                        ₹{formatSalary(minSalary)} - ₹{formatSalary(maxSalary)}
                      </span>
                    </div>
                  </div>

                  <ConfigProvider
                    theme={{
                      token: {
                        colorPrimary: "#f97316",
                      },
                      components: {
                        Slider: {
                          colorPrimary: "#f97316",
                          trackBg: "#f97316", 
                          trackHoverBg: "#f97316",
                          handleColor: "#f97316",
                          handleActiveColor: "#ea580c",
                          handleActiveOutlineColor: "rgba(249, 115, 22, 0.2)",
                          railBg: "#e5e7eb",
                          railHoverBg: "#e5e7eb",
                        },
                      },
                    }}
                  >
                    <Slider
                      range
                      min={0}
                      max={maxLimit}
                      step={10000}
                      value={[minSalary, maxSalary]}
                      onChange={handleSliderChange}
                      tooltip={{ formatter: null }}
                    />
                  </ConfigProvider>

                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
                    <span>0</span>
                    <span>5L</span>
                    <span>10L</span>
                    <span>15L+</span>
                  </div>
                </div>
              ) : key === "workModes" ? (
                <div className="flex gap-2 mt-2">
                  {section.options.map((opt) => {
                    const active = isSelected(key, opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onToggleFilter(key, opt.value)}
                        className={`
                          flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl border transition-all duration-200
                          ${
                            active
                              ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm"
                              : "bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600"
                          }
                        `}
                      >
                        {getWorkModeIcon(opt.value)}
                        <span className="text-[11px] font-semibold">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : key === "experienceLevels" ? (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {section.options.map((opt) => {
                    const active = isSelected(key, opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onToggleFilter(key, opt.value)}
                        className={`
                          py-2.5 px-3 text-xs font-semibold rounded-lg border transition-all duration-200 text-center
                          ${
                            active
                              ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                              : "bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:bg-orange-50"
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  {section.options.map((opt) => {
                    const active = isSelected(key, opt.value);
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center gap-3 cursor-pointer group select-none"
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={active || false}
                          onChange={() => onToggleFilter(key, opt.value)}
                        />
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 
                          ${
                            active
                              ? "bg-orange-500 border-orange-500"
                              : "bg-white border-gray-300 group-hover:border-orange-400"
                          }`}
                        >
                          {active && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span
                          className={`text-sm transition-colors ${
                            active
                              ? "text-gray-900 font-semibold"
                              : "text-gray-600 group-hover:text-gray-800"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobFilters;
