import { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Users,
  Clock,
  UserCheck,
  UserX,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Mail,
  GraduationCap,
  Briefcase,
  Calendar,
  AlertTriangle,
  X,
  FileCheck,
} from 'lucide-react'
import Sidebar from '../../components/hr/Sidebar'
import Topbar from '../../components/hr/Topbar'
import './HRApplications.css'

// Initial 48 Demo Applications (20 Pending, 12 Shortlisted, 16 Rejected)
const INITIAL_DEMO_APPLICATIONS = [
  // 1-8: Primary Prompt Demo Applicants
  {
    id: 'app-01',
    studentName: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+91 98765 01001',
    college: 'IIT Bombay',
    degree: 'B.Tech Computer Science',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 28, 2026',
    skills: ['React', 'JavaScript', 'HTML', 'CSS'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-02',
    studentName: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+91 98765 01002',
    college: 'BITS Pilani',
    degree: 'B.E. Computer Science',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 27, 2026',
    skills: ['React', 'TypeScript', 'CSS'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Portfolio.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-03',
    studentName: 'Daniel Thomas',
    email: 'daniel@example.com',
    phone: '+91 98765 01003',
    college: 'NID Ahmedabad',
    degree: 'M.Des Interaction Design',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 26, 2026',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Design_Case_Studies.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-04',
    studentName: 'Olivia Martin',
    email: 'olivia@example.com',
    phone: '+91 98765 01004',
    college: 'Delhi University',
    degree: 'B.Sc Statistics & Analytics',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 25, 2026',
    skills: ['Python', 'SQL', 'Excel'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'SQL_Cert.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-05',
    studentName: 'Ethan Brown',
    email: 'ethan@example.com',
    phone: '+91 98765 01005',
    college: 'VIT Vellore',
    degree: 'B.Tech Information Technology',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 24, 2026',
    skills: ['JavaScript', 'React', 'Git'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-06',
    studentName: 'Sophia Davis',
    email: 'sophia@example.com',
    phone: '+91 98765 01006',
    college: 'Srishti Institute',
    degree: 'B.Des Visual Communication',
    gradYear: '2027',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 23, 2026',
    skills: ['Figma', 'UX Research', 'Prototyping'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-07',
    studentName: 'Noah Miller',
    email: 'noah@example.com',
    phone: '+91 98765 01007',
    college: 'IIIT Hyderabad',
    degree: 'B.Tech Data Science',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 22, 2026',
    skills: ['Python', 'SQL', 'Power BI'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Analytics_Project.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-08',
    studentName: 'Ava Taylor',
    email: 'ava@example.com',
    phone: '+91 98765 01008',
    college: 'NIT Trichy',
    degree: 'B.Tech CSE',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 21, 2026',
    skills: ['React', 'JavaScript', 'Bootstrap'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },

  // 9-48: Supplementary realistic candidates to complete the 48 pipeline (Total: 20 Pending, 12 Shortlisted, 16 Rejected)
  // Pending additions (16 more to reach 20 total pending)
  {
    id: 'app-09',
    studentName: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    phone: '+91 98765 01009',
    college: 'Manipal Institute of Tech',
    degree: 'B.Tech CSE',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 20, 2026',
    skills: ['React', 'Next.js', 'Redux', 'CSS'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-10',
    studentName: 'Meera Nair',
    email: 'meera.n@example.com',
    phone: '+91 98765 01010',
    college: 'NIT Calicut',
    degree: 'B.Tech ECE',
    gradYear: '2027',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 20, 2026',
    skills: ['Python', 'SQL', 'Tableau'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-11',
    studentName: 'Arjun Das',
    email: 'arjun.das@example.com',
    phone: '+91 98765 01011',
    college: 'IIT Madras',
    degree: 'B.Tech Electrical',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 19, 2026',
    skills: ['Figma', 'Wireframing', 'Illustrator'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Portfolio.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-12',
    studentName: 'Kavya Pillai',
    email: 'kavya.p@example.com',
    phone: '+91 98765 01012',
    college: 'Amrita University',
    degree: 'Integrated M.Tech AI',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 19, 2026',
    skills: ['Python', 'R', 'Machine Learning', 'SQL'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Project_Summary.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-13',
    studentName: 'Siddharth Rao',
    email: 'sid.rao@example.com',
    phone: '+91 98765 01013',
    college: 'PES University',
    degree: 'B.Tech CSE',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 18, 2026',
    skills: ['React', 'JavaScript', 'Tailwind', 'Git'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-14',
    studentName: 'Diya Sen',
    email: 'diya.sen@example.com',
    phone: '+91 98765 01014',
    college: 'Jadavpur University',
    degree: 'B.E. IT',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 18, 2026',
    skills: ['Figma', 'Design Systems', 'User Journey'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-15',
    studentName: 'Varun Reddy',
    email: 'varun.r@example.com',
    phone: '+91 98765 01015',
    college: 'Osmania University',
    degree: 'B.Tech CSE',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 17, 2026',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-16',
    studentName: 'Ananya Mukherjee',
    email: 'ananya.m@example.com',
    phone: '+91 98765 01016',
    college: 'St. Xavier’s College',
    degree: 'B.Sc Economics & Stats',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 17, 2026',
    skills: ['Excel', 'SQL', 'Data Modeling'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-17',
    studentName: 'Karan Joshi',
    email: 'karan.j@example.com',
    phone: '+91 98765 01017',
    college: 'COEP Pune',
    degree: 'B.Tech Mechanical',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 16, 2026',
    skills: ['Figma', 'Wireframing', 'User Research'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Portfolio.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-18',
    studentName: 'Pooja Verma',
    email: 'pooja.v@example.com',
    phone: '+91 98765 01018',
    college: 'Thapar Institute',
    degree: 'B.E. Computer Science',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 16, 2026',
    skills: ['React', 'TypeScript', 'Sass'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-19',
    studentName: 'Aditya Chawla',
    email: 'aditya.c@example.com',
    phone: '+91 98765 01019',
    college: 'DTU Delhi',
    degree: 'B.Tech IT',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 15, 2026',
    skills: ['Python', 'Pandas', 'Power BI'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Certifications.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-20',
    studentName: 'Rhea Kapoor',
    email: 'rhea.k@example.com',
    phone: '+91 98765 01020',
    college: 'NMIMS Mumbai',
    degree: 'B.Des Human Centered Design',
    gradYear: '2027',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 15, 2026',
    skills: ['Figma', 'Prototyping', 'Accessibility'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-21',
    studentName: 'Manish Pandey',
    email: 'manish.p@example.com',
    phone: '+91 98765 01021',
    college: 'IIT Roorkee',
    degree: 'B.Tech Civil Engg',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 14, 2026',
    skills: ['SQL', 'Python', 'Excel'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-22',
    studentName: 'Natasha Menon',
    email: 'natasha.m@example.com',
    phone: '+91 98765 01022',
    college: 'Kochi University',
    degree: 'B.Tech CSE',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 14, 2026',
    skills: ['React', 'JavaScript', 'HTML5'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-23',
    studentName: 'Gaurav Kulkarni',
    email: 'gaurav.k@example.com',
    phone: '+91 98765 01023',
    college: 'VJTI Mumbai',
    degree: 'B.Tech IT',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 13, 2026',
    skills: ['React', 'Redux', 'Bootstrap'],
    status: 'Pending',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-24',
    studentName: 'Zoya Khan',
    email: 'zoya.khan@example.com',
    phone: '+91 98765 01024',
    college: 'Jamia Millia Islamia',
    degree: 'B.Sc Applied Mathematics',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 13, 2026',
    skills: ['Python', 'SQL', 'Statistics'],
    status: 'Pending',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },

  // Shortlisted additions (10 more to reach 12 total shortlisted)
  {
    id: 'app-25',
    studentName: 'Tanya Bose',
    email: 'tanya.bose@example.com',
    phone: '+91 98765 01025',
    college: 'IIT Kharagpur',
    degree: 'B.Tech Computer Science',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 12, 2026',
    skills: ['React', 'TypeScript', 'GraphQL', 'Next.js'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-26',
    studentName: 'Devansh Singhal',
    email: 'devansh.s@example.com',
    phone: '+91 98765 01026',
    college: 'IIIT Delhi',
    degree: 'B.Tech CSAM',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 12, 2026',
    skills: ['Python', 'SQL', 'Power BI', 'Scikit-Learn'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'GitHub_Projects.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-27',
    studentName: 'Ishaan Chopra',
    email: 'ishaan.c@example.com',
    phone: '+91 98765 01027',
    college: 'MIT Institute of Design',
    degree: 'B.Des Product Design',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 11, 2026',
    skills: ['Figma', 'Micro-interactions', 'Design Systems'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Case_Study_2026.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-28',
    studentName: 'Aashi Agarwal',
    email: 'aashi.a@example.com',
    phone: '+91 98765 01028',
    college: 'SRM Institute',
    degree: 'B.Tech CSE',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 11, 2026',
    skills: ['React', 'JavaScript', 'CSS3', 'Git'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-29',
    studentName: 'Pranav Bhat',
    email: 'pranav.b@example.com',
    phone: '+91 98765 01029',
    college: 'RV College of Engineering',
    degree: 'B.E. Information Science',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 10, 2026',
    skills: ['Python', 'SQL', 'Excel', 'Tableau'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Data_Cert.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-30',
    studentName: 'Meghna Roy',
    email: 'meghna.roy@example.com',
    phone: '+91 98765 01030',
    college: 'National Institute of Design',
    degree: 'B.Des Interaction Design',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 10, 2026',
    skills: ['Figma', 'User Research', 'Wireframes'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Design_Portfolio.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-31',
    studentName: 'Rishabh Mehta',
    email: 'rishabh.m@example.com',
    phone: '+91 98765 01031',
    college: 'IIT BHU Varanasi',
    degree: 'B.Tech Electronics',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 09, 2026',
    skills: ['React', 'JavaScript', 'HTML5', 'Tailwind'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-32',
    studentName: 'Shreya Nambiar',
    email: 'shreya.n@example.com',
    phone: '+91 98765 01032',
    college: 'BITS Goa',
    degree: 'B.E. Computer Science',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 09, 2026',
    skills: ['Python', 'Pandas', 'SQL', 'Power BI'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-33',
    studentName: 'Yashwardhan Dixit',
    email: 'yash.d@example.com',
    phone: '+91 98765 01033',
    college: 'IIIT Allahabad',
    degree: 'B.Tech IT',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 08, 2026',
    skills: ['React', 'TypeScript', 'CSS', 'REST APIs'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Cover Letter.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-34',
    studentName: 'Kritika Sen',
    email: 'kritika.s@example.com',
    phone: '+91 98765 01034',
    college: 'Symbiosis Pune',
    degree: 'B.Des UX Design',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 08, 2026',
    skills: ['Figma', 'Prototyping', 'User Testing'],
    status: 'Shortlisted',
    documents: ['Resume.pdf', 'Portfolio.pdf', 'ID Proof.pdf'],
  },

  // Rejected additions (14 more to reach 16 total rejected)
  {
    id: 'app-35',
    studentName: 'Anil Gupta',
    email: 'anil.g@example.com',
    phone: '+91 98765 01035',
    college: 'State University',
    degree: 'BCA',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 07, 2026',
    skills: ['HTML', 'CSS'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-36',
    studentName: 'Priya Sundaram',
    email: 'priya.s@example.com',
    phone: '+91 98765 01036',
    college: 'Anna University',
    degree: 'B.E. Civil',
    gradYear: '2025',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 07, 2026',
    skills: ['Excel'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-37',
    studentName: 'Rahul Tiwari',
    email: 'rahul.t@example.com',
    phone: '+91 98765 01037',
    college: 'AKTU Lucknow',
    degree: 'B.Tech CS',
    gradYear: '2028',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 06, 2026',
    skills: ['Photoshop'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-38',
    studentName: 'Swati Kulkarni',
    email: 'swati.k@example.com',
    phone: '+91 98765 01038',
    college: 'Savitribai Phule Pune Univ',
    degree: 'B.Sc Computer Science',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 06, 2026',
    skills: ['JavaScript'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-39',
    studentName: 'Harsh Vardhan',
    email: 'harsh.v@example.com',
    phone: '+91 98765 01039',
    college: 'Jaipur National Univ',
    degree: 'B.Tech IT',
    gradYear: '2027',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 05, 2026',
    skills: ['Python Basics'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-40',
    studentName: 'Deepika Rao',
    email: 'deepika.r@example.com',
    phone: '+91 98765 01040',
    college: 'Bangalore City College',
    degree: 'B.Com',
    gradYear: '2026',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 05, 2026',
    skills: ['Canva'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-41',
    studentName: 'Sunil Sethi',
    email: 'sunil.s@example.com',
    phone: '+91 98765 01041',
    college: 'Utkal University',
    degree: 'B.Sc Physics',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 04, 2026',
    skills: ['HTML', 'CSS'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-42',
    studentName: 'Mansi Pathak',
    email: 'mansi.p@example.com',
    phone: '+91 98765 01042',
    college: 'Chitkara University',
    degree: 'B.Tech CSE',
    gradYear: '2028',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 04, 2026',
    skills: ['JavaScript'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-43',
    studentName: 'Tarun Mathur',
    email: 'tarun.m@example.com',
    phone: '+91 98765 01043',
    college: 'UPES Dehradun',
    degree: 'B.Tech ECE',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 03, 2026',
    skills: ['Excel'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-44',
    studentName: 'Neelam Kaushik',
    email: 'neelam.k@example.com',
    phone: '+91 98765 01044',
    college: 'Kurukshetra University',
    degree: 'BCA',
    gradYear: '2027',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 03, 2026',
    skills: ['Figma Basics'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-45',
    studentName: 'Chetan Bagga',
    email: 'chetan.b@example.com',
    phone: '+91 98765 01045',
    college: 'LPU Jalandhar',
    degree: 'B.Tech CSE',
    gradYear: '2027',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 02, 2026',
    skills: ['Bootstrap', 'HTML'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-46',
    studentName: 'Divya Rastogi',
    email: 'divya.r@example.com',
    phone: '+91 98765 01046',
    college: 'Banasthali Vidyapith',
    degree: 'B.Tech CS',
    gradYear: '2026',
    internship: 'Data Analytics Intern',
    department: 'Data Science',
    type: 'On-site',
    location: 'Kochi, Kerala',
    duration: '6 Months',
    appliedDate: 'September 02, 2026',
    skills: ['SQL'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-47',
    studentName: 'Sameer Qureshi',
    email: 'sameer.q@example.com',
    phone: '+91 98765 01047',
    college: 'Aligarh Muslim University',
    degree: 'B.Sc Math',
    gradYear: '2027',
    internship: 'UI/UX Design Intern',
    department: 'UI/UX Design',
    type: 'Remote',
    location: 'Remote',
    duration: '2 Months',
    appliedDate: 'September 01, 2026',
    skills: ['Wireframing'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
  {
    id: 'app-48',
    studentName: 'Ritika Ghosal',
    email: 'ritika.g@example.com',
    phone: '+91 98765 01048',
    college: 'Calcutta University',
    degree: 'B.Sc Computer Science',
    gradYear: '2026',
    internship: 'Frontend Development Intern',
    department: 'Software Development',
    type: 'Hybrid',
    location: 'Bengaluru, Karnataka',
    duration: '3 Months',
    appliedDate: 'September 01, 2026',
    skills: ['HTML', 'JavaScript'],
    status: 'Rejected',
    documents: ['Resume.pdf', 'ID Proof.pdf'],
  },
]

/**
 * HRApplications Component
 * Review, filter, shortlist, and reject student candidate applications.
 */
function HRApplications() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [internshipFilter, setInternshipFilter] = useState('All Internships')
  const [statusFilter, setStatusFilter] = useState('All')
  const [bannerMessage, setBannerMessage] = useState(null) // { text, type: 'success' | 'reject' }

  // Recruiter profile info
  const [hrProfile] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubHRProfile')
      if (stored) return JSON.parse(stored)
    } catch (err) {
      console.error('Error reading hrProfile:', err)
    }
    return {
      hrName: 'Sarah Mitchell',
      companyName: 'NovaTech Labs Pvt Ltd',
    }
  })

  // Applications list loaded from localStorage with initial demo fallback
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem('internhubHRApplications')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (err) {
      console.error('Error loading stored applications:', err)
    }
    return INITIAL_DEMO_APPLICATIONS
  })

  // Synchronize applications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('internhubHRApplications', JSON.stringify(applications))
    } catch (err) {
      console.error('Error saving applications to localStorage:', err)
    }
  }, [applications])

  // Modals state: null | { type: 'view' | 'reject', data: any }
  const [activeModal, setActiveModal] = useState(null)

  const metrics = useMemo(() => {
    const total = applications.length
    const pending = applications.filter((app) => app.status === 'Pending').length
    const shortlisted = applications.filter((app) => app.status === 'Shortlisted').length
    const selected = applications.filter((app) => app.status === 'Selected').length
    const rejected = applications.filter((app) => app.status === 'Rejected').length

    return { total, pending, shortlisted, selected, rejected }
  }, [applications])

  // Shortlist action handler
  const handleShortlist = (appId) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: 'Shortlisted' } : app))
    )
    setBannerMessage({ text: 'Applicant shortlisted successfully.', type: 'success' })

    // If modal is currently viewing this application, update modal data
    if (activeModal && activeModal.data && activeModal.data.id === appId) {
      setActiveModal({
        ...activeModal,
        data: { ...activeModal.data, status: 'Shortlisted' },
      })
    }
  }
  const handleSelect = (appId) => {
    const selectedApplication = applications.find(
      (app) => app.id === appId
    )

    if (!selectedApplication) return

    // 1. Change application status to Selected
    setApplications((prev) =>
      prev.map((app) =>
        app.id === appId
          ? { ...app, status: 'Selected' }
          : app
      )
    )

    // 2. Get existing interns
    let existingInterns = []

    try {
      const storedInterns = localStorage.getItem('internhubHRInterns')

      if (storedInterns) {
        const parsedInterns = JSON.parse(storedInterns)

        if (Array.isArray(parsedInterns)) {
          existingInterns = parsedInterns
        }
      }
    } catch (err) {
      console.error('Error loading interns:', err)
    }

    // 3. Prevent duplicate intern
    const alreadyAdded = existingInterns.some(
      (intern) =>
        intern.applicationId === selectedApplication.id ||
        (
          intern.email &&
          selectedApplication.email &&
          intern.email.toLowerCase() ===
          selectedApplication.email.toLowerCase()
        )
    )

    // 4. Add selected applicant to Interns
    if (!alreadyAdded) {
      const newIntern = {
        id: `intern-${selectedApplication.id}`,
        applicationId: selectedApplication.id,

        name: selectedApplication.studentName,
        email: selectedApplication.email,
        phone: selectedApplication.phone,

        college: selectedApplication.college,
        degree: selectedApplication.degree,
        graduationYear: selectedApplication.gradYear,

        internship: selectedApplication.internship,
        department: selectedApplication.department,
        type: selectedApplication.type,
        location: selectedApplication.location,

        startDate: '',
        endDate: '',

        progress: 0,
        status: 'Active',

        supervisor: hrProfile.hrName,
        mentorEmail: 'hr@example.com',
      }

      try {
        localStorage.setItem(
          'internhubHRInterns',
          JSON.stringify([
            newIntern,
            ...existingInterns,
          ])
        )
      } catch (err) {
        console.error('Error saving intern:', err)
      }
    }

    // 5. Update modal if it is open
    if (
      activeModal &&
      activeModal.data &&
      activeModal.data.id === appId
    ) {
      setActiveModal({
        ...activeModal,
        data: {
          ...activeModal.data,
          status: 'Selected',
        },
      })
    }

    // 6. Show success message
    setBannerMessage({
      text: alreadyAdded
        ? 'Applicant selected successfully. Intern already exists.'
        : 'Applicant selected and added to Interns successfully.',
      type: 'success',
    })
  }

  // Reject prompt & confirm
  const handleOpenReject = (app) => {
    setActiveModal({ type: 'reject', data: app })
  }

  const handleConfirmReject = () => {
    if (!activeModal || !activeModal.data) return
    const targetId = activeModal.data.id

    setApplications((prev) =>
      prev.map((app) => (app.id === targetId ? { ...app, status: 'Rejected' } : app))
    )
    setBannerMessage({ text: 'Application rejected.', type: 'reject' })
    setActiveModal(null)
  }

  // Filtered applications list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // 1. Search filter: Student name, Internship title, Email, Skills
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        app.studentName.toLowerCase().includes(query) ||
        app.internship.toLowerCase().includes(query) ||
        app.email.toLowerCase().includes(query) ||
        (Array.isArray(app.skills) && app.skills.some((sk) => sk.toLowerCase().includes(query)))

      // 2. Internship dropdown filter
      const matchesInternship =
        internshipFilter === 'All Internships' || app.internship === internshipFilter

      // 3. Status filter: All, Pending, Shortlisted, Rejected
      const matchesStatus =
        statusFilter === 'All' || app.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesInternship && matchesStatus
    })
  }, [applications, searchQuery, internshipFilter, statusFilter])

  // Render Status Badge Helper
  const renderStatusBadge = (status) => {
    let className = 'hr-app-status-badge '
    switch (status) {
      case 'Shortlisted':
        className += 'badge-shortlisted'
        break
      case 'Selected':
        className += 'badge-selected'
        break
      case 'Rejected':
        className += 'badge-rejected'
        break
      default:
        className += 'badge-pending'
    }
    return (
      <span className={className}>
        {status === 'Shortlisted' && <CheckCircle2 size={12} />}
        {status === 'Selected' && <CheckCircle2 size={12} />}
        {status === 'Rejected' && <XCircle size={12} />}
        {status === 'Pending' && <Clock size={12} />}
        <span>{status}</span>
      </span>
    )
  }

  return (
  <div className="hr-dashboard-layout">
    {/* 1. Sidebar */}
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

    {/* 2. Main Content Area */}
    <div className="hr-main-content">
      <Topbar
        hrName={hrProfile.hrName}
        companyName={hrProfile.companyName}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        title="Applications"
      />

      <main className="hr-dashboard-container">
        {/* Page Header */}
        <div className="hr-apps-header">
          <h2 className="hr-apps-title">Applications</h2>
          <p className="hr-apps-subtitle">
            Review and manage student applications for your internships.
          </p>
        </div>

        {/* Feedback Banner */}
        {bannerMessage && (
          <div
            className={`hr-apps-banner ${bannerMessage.type === 'reject' ? 'banner-reject' : ''}`}
            role="status"
            aria-live="polite"
          >
            <div className="hr-banner-content">
              {bannerMessage.type === 'reject' ? (
                <XCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
              <span>{bannerMessage.text}</span>
            </div>
            <button
              type="button"
              className="hr-banner-close"
              onClick={() => setBannerMessage(null)}
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ================================================================
              1. Summary Statistics (4 Cards)
              ================================================================ */}
        <section className="hr-apps-stats-grid" aria-label="Application Summary Statistics">
          <div className="hr-apps-stat-card">
            <div className="hr-apps-stat-header">
              <span className="hr-apps-stat-label">Total Applications</span>
              <div className="hr-apps-stat-icon-box" aria-hidden="true">
                <Users size={18} />
              </div>
            </div>
            <div className="hr-apps-stat-value">{metrics.total}</div>
            <span className="hr-apps-stat-subtext">All candidate submissions</span>
          </div>

          <div className="hr-apps-stat-card">
            <div className="hr-apps-stat-header">
              <span className="hr-apps-stat-label">Pending Review</span>
              <div className="hr-apps-stat-icon-box hr-apps-stat-icon-pending" aria-hidden="true">
                <Clock size={18} />
              </div>
            </div>
            <div className="hr-apps-stat-value">{metrics.pending}</div>
            <span className="hr-apps-stat-subtext">Awaiting recruiter evaluation</span>
          </div>

          <div className="hr-apps-stat-card">
            <div className="hr-apps-stat-header">
              <span className="hr-apps-stat-label">Shortlisted</span>
              <div className="hr-apps-stat-icon-box hr-apps-stat-icon-shortlisted" aria-hidden="true">
                <UserCheck size={18} />
              </div>
            </div>
            <div className="hr-apps-stat-value">{metrics.shortlisted}</div>
            <span className="hr-apps-stat-subtext">Qualified for interview/cohort</span>
          </div>
          {/* Selected */}
          <div className="hr-apps-stat-card">
            <div className="hr-apps-stat-header">
              <span className="hr-apps-stat-label">Selected</span>
              <div className="hr-apps-stat-icon-box" aria-hidden="true">
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div className="hr-apps-stat-value">{metrics.selected}</div>
            <span className="hr-apps-stat-subtext">Successfully selected candidates</span>
          </div>

          <div className="hr-apps-stat-card">
            <div className="hr-apps-stat-header">
              <span className="hr-apps-stat-label">Rejected</span>
              <div className="hr-apps-stat-icon-box hr-apps-stat-icon-rejected" aria-hidden="true">
                <UserX size={18} />
              </div>
            </div>
            <div className="hr-apps-stat-value">{metrics.rejected}</div>
            <span className="hr-apps-stat-subtext">Archived submissions</span>
          </div>
        </section>

        {/* ================================================================
              2. Search & Filter Bar
              ================================================================ */}
        <section className="hr-apps-filter-card" aria-label="Search and Filter Applications">
          <div className="hr-apps-filter-row">
            {/* Search Box */}
            <div className="hr-apps-search-wrap">
              <Search size={16} className="hr-apps-search-icon" />
              <input
                type="search"
                className="hr-apps-search-input"
                placeholder="Search applicants by name, role, email, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="hr-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="hr-apps-filter-controls">
              {/* Internship Role Filter */}
              <select
                className="hr-apps-select-control"
                value={internshipFilter}
                onChange={(e) => setInternshipFilter(e.target.value)}
                aria-label="Filter by Internship Role"
              >
                <option value="All Internships">All Internships</option>
                <option value="Frontend Development Intern">Frontend Development Intern</option>
                <option value="UI/UX Design Intern">UI/UX Design Intern</option>
                <option value="Data Analytics Intern">Data Analytics Intern</option>
              </select>

              {/* Status Filter Pills */}
              <div className="hr-apps-status-pills" role="group" aria-label="Filter by Status">
                {['All', 'Pending', 'Shortlisted', 'Selected', 'Rejected'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`hr-apps-status-btn ${statusFilter === st ? 'active' : ''}`}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Counter */}
          <div className="hr-apps-toolbar-meta">
            <span>
              Showing <strong>{filteredApplications.length}</strong>{' '}
              {filteredApplications.length === 1 ? 'application' : 'applications'}
              {searchQuery || internshipFilter !== 'All Internships' || statusFilter !== 'All'
                ? ' (filtered)'
                : ''}
            </span>
            <span>Organization: <strong>{hrProfile.companyName || 'NovaTech Labs Pvt Ltd'}</strong></span>
          </div>
        </section>

        {/* ================================================================
              3. Applications Cards Grid / Empty State
              ================================================================ */}
        {filteredApplications.length > 0 ? (
          <div className="hr-apps-cards-grid">
            {filteredApplications.map((app) => {
              const initials = app.studentName
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()

              return (
                <div
                  key={app.id}
                  className={`hr-app-card ${app.status === 'Shortlisted'
                    ? 'card-shortlisted'
                    : app.status === 'Rejected'
                      ? 'card-rejected'
                      : ''
                    }`}
                >
                  <div>
                    {/* Top Row: Student Avatar, Name, Email, Status */}
                    <div className="hr-app-card-top">
                      <div className="hr-student-lead">
                        <div className="hr-student-avatar" aria-hidden="true">
                          {initials}
                        </div>
                        <div className="hr-student-headings">
                          <h3 className="hr-student-name">{app.studentName}</h3>
                          <span className="hr-student-email">
                            <Mail size={12} />
                            {app.email}
                          </span>
                        </div>
                      </div>

                      <div>{renderStatusBadge(app.status)}</div>
                    </div>

                    {/* Internship & Date Row */}
                    <div className="hr-app-role-box" style={{ marginTop: '14px' }}>
                      <div className="hr-app-role-info">
                        <span style={{ fontSize: '10px', color: 'var(--hr-muted-gray, #6F686B)', textTransform: 'uppercase', fontWeight: 700 }}>
                          Applied Role
                        </span>
                        <span className="hr-app-role-title">{app.internship}</span>
                      </div>
                      <div className="hr-app-date-meta">
                        <Calendar size={12} />
                        <span>{app.appliedDate}</span>
                      </div>
                    </div>

                    {/* Skills Chips */}
                    {app.skills && (
                      <div className="hr-app-skills-row" style={{ marginTop: '14px' }}>
                        {(Array.isArray(app.skills) ? app.skills : app.skills.split(',')).map(
                          (sk, idx) => (
                            <span key={idx} className="hr-app-skill-chip">
                              {sk.trim()}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="hr-app-actions-footer">
                    <div className="hr-app-action-buttons">
                      {/* View Button */}
                      <button
                        type="button"
                        className="hr-btn-action-view"
                        onClick={() => setActiveModal({ type: 'view', data: app })}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>

                      {/* Shortlist Button (if not already shortlisted) */}
                      {/* Shortlist Button */}
                      {app.status === 'Pending' && (
                        <button
                          type="button"
                          className="hr-btn-action-shortlist"
                          onClick={() => handleShortlist(app.id)}
                        >
                          <UserCheck size={14} />
                          <span>Shortlist</span>
                        </button>
                      )}

                      {/* Select Button */}
                      {app.status === 'Shortlisted' && (
                        <button
                          type="button"
                          className="hr-btn-action-shortlist"
                          onClick={() => handleSelect(app.id)}
                        >
                          <CheckCircle2 size={14} />
                          <span>Select</span>
                        </button>
                      )}

                      {/* Reject Button (if not already rejected) */}
                      {app.status !== 'Rejected' && (
                        <button
                          type="button"
                          className="hr-btn-action-reject"
                          onClick={() => handleOpenReject(app)}
                        >
                          <UserX size={14} />
                          <span>Reject</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="hr-internships-empty-state">
            <div className="hr-empty-icon-box" aria-hidden="true">
              <Users size={28} />
            </div>
            <h3 className="hr-empty-title">No applications found</h3>
            <p className="hr-empty-desc">
              Try changing your search or filters to see more applicant records.
            </p>
            <button
              type="button"
              className="hr-btn-secondary"
              onClick={() => {
                setSearchQuery('')
                setInternshipFilter('All Internships')
                setStatusFilter('All')
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>

    {/* ================================================================
          MODAL 1: Application Full Details Modal
          ================================================================ */}
    {activeModal && activeModal.type === 'view' && activeModal.data && (
      <div
        className="hr-modal-overlay"
        onClick={() => setActiveModal(null)}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="hr-modal-container"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Header */}
          <div className="hr-modal-topbar">
            <div className="hr-modal-heading-group">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="hr-modal-main-title">{activeModal.data.studentName}</h3>
                {renderStatusBadge(activeModal.data.status)}
              </div>
              <p className="hr-modal-main-subtitle">
                Applied for {activeModal.data.internship} • {activeModal.data.appliedDate}
              </p>
            </div>
            <button
              type="button"
              className="hr-modal-close-icon"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="hr-modal-scrollable-body">
            {/* 1. Student Information */}
            <div className="hr-app-detail-section">
              <h4 className="hr-app-detail-section-title">
                <GraduationCap size={15} />
                Student Information
              </h4>
              <div className="hr-card-info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Full Name</span>
                  <span className="hr-info-stat-value">{activeModal.data.studentName}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Email</span>
                  <span className="hr-info-stat-value" title={activeModal.data.email}>
                    {activeModal.data.email}
                  </span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Phone</span>
                  <span className="hr-info-stat-value">{activeModal.data.phone || '+91 98765 01000'}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">College / University</span>
                  <span className="hr-info-stat-value" title={activeModal.data.college}>
                    {activeModal.data.college || 'Engineering Institute'}
                  </span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Degree / Stream</span>
                  <span className="hr-info-stat-value" title={activeModal.data.degree}>
                    {activeModal.data.degree || 'Bachelor of Technology'}
                  </span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Graduation Year</span>
                  <span className="hr-info-stat-value">{activeModal.data.gradYear || '2026'}</span>
                </div>
              </div>
            </div>

            {/* 2. Skills */}
            <div className="hr-app-detail-section">
              <h4 className="hr-app-detail-section-title">
                <FileCheck size={15} />
                Technical & Academic Skills
              </h4>
              <div className="hr-app-skills-row">
                {(Array.isArray(activeModal.data.skills)
                  ? activeModal.data.skills
                  : activeModal.data.skills.split(',')
                ).map((sk, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'var(--hr-soft-lavender, #F0EAF0)',
                      color: 'var(--hr-primary-plum, #67405F)',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    {sk.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Internship Details */}
            <div className="hr-app-detail-section">
              <h4 className="hr-app-detail-section-title">
                <Briefcase size={15} />
                Internship Specifications
              </h4>
              <div className="hr-card-info-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Internship Title</span>
                  <span className="hr-info-stat-value">{activeModal.data.internship}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Department</span>
                  <span className="hr-info-stat-value">{activeModal.data.department || 'Engineering'}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Type</span>
                  <span className="hr-info-stat-value">{activeModal.data.type || 'Hybrid'}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Location</span>
                  <span className="hr-info-stat-value">{activeModal.data.location || 'Bengaluru, Karnataka'}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Duration</span>
                  <span className="hr-info-stat-value">{activeModal.data.duration || '3 Months'}</span>
                </div>
                <div className="hr-info-stat-block">
                  <span className="hr-info-stat-label">Applied Date</span>
                  <span className="hr-info-stat-value">{activeModal.data.appliedDate}</span>
                </div>
              </div>
            </div>

            {/* 4. Resume & Uploaded Documents */}
            <div className="hr-app-detail-section">
              <h4 className="hr-app-detail-section-title">
                <FileText size={15} />
                Applicant Documents
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Primary Resume */}
                <div className="hr-doc-item">
                  <div className="hr-doc-name">
                    <FileText size={16} color="var(--hr-primary-plum, #67405F)" />
                    <span>Resume.pdf</span>
                  </div>
                  <button
                    type="button"
                    className="hr-doc-view-btn"
                    onClick={() => alert('Resume preview will be connected with the backend later.')}
                  >
                    View Resume
                  </button>
                </div>

                {/* Supplemental Documents */}
                {(activeModal.data.documents || ['Cover Letter.pdf', 'ID Proof.pdf'])
                  .filter((doc) => doc !== 'Resume.pdf')
                  .map((doc, idx) => (
                    <div key={idx} className="hr-doc-item">
                      <div className="hr-doc-name">
                        <FileText size={16} color="var(--hr-muted-gray, #6F686B)" />
                        <span>{doc}</span>
                      </div>
                      <button
                        type="button"
                        className="hr-doc-view-btn"
                        onClick={() => alert(`Document preview for ${doc} will be connected with the backend later.`)}
                      >
                        View Document
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="hr-modal-footer">
            <button
              type="button"
              className="hr-btn-secondary"
              onClick={() => setActiveModal(null)}
            >
              Close
            </button>

            {/* Reject: Pending or Shortlisted only */}
            {(activeModal.data.status === 'Pending' ||
              activeModal.data.status === 'Shortlisted') && (
                <button
                  type="button"
                  className="hr-btn-action-reject"
                  onClick={() => handleOpenReject(activeModal.data)}
                >
                  <UserX size={15} />
                  <span>Reject</span>
                </button>
              )}

            {/* Shortlist: Pending only */}
            {activeModal.data.status === 'Pending' && (
              <button
                type="button"
                className="hr-btn-action-shortlist"
                onClick={() => handleShortlist(activeModal.data.id)}
              >
                <UserCheck size={15} />
                <span>Shortlist Candidate</span>
              </button>
            )}

            {/* Select: Shortlisted only */}
            {activeModal.data.status === 'Shortlisted' && (
              <button
                type="button"
                className="hr-btn-action-shortlist"
                onClick={() => handleSelect(activeModal.data.id)}
              >
                <CheckCircle2 size={15} />
                <span>Select Candidate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )}

    {/* ================================================================
          MODAL 2: Reject Confirmation Modal
          ================================================================ */}
    {activeModal && activeModal.type === 'reject' && activeModal.data && (
      <div
        className="hr-modal-overlay"
        onClick={() => setActiveModal(null)}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="hr-modal-container hr-modal-container-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="hr-modal-topbar">
            <h3 className="hr-modal-main-title">Reject this application?</h3>
            <button
              type="button"
              className="hr-modal-close-icon"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="hr-modal-scrollable-body">
            <div className="hr-delete-warning-box">
              <AlertTriangle size={24} className="hr-delete-warning-icon" />
              <div className="hr-delete-warning-text">
                <h4>Application Rejection</h4>
                <p>
                  Are you sure you want to reject{' '}
                  <strong>{activeModal.data.studentName}</strong>'s application for{' '}
                  <strong>{activeModal.data.internship}</strong>?
                </p>
              </div>
            </div>
          </div>

          <div className="hr-modal-footer">
            <button
              type="button"
              className="hr-btn-secondary"
              onClick={() => setActiveModal(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="hr-btn-danger-solid"
              onClick={handleConfirmReject}
            >
              <UserX size={15} />
              <span>Reject Application</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}

export default HRApplications