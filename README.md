<<<<<<< HEAD
# Bryan's Cafe: XML project

This project stores the lunch-menu content in XML, checks its structure with an external DTD, and uses XSLT to render browser-compatible HTML. The transformed page loads its own green-and-white CSS, animated GIF and WAV audio. XML by itself does not play media; the XSLT output supplies the HTML image and audio elements.

## Project files

| File | Purpose |
| --- | --- |
| `bryans_cafe.xml` | UTF-8 menu data and references to the DTD and XSLT |
| `bryans_cafe.dtd` | Required elements, child order and constrained dietary/currency attributes |
| `bryans_cafe.xsl` | XSLT 1.0 transformation to browser HTML |
| `bryans_cafe.css` | Responsive green-and-white presentation |
| `food.gif`, `food.wav` | Original animated salad illustration and short cafe chime |
| `generate_assets.js` | Generates both media files using Node.js built-in modules |
| `serve.js` | Serves this folder on loopback port 4174 for local preview |

## Menu and dietary classification

| Dish | Price | DTD dietary value | Reason |
| --- | ---: | --- | --- |
| Beetroot and feta salad | AUD $15.00 | vegetarian | Roasted vegetables, walnuts, dressing and explicitly vegetarian feta; no meat or fish |
| Sourdough Rye Sandwich | AUD $18.00 | contains-chicken | The listed filling includes grilled chicken, so it is not labelled vegetarian |
| Spinach Pie and Salad | AUD $20.00 | vegetarian | Spinach, ricotta and explicitly vegetarian feta in pastry with garden salad |
| Feta pancakes with salad | AUD $19.50 | vegetarian | Egg and buttermilk pancakes with explicitly vegetarian feta and salad; no meat or fish |

The recipe descriptions determine these labels. For a real restaurant menu, confirm ingredients with the kitchen, especially the rennet in feta and pastry fats. The XML DTD limits `dietary` to `vegetarian` or `contains-chicken`; the XSLT turns those values into visible labels.

## XML tree

```text
cafe
|-- brand
|-- tagline
|-- introduction
|-- menu
|   |-- item [id, dietary]
|   |   |-- name
|   |   |-- price [currency]
|   |   `-- description
|   `-- item (repeated for all four dishes)
|-- media
|   |-- image [src, alt, width, height]
|   `-- audio [src, type, title]
`-- footer
    `-- copyright
```

Elements hold the structured content; attributes qualify it with compact values such as an item's unique `id`, dietary status, currency or media path. XML reserves `&` and `<`, so write those characters as `&amp;` and `&lt;` in text. This document uses the numeric character reference `&#233;` for the accented e in Cafe. The external DTD defines the document hierarchy, requires one or more menu items and required accessibility/media attributes, and restricts dietary/currency values. It cannot verify that prices, recipes or file paths are factually correct.

## Methodology and standards

Development proceeds from content structure to DTD constraints, then to the XSLT presentation and CSS, followed by validation and browser checks. The XML remains the single source for names, descriptions, prices and dietary values; the XSLT loops over menu items to avoid duplicating content. Visual or content changes should be followed by DTD validation and a browser retest.

Tools used are Visual Studio Code, Node.js (built-in modules only) for the original GIF/WAV generator and local server, Windows PowerShell/.NET `XmlReader` for external DTD validation, and Chromium in the VS Code browser for the available preview. Edge and Firefox are recommended for the second-browser assessment.

The design uses a forest-green masthead, white menu area, green vegetarian markers, a distinct chicken marker, two-column desktop dishes and one-column narrow layouts. Font sizes use fixed values with breakpoints. CSS includes visible keyboard focus and a `prefers-reduced-motion` rule; contrast and keyboard behavior still need manual assessment before claiming accessibility conformance.

Applicable references to discuss are XML 1.0 Fifth Edition (W3C), XSLT 1.0 (W3C), the HTML Living Standard (WHATWG), CSS specifications and WCAG 2.2 (W3C). In Australia, the Copyright Act 1968 (Cth) is relevant to original or properly licensed media, and the Disability Discrimination Act 1992 (Cth) is relevant to accessible services. This static menu collects no personal information; reassess the Privacy Act 1988 (Cth) if forms, analytics or accounts are added. These references are not a claim of legal compliance; cite current official texts using the course's required referencing style.

## Generate, validate and preview

Open the `XML_Assignment` folder in VS Code. In **Terminal > New Terminal**, run these commands from `Bryans_Cafe`:

```powershell
node .\generate_assets.js
node .\serve.js
```

The preview server is local to this computer. Open `http://127.0.0.1:4174/bryans_cafe.xml`. Stop the server with Ctrl+C. This separate port keeps it distinct from the Luca preview server.

Validate the XML and DTD from the `Bryans_Cafe` terminal with Windows PowerShell/.NET:

```powershell
$settings = [System.Xml.XmlReaderSettings]::new()
$settings.DtdProcessing = [System.Xml.DtdProcessing]::Parse
$settings.ValidationType = [System.Xml.ValidationType]::DTD
$settings.XmlResolver = [System.Xml.XmlUrlResolver]::new()
$reader = [System.Xml.XmlReader]::Create((Resolve-Path .\bryans_cafe.xml), $settings)
try { while ($reader.Read()) {} ; 'XML is well-formed and valid against bryans_cafe.dtd.' }
finally { $reader.Dispose() }
```

An alternative, if installed, is `xmllint --noout --valid bryans_cafe.xml`. A browser render is not a substitute for DTD validation. Chromium may warn about external-DTD MIME handling or deprecation of XSLT processing instructions; record the browser/version and independently validate the XML as above.

## Testing and evidence

Record the date, browser/device/version, viewport, expected result, observed result and any correction. Do not mark a check as passed before running it.

| Test | Expected result | Result to record |
| --- | --- | --- |
| XML + external DTD | No well-formedness or DTD validity errors | Passed 2026-11-15 with Windows PowerShell/.NET `XmlReader` DTD validation |
| Dietary labels | Three vegetarian dishes and one chicken dish have correct labels | Passed preview check: 3 Vegetarian labels, 1 Contains chicken; recipe ingredients are stated in XML |
| Assets | GIF animates; WAV loads and plays after user presses play | Passed local preview: GIF has 6 decoded frames and distinct rendered frames; WAV decoded to 3.2 seconds and playback advanced |
| Content | Four descriptions and AUD $15.00, $18.00, $20.00, $19.50 display | Passed preview check; all four names, descriptions and prices were present |
| Desktop browser 1 | Clear layout, no missing files or horizontal overflow | VS Code embedded Chromium 148; no horizontal overflow at 885 CSS pixels; DTD MIME warning noted below |
| Desktop browser 2 | Same content, labels and audio controls work | Browser/version and result: __________ |
| Desktop device | Readable layout at desktop width | Browser emulation at 885 CSS pixels: two-column menu, no overflow |
| Mobile device | One-column dishes, no horizontal scroll, usable controls | Browser emulation reported 360 and 305 CSS pixels: one column and no overflow; physical phone not tested |
| Accessibility | Keyboard focus visible, image alternative meaningful, reduced motion respected | Findings/corrections: __________ |
| Offline | Local content, GIF and WAV work with network disconnected; web fonts may fall back | Result/corrections: __________ |

Test Edge and a second browser such as Firefox, then a phone and tablet. If physical devices are unavailable, record browser device-emulation dimensions and say that these are emulated tests, not physical-device tests. Test the audio with an explicit play action; autoplay is intentionally disabled.

For hosting, publish the entire `Bryans_Cafe` folder to a course-approved static host that serves XML, XSLT, CSS, GIF and WAV with correct relative paths and MIME types. Test the hosted XML URL in both browsers and at a phone-sized viewport. Confirm the host permits the XSLT processing instruction; if it does not, use an approved transformation/build step while retaining the validated XML and DTD.

Capture screenshots of: VS Code Explorer with all files; XML declaration and DTD/XSL references; DTD dietary enumeration; actual validator output; desktop menu with all prices and labels; mobile layout; GIF in motion (screen recording is stronger evidence); audio controls during playback; and, if hosted, the URL and rendered page. Keep measured results and corrections in the table above.

**Observed browser note (2026-11-15).** Embedded Chromium rendered the XSLT page and media but logged an external-DTD MIME warning and an XSLT-processing-instruction deprecation warning. The XML validity result above comes from the independent .NET validator, not from the browser. Confirm behavior in the assessment browsers and target host; if XSLT processing is unavailable, use a course-approved transformation/build step while retaining these XML and DTD source files.
=======
https://kritikawosti7.github.io/Bryans-cafe/
>>>>>>> 03d267cd6d725ea19b47f1bb84f3231a70dffbb1
