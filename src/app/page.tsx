'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Stats {
  total: number
  attending: number
  notAttending: number
}

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      {/* 행사 정보 */}
      <div className="text-center py-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">호스팅플랫폼팀 2025 송년회</h1>
        <p className="text-xl opacity-90">2025년 12월 18일(목) 19:00</p>
      </div>

      {/* 참석 현황 요약 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">참석 현황</h2>
        {loading ? (
          <div className="text-center py-4 text-gray-500">불러오는 중...</div>
        ) : stats ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-sm text-gray-600 mt-1">등록 인원</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {stats.attending}
              </div>
              <div className="text-sm text-gray-600 mt-1">참석</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">
                {stats.notAttending}
              </div>
              <div className="text-sm text-gray-600 mt-1">불참</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            데이터를 불러올 수 없습니다.
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/rsvp"
          className="flex items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-indigo-200"
        >
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800">참석 여부 등록</div>
            <div className="text-sm text-gray-500">참석/불참을 등록하세요</div>
          </div>
        </Link>

        <Link
          href="/places"
          className="flex items-center justify-center gap-3 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-transparent hover:border-purple-200"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800">장소 추천/투표</div>
            <div className="text-sm text-gray-500">
              장소를 추천하고 투표하세요
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
