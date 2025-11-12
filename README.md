# Personal Portfolio

Responsive personal portfolio website showcasing professional background, featured work, and contact details. Built as a single-page site with smooth navigation and a mobile-first layout. Explore more of my work on GitHub at [`@Ritesh7365`](https://github.com/Ritesh7365).

## Features
- Sticky navigation with animated mobile menu for quick section jumps.
- Hero, About, Services, Portfolio, and Contact sections tailored for creative professionals.
- Tabbed About section that toggles skills, experience, and education.
- Portfolio gallery with hover overlays linking to external project pages.
- Contact area with social links, downloadable CV, and Google Apps Script-powered form submission that routes messages to me.

## Tech Stack
- HTML5 for semantic structure.
- CSS3 for styling, animations, and responsive layout.
- Font Awesome for icons.
- Vanilla JavaScript for tab switching, menu toggling, and form submission.

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/Ritesh7365/Personal_portfolio.git
   cd Personal_portfolio
   ```
2. Open `index.html` directly in a browser **or** start a lightweight server for better cross-origin support:
   ```bash
   # Python 3
   python -m http.server 8000

   # or Node.js (requires http-server)
   npx http-server .
   ```
3. Visit `http://localhost:8000` (or the URL shown in your terminal).

## Project Structure
```
Personal_portfolio/
├── index.html         # Main single-page application
├── style.css          # Global styles and responsive rules
└── assets/            # Images, CV, and static media
```

## Customization
- Update personal details, services, and project information inside `index.html`.
- Replace imagery in `assets/` with your own (`logo.jpg`, `background.jpg`, etc.).
- Adjust colors, typography, and layout in `style.css` to match your branding.
- Update the Google Apps Script endpoint near the bottom of `index.html` if you change form handling.

## Deployment
- **GitHub Pages:** push to `main`, then enable Pages in your repository settings targeting the root folder.
- **Netlify/Vercel:** drag-and-drop the project folder or connect the repository for automatic deployments.

## License
This project is currently unlicensed. Add a license file if you intend to share or reuse it publicly.

## Submit a Form to Google Sheets

[Demo](https://form-to-google-sheets.surge.sh)

How to collect form submissions in Google Sheets using vanilla JavaScript, Fetch, FormData, and Google Apps Script. These steps mirror the embedded contact form near the bottom of `index.html`, ensuring inquiries reach me via [`@Ritesh7365`](https://github.com/Ritesh7365).

### 1. Create a new Google Sheet
- Go to [Google Sheets](https://docs.google.com/spreadsheets) and start a new spreadsheet using the Blank template.
- Rename it to something like `Email Subscribers`.
- Add the following headers to the first row:

|   |     A     |   B   | C | ... |
|---|:---------:|:-----:|:-:|:---:|
| 1 | timestamp | email |   |     |

> See [Section 7](#7-adding-additional-form-data) for adding more input fields.

### 2. Create a Google Apps Script
- Click `Extensions > Apps Script` (formerly `Tools > Script editor`); a new tab opens.
- Rename the project `Submit Form to Google Sheets` and wait for the new name to save.
- Delete the placeholder `function myFunction() {}` and paste this script into `Code.gs`:

```js
var sheetName = 'Sheet1'
var scriptProp = PropertiesService.getScriptProperties()

function initialSetup () {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  scriptProp.setProperty('key', activeSpreadsheet.getId())
}

function doPost (e) {
  var lock = LockService.getScriptLock()
  lock.tryLock(10000)

  try {
    var doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
    var sheet = doc.getSheetByName(sheetName)
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var nextRow = sheet.getLastRow() + 1

    var newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header]
    })

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', row: nextRow }))
      .setMimeType(ContentService.MimeType.JSON)
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err }))
      .setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}
```


### 3. Run the setup function
- Choose `Run > Run function > initialSetup`.
- Review the authorization prompt and click `Allow`.

### 4. Add a project trigger
- Open `Triggers` (`Apps Script` left sidebar or `Edit > Current project's triggers`).
- Click `Add Trigger`, select `doPost`, set event source to `From spreadsheet`, event type `On form submit`, then `Save`.

### 5. Deploy the web app
- Click `Deploy > New deployment`.
- Choose `Web app`, set a description (e.g., `initial version`), and set `Execute as` to yourself.
- Set `Who has access` to `Anyone`.
- Click `Deploy` and copy the `Web app URL`.

> Custom G Suite domains might require redeploying. The final URL should resemble `https://script.google.com/macros/s/XXXX.../exec`.

### 6. Add the web app URL to the form
Replace the placeholder URL near the bottom of `index.html` with your web app URL:

```html
<form name="submit-to-google-sheet">
  <input name="email" type="email" placeholder="Email" required>
  <button type="submit">Send</button>
</form>

<script>
  const scriptURL = 'https://script.google.com/macros/s/XXXX/exec'
  const form = document.forms['submit-to-google-sheet']

  form.addEventListener('submit', e => {
    e.preventDefault()
    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => console.log('Success!', response))
      .catch(error => console.error('Error!', error.message))
  })
</script>
```

This script sends a `POST` request via Fetch using `FormData`. For wider browser support, consider polyfills (next section).

### 7. Adding additional form data
- Add new input fields with `name` attributes, e.g.:

```html
<input name="firstName" type="text" placeholder="First Name">
<input name="lastName" type="text" placeholder="Last Name">
```

- Add matching column headers in Google Sheets:

|   |     A     |   B   |     C     |     D    | ... |
|---|:---------:|:-----:|:---------:|:--------:|:---:|
| 1 | timestamp | email | firstName | lastName |     |

### 8. Related polyfills
- [Promise Polyfill](https://github.com/taylorhakes/promise-polyfill)
- [Fetch Polyfill](https://github.com/github/fetch)
- [FormData Polyfill](https://github.com/jimmywarting/FormData)

You can load them via [wzrd.in](https://wzrd.in/):

```html
<script src="https://wzrd.in/standalone/formdata-polyfill"></script>
<script src="https://wzrd.in/standalone/promise-polyfill@latest"></script>
<script src="https://wzrd.in/standalone/whatwg-fetch@latest"></script>
```

Ensure these polyfills load before the main submission script.

### References
- [Google Apps Script](https://developers.google.com/apps-script/)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)
- [HTML `<form>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [Document.forms](https://developer.mozilla.org/en-US/docs/Web/API/Document/forms)
- [Sending forms through JavaScript](https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript)

---

Have feedback or a collaboration idea? Reach out through the contact form or connect with me directly on GitHub: [`Ritesh7365`](https://github.com/Ritesh7365).

