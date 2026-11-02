# Charmistry Co. — Halloween E-Commerce Website

**Where Cuteness Meets Spookiness** 🎃

A ready-to-open, responsive storefront made with **HTML, CSS, vanilla JavaScript, and original SVG illustrations**. No npm installation, database, API key, or build step is needed to preview it.

## START HERE

1. **Extract** the entire ZIP (do not open the HTML while it is still inside the ZIP).
2. Double-click **`index.html`** to open the storefront in Chrome or Edge.
3. Double-click **`team-editor.html`** to visually edit products, activities, stock, prices, and site settings.
4. In the editor, click **Save draft**, then **Download catalog.js** or **Download settings.js**.
5. Replace the matching file in the **`js/`** folder with the downloaded file. Reopen or refresh `index.html` to check your published edits.

> **Critical before launch:** All included prices, stock quantities, and product variants are **placeholder examples**, not verified Charmistry Co. offerings. Confirm and update them, and set `demoMode` to `false` only when ready.

## WHAT WORKS

- Halloween-themed, mobile-friendly storefront.
- Six editable example products: two mystery pouches and four fuzzy wire charm sets.
- Search, category filters, featured sorting and price sorting.
- Stock indicator, disabled purchase buttons when stock is zero.
- Customize a fuzzy wire character (inspiration, color, optional notes).
- Persistent shopping bag using **browser localStorage**; add, remove and change quantity.
- Stock-aware total quantity across different versions of the same item.
- Editable booth games, FAQs, business story, location and quality promise.
- Responsive menu and accessible keyboard interactions.
- Manual checkout generates a **downloadable, copyable and printable order-request slip**.
- Optional live order-request submission through a configured **Formspree** HTTPS endpoint.
- Optional email link for prepared order requests when a real team contact email is configured.
- A visual, locally run team catalog editor (not a live online administration service).

## IMPORTANT: WHAT DOES NOT HAPPEN AUTOMATICALLY

**This is not a payment-processing website.** It does not take credit cards, e-wallet payments, or issue confirmed paid orders. There is no private user account system or seller dashboard/database. With `orderEndpoint` blank, *order slips are NOT delivered to the business*. Users must share them with the team directly. With a working Formspree endpoint, a successful HTTP response means the request was submitted to that service; the seller still has to confirm stock, pricing, payment, and pickup.

For a fully deployed commercial store with live multi-device inventory, secure payments, order management and admin login, you would need a real backend or hosted e-commerce platform.

## EVERYDAY TEAM EDITING (NO CODING)

Use **`team-editor.html`** to update:

- **Products:** name, price in Philippine pesos, stock, category, description, badge, image path, sorting position, and customization option.
- **Booth games:** game name, rules intro, tagline, category label, and illustration.
- **Site settings:** announcement, business name, address, landmark, contact links, demo warning, optional order-submission endpoint.

**Workflow:** Open the editor → select a product/game → make changes → click **Save** → download replacement file → put it in `js/` → refresh the storefront. The editor also saves a *local draft in that browser*, but browser drafts **do not update public files or other teammates' copies**. Share the edited JS files through your normal team file-sharing process, and choose one release owner to avoid overwrites.

For text in the page that is *not* in the editor (such as FAQs, hero headline, and quality promise), edit `index.html` with a text editor such as VS Code. To change colors, edit the `:root` variables at the top of `css/styles.css`.

## IMAGES

The design includes **original concept SVG illustrations**, not real product photographs. You are welcome to replace them with authorized actual product photos:

1. Put a file such as `my-new-charm.jpg` inside `assets/images/`.
2. Update that product's **Image path** in the team editor to `assets/images/my-new-charm.jpg`.
3. Save and download `catalog.js`, replace the old file, and refresh.

Prefer optimized WebP/JPEG/PNG, ideally square or landscape. Use your own or licensed photos, not unrelated stock images that misrepresent the products.

## DEPLOYMENT

Host the public site on any static hosting service (e.g. your school's approved host, GitHub Pages, Netlify or Cloudflare Pages). Upload:

- `index.html`
- `css/styles.css`, `css/responsive.css`
- `js/settings.js`, `js/catalog.js`, `js/store.js`, `js/app.js`
- the full `assets/images/` folder

**DO NOT deploy the local team editor** (`team-editor.html`, `css/editor.css`, `js/team-editor.js`) or internal documents. This editor has no user authentication and cannot securely manage a live production storefront.

The Google Fonts stylesheet requires internet access for Poppins and Fredoka. If offline, the browser uses a readable fallback font.

## ORDER REQUESTS

**Default:** Users can prepare a slip, download it as `.txt`, copy it, or print it. They must manually share it with your team. The order subtotal is only an estimate.

**Optional real request collection:** Create a Formspree form account controlled by an authorized adult/team leader, copy its `https://formspree.io/f/...` endpoint into `orderEndpoint` in the editor, download the updated `settings.js`, and upload it. Then test submissions and notifications end-to-end before telling customers this feature is live. This supports sending an order *request*, not collecting payments. See `docs/ORDER_SETUP.md`.

Only collect contact details you actually need, and follow school policies and applicable privacy requirements when serving students. There is no analytics or tracking code bundled in this website.

## FOLDER GUIDE

```text
charmistry-co/
├── index.html                  Main storefront
├── team-editor.html            LOCAL visual editor (keep private)
├── README.md                   This guide
├── css/
│   ├── styles.css              Colors, typography, layout, components
│   ├── responsive.css          Tablet / phone styles
│   └── editor.css              Local team editor styles
├── js/
│   ├── settings.js             EDITABLE site settings
│   ├── catalog.js              EDITABLE products and games
│   ├── store.js                Shopping bag / stock limits
│   ├── app.js                  Shopping interactions / request forms
│   └── team-editor.js           Local editor only
├── assets/images/              Original SVG illustrations
└── docs/
    ├── TEAM_GUIDE.md            Roles, approval, deployment checklist
    ├── ORDER_SETUP.md           Optional request receiving
    └── TEST_CHECKLIST.md        Smoke tests before launch
```

Created for Charmistry Co.'s proposed school-booth experience at **Taguig National High School, beside the “I Love TNHS” signage**. This is a website prototype and starter storefront: publish only confirmed information.
