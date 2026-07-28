import { createRoot } from 'react-dom/client'
import '../jobposting.css'
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Sparkles,
  Users2,
} from 'lucide-react'

const postings = [
  {
    title: 'Backend Developer',
    department: 'IT',
    location: 'Ha Noi, Hồ Chí Minh',
    status: 'Published',
    description: 'We are looking for a skilled backend developer to join our team. You will be part of our delivery team and will be responsible for providing technical expertise throughout all phases of the software delivery life cycle as we initiate a transformation of technology.',
    experience: '3+ years of experience in backend development, with a strong understanding of server-side programming languages and frameworks.',
    skills: 'Proficiency in backend programming languages (e.g., Node.js, Python, Java), experience with databases (SQL and NoSQL), knowledge of RESTful APIs and microservices architecture, familiarity with version control systems (e.g., Git), understanding of security best practices in backend development.',
    english: 'Fluent in English, both written and spoken.',
    education: 'Bachelor\'s degree in Computer Science or related field.',
    note: 'Candidates with experience in cloud platforms (e.g., AWS, Azure) and containerization (e.g., Docker, Kubernetes) will be given preference.',
    applicants: 48,
    posted: '2 ngày trước',
    type: 'Full-time',
    date: '2026-07-25',
  },
  {
    title: 'Software Tester (Manual, Fresher)',
    department: 'IT',
    location: 'Hồ Chí Minh',
    status: 'Published',
    description: 'We are looking for a software tester to join our team. You will be part of our delivery team and will be responsible for providing technical expertise throughout all phases of the software delivery life cycle as we initiate a transformation of technology.',
    experience: 'Fresher with basic knowledge of software testing principles and methodologies.',
    skills: 'Understanding of manual testing techniques, ability to create and execute test cases, familiarity with bug tracking tools, good communication skills.',
    english: 'Basic to Intermediate knowledge of English, both written and spoken.',
    education: 'Bachelor\'s degree in Computer Science or related field.',
    note: 'Final-year students are also welcome BUT must be able to start working full-time (should finish all coursework).',
    applicants: 53,
    posted: '9 ngày trước',
    type: 'Full-time',
    date: '2026-07-18',
  },
  {
    title: 'Senior Business Analyst',
    department: 'IT',
    location: 'Ha Noi',
    status: 'Published',
    description: 'We are looking for a senior business analyst to join our team. You will be part of our delivery team and will be responsible for providing technical expertise throughout all phases of the software delivery life cycle as we initiate a transformation of technology.',
    experience: '5+ years of experience in business analysis, with a strong understanding of business processes and requirements gathering.',
    skills: 'Proficiency in business analysis tools and techniques, experience with requirements elicitation and documentation, knowledge of SDLC, strong analytical and problem-solving skills, excellent communication and stakeholder management abilities.',
    english: 'Basic to Intermediate knowledge of English, both written and spoken.',
    education: 'Bachelor\'s degree in Computer Science or related field.',
    note: 'Candidates with experience in cloud platforms (e.g., AWS, Azure) and containerization (e.g., Docker, Kubernetes) will be given preference.',
    applicants: 29,
    posted: '9 ngày trước',
    type: 'Full-time',
    date: '2026-07-18',
  },
  {
    title: 'HR Executive',
    department: 'HR',
    location: 'Hà Nội, Hồ Chí Minh, Đà Nẵng',
    status: 'Pending Approval',
    description: 'We are seeking a highly motivated and organized HR Executive to join our team. In this role, you will be responsible for supporting various HR functions, including recruitment, employee relations, performance management, and HR administration.',
    experience: '2+ years of experience in HR or related field, with a strong understanding of HR practices and employment laws.',
    skills: 'Excellent communication and interpersonal skills, strong organizational and time management abilities, proficiency in HR software and tools, knowledge of recruitment strategies and employee engagement techniques.',
    english: 'Proficient in English, both written and spoken.',
    education: 'Bachelor\'s degree in Business Administration or related field.',
    note: 'Candidates with experience in HRIS (Human Resource Information Systems) will be given preference.',
    applicants: 19,
    posted: '5 ngày trước',
    type: 'Full-time',
    date: '2026-06-20',
  },
  {
    title: 'Early Career Specialist',
    department: 'HR',
    location: 'Hà Nội, Hồ Chí Minh',
    status: 'Pending Approval',
    description: 'We are seeking a highly motivated and organized HR Executive to join our team. In this role, you will be responsible for supporting various HR functions, including recruitment, employee relations, performance management, and HR administration.',
    experience: '2+ years of experience in HR or related field, with a strong understanding of HR practices and employment laws.',
    skills: 'Excellent communication and interpersonal skills, strong organizational and time management abilities, proficiency in HR software and tools, knowledge of recruitment strategies and employee engagement techniques.',
    english: 'Proficient in English, both written and spoken.',
    education: 'Bachelor\'s degree in Business Administration or related field.',
    note: 'Candidates with experience in HRIS (Human Resource Information Systems) will be given preference.',
    applicants: 19,
    posted: '5 ngày trước',
    type: 'Full-time',
    date: '2026-06-20',
  },
  {
    title: 'Digital Marketing Lead',
    department: 'Marketing',
    location: 'Đà Nẵng',
    status: 'Draft',
    description: 'We are looking for a talented and experienced Digital Marketing Lead to join our marketing team. In this role, you will be responsible for developing and executing digital marketing strategies to drive brand awareness, engagement, and lead generation.',
    experience: '5+ years of experience in digital marketing, with a proven track record of successful campaigns and strategies.',
    skills: 'Strong knowledge of digital marketing channels (SEO, SEM, social media, email marketing), proficiency in analytics tools (Google Analytics, etc.), experience with content creation and management, excellent communication and leadership skills.',
    english: 'Fluent in English, both written and spoken. For written communication, a high level of proficiency is required to create compelling content and marketing materials.',
    applicants: 8,
    posted: '1 tuần trước',
    type: 'Contract',
  },
  {
    title: 'Senior Product Designer',
    department: 'Marketing',
    location: 'Remote',
    status: 'Closed',
    description: 'We are seeking a highly skilled and creative Senior Product Designer to join our design team. In this role, you will be responsible for leading the design process and creating exceptional user experiences for our digital products.',
    experience: '4+ years of experience in product design, with a strong portfolio showcasing your design work and problem-solving abilities.',
    skills: 'Proficiency in design tools (Sketch, Figma, Adobe Creative Suite), strong understanding of user-centered design principles, experience with prototyping and user testing, excellent communication and collaboration skills.',
    applicants: 27,
    posted: '2 tuần trước',
    type: 'Full-time',
  },
]

const statusClasses = {
  Draft: 'bg-slate-100 text-slate-700',
  'Pending Approval': 'bg-amber-100 text-amber-700',
  Published: 'bg-emerald-100 text-emerald-700',
  Closed: 'bg-rose-100 text-rose-700',
}

function JobPosting() {
  return (
    <div className="jobposting-page rounded-[32px] border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="jobposting-hero flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-200">Trung tâm tuyển dụng</p>
          <h2 className="text-xl font-semibold text-white">Cơ hội nghề nghiệp</h2>
          <p className="mt-1 text-sm text-cyan-50/90">Theo dõi các vị trí đang mở, ứng viên và phê duyệt tại một nơi.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="jobposting-search flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-slate-500">
            <Search size={16} />
            <input className="w-full bg-transparent outline-none" placeholder="Search jobs" />
          </label>
          <button className="jobposting-btn rounded-2xl px-3 py-2 text-sm font-medium">
            + Công việc mới
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="jobposting-stat-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <BriefcaseBusiness size={16} className="text-cyan-600" />
            Vị trí đang mở
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">24</p>
        </div>
        <div className="jobposting-stat-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users2 size={16} className="text-violet-600" />
            Tổng số đơn ứng tuyển
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">1,248</p>
        </div>
        <div className="jobposting-stat-card rounded-2xl p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles size={16} className="text-emerald-600" />
            AI shortlisted
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">87</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {postings.map((job) => (
          <div key={job.title} className="jobposting-job-card rounded-2xl p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                  <span className={`jobposting-chip rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[job.status]}`}>
                    {job.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <BriefcaseBusiness size={14} /> {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 size={14} /> {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} /> Posted {job.posted}
                  </span>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{job.applicants} applicants</p>
                <p className="mt-1">Sẵn sàng xem xét</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default JobPosting

const container = document.getElementById('root')

if (container?.dataset.standalone === 'jobposting') {
  createRoot(container).render(<JobPosting />)
}

