# Chrome Image Prompt Assistant

ChatGPT와 Gemini 웹페이지 오른쪽에 주입되는 이미지 프롬프트 작성 패널입니다. 사용자는 용도, 스타일, 비율, 이미지 안 문구를 고르고, hosted Prompt API로 만든 프롬프트를 현재 입력창에 삽입할 수 있습니다.

## 현재 구현 범위

- Manifest V3 Chrome 확장
- ChatGPT/Gemini URL 자동 감지
- 감지된 사이트에 맞춘 대상 자동 선택
- Shadow DOM 기반 in-page 사이드 패널
- 새로고침 직후 페이지 shell이 늦게 준비되어도 패널 mount 재시도
- 대표 작업 + 더보기 작업 유형
- 스토리북, 만화/웹툰, 여러 장 시리즈, 학생/학부모 안내 워크플로우
- 작업 유형 기반 출력 형식 자동 결정
- 작업 유형별 세부 프롬프트 규칙 자동 반영
- 고급 옵션의 추가 조건으로 작업 유형별 기본 규칙 보완/덮어쓰기
- 프롬프트 한글 설명에 적용된 작업 유형 규칙 표시
- 생성 장수, 장면/컷 구성, 캐릭터/배경 일관성 조건 입력
- 스토리북/만화·웹툰 기본 짧은 대사/말풍선 지시
- 2장 이상 생성 요청에서 최종 프롬프트의 생성 장수 조건 보강
- 다시 생성하기 수정 요청을 한글 설명 fallback에 반영
- 스타일 프리셋 49개와 직접 입력 스타일 지원
- 쉬운 한국어 입력 UI와 영어 중심 최종 프롬프트
- 이미지 안 한국어 문구 원문 보존 지시
- Mac mini 단일 엔드포인트 호출
- API 장애 시 연결 실패 표시, 실패 결과 저장 방지
- ChatGPT/Gemini 입력창 삽입, 기존 내용 덮어쓰기/이어붙이기/취소
- Gemini contenteditable 입력창 자동 삽입 보강
- Chrome local storage 기반 작업 카드, 버전, 즐겨찾기, 최근 작업 불러오기/삭제
- 최근 작업 100개 제한
- ChatGPT Image 2.0 / Gemini Nano Banana 프롬프트 가이드 반영
- 숨겨진 관리자 설정: API 주소, API 키, 모델명
- ZIP 배포 스크립트

## 레퍼런스 관리

모델별 이미지 생성 가이드의 핵심 규칙은 현재 런타임 코드에 내장되어 있습니다.

- OpenAI Academy: Creating images with ChatGPT
- Google DeepMind: Gemini Image / Nano Banana prompt guide

실제 런타임 반영 위치는 `src/content-runtime.js`입니다. 이미지 생성 가이드, 작업 유형별 규칙, OpenAI-compatible 요청 구성, fallback 프롬프트가 현재 실행 경로 안에 함께 들어 있습니다. 정상 생성 버튼은 API 응답이 있을 때만 성공 처리하고, API 실패 시 fallback 결과를 성공처럼 저장하지 않습니다.

## 설치

1. Chrome에서 `chrome://extensions`를 엽니다.
2. 오른쪽 위 `개발자 모드`를 켭니다.
3. `압축해제된 확장 프로그램 로드`를 누릅니다.
4. 이 폴더 `projects/chrome-image-prompt-assistant`를 선택합니다.
5. ChatGPT 또는 Gemini 페이지를 열고 오른쪽 패널을 사용합니다.

## 개발 명령

```bash
npm run build:zip
```

`npm run build:zip`은 프로젝트 루트의 `release/chrome-image-prompt-assistant.zip`을 만듭니다.

## 쉬운 권장 구조

문외한 사용자에게는 크롬 확장이 LM Studio를 직접 호출하게 하지 않는 편이 좋습니다. 권장 구조는 아래처럼 중간 API 서버를 하나 두는 방식입니다.

```text
Chrome 확장 프로그램
  -> https://image-prompt.alluser.site/api/image-prompt
  -> Mac mini LM Studio /v1/chat/completions
```

이 구조의 장점은 명확합니다.

- 사용자는 확장 프로그램만 설치하면 됩니다.
- LM Studio 내부 주소와 모델 설정을 사용자에게 설명하지 않아도 됩니다.
- 민감한 서버 설정은 중간 API 서버에만 둡니다.
- 다른 웹서비스도 같은 `/api/image-prompt` 주소를 호출해 재사용할 수 있습니다.

## Hosted API 운영 참고

이 저장소의 현재 확장 프로그램 폴더에는 Prompt API 서버 소스가 포함되어 있지 않습니다. 확장은 기본적으로 이미 운영 중인 hosted Prompt API(`https://image-prompt.alluser.site/api/image-prompt`)를 호출합니다.

내부 배포판은 기본 API 키를 설정값으로 미리 채워 둡니다. 사용자가 숨겨진 설정에서 직접 저장한 API 키가 있으면 그 값을 우선 사용합니다.

Nginx Proxy Manager에서는 기존 LM Studio proxy host를 고치지 않고, 새 Proxy Host를 하나 만드는 방식을 추천합니다.

- 도메인: `image-prompt.alluser.site`
- Forward Hostname/IP: 중간 API 서버가 실행 중인 서버 IP
- Forward Port: `8787`
- SSL: Let's Encrypt
- Websockets: 필요 없음

## 확장 프로그램 API 요청 구조

기본 API 주소는 `https://image-prompt.alluser.site/api/image-prompt`입니다. 숨겨진 설정에서 변경할 수 있습니다.

확장은 기본적으로 아래 구조를 중간 API 서버로 보냅니다.

```json
{
  "action": "generate",
  "requestId": "req_xxx",
  "targetSite": "chatgpt",
  "sourceText": "초등학생용 물의 순환 설명 그림",
  "options": {
    "purpose": "education",
    "style": "수채화",
    "ratio": "16:9",
    "quality": "balanced",
    "inImageText": "물이 여행해요",
    "formatPreset": "auto",
    "outputCount": 4,
    "scenePlan": "1장: 구름에서 출발\n2장: 강으로 이동",
    "consistencyNotes": "작은 파란 물방울 캐릭터를 모든 장면에 유지"
  }
}
```

hosted Prompt API는 이 요청을 LM Studio OpenAI-compatible API 형식으로 바꿔서 호출하고, 확장이 쓰기 쉬운 응답으로 정리해 돌려줍니다.

```json
{
  "ok": true,
  "prompt": "Create a bright classroom illustration...",
  "summary": {},
  "suggestions": [],
  "metadata": {
    "source": "lm_studio",
    "proxy": "chrome-image-prompt-assistant-api"
  }
}
```

확장 프로그램은 사용자 브라우저에서 LM Studio 주소를 직접 호출하지 않습니다. 모든 일반 사용자는 기본 hosted Prompt API에 자동 연결되고, Mac mini와 LM Studio 연결은 중간 API 서버가 관리합니다.

중간 API 서버는 확장이 전달한 모델 라우팅 정보를 기준으로 LM Studio 모델을 선택합니다. 일반 요청은 `google/gemma-4-e2b`를 기본으로 쓰고, 고품질/여러 장/스토리북/웹툰/시리즈/장면 구성/일관성 조건/이미지 안 문구가 있는 요청은 `google/gemma-4-e4b`로 승격합니다.

응답 모양이 틀리거나 서버가 연결되지 않으면 확장은 API 연결 실패를 표시하고, 실패한 결과를 최근 작업에 저장하지 않습니다.

## Nginx/CORS 참고

현재 확장프로그램은 content script에서 직접 외부 API를 호출하지 않고 background service worker를 통해 hosted Prompt API를 호출합니다. 서버가 Origin을 엄격히 제한하면 Chrome extension origin도 허용해야 실제 확장에서 호출됩니다.

예: `chrome-extension://<확장프로그램 ID>`

확장 ID는 Chrome 개발자 모드에서 로드한 뒤 확인할 수 있습니다. 일반 웹앱에서 쓰는 `alluser.site`, `netlify.app`, `vercel.app`, `localhost` 허용만으로는 확장프로그램 호출이 차단될 수 있습니다.

## 개인정보 원칙

- 사용자 프롬프트와 작업 카드는 브라우저 `chrome.storage.local`에만 저장합니다.
- 생성 이미지는 저장하지 않습니다.
- ChatGPT/Gemini 대화 전체를 자동으로 읽지 않습니다.
- 참고 파일은 자동 업로드하지 않고 사용자가 직접 업로드하도록 안내합니다.
- Mac mini API는 프롬프트 전문 저장 없이 집계 메트릭 중심으로 운영하는 전제입니다.
