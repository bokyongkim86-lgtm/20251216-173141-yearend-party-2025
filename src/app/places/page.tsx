'use client'

import { useEffect, useState } from 'react'

interface Place {
  id: number
  title: string
  description: string | null
  voteCount: number
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)

  // 장소 추천 폼
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [addMessage, setAddMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  // 투표 폼
  const [voterName, setVoterName] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null)
  const [voteLoading, setVoteLoading] = useState(false)
  const [voteMessage, setVoteMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const fetchPlaces = () => {
    fetch('/api/places')
      .then((res) => res.json())
      .then((data) => {
        setPlaces(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  const maxVotes = Math.max(...places.map((p) => p.voteCount), 0)

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddMessage(null)

    if (!newTitle.trim()) {
      setAddMessage({ type: 'error', text: '장소명을 입력해주세요.' })
      return
    }

    setAddLoading(true)

    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setAddMessage({
          type: 'error',
          text: data.error || '오류가 발생했습니다.',
        })
      } else {
        setAddMessage({ type: 'success', text: '장소가 추가되었습니다!' })
        setNewTitle('')
        setNewDescription('')
        fetchPlaces()
      }
    } catch {
      setAddMessage({ type: 'error', text: '서버 연결에 실패했습니다.' })
    } finally {
      setAddLoading(false)
    }
  }

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault()
    setVoteMessage(null)

    if (!voterName.trim()) {
      setVoteMessage({ type: 'error', text: '이름을 입력해주세요.' })
      return
    }

    if (!selectedPlace) {
      setVoteMessage({ type: 'error', text: '장소를 선택해주세요.' })
      return
    }

    setVoteLoading(true)

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voterName: voterName.trim(),
          placeId: selectedPlace,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setVoteMessage({
          type: 'error',
          text: data.error || '오류가 발생했습니다.',
        })
      } else {
        setVoteMessage({ type: 'success', text: '투표가 완료되었습니다!' })
        setSelectedPlace(null)
        fetchPlaces()
      }
    } catch {
      setVoteMessage({ type: 'error', text: '서버 연결에 실패했습니다.' })
    } finally {
      setVoteLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">장소 추천 & 투표</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 장소 추천 폼 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            장소 추천하기
          </h2>
          <form onSubmit={handleAddPlace} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                장소명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예: 강남역 고기집"
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                설명 (선택)
              </label>
              <input
                type="text"
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="간단한 설명이나 위치"
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>

            {addMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  addMessage.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {addMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={addLoading}
              className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium rounded-lg transition"
            >
              {addLoading ? '추가 중...' : '장소 추천하기'}
            </button>
          </form>
        </div>

        {/* 투표 폼 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">투표하기</h2>
          <form onSubmit={handleVote} className="space-y-4">
            <div>
              <label
                htmlFor="voterName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="voterName"
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                placeholder="투표자 이름"
                maxLength={30}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                장소 선택 <span className="text-red-500">*</span>
              </label>
              {places.length === 0 ? (
                <p className="text-sm text-gray-500">
                  아직 추천된 장소가 없습니다.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => setSelectedPlace(place.id)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition ${
                        selectedPlace === place.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-800">
                        {place.title}
                      </div>
                      {place.description && (
                        <div className="text-sm text-gray-500">
                          {place.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {voteMessage && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  voteMessage.type === 'success'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {voteMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={voteLoading || places.length === 0}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition"
            >
              {voteLoading ? '투표 중...' : '투표하기'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              1인 1표입니다. 이미 투표한 경우 다른 장소로 변경됩니다.
            </p>
          </form>
        </div>
      </div>

      {/* 장소 목록 및 투표 현황 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">투표 현황</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">불러오는 중...</div>
        ) : places.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 추천된 장소가 없습니다. 위에서 장소를 추천해주세요!
          </div>
        ) : (
          <div className="space-y-3">
            {places
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((place) => (
                <div
                  key={place.id}
                  className={`p-4 rounded-lg border-2 ${
                    place.voteCount > 0 && place.voteCount === maxVotes
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-800">
                        {place.title}
                      </span>
                      {place.voteCount > 0 && place.voteCount === maxVotes && (
                        <span className="ml-2 text-xs bg-yellow-400 text-yellow-800 px-2 py-0.5 rounded-full">
                          1위
                        </span>
                      )}
                    </div>
                    <span className="text-lg font-bold text-indigo-600">
                      {place.voteCount}표
                    </span>
                  </div>
                  {place.description && (
                    <p className="text-sm text-gray-500">{place.description}</p>
                  )}
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                      style={{
                        width:
                          maxVotes > 0
                            ? `${(place.voteCount / maxVotes) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
