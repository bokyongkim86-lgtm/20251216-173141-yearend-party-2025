import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const places = await prisma.place.findMany({
    include: {
      _count: {
        select: { votes: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Transform to include vote count
  const placesWithVotes = places.map((place) => ({
    id: place.id,
    title: place.title,
    description: place.description,
    createdAt: place.createdAt,
    voteCount: place._count.votes,
  }))

  return NextResponse.json(placesWithVotes)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { title, description } = body

    // Validation
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: '장소명을 입력해주세요.' },
        { status: 400 }
      )
    }

    title = title.trim()

    if (title.length < 1 || title.length > 60) {
      return NextResponse.json(
        { error: '장소명은 1~60자 사이여야 합니다.' },
        { status: 400 }
      )
    }

    if (description) {
      description = description.trim()
      if (description.length > 200) {
        return NextResponse.json(
          { error: '설명은 200자 이내로 입력해주세요.' },
          { status: 400 }
        )
      }
    }

    const place = await prisma.place.create({
      data: {
        title,
        description: description || null,
      },
    })

    return NextResponse.json(place)
  } catch (error) {
    console.error('Error creating place:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
