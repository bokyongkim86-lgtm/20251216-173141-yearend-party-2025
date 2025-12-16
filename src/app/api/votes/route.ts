import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const votes = await prisma.vote.findMany({
    include: {
      place: true,
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json(votes)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { voterName, placeId } = body

    // Validation
    if (!voterName || typeof voterName !== 'string') {
      return NextResponse.json(
        { error: '이름을 입력해주세요.' },
        { status: 400 }
      )
    }

    voterName = voterName.trim()

    if (voterName.length < 1 || voterName.length > 30) {
      return NextResponse.json(
        { error: '이름은 1~30자 사이여야 합니다.' },
        { status: 400 }
      )
    }

    if (!placeId || typeof placeId !== 'number') {
      return NextResponse.json(
        { error: '장소를 선택해주세요.' },
        { status: 400 }
      )
    }

    // Check if place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    })

    if (!place) {
      return NextResponse.json(
        { error: '존재하지 않는 장소입니다.' },
        { status: 400 }
      )
    }

    // Upsert: update vote if already voted, create if not
    const vote = await prisma.vote.upsert({
      where: { voterName },
      update: { placeId },
      create: { voterName, placeId },
    })

    return NextResponse.json(vote)
  } catch (error) {
    console.error('Error creating/updating vote:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
