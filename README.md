# Chrome Image Prompt Assistant

ChatGPT와 Gemini 화면 오른쪽에 이미지 생성 프롬프트 작성 패널을 추가하는 Chrome 확장프로그램입니다. 용도, 스타일, 비율, 이미지 안 문구, 장면 구성, 일관성 조건을 선택하면 이미지 생성에 바로 쓸 수 있는 영어 프롬프트를 만들어 현재 입력창에 넣어줍니다.

기본 프롬프트 생성은 외부 API, 로컬 LLM, 별도 계정, 서버 설정 없이 확장 프로그램 내부에서 동작합니다. 고급 사용자는 선택적으로 직접 관리하는 Prompt API를 연결할 수 있습니다.

## 바로 다운로드

검증된 배포 ZIP 파일은 아래 링크에서 받을 수 있습니다.
현재 배포 ZIP은 `0.1.1` 버전이며, 패널 상단에 `by HooniKim` 서명이 표시됩니다.

[chrome-image-prompt-assistant.zip 다운로드](https://github.com/HooniKims/image_prompt_gen/raw/main/release/chrome-image-prompt-assistant.zip)

## 주요 기능

- ChatGPT와 Gemini 페이지 자동 감지
- 페이지 오른쪽에 Shadow DOM 기반 프롬프트 작성 패널 표시
- 패널 상단에 `by HooniKim` 서명 표시
- 이미지 용도, 스타일, 비율, 품질, 이미지 안 문구 입력 지원
- 스토리북, 만화/웹툰, 여러 장 시리즈, 학생/학부모 안내 등 작업 유형 지원
- 생성 장수, 장면/컷 구성, 캐릭터/배경 일관성 조건 입력 지원
- 최근 작업, 즐겨찾기, 작업 카드 저장
- Chrome Manifest V3 기반 확장프로그램
- 기본 내부 템플릿 생성기로 외부 API 없이 프롬프트 생성
- 선택형 고급 설정으로 사용자 지정 Prompt API 연결
- 스타일 썸네일 WebP 49개 포함

## ZIP 파일로 설치하기

1. 위의 `chrome-image-prompt-assistant.zip 다운로드` 링크를 눌러 ZIP 파일을 받습니다.
2. ZIP 파일의 압축을 풉니다.
3. Chrome 주소창에 `chrome://extensions`를 입력해 확장 프로그램 관리 화면을 엽니다.
4. 오른쪽 위의 `개발자 모드`를 켭니다.
5. `압축해제된 확장 프로그램을 로드` 버튼을 누릅니다.
6. 2번에서 압축을 푼 폴더를 선택합니다.
7. 확장 목록에 `Chrome Image Prompt Assistant`가 표시되면 설치가 완료된 것입니다.

## 소스 코드로 설치하기

1. 이 저장소를 내려받습니다.

```bash
git clone https://github.com/HooniKims/image_prompt_gen.git
```

2. Chrome 주소창에서 `chrome://extensions`를 엽니다.
3. 오른쪽 위의 `개발자 모드`를 켭니다.
4. `압축해제된 확장 프로그램을 로드`를 누릅니다.
5. 저장소 안의 `chrome-image-prompt-assistant` 폴더를 선택합니다.

## 사용 방법

1. ChatGPT 또는 Gemini 페이지를 엽니다.
2. 화면 오른쪽에 표시되는 이미지 프롬프트 패널을 엽니다.
3. 만들고 싶은 이미지 설명을 입력합니다.
4. 용도, 스타일, 비율, 품질, 이미지 안 문구 등 필요한 옵션을 선택합니다.
5. `프롬프트 만들기`를 눌러 프롬프트를 만듭니다.
6. 생성된 프롬프트를 확인한 뒤 현재 ChatGPT/Gemini 입력창에 삽입합니다.
7. 필요한 경우 최근 작업이나 즐겨찾기에서 이전 프롬프트를 다시 불러옵니다.

## 지원 사이트

- `https://chatgpt.com/*`
- `https://chat.openai.com/*`
- `https://gemini.google.com/*`

## 배포 ZIP 만들기

개발자가 로컬에서 ZIP 배포 파일을 다시 만들 때는 아래 명령을 사용합니다.

```bash
cd chrome-image-prompt-assistant
npm test
npm run install:playwright
npm run test:e2e
npm run build:zip
```

생성된 파일은 `release/chrome-image-prompt-assistant.zip`에 저장됩니다.

## API 연결

확장프로그램은 기본적으로 외부 API를 호출하지 않습니다. 프롬프트 생성 버튼은 브라우저 안의 내부 템플릿 생성기로 바로 동작합니다.

고급 사용자가 설정에서 `사용자 지정 Prompt API 사용`을 직접 켠 경우에만 `https://image-prompt.alluser.site/api/image-prompt` 같은 HTTPS API 주소로 프롬프트 생성 요청을 보냅니다. 이 기능은 기본적으로 꺼져 있으며, API 키도 미리 포함하지 않습니다.

## 개인정보 원칙

- 사용자 프롬프트와 작업 카드는 브라우저의 `chrome.storage.local`에 저장됩니다.
- 기본 프롬프트 생성 기능은 사용자의 입력을 외부 서버로 전송하지 않습니다.
- 생성 이미지는 확장프로그램이 저장하지 않습니다.
- ChatGPT/Gemini 대화 전체를 자동으로 읽지 않습니다.
- 참고 파일은 자동 업로드하지 않고, 사용자가 직접 업로드하도록 안내합니다.
- 사용자가 고급 설정에서 사용자 지정 Prompt API를 직접 켠 경우에만 입력한 주제와 선택 옵션이 설정된 API 주소로 전송됩니다.
