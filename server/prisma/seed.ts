import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.jobChannelPublishTrack.deleteMany()
  await prisma.timelineEvent.deleteMany()
  await prisma.emailLog.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.job.deleteMany()
  await prisma.channel.deleteMany()
  await prisma.user.deleteMany()
  await prisma.department.deleteMany()

  // 1. Seed Departments
  const deptIT = await prisma.department.create({
    data: { name: 'IT', code: 'IT' },
  })
  const deptHR = await prisma.department.create({
    data: { name: 'HR', code: 'HR' },
  })
  const deptMkt = await prisma.department.create({
    data: { name: 'Marketing', code: 'MKT' },
  })
  const deptMgmt = await prisma.department.create({
    data: { name: 'Management', code: 'MGMT' },
  })

  // 2. Seed Users
  const user1 = await prisma.user.create({
    data: {
      id: 'usr-1',
      name: 'Nhật Trần',
      email: 'nhat.tran@thdcyber.vn',
      role: 'HR Recruiter',
      departmentId: deptIT.id,
      avatar: 'NT',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      id: 'usr-2',
      name: 'Lan Nguyễn',
      email: 'lan.nguyen@thdcyber.vn',
      role: 'HR Manager',
      departmentId: deptHR.id,
      avatar: 'LN',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      id: 'usr-3',
      name: 'Minh Vũ',
      email: 'minh.vu@thdcyber.vn',
      role: 'TA Lead',
      departmentId: deptIT.id,
      avatar: 'MV',
    },
  })

  const user4 = await prisma.user.create({
    data: {
      id: 'usr-4',
      name: 'Admin THD',
      email: 'admin@thdcyber.vn',
      role: 'Admin',
      departmentId: deptMgmt.id,
      avatar: 'AD',
    },
  })

  // 3. Seed Recruitment Channels (FR3)
  const chnLinkedin = await prisma.channel.create({
    data: {
      id: 'chn-linkedin',
      name: 'LinkedIn',
      category: 'Social Media',
      activeJobsCount: 15,
      totalCandidates: 250,
      trend: '+18%',
      status: 'Active',
    },
  })

  const chnTopcv = await prisma.channel.create({
    data: {
      id: 'chn-topcv',
      name: 'TopCV',
      category: 'Job Board',
      activeJobsCount: 12,
      totalCandidates: 135,
      trend: '+11%',
      status: 'Active',
    },
  })

  const chnFacebook = await prisma.channel.create({
    data: {
      id: 'chn-facebook',
      name: 'Facebook / MXH',
      category: 'Social Media',
      activeJobsCount: 8,
      totalCandidates: 96,
      trend: '+6%',
      status: 'Active',
    },
  })

  const chnVietnamworks = await prisma.channel.create({
    data: {
      id: 'chn-vietnamworks',
      name: 'VietnamWorks',
      category: 'Job Board',
      activeJobsCount: 7,
      totalCandidates: 88,
      trend: '+4%',
      status: 'Active',
    },
  })

  const chnWebsite = await prisma.channel.create({
    data: {
      id: 'chn-website',
      name: 'Company Website',
      category: 'Company Website',
      activeJobsCount: 24,
      totalCandidates: 62,
      trend: '+12%',
      status: 'Active',
    },
  })

  const chnReferral = await prisma.channel.create({
    data: {
      id: 'chn-referral',
      name: 'Giới thiệu nội bộ (Referral)',
      category: 'Employee Referral',
      activeJobsCount: 6,
      totalCandidates: 45,
      trend: '+9%',
      status: 'Active',
    },
  })

  // 4. Seed Jobs & Timeline Events (FR2, FR5, FR10)
  const job1 = await prisma.job.create({
    data: {
      id: 'job-1',
      title: 'Backend Developer (Kỹ sư Backend)',
      departmentName: 'IT',
      departmentId: deptIT.id,
      location: 'TP. Hồ Chí Minh',
      status: 'Published',
      type: 'Full-time',
      description:
        'Chịu trách nhiệm thiết kế, xây dựng và tối ưu hóa các dịch vụ phía máy chủ (Backend Services) và RESTful APIs cho hệ thống của công ty.',
      experience: 'Từ 3 năm kinh nghiệm lập trình Backend (Node.js, Python hoặc Java).',
      skills: 'Thành thạo SQL/NoSQL, RESTful API, Docker/Kubernetes, Microservices.',
      english: 'Đọc hiểu tài liệu chuyên ngành tốt, giao tiếp cơ bản.',
      education: 'Cử nhân Công nghệ Thông tin hoặc chuyên ngành liên quan.',
      note: 'Ưu tiên ứng viên có kiến thức về bảo mật thông tin và Cloud AWS/Azure.',
      recruiterId: user1.id,
      recruiterName: user1.name,
      applicantsCount: 48,
      createdDate: '2026-07-01',
      updatedDate: '2026-07-15',
      expiryDate: '2026-08-15',
      timelineEvents: {
        create: [
          { date: '2026-07-01 09:00', action: 'Created', actor: user1.name, note: 'Tạo bản nháp vị trí Backend Developer' },
          { date: '2026-07-02 14:30', action: 'Approved', actor: user2.name, note: 'Đã duyệt yêu cầu tuyển dụng' },
          { date: '2026-07-03 10:15', action: 'Published', actor: user1.name, note: 'Đã xuất bản lên LinkedIn & TopCV' },
          { date: '2026-07-15 16:00', action: 'Updated', actor: user1.name, note: 'Cập nhật bổ sung yêu cầu Cloud AWS' },
        ],
      },
    },
  })

  const job2 = await prisma.job.create({
    data: {
      id: 'job-2',
      title: 'Business Analyst (PT Nghiệp vụ)',
      departmentName: 'IT',
      departmentId: deptIT.id,
      location: 'Hà Nội',
      status: 'Published',
      type: 'Full-time',
      description:
        'Thu thập, phân tích yêu cầu nghiệp vụ từ khách hàng và các bên liên quan, viết tài liệu BRD/SRS cho đội phát triển phần mềm.',
      experience: '3+ năm kinh nghiệm BA phần mềm hoặc tư vấn giải pháp IT.',
      skills: 'UML, BPMN, SQL cơ bản, kỹ năng giao tiếp và truyền đạt xuất sắc.',
      english: 'Tiếng Anh giao tiếp và viết tài liệu thành thạo.',
      education: 'Đại học chuyên ngành CNTT, Hệ thống thông tin quản lý hoặc Quản trị kinh doanh.',
      recruiterId: user3.id,
      recruiterName: user3.name,
      applicantsCount: 29,
      createdDate: '2026-07-05',
      updatedDate: '2026-07-18',
      expiryDate: '2026-08-20',
      timelineEvents: {
        create: [
          { date: '2026-07-05 10:00', action: 'Created', actor: user3.name, note: 'Tạo tin bài BA' },
          { date: '2026-07-06 11:20', action: 'Published', actor: user3.name, note: 'Đăng tuyển Website Công ty & LinkedIn' },
        ],
      },
    },
  })

  const job3 = await prisma.job.create({
    data: {
      id: 'job-3',
      title: 'HR Executive (Chuyên viên Nhân sự)',
      departmentName: 'HR',
      departmentId: deptHR.id,
      location: 'TP. Hồ Chí Minh',
      status: 'Pending Approval',
      type: 'Full-time',
      description:
        'Hỗ trợ công tác tuyển dụng, tiếp nhận nhân sự mới, tổ chức truyền thông nội bộ và phối hợp quản lý hồ sơ nhân sự.',
      experience: '1-2 năm kinh nghiệm ở vị trí HR Generalist/Recruiter.',
      skills: 'Giao tiếp tốt, sử dụng thành thạo MS Office, tinh thần trách nhiệm cao.',
      english: 'Giao tiếp cơ bản.',
      education: 'Đại học chuyên ngành Quản trị Nhân sự, Luật hoặc Ngoại ngữ.',
      recruiterId: user2.id,
      recruiterName: user2.name,
      applicantsCount: 19,
      createdDate: '2026-07-20',
      updatedDate: '2026-07-20',
      expiryDate: '2026-08-30',
      timelineEvents: {
        create: [
          { date: '2026-07-20 15:00', action: 'Submitted Approval', actor: user2.name, note: 'Gửi đề xuất tuyển dụng chờ duyệt' },
        ],
      },
    },
  })

  // 5. Seed Publish Tracks (FR4)
  await prisma.jobChannelPublishTrack.createMany({
    data: [
      { jobId: job1.id, channelId: chnLinkedin.id, status: 'Published', publishedDate: '2026-07-03' },
      { jobId: job1.id, channelId: chnTopcv.id, status: 'Published', publishedDate: '2026-07-03' },
      { jobId: job1.id, channelId: chnWebsite.id, status: 'Published', publishedDate: '2026-07-02' },
      { jobId: job2.id, channelId: chnLinkedin.id, status: 'Published', publishedDate: '2026-07-06' },
      { jobId: job2.id, channelId: chnWebsite.id, status: 'Published', publishedDate: '2026-07-05' },
    ],
  })

  // 6. Seed Emails (FR9)
  await prisma.emailLog.createMany({
    data: [
      {
        jobId: job1.id,
        jobTitle: 'Backend Developer',
        sender: 'Nhật Trần',
        recipient: 'Phong Trần',
        recipientEmail: 'phong.tran@gmail.com',
        topic: 'Xác nhận lịch phỏng vấn vị trí Backend Developer',
        content: 'Chào Phong, HR xin gửi lời mời phỏng vấn vòng 1 vào lúc 14h00 ngày 30/07/2026...',
        time: '10 phút trước',
        status: 'Sent',
      },
      {
        jobId: job3.id,
        jobTitle: 'HR Executive',
        sender: 'Lan Nguyễn',
        recipient: 'HR Ops',
        recipientEmail: 'hrops@thdcyber.vn',
        topic: 'Yêu cầu phê duyệt đề xuất vị trí HR Executive',
        content: 'Kính gửi chị Lan, em vừa gửi đề xuất tuyển HR Executive, nhờ chị xem xét...',
        time: '35 phút trước',
        status: 'Replied',
      },
    ],
  })

  // 7. Seed Audit Logs (NFR-09)
  await prisma.auditLog.createMany({
    data: [
      {
        timestamp: '2026-07-28 08:30:12',
        userId: user1.id,
        userName: user1.name,
        action: 'Login',
        details: 'Đăng nhập hệ thống từ IP 118.69.182.10',
      },
      {
        timestamp: '2026-07-28 08:35:44',
        userId: user1.id,
        userName: user1.name,
        action: 'Publish Job',
        details: 'Đăng tuyển bài viết Backend Developer lên kênh LinkedIn',
      },
    ],
  })

  console.log('✅ Database seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
