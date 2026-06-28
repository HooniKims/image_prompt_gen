# Chrome Image Prompt Assistant Privacy Policy

Last updated: June 28, 2026

Chrome Image Prompt Assistant is a Chrome extension that helps users create, copy, and insert image-generation prompts on ChatGPT and Gemini.

## Data Collected and Stored

The extension may store the following data locally in the user's browser with `chrome.storage.local`:

- Image ideas entered by the user
- Prompt options such as purpose, style, aspect ratio, quality level, output count, and in-image text
- Generated prompts
- Favorite prompts and recent prompt history
- Panel settings and advanced settings

The extension does not collect generated image files, uploaded files, full ChatGPT or Gemini conversations, account passwords, payment information, contact lists, or browsing history outside the supported ChatGPT and Gemini pages.

The extension does not collect data for advertising tracking, user profiling, or sale to third parties.

## Data Transmission

The default prompt-generation feature runs inside the extension and does not send user input to an external server.

Only when the user manually enables "Use custom Prompt API" in advanced settings, the prompt-generation request entered by the user is sent to the HTTPS API endpoint configured by the user.

The optional default API endpoint is:

`https://image-prompt.alluser.site/api/image-prompt`

This endpoint is called only when the user manually enables the advanced custom Prompt API setting.

The extension does not download or execute remote JavaScript.

## Permissions

The extension uses the following permissions:

- `storage`: Saves recent work, favorites, panel settings, and advanced settings in the user's browser.
- `https://chatgpt.com/*`, `https://chat.openai.com/*`, `https://gemini.google.com/*`: Shows the prompt-writing panel on ChatGPT and Gemini pages and, when the user chooses, inserts the generated prompt into the current input box.
- `https://image-prompt.alluser.site/*`: Optional permission requested only when the user enables the custom Prompt API feature in advanced settings.

## Third-Party Sharing

Chrome Image Prompt Assistant does not sell personal information and does not share user data with advertising networks or data brokers.

If the user manually enables an optional custom Prompt API, that API provider may process the transmitted prompt-generation request according to its own policy.

## Data Deletion

Users can delete locally stored Chrome Image Prompt Assistant data from Chrome extension settings or remove the extension to clear locally stored data.

Users can also delete recent prompt history and favorite prompts inside the extension.

## Contact

For privacy questions, contact the developer through the GitHub repository issues page:

`https://github.com/HooniKims/image_prompt_gen/issues`
