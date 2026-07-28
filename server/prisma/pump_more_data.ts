import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function pumpData() {
  console.log('🚀 Pumping new test data into PostgreSQL database...')

  // Fetch IT Department
  const deptIT = await prisma.department.findUnique({ where: { name: 'IT' } })
  const deptMkt = await prisma.department.findUnique({ where: { name: 'Marketing' } })
  const deptHR = await prisma.department.findUnique({ where: { name: 'HR' } })

  const user1 = await prisma.user.findUnique({ where: { email: 'nhat.tran@thdcyber.vn' } })
  const user2 = await prisma.user.findUnique({ where: { email: 'lan.nguyen@thdcyber.vn' } })
  const user3 = await prisma.user.findUnique({ where: { email: 'minh.vu@thdcyber.vn' } })

  // 1. Insert 4 new Jobs into PostgreSQL
  const jobCyber = await prisma.job.create({
    data: {
      title: 'Senior Cyber Security Specialist (Kỹ sư ATTT)',
      departmentName: 'IT',
      departmentId: deptIT?.id,
      location: 'TP. Hồ Chí Minh',
      status: 'Published',
      type: 'Full-time',
      description:
        'Thực hiện kiểm thử xâm nhập (Pentest), rà soát lỗ hổng bảo mật ứng dụng Web/API và giám sát sự cố An toàn thông tin cho hệ thống công ty.',
      experience: '4+ năm kinh nghiệm trong lĩnh vực Penetration Testing / SOC Analysis.',
      skills: 'OSCP, CEH, CISSP, Web Security, Network Hardening, SIEM, Incident Response.',
      english: 'Thành thạo đọc tài liệu và viết báo cáo chuyên ngành Security.',
      education: 'Đại học chuyên ngành An toàn thông tin hoặc Công nghệ thông tin.',
      note: 'Ưu tiên ứng viên có chứng chỉ OSCP hoặc CREST.',
      recruiterId: user1?.id,
      recruiterName: user1?.name || 'Nhật Trần',
      applicantsCount: 35,
      createdDate: '2026-07-25',
      updatedDate: '2026-07-28',
      expiryDate: '2026-08-31',
      timelineEvents: {
        create: [
          { date: '2026-07-25 08:30', action: 'Created', actor: 'Nhật Trần', note: 'Tạo vị trí Senior Security Specialist' },
          { date: '2026-07-26 10:00', action: 'Approved', actor: 'Lan Nguyễn', note: 'Phê duyệt đề xuất tuyển dụng' },
          { date: '2026-07-27 09:15', action: 'Published', actor: 'Nhật Trần', note: 'Xuất bản lên LinkedIn & Website Công ty' },
        ],
      },
    },
  })

  const jobDevops = await prisma.job.create({
    data: {
      title: 'DevOps / SRE Lead (Trưởng nhóm DevOps)',
      departmentName: 'IT',
      departmentId: deptIT?.id,
      location: 'Hà Nội',
      status: 'Published',
      type: 'Full-time',
      description:
        'Thiết kế kiến trúc hạ tầng CI/CD, quản lý cụm Kubernetes/Docker và tự động hóa quy trình triển khai phần mềm.',
      experience: '5+ năm kinh nghiệm với vai trò DevOps Engineer / SRE.',
      skills: 'Docker, Kubernetes, Terraform, Ansible, Jenkins, GitLab CI, AWS, Prometheus, Grafana.',
      english: 'Giao tiếp tốt trong môi trường quốc tế.',
      education: 'Đại học chuyên ngành CNTT hoặc Khoa học máy tính.',
      recruiterId: user3?.id,
      recruiterName: user3?.name || 'Minh Vũ',
      applicantsCount: 42,
      createdDate: '2026-07-24',
      updatedDate: '2026-07-27',
      expiryDate: '2026-09-05',
      timelineEvents: {
        create: [
          { date: '2026-07-24 14:00', action: 'Created', actor: 'Minh Vũ', note: 'Khởi tạo đề xuất DevOps Lead' },
          { date: '2026-07-25 11:00', action: 'Published', actor: 'Minh Vũ', note: 'Đăng bài tuyển dụng trên TopCV' },
        ],
      },
    },
  })

  const jobMkt = await prisma.job.create({
    data: {
      title: 'Content Marketing Executive (Chuyên viên Nội dung)',
      departmentName: 'Marketing',
      departmentId: deptMkt?.id,
      location: 'TP. Hồ Chí Minh',
      status: 'Draft',
      type: 'Full-time',
      description:
        'Sáng tạo nội dung truyền thông cho Website, Fanpage, LinkedIn và biên soạn ấn phẩm báo chí cho các chiến dịch tuyển dụng.',
      experience: '1-2 năm kinh nghiệm làm Content Marketing / Copywriting.',
      skills: 'SEO Writing, Content Strategy, Social Media Copy, Basic Photoshop/Canva.',
      english: 'Viết tiếng Anh tốt.',
      recruiterId: user2?.id,
      recruiterName: user2?.name || 'Lan Nguyễn',
      applicantsCount: 14,
      createdDate: '2026-07-28',
      updatedDate: '2026-07-28',
      expiryDate: '2026-08-25',
      timelineEvents: {
        create: [
          { date: '2026-07-28 09:00', action: 'Created', actor: 'Lan Nguyễn', note: 'Tạo bản nháp vị trí Content Marketing' },
        ],
      },
    },
  })

  // 2. Insert 2 new Channels into PostgreSQL
  const chnGlints = await prisma.channel.create({
    data: {
      id: 'chn-glints',
      name: 'Glints Vietnam',
      category: 'Job Board',
      activeJobsCount: 10,
      totalCandidates: 112,
      trend: '+15%',
      status: 'Active',
    },
  })

  const chnCareerbuilder = await prisma.channel.create({
    data: {
      id: 'chn-careerbuilder',
      name: 'CareerBuilder Vietnam',
      category: 'Job Board',
      activeJobsCount: 8,
      totalCandidates: 85,
      trend: '+7%',
      status: 'Active',
    },
  })

  // 3. Connect Publish Tracks in DB
  await prisma.jobChannelPublishTrack.createMany({
    data: [
      { jobId: jobCyber.id, channelId: 'chn-linkedin', status: 'Published', publishedDate: '2026-07-27' },
      { jobId: jobCyber.id, channelId: chnGlints.id, status: 'Published', publishedDate: '2026-07-27' },
      { jobId: jobDevops.id, channelId: 'chn-topcv', status: 'Published', publishedDate: '2026-07-25' },
      { jobId: jobDevops.id, channelId: chnCareerbuilder.id, status: 'Published', publishedDate: '2026-07-26' },
    ],
  })

  // 4. Insert new Email Log into PostgreSQL DB
  await prisma.emailLog.create({
    data: {
      jobId: jobCyber.id,
      jobTitle: jobCyber.title,
      sender: user1?.name || 'Nhật Trần',
      recipient: 'Bảo Hoàng',
      recipientEmail: 'bao.hoang.security@gmail.com',
      topic: 'Lời mời Phỏng vấn Vòng 2 - Senior Security Specialist',
      content:
        'Chào Bảo Hoàng, HR trân trọng mời bạn tham gia buổi phỏng vấn Chuyên môn Vòng 2 với TA Lead vào 15h00 ngày 01/08/2026...',
      time: 'Vừa xong',
      status: 'Sent',
    },
  })

  // 5. Insert new Audit Log into PostgreSQL DB
  await prisma.auditLog.create({
    data: {
      timestamp: '2026-07-28 09:25:00',
      userId: user1?.id,
      userName: user1?.name || 'Nhật Trần',
      action: 'Pump Test Data',
      details: 'Bơm dữ liệu thử nghiệm vị trí Senior Security Specialist & DevOps Lead vào PostgreSQL Database',
    },
  })

  console.log('🎉 Successfully pumped new records into PostgreSQL database!')
}

pumpData()
  .catch((e) => {
    console.error('❌ Error pumping data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
