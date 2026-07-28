import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Utility function to record Audit Log automatically
async function createAuditLog(userId: string | null, userName: string, action: string, details: string) {
  const now = new Date()
  const timestamp = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })}`

  await prisma.auditLog.create({
    data: {
      userId,
      userName,
      action,
      details,
      timestamp,
    },
  })
}

// ----------------------------------------------------
// 1. JOB POSTINGS ENDPOINTS (FR2, FR5, FR6, FR10)
// ----------------------------------------------------

// GET /api/jobs - Get all jobs with tracks & timeline
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        publishedChannels: true,
        timelineEvents: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Map publishedChannels IDs array for frontend compatibility
    const formattedJobs = jobs.map((job) => ({
      ...job,
      publishedChannels: job.publishedChannels
        .filter((t) => t.status === 'Published')
        .map((t) => t.channelId),
    }))

    res.json(formattedJobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// POST /api/jobs - Create a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      type,
      description,
      experience,
      skills,
      english,
      education,
      note,
      expiryDate,
      status = 'Pending Approval',
      recruiterId = 'usr-1',
      recruiterName = 'Nhật Trần',
    } = req.body

    const today = new Date().toISOString().split('T')[0]
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

    const job = await prisma.job.create({
      data: {
        title,
        departmentName: department || 'IT',
        location,
        type: type || 'Full-time',
        description,
        experience,
        skills,
        english,
        education,
        note,
        expiryDate,
        status,
        recruiterId,
        recruiterName,
        createdDate: today,
        updatedDate: today,
        timelineEvents: {
          create: {
            date: `${today} ${nowTime}`,
            action: status === 'Draft' ? 'Created' : 'Submitted Approval',
            actor: recruiterName,
            note: status === 'Draft' ? 'Khởi tạo bản nháp mới' : 'Gửi đề xuất tuyển dụng mới',
          },
        },
      },
      include: {
        publishedChannels: true,
        timelineEvents: true,
      },
    })

    await createAuditLog(recruiterId, recruiterName, 'Create Job', `Tạo vị trí tuyển dụng mới: "${title}"`)

    res.status(201).json({
      ...job,
      publishedChannels: [],
    })
  } catch (error) {
    console.error('Error creating job:', error)
    res.status(500).json({ error: 'Failed to create job' })
  }
})

// PUT /api/jobs/:id - Update job info
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const today = new Date().toISOString().split('T')[0]
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

    const job = await prisma.job.update({
      where: { id },
      data: {
        ...updates,
        departmentName: updates.department || updates.departmentName,
        updatedDate: today,
        timelineEvents: {
          create: {
            date: `${today} ${nowTime}`,
            action: 'Updated',
            actor: updates.recruiterName || 'HR Recruiter',
            note: 'Chỉnh sửa nội dung thông tin công việc',
          },
        },
      },
      include: {
        publishedChannels: true,
        timelineEvents: { orderBy: { createdAt: 'desc' } },
      },
    })

    await createAuditLog(
      updates.recruiterId || null,
      updates.recruiterName || 'HR Recruiter',
      'Edit Job',
      `Cập nhật thông tin công việc: "${job.title}"`
    )

    res.json({
      ...job,
      publishedChannels: job.publishedChannels.filter((t) => t.status === 'Published').map((t) => t.channelId),
    })
  } catch (error) {
    console.error('Error updating job:', error)
    res.status(500).json({ error: 'Failed to update job' })
  }
})

// PATCH /api/jobs/:id/status - Change Job Status
app.patch('/api/jobs/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status, note, actorName = 'HR System', actorId = 'usr-1' } = req.body
    const today = new Date().toISOString().split('T')[0]
    const nowTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })

    const job = await prisma.job.update({
      where: { id },
      data: {
        status,
        updatedDate: today,
        timelineEvents: {
          create: {
            date: `${today} ${nowTime}`,
            action: status,
            actor: actorName,
            note: note || `Chuyển trạng thái sang ${status}`,
          },
        },
      },
      include: {
        publishedChannels: true,
        timelineEvents: { orderBy: { createdAt: 'desc' } },
      },
    })

    await createAuditLog(actorId, actorName, 'Status Change', `Đổi trạng thái tin "${job.title}" sang ${status}`)

    res.json({
      ...job,
      publishedChannels: job.publishedChannels.filter((t) => t.status === 'Published').map((t) => t.channelId),
    })
  } catch (error) {
    console.error('Error changing job status:', error)
    res.status(500).json({ error: 'Failed to change job status' })
  }
})

// DELETE /api/jobs/:id
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params
    const job = await prisma.job.findUnique({ where: { id } })
    if (job) {
      await prisma.job.delete({ where: { id } })
      await createAuditLog(job.recruiterId, job.recruiterName, 'Delete Job', `Xóa vị trí tuyển dụng: "${job.title}"`)
    }
    res.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    res.status(500).json({ error: 'Failed to delete job' })
  }
})

// ----------------------------------------------------
// 2. CHANNELS & PUBLISH TRACKING ENDPOINTS (FR3, FR4)
// ----------------------------------------------------

app.get('/api/channels', async (req, res) => {
  try {
    const channels = await prisma.channel.findMany({ orderBy: { createdAt: 'asc' } })
    res.json(channels)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch channels' })
  }
})

app.post('/api/channels', async (req, res) => {
  try {
    const { name, category, status = 'Active', actorName = 'Admin', actorId = 'usr-4' } = req.body
    const channel = await prisma.channel.create({
      data: { name, category, status },
    })

    await createAuditLog(actorId, actorName, 'Add Channel', `Thêm kênh tuyển dụng mới: ${name} (${category})`)
    res.status(201).json(channel)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add channel' })
  }
})

app.put('/api/channels/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const channel = await prisma.channel.update({
      where: { id },
      data: updates,
    })

    await createAuditLog(req.body.actorId || null, req.body.actorName || 'Admin', 'Update Channel', `Cập nhật kênh ${channel.name}`)
    res.json(channel)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update channel' })
  }
})

app.delete('/api/channels/:id', async (req, res) => {
  try {
    const { id } = req.params
    const channel = await prisma.channel.findUnique({ where: { id } })
    if (channel) {
      await prisma.channel.delete({ where: { id } })
      await createAuditLog(null, 'Admin', 'Delete Channel', `Xóa kênh tuyển dụng: ${channel.name}`)
    }
    res.json({ message: 'Channel deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete channel' })
  }
})

// Publish Track Matrix Toggle Endpoint (FR4)
app.get('/api/publish-tracks', async (req, res) => {
  try {
    const tracks = await prisma.jobChannelPublishTrack.findMany()
    res.json(tracks)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tracks' })
  }
})

app.post('/api/publish-tracks/toggle', async (req, res) => {
  try {
    const { jobId, channelId, actorName = 'HR System', actorId = 'usr-1' } = req.body
    const existing = await prisma.jobChannelPublishTrack.findUnique({
      where: { jobId_channelId: { jobId, channelId } },
    })

    let newStatus = 'Published'
    let track

    if (existing) {
      newStatus = existing.status === 'Published' ? 'Draft' : 'Published'
      track = await prisma.jobChannelPublishTrack.update({
        where: { id: existing.id },
        data: {
          status: newStatus,
          publishedDate: newStatus === 'Published' ? new Date().toISOString().split('T')[0] : existing.publishedDate,
        },
      })
    } else {
      track = await prisma.jobChannelPublishTrack.create({
        data: {
          jobId,
          channelId,
          status: 'Published',
          publishedDate: new Date().toISOString().split('T')[0],
        },
      })
    }

    const channel = await prisma.channel.findUnique({ where: { id: channelId } })
    await createAuditLog(
      actorId,
      actorName,
      'Publish Track',
      `Cập nhật trạng thái đăng bài kênh ${channel?.name || channelId} thành ${newStatus}`
    )

    res.json(track)
  } catch (error) {
    console.error('Error toggling publish track:', error)
    res.status(500).json({ error: 'Failed to toggle publish track' })
  }
})

// ----------------------------------------------------
// 3. USERS & RBAC ENDPOINTS (FR1, FR12)
// ----------------------------------------------------

app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role, department } = req.body
    const avatar = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()

    const user = await prisma.user.create({
      data: { name, email, role, avatar },
    })

    await createAuditLog(null, 'Admin', 'Create User', `Tạo tài khoản người dùng mới: ${name} (${role})`)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

app.patch('/api/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params
    const { role, actorName = 'Admin' } = req.body

    const user = await prisma.user.update({
      where: { id },
      data: { role },
    })

    await createAuditLog(null, actorName, 'Update Role', `Thay đổi vai trò người dùng ${user.name} thành ${role}`)
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' })
  }
})

// ----------------------------------------------------
// 4. EMAIL LOGS ENDPOINTS (FR9)
// ----------------------------------------------------

app.get('/api/emails', async (req, res) => {
  try {
    const emails = await prisma.emailLog.findMany({ orderBy: { sentAt: 'desc' } })
    res.json(emails)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch emails' })
  }
})

app.post('/api/emails', async (req, res) => {
  try {
    const { jobId, jobTitle, sender, recipient, recipientEmail, topic, content, status = 'Sent', actorId } = req.body

    const email = await prisma.emailLog.create({
      data: {
        jobId,
        jobTitle,
        sender,
        recipient,
        recipientEmail,
        topic,
        content,
        time: 'Vừa xong',
        status,
      },
    })

    await createAuditLog(actorId || null, sender, 'Send Email', `Gửi email cho ứng viên ${recipient} (${recipientEmail}) - Subject: ${topic}`)
    res.status(201).json(email)
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' })
  }
})

// ----------------------------------------------------
// 5. AUDIT LOGS ENDPOINTS (NFR-09)
// ----------------------------------------------------

app.get('/api/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' } })
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' })
  }
})

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`🚀 RCMS Server running on http://localhost:${PORT}`)
})
