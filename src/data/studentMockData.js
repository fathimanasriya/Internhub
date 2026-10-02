/**
 * Student Dashboard Mock Data
 * Used for initial frontend development before connecting backend APIs.
 */

// Default student profile details
// TODO: replace with API call: GET /api/student/profile
export const mockStudentProfile = {
  id: 'STU-2026-089',
  name: 'Alex Johnson',
  email: 'alex.johnson@college.edu',
  phone: '+91 98765 43210',
  college: 'National Institute of Technology',
  course: 'B.Tech in Computer Science & Engineering',
  year: '3rd Year / 6th Semester',
  studentId: 'CS2023-089',
  profileCompletion: 70,
  skills: ['React', 'JavaScript', 'CSS3', 'Python', 'Git', 'UI/UX Design'],
  initials: 'AJ',
  avatarUrl: '',
}

// Application statistics
// TODO: replace with API call: GET /api/student/stats
export const mockStudentStats = {
  totalApplications: 12,
  underReview: 4,
  shortlisted: 3,
  selected: 1,
}

// Recent internship applications
// TODO: replace with API call: GET /api/student/applications/recent
export const mockRecentApplications = [
  {
    id: 'app-101',
    company: 'TechNova Solutions',
    companyLogo: 'TN',
    role: 'Frontend Developer Intern',
    appliedDate: '2026-09-28',
    status: 'Under Review',
    location: 'Remote',
    stipend: '₹25,000 / mo',
  },
  {
    id: 'app-102',
    company: 'Stratum Analytics',
    companyLogo: 'SA',
    role: 'Data Analyst Intern',
    appliedDate: '2026-09-24',
    status: 'Shortlisted',
    location: 'Mumbai (Hybrid)',
    stipend: '₹20,000 / mo',
  },
  {
    id: 'app-103',
    company: 'Apex Cloud Systems',
    companyLogo: 'AC',
    role: 'Software Engineer Intern',
    appliedDate: '2026-09-18',
    status: 'Selected',
    location: 'Bangalore',
    stipend: '₹30,000 / mo',
  },
  {
    id: 'app-104',
    company: 'Pulse Digital Media',
    companyLogo: 'PD',
    role: 'UI/UX Designer Intern',
    appliedDate: '2026-09-10',
    status: 'Pending',
    location: 'Remote',
    stipend: '₹18,000 / mo',
  },
  {
    id: 'app-105',
    company: 'Cipher Cybersecurity',
    companyLogo: 'CC',
    role: 'Security Analyst Trainee',
    appliedDate: '2026-08-30',
    status: 'Rejected',
    location: 'Delhi (On-site)',
    stipend: '₹15,000 / mo',
  },
]

// Recommended internships curated for student
// TODO: replace with API call: GET /api/student/internships/recommended
export const mockRecommendedInternships = [
  {
    id: 'rec-01',
    company: 'TechNova Solutions',
    companyInitial: 'T',
    role: 'Frontend React Developer Intern',
    location: 'Remote / Bangalore',
    duration: '6 Months',
    stipend: '₹25,000 / month',
    type: 'Full-time Intern',
    deadline: 'Oct 20, 2026',
    skills: ['React', 'JavaScript', 'CSS3', 'Git', 'REST APIs'],
    description:
      'Collaborate with the frontend engineering team to develop high-performance web applications, convert Figma designs to responsive code, and implement state management.',
  },
  {
    id: 'rec-02',
    company: 'Apex Cloud Systems',
    companyInitial: 'A',
    role: 'Full Stack Engineering Intern',
    location: 'Hyderabad (Hybrid)',
    duration: '4 Months',
    stipend: '₹30,000 / month',
    type: 'Hybrid',
    deadline: 'Oct 15, 2026',
    skills: ['Node.js', 'React', 'PostgreSQL', 'Docker', 'Express'],
    description:
      'Assist in architecting microservices, developing database schemas, and building client portals with a fast-growing cloud enterprise team.',
  },
  {
    id: 'rec-03',
    company: 'DataSphere AI',
    companyInitial: 'D',
    role: 'Data Science & Analytics Intern',
    location: 'Pune (Hybrid)',
    duration: '3 Months',
    stipend: '₹22,000 / month',
    type: 'Hybrid',
    deadline: 'Oct 25, 2026',
    skills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Data Viz'],
    description:
      'Extract actionable insights from real-world telemetry data, construct ETL pipelines, and develop predictive models under senior data scientists.',
  },
  {
    id: 'rec-04',
    company: 'Vanguard Studios',
    companyInitial: 'V',
    role: 'UI/UX Product Design Intern',
    location: 'Remote',
    duration: '6 Months',
    stipend: '₹20,000 / month',
    type: 'Flexible Hours',
    deadline: 'Nov 01, 2026',
    skills: ['Figma', 'Wireframing', 'Design Systems', 'User Research', 'Prototyping'],
    description:
      'Design intuitive mobile and desktop workflows, participate in user interviews, and maintain multi-brand design systems for cross-functional product teams.',
  },
]
