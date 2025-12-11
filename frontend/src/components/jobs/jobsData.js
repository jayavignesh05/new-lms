// src/data/jobsData.js

export const availableJobs = [
  {
    id: 1,
    title: "Java Full Stack Developer",
    company: "Infosys",
    logo: "https://img.icons8.com/color/48/company.png",
    location: "Bangalore, India",
    city: "Bangalore", // Added for Filter
    experience: "0-2 Years",
    experienceLevel: "fresher", // Added for Filter (fresher, 1-3, 3-5, 5+)
    salary: "₹15 LPA",
    salaryNumber: 1500000, // Added for Filter (Numeric value)
    jobType: "full-time", // Normalized for Filter
    workMode: "onsite", // Added for Filter
    postedTime: "Posted 2 days ago",
    openings: 20,
    applicants: "Over 100",
    requiredCourses: ["ESS-106", "DATA-203"],
    skills: ["Java", "Spring Boot", "MySQL", "HTML/CSS", "React"],
    description: "We are looking for a motivated Full Stack Developer proficient in Java and Database management. You will be responsible for developing end-to-end web applications using Spring Boot and React.",
    eligibility: [
      "B.E/B.Tech/M.C.A graduates only.",
      "Minimum 60% in academics.",
      "Strong knowledge in OOPs concepts.",
      "Willing to relocate to Bangalore."
    ],
    aboutCompany: {
      name: "Infosys Limited",
      address: "Electronics City, Hosur Road, Bangalore - 560100",
      bio: "Infosys is a global leader in next-generation digital services and consulting."
    }
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Zoho",
    logo: "https://img.icons8.com/color/48/company.png",
    location: "Chennai, India",
    city: "Chennai", // Added for Filter
    experience: "1-3 Years",
    experienceLevel: "1-3", // Added for Filter
    salary: "₹7 LPA",
    salaryNumber: 700000, // Added for Filter
    jobType: "full-time", // Normalized for Filter
    workMode: "onsite", // Added for Filter
    postedTime: "Posted just now",
    openings: 5,
    applicants: "Less than 10",
    requiredCourses: ["PRO-306", "ADV-UX-999"],
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    description: "Join our design team to craft intuitive user experiences. You must have a strong portfolio in UI/UX design and proficiency in tools like Figma and Adobe XD.",
    eligibility: [
      "Any Graduate with a design portfolio.",
      "Experience with design systems.",
      "Creative thinking and problem-solving skills.",
      "Knowledge of HTML/CSS is a plus."
    ],
    aboutCompany: {
      name: "Zoho Corporation",
      address: "Estancia IT Park, Vallanchery, Chennai - 603202",
      bio: "Zoho offers a suite of online productivity tools and SaaS applications."
    }
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "TCS",
    logo: "https://img.icons8.com/color/48/company.png",
    location: "Mumbai, India",
    city: "Mumbai", // Added for Filter
    experience: "Freshers",
    experienceLevel: "fresher", // Added for Filter
    salary: "₹5 LPA",
    salaryNumber: 500000, // Added for Filter
    jobType: "contract", // Changed for demo purposes (or keep full-time)
    workMode: "hybrid", // Added for Filter
    postedTime: "Posted 5 days ago",
    openings: 50,
    applicants: "Over 500",
    requiredCourses: ["DATA-202", "DATA-203"],
    skills: ["Power BI", "SQL", "Excel", "Python"],
    description: "Seeking a detail-oriented Data Analyst to interpret complex datasets. Expertise in Power BI and SQL for creating insightful dashboards is essential.",
    eligibility: [
      "B.Sc/M.Sc in Statistics, Maths or Computer Science.",
      "Strong analytical skills.",
      "Proficiency in SQL and Excel.",
      "Good communication skills."
    ],
    aboutCompany: {
      name: "Tata Consultancy Services",
      address: "TCS House, Raveline Street, Fort, Mumbai - 400001",
      bio: "TCS is an IT services, consulting and business solutions organization."
    }
  },

  {
    id: 5,
    title: "Frontend React Developer",
    company: "Freshworks",
    logo: "https://img.icons8.com/color/48/company.png",
    location: "Chennai, India",
    city: "Chennai", // Added for Filter
    experience: "1-2 Years",
    experienceLevel: "1-3", // Added for Filter
    salary: "₹6.5 LPA",
    salaryNumber: 650000, // Added for Filter
    jobType: "internship", // Changed for demo purposes
    workMode: "onsite", // Added for Filter
    postedTime: "Posted 3 days ago",
    openings: 15,
    applicants: "Over 150",
    requiredCourses: ["ESS-106", "PRO-306"],
    skills: ["React.js", "Redux", "Tailwind CSS", "JavaScript", "Figma"],
    description: "Looking for a Frontend Developer with a keen eye for design. You will build responsive user interfaces using React and integrate them with backend services.",
    eligibility: [
      "Proficiency in React.js and modern JavaScript.",
      "Understanding of UI/UX principles.",
      "Experience with state management (Redux/Context API).",
      "Good debugging skills."
    ],
    aboutCompany: {
      name: "Freshworks Inc.",
      address: "Global Infocity Park, Perungudi, Chennai - 600096",
      bio: "Freshworks provides innovative customer engagement software for businesses of all sizes."
    }
  },
  {
    id: 6,
    title: "Database Administrator",
    company: "Oracle",
    logo: "https://img.icons8.com/color/48/company.png",
    location: "Bangalore, India",
    city: "Bangalore", // Added for Filter
    experience: "5+ Years", // Changed to match filter option
    experienceLevel: "5+", // Added for Filter
    salary: "₹9 LPA",
    salaryNumber: 900000, // Added for Filter
    jobType: "freelance", // Changed for demo purposes
    workMode: "hybrid", // Added for Filter
    postedTime: "Posted 1 day ago",
    openings: 8,
    applicants: "Less than 50",
    requiredCourses: ["DATA-203", "ADV-DB-500"],
    skills: ["Oracle DB", "SQL", "PL/SQL", "Performance Tuning", "Backup/Recovery"],
    description: "Manage, optimize, and secure our mission-critical databases. Expertise in advanced database tuning, backup strategies, and SQL is mandatory.",
    eligibility: [
      "Strong command over SQL and PL/SQL.",
      "Experience with Oracle Database 12c/19c.",
      "Knowledge of database security and user management.",
      "Willingness to work in shifts if required."
    ],
    aboutCompany: {
      name: "Oracle Corporation",
      address: "Oracle Tech Hub, Marathahalli, Bangalore - 560037",
      bio: "Oracle is a cloud technology company that provides organizations around the world with computing infrastructure and software."
    }
  },
];

export const courseNames = {
  "ESS-106": "Java Programming",
  "PRO-306": "UI/UX Design",
  "DATA-202": "Power BI",
  "DATA-203": "HTML & Database",
  "ADV-UX-999": "Advanced Interaction Design",
  "AWS-900": "AWS Solutions Arch",
  "LINUX-101": "Linux Basics",
  "ADV-DB-500": "Advanced Database Tuning",
};