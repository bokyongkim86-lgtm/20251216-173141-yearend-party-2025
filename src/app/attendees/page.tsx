'use client'

import { useEffect, useState } from 'react'

interface Attendee {
  id: number
  name: string
  status: string
  updatedAt: string
}

export default function AttendeesPage() {
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'attending' | 'not_attending'>(
    'all'
  )

  useEffect(() => {
    setLoading(true)
    const params = filter !== 'all' ? `?filter=${filter}` : ''
    fetch(`/api/attendees${params}`)
      .then((res) => res.json())
      .then((data) => {
        setAttendees(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [filter])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">참석 현황</h1>

      {/* 필터 */}
      <div className="flex gap-2 mb-4">
        {[
          { value: 'all', label: '전체' },
          { value: 'attending', label: '참석' },
          { value: 'not_attending', label: '불참' },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() =>
              setFilter(item.value as 'all' | 'attending' | 'not_attending')
            }
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === item.value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">불러오는 중...</div>
        ) : attendees.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            등록된 참석자가 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    참석 여부
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수정일시
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {attendee.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          attendee.status === 'ATTENDING'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {attendee.status === 'ATTENDING' ? '참석' : '불참'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(attendee.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 요약 */}
      {!loading && attendees.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-right">
          총 {attendees.length}명
        </div>
      )}
    </div>
  )
}
