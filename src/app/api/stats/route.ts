import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const [total, attending, notAttending] = await Promise.all([
    prisma.attendee.count(),
    prisma.attendee.count({ where: { status: 'ATTENDING' } }),
    prisma.attendee.count({ where: { status: 'NOT_ATTENDING' } }),
  ])

  return NextResponse.json({
    total,
    attending,
    notAttending,
  })
}
