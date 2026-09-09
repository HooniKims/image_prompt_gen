# 이미지 모델 및 공식 가이드

확인일: 2026-09-09. 확장 버전: 0.1.2.

## 확인한 모델

| 모델 | 공식 API ID | 용도 |
| --- | --- | --- |
| GPT Image 2.5 Sunburst | `gpt-image-2.5-sunburst` | 정밀 편집과 높은 품질이 필요한 작업 |
| GPT Image 2.5 Flare | `gpt-image-2.5-flare` | 속도가 중요한 일상 이미지 생성 |
| Nano Banana 2 | `gemini-3.1-flash-image` | 범용 생성, 여러 참조 이미지와 일관성 |
| Nano Banana Pro | `gemini-3-pro-image` | 복잡한 구성과 정교한 제어 |
| Nano Banana 2 Lite | `gemini-3.1-flash-lite-image` | 속도·비용 우선. 다중 참조와 연속 편집에는 비권장 |

Google은 기존 `gemini-2.5-flash-image`를 이전 세대 모델로 분류합니다.

공식 출처:

- [Sunburst 모델 문서](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)
- [Flare 모델 문서](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare)
- [OpenAI 이미지 생성](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI 이미지 프롬프팅](https://developers.openai.com/api/docs/guides/image-prompting)
- [Gemini 이미지 생성 및 프롬프팅](https://ai.google.dev/gemini-api/docs/image-generation)

## 확장에 반영한 내용

- ChatGPT용 프롬프트 작성: 구도와 정보 위계, 편집 대상과 유지할 요소를 문장으로 구분합니다.
- Gemini용 프롬프트 작성: 피사체와 배경의 관계를 자연스러운 문장으로 설명하고, 장면별 프롬프트에 공통 캐릭터·소품 정보를 반복합니다.
- 공통: 정확한 문구, 읽기 쉬운 배치, 참조 이미지의 역할을 명시합니다.
- 확장은 이미지 프롬프트를 작성하는 도구입니다. 단일 요청은 프롬프트 텍스트, 다중 요청은 번호별 프롬프트 묶음을 작성하도록 합니다. 이미지를 직접 생성하라는 지시로 바꾸지 않습니다.
- 다시 생성할 때 이전 프롬프트와 수정 요청을 전달합니다.
- 같은 가이드를 내부 템플릿과 OpenAI-compatible 요청에 적용합니다. 사용자 지정 서버에는 `imageGuidance` 필드로 전달하며, 실제 사용 여부는 서버 구현에 달려 있습니다.

## 적용 범위

위 이름은 공식 API 모델 목록입니다. ChatGPT/Gemini 웹앱의 계정별 제공 모델을 확인한 목록은 아닙니다. 확장은 모델을 직접 호출하거나 전환하지 않습니다. 비율·품질은 자연어 요청이며 API 설정값을 강제하지 않습니다. 고급 설정의 모델명은 프롬프트 작성 서버용 텍스트 모델이므로 위 이미지 모델 ID로 바꾸지 마세요.

가이드 반영이 생성 이미지의 품질이나 정확한 장수·글자를 보장하지는 않습니다. 실제 이미지는 웹앱에서 생성 후 확인해야 합니다.
