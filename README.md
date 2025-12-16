# 호스팅플랫폼팀 2025 송년회

사내 송년회 참석 등록 및 장소 추천/투표 웹 서비스

## 행사 정보

- **행사명**: 호스팅플랫폼팀 2025 송년회
- **일시**: 2025년 12월 18일(목) 19:00 (고정)

## 기능

- 참석 여부 등록 (이름 기준 upsert)
- 참석 현황 조회 (필터: 전체/참석/불참)
- 장소 추천 등록
- 장소 투표 (1인 1표, 변경 가능)

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma + SQLite

## 프로젝트 구조

```
├── prisma/
│   └── schema.prisma       # DB 스키마
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── attendees/  # 참석자 API
│   │   │   ├── places/     # 장소 API
│   │   │   ├── votes/      # 투표 API
│   │   │   └── stats/      # 통계 API
│   │   ├── rsvp/           # 참석 등록 페이지
│   │   ├── attendees/      # 참석 현황 페이지
│   │   ├── places/         # 장소 투표 페이지
│   │   ├── layout.tsx
│   │   ├── page.tsx        # 메인 페이지
│   │   └── globals.css
│   ├── components/
│   │   └── Navigation.tsx
│   └── lib/
│       └── prisma.ts       # Prisma 클라이언트
├── .env
├── package.json
└── README.md
```

## 데이터 모델

### Attendee (참석자)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Int | PK, 자동증가 |
| name | String | 이름 (unique) |
| status | String | ATTENDING / NOT_ATTENDING |
| updatedAt | DateTime | 수정일시 |

### Place (장소)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Int | PK, 자동증가 |
| title | String | 장소명 |
| description | String? | 설명 (선택) |
| createdAt | DateTime | 생성일시 |

### Vote (투표)
| 필드 | 타입 | 설명 |
|------|------|------|
| id | Int | PK, 자동증가 |
| voterName | String | 투표자 이름 (unique) |
| placeId | Int | FK → Place |
| updatedAt | DateTime | 수정일시 |

## 실행 방법

### 로컬 실행

```bash
# 1. 의존성 설치
npm install

# 2. DB 초기화 및 마이그레이션
npx prisma db push

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 테스트 시나리오

### 1. 참석 등록
1. `/rsvp` 페이지 접속
2. 이름 입력: "홍길동"
3. 참석 선택 후 등록
4. 성공 메시지 확인
5. "현황 보기" 클릭하여 목록에서 확인

### 2. 참석 정보 수정
1. `/rsvp` 페이지에서 같은 이름 "홍길동" 입력
2. 불참 선택 후 등록
3. `/attendees`에서 상태가 "불참"으로 변경됨 확인

### 3. 장소 추천
1. `/places` 페이지 접속
2. 장소명: "강남역 고기집", 설명: "역삼동 맛집" 입력
3. "장소 추천하기" 클릭
4. 목록에 추가됨 확인

### 4. 투표
1. `/places` 페이지에서 이름 입력: "홍길동"
2. 장소 선택 후 "투표하기"
3. 해당 장소 득표수 증가 확인

### 5. 투표 변경
1. 같은 이름 "홍길동"으로 다른 장소 선택
2. 투표하기 클릭
3. 기존 장소 득표수 감소, 새 장소 득표수 증가 확인

## API 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | /api/attendees | 참석자 목록 (filter 파라미터 지원) |
| POST | /api/attendees | 참석 등록/수정 |
| GET | /api/places | 장소 목록 (득표수 포함) |
| POST | /api/places | 장소 추천 |
| POST | /api/votes | 투표 |
| GET | /api/stats | 참석 통계 |

## 환경 변수

```env
DATABASE_URL="file:./dev.db"
```

## 라이선스

Internal Use Only - 호스팅플랫폼팀
