# Image Prompt Assistant Handoff Context

## Project Paths

- Project root: `C:\Users\user\Desktop\codex_project\image-prompt-assistant-chrome-extension`
- Chrome extension folder: `chrome-image-prompt-assistant`
- Required living documents:
  - `final-spec.md`
  - `image-prompt-story.md`

## Standing Rule

Whenever implementation, behavior, wording, UI, build, or configuration changes are made, update both:

- `final-spec.md`
- `image-prompt-story.md`

## Current API And Model Defaults

- Default Prompt API: `https://image-prompt.alluser.site/api/image-prompt`
- Default model: `google/gemma-4-e2b`
- Complex-request model: `google/gemma-4-e4b`
- API key is prefilled for internal distribution.

Complex requests are escalated to `google/gemma-4-e4b` when they involve high quality, multiple outputs, storybook/comic/series workflows, scene plans, consistency notes, or exact in-image text.

## Recent Product Decisions

- Style selector no longer shows `Notion LM 50 스타일 보기`.
- Style selector now shows only the selected style name and a dropdown arrow.
- Style picker keeps 49 preset thumbnail assets and adds a `직접 입력 스타일` custom input. Applying it writes the typed text into the same hidden `style` field sent as `Style:`.
- Result keyword chips are hidden from regular users.
- Prompt explanation is shown in Korean before additional suggestions.
- Insert button label is `자동 입력`.
- Copy button is green and labeled `복사`.
- Quick improvement buttons no longer regenerate immediately.
- Users select one improvement option or type feedback, then click `다시 생성하기`.
- Initial generation button changes to `프롬프트 생성중...` while running.
- Feedback regeneration shows an in-field loading state, then completion state.
- `출력 형식` selector was removed from the UI.
- Former output-format choices are folded into `작업 유형`.
- Runtime derives the internal `formatPreset` from the selected task type with `purposeFormatPreset()`.
- Runtime adds purpose-specific prompt rules with `purposeGuidance()` for cardnews, thumbnails, slides, A4 documents, blog covers, notices, worksheet illustrations, SNS/blog images, and reusable character/background/prop specs.
- Advanced notes are explicitly allowed to refine or override purpose-specific layout rules.
- Korean prompt explanations append `적용된 작업 유형 규칙:` via `purposeGuidanceKo()`.
- Toast messages are visually prominent dark boxes, not small inline blue text.
- Plain OpenAI-compatible text responses use `외부 API의 응답을 프롬프트 본문으로 사용했습니다.`.
- Regeneration feedback is stored in summary and shown in the Korean prompt explanation fallback.
- If the model omits selected output count from the final prompt, normalization appends `Return a numbered prompt pack with exactly N image prompts.`.
- Storybook and comic/webtoon workflows include short dialogue/speech bubbles by default.
- Default dialogue is suppressed when notes request no dialogue, no speech bubbles, minimal text, or no text.
- Runtime panel mount retries up to 20 times if the page shell is not ready or initialization fails; failed hosts are removed before the next retry.
- Target site select is synchronized with detected page site, so Gemini pages show `Gemini용` automatically.
- Gemini insertion uses robust contenteditable injection and delayed verification; ignore unrelated CSP logs from other extensions such as `hobdeid.../insert.css` unless our `[CIPA]` log points there.

## Current UI Wording

- `이미지에 표시할 정확한 문구`
  - Meaning: exact text that should visibly appear inside the generated image, such as a title, speech bubble, cover text, sign, label, or worksheet text.
- `추가 조건`
  - Meaning: additional prompt-generation instructions, not visible image text.
  - Placeholder:
    `예: 배경은 밝은 교실, 텍스트는 최소화, 손가락은 정확하게, 로고/워터마크 제외`
- `참고 자료`
  - Option wording:
    `사용자가 채팅창에 첨부파일로 업로드함`

## Style Thumbnail System

- 49 generated style thumbnails are used.
- Files:
  - `chrome-image-prompt-assistant/assets/style-samples/style-01.webp`
  - through
  - `chrome-image-prompt-assistant/assets/style-samples/style-49.webp`
- Thumbnails are 16:9 and should not use blurred padding.
- Chalkboard style should be a green chalkboard with white chalk lines.
- Old category thumbnail files are not used.
- Users can bypass presets by typing a custom style in the picker header.

## Build And Verification

Use these commands from:

```text
C:\Users\user\Desktop\codex_project\image-prompt-assistant-chrome-extension\chrome-image-prompt-assistant
```

```powershell
node --check src\content-runtime.js
node --check src\background.js
node --check src\options.js
python -m json.tool manifest.json
npm run build:zip
```

Expected build outputs:

- `release/chrome-image-prompt-assistant.zip`

## Last Known Verification

- Test-only `tests` folder and legacy runtime files were removed after passing 47 tests.
- JS syntax checks: passing
- `manifest.json` validation: passing
- `npm run build:zip`: successful

## Suggested First Message In A New Session

```text
위 컨텍스트를 기준으로 이어서 작업하자. 먼저 final-spec.md와 image-prompt-story.md를 읽고 현재 구현 상태를 점검한 다음 진행해줘.
```
