# MIT No Code AI and Machine Learning: program book

Private study companion for the MIT Professional Education program
**No Code AI and Machine Learning: Building Data Science Solutions**
(delivered with Great Learning, cohort January 2026 B).

| File | Purpose |
|---|---|
| `book/NoCodeAI_ML_Program_Book.md` | The book, Markdown source with LaTeX math |
| `book/NoCodeAI_ML_Program_Book.html` | Self contained HTML rendering (math rendered with KaTeX, fonts embedded) |
| `book/NoCodeAI_ML_Program_Book.pdf` | Printable PDF, US Letter |
| `book/build.js` | Rebuilds the HTML and PDF from the Markdown |

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
8. Appendices: sources, reading list
