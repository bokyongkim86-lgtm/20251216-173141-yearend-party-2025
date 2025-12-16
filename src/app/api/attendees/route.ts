import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter')

  let where = {}
  if (filter === 'attending') {
    where = { status: 'ATTENDING' }
  } else if (filter === 'not_attending') {
    where = { status: 'NOT_ATTENDING' }
  }

  const attendees = await prisma.attendee.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(attendees)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { name, status } = body

    // Validation
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: '이름을 입력해주세요.' },
        { status: 400 }
      )
    }

    name = name.trim()

    if (name.length < 1 || name.length > 30) {
      return NextResponse.json(
        { error: '이름은 1~30자 사이여야 합니다.' },
        { status: 400 }
      )
    }

    if (!status || !['ATTENDING', 'NOT_ATTENDING'].includes(status)) {
      return NextResponse.json(
        { error: '참석 여부를 선택해주세요.' },
        { status: 400 }
      )
    }

    // Upsert: update if exists, create if not
    const attendee = await prisma.attendee.upsert({
      where: { name },
      update: { status },
      create: { name, status },
    })

    return NextResponse.json(attendee)
  } catch (error) {
    console.error('Error creating/updating attendee:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
