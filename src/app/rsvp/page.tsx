'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RSVPPage() {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'ATTENDING' | 'NOT_ATTENDING' | ''>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!name.trim()) {
      setMessage({ type: 'error', text: '이름을 입력해주세요.' })
      return
    }

    if (!status) {
      setMessage({ type: 'error', text: '참석 여부를 선택해주세요.' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/attendees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), status }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || '오류가 발생했습니다.' })
      } else {
        setMessage({
          type: 'success',
          text: `${name}님의 참석 여부가 등록되었습니다!`,
        })
        setName('')
        setStatus('')
      }
    } catch {
      setMessage({ type: 'error', text: '서버 연결에 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">참석 여부 등록</h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 입력 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              maxLength={30}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* 참석 여부 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              참석 여부 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setStatus('ATTENDING')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                  status === 'ATTENDING'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                참석
              </button>
              <button
                type="button"
                onClick={() => setStatus('NOT_ATTENDING')}
                className={`py-3 px-4 rounded-lg border-2 font-medium transition ${
                  status === 'NOT_ATTENDING'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                불참
              </button>
            </div>
          </div>

          {/* 메시지 */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.text}
              {message.type === 'success' && (
                <Link
                  href="/attendees"
                  className="block mt-2 text-sm underline hover:no-underline"
                >
                  현황 보기 →
                </Link>
              )}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition"
          >
            {loading ? '등록 중...' : '등록하기'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-500 text-center">
          이미 등록한 경우, 같은 이름으로 다시 등록하면 업데이트됩니다.
        </p>
      </div>
    </div>
  )
}
