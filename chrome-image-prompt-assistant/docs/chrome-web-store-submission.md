# Chrome Web Store 재심사 입력 문구

## 이번 수정 요약

거부 사유였던 `Prompt generation` 기능 재현 문제와 업데이트 후 추가 권한 승인 문제를 함께 정리했습니다.

`프롬프트 만들기` 버튼은 이제 외부 API, 로컬 LLM, 별도 서버 설정 없이 확장 프로그램 내부 템플릿 생성기로 즉시 결과를 만듭니다. `https://image-prompt.alluser.site/*`는 필수 `host_permissions`에서 제거했고, 사용자가 고급 설정에서 직접 켠 경우에만 쓰는 선택형 `optional_host_permissions`로 이동했습니다.

스타일 썸네일 WebP 49개는 ZIP에 포함되며, 런타임에서는 `chrome.runtime.getURL(...)`로 확장 프로그램 내부 URL을 만들어 표시합니다.

## 심사자에게 전달할 메모

```text
The previously rejected "Prompt generation" flow has been updated.

The main "프롬프트 만들기" button now generates an image prompt locally inside the extension without requiring an external API, local LLM, account, or server configuration. Reviewers can reproduce the feature immediately after installing the extension by opening ChatGPT or Gemini, entering an image idea, and clicking "프롬프트 만들기".

The optional custom Prompt API setting remains available only as an advanced user setting. It is disabled by default and is not required for the listed prompt generation feature. The API host is no longer a required host permission.
```

## 한국어 짧은 설명

```text
입력한 아이디어, 이미지 용도, 비율, 스타일 옵션을 바탕으로 ChatGPT와 Gemini에서 사용할 수 있는 이미지 생성용 영어 프롬프트를 작성해 주는 확장 프로그램입니다. 생성된 프롬프트는 현재 입력창에 자동 삽입하거나 복사할 수 있습니다.
```

## 영어 짧은 설명

```text
Create image-generation prompts for ChatGPT and Gemini from your idea, purpose, style, ratio, and quality options. Copy the generated prompt or insert it into the current input box.
```

## 한국어 상세 설명

```text
Chrome Image Prompt Assistant는 ChatGPT와 Gemini에서 이미지 생성 프롬프트를 빠르게 작성하도록 도와주는 확장 프로그램입니다.

사용자는 만들고 싶은 이미지의 아이디어를 한국어로 입력하고, 이미지 용도, 스타일, 비율, 품질, 생성 장수, 이미지 안에 들어갈 문구 등을 선택할 수 있습니다. 확장 프로그램은 이 정보를 바탕으로 이미지 생성에 바로 사용할 수 있는 영어 프롬프트를 작성합니다.

기본 프롬프트 생성 기능은 별도 계정, 외부 API, 로컬 LLM, 서버 설정 없이 확장 프로그램 내부에서 동작합니다. 생성된 프롬프트는 복사하거나 ChatGPT/Gemini 입력창에 자동으로 삽입할 수 있습니다.

고급 사용자는 별도 설정을 통해 자신이 직접 관리하는 Prompt API를 연결할 수 있습니다. 이 고급 기능은 기본적으로 꺼져 있으며, 기본 프롬프트 생성 기능을 사용하는 데 필요하지 않습니다.
```

## 영어 상세 설명

```text
Chrome Image Prompt Assistant helps users write image-generation prompts for ChatGPT and Gemini.

Users can enter an image idea, choose the purpose, style, aspect ratio, quality level, output count, and exact text that should appear inside the image. The extension then creates a structured English prompt that can be copied or inserted into the current ChatGPT or Gemini input box.

The default prompt generation feature works locally inside the extension. It does not require an external API, local LLM, account, or server setup. This makes the listed prompt generation feature available immediately after installation.

Advanced users can optionally connect a custom Prompt API that they manage themselves. This setting is disabled by default and is not required for the extension's core prompt generation feature.
```

## 단일 목적 설명

```text
이 확장 프로그램의 단일 목적은 ChatGPT와 Gemini 입력창에서 사용할 이미지 생성용 프롬프트를 작성하고, 생성된 프롬프트를 복사하거나 현재 입력창에 삽입하는 것입니다.
```

## 권한 설명

### storage

```text
사용자가 생성한 최근 프롬프트 작업, 즐겨찾기, 패널 설정, 고급 설정 값을 Chrome 로컬 저장소에 저장하기 위해 사용합니다.
```

### chatgpt.com / chat.openai.com / gemini.google.com

```text
ChatGPT와 Gemini 웹페이지에 프롬프트 작성 패널을 표시하고, 사용자가 생성한 프롬프트를 현재 입력창에 삽입하기 위해 사용합니다.
```

### image-prompt.alluser.site

```text
선택형 고급 기능인 사용자 지정 Prompt API 연결을 위해 선택 권한으로만 사용합니다. 이 기능은 기본적으로 꺼져 있으며, 기본 프롬프트 생성 기능은 이 권한 없이도 확장 프로그램 내부에서 동작합니다.
```

## 개인정보 처리 설명

```text
기본 프롬프트 생성 기능은 브라우저 내부에서 동작하며 사용자의 입력을 외부 서버로 전송하지 않습니다. 사용자가 입력한 아이디어와 최근 작업 기록은 Chrome 로컬 저장소에 저장됩니다. 확장 프로그램은 생성 이미지를 저장하지 않고, ChatGPT 또는 Gemini의 전체 대화 내용을 자동으로 수집하지 않습니다.

사용자가 고급 설정에서 사용자 지정 Prompt API를 직접 켠 경우에만 프롬프트 생성 요청이 설정된 API 주소로 전송됩니다.
```

## 원격 코드 관련 설명

```text
This extension does not load or execute remote JavaScript. All extension logic is packaged inside the submitted extension files. The optional custom Prompt API feature sends data to an HTTPS endpoint only when the user enables it; it does not download or execute remote code.
```

## 재현 절차

```text
1. Install the extension.
2. Open https://chatgpt.com/ or https://gemini.google.com/.
3. Open the extension side panel on the right side of the page.
4. Enter an image idea such as "elementary science water cycle diagram".
5. Click "프롬프트 만들기".
6. Confirm that an English image-generation prompt appears.
7. Click "복사" or "자동 입력" to copy or insert the generated prompt.
8. Open the style picker and confirm that style thumbnail images are visible.
```

## 심사 전 확인 사항

- `manifest.json`, `package.json`, `src/content-runtime.js`의 버전은 모두 `0.1.1`입니다.
- 필수 `host_permissions`에는 ChatGPT/Gemini 도메인만 있습니다.
- `https://image-prompt.alluser.site/*`는 `optional_host_permissions`에만 있습니다.
- 기본 프롬프트 생성은 외부 API 없이 동작합니다.
- ZIP 안에 `assets/style-samples/style-01.webp`부터 `style-49.webp`까지 포함됩니다.
- 원격 JavaScript를 로드하지 않습니다.
