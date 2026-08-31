# FE-07 quick setup

These are the files changed/added for FE-07 in the existing StreamAI repo.

## 1. Copy the files

Copy this folder's contents into the root of your existing `Stream-Ai-chat` project, preserving the folder structure.

## 2. Install the one new dependency

From the project root:

```bash
npm install
```

This installs Zod, which is used by the server-side tool schema.

## 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## 4. Test success

Send:

`Analyze this website: https://example.com`

You should see the tool lifecycle and then a structured Website Analysis card.

## 5. Test failure

Send:

`Analyze this website: https://example.invalid`

You should see the designed red `Website analysis failed` card.

## 6. Deploy

Commit and push the changes to GitHub. Vercel should rebuild automatically if the repository is already connected.

## 7. Assignment evidence

For your FE-07 submission, demonstrate:

- `lib/tools/analyzeWebsite.ts` as the typed server-side tool definition.
- `input-streaming` state.
- `input-available` state showing the URL.
- `output-available` state as the Website Analysis card.
- `output-error` state using `example.invalid`.
- README tool contract.
- Production/Preview URL after deployment.
