# MIT No Code AI and Machine Learning: program book

Private study companion for the MIT Professional Education program
**No Code AI and Machine Learning: Building Data Science Solutions**
(delivered with Great Learning, cohort January 2026 B).

Second edition (September 2026): merges the learner's Google Drive archive (official schedule, brochure,
lecture handouts, mentor decks, personal notes, transcripts and the three project submissions).
Everything added or corrected in the second edition is rendered in green.

| File | Purpose |
|---|---|
| `book/NoCodeAI_ML_Program_Book.md` | The book, Markdown source with LaTeX math |
| `book/NoCodeAI_ML_Program_Book.html` | Self contained HTML rendering (math rendered with KaTeX, fonts embedded) |
| `book/NoCodeAI_ML_Program_Book.pdf` | Printable PDF, US Letter |
| `book/build.js` | Rebuilds the HTML and PDF from the Markdown |

In the Markdown, a block between a line `:::added` and a line `:::` is rendered as a green
second edition block; inline additions use `<span class="added">...</span>`.

## Rebuild

```bash
npm install marked@12 katex@0.16.11 playwright
node book/build.js
```

Playwright needs a Chromium build; `npx playwright install chromium` fetches one if none is configured.

## Contents of the book

1. The program at a glance: institution, cohort, people, tools, grading, faculty
2. Cohort timeline, December 2025 to July 2026, with confirmed and inferred dates
3. The curriculum module by module, with the mathematics under each technique
4. Tools reference: RapidMiner AI Studio 2025.1, KNIME, Teachable Machine, Ikigai, generative tools
5. Projects and portfolio
6. Formula sheet and glossary
7. Self test questions and a thirty day revision plan
8. Appendices: sources, reading list, and the discrepancies between the learner's own files
