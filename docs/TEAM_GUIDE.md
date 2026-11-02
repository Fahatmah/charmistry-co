# Team handoff: who edits what?

Use **one release owner**. Team members can propose changes via their local editor, but somebody must approve and publish the final files. The built-in editor is not a synced collaboration database.

| Role | Recommended responsibilities |
| --- | --- |
| Product lead | Verify actual mystery pouch contents, safe materials, available fuzzy wire options, prices and stock. |
| Creative/editor | Update descriptions, photos, badges, game text, brand copy. |
| Booth operations | Confirm quality checks, location, game rules, staffing and pickup process. |
| Release owner | Combine approved edits, back up the previous files, deploy and perform smoke tests. |

## Product changes

1. Open `team-editor.html` locally.
2. In **Products**, select an item or click **+ Add**.
3. Enter its verified price, stock and descriptive fields; make sure the **ID** is unique and stays stable once customers have used the product.
4. Put real photographs in `assets/images/` if available, and set the correct filename in the product editor.
5. Click **Save product draft** and **Download catalog.js**.
6. Replace `js/catalog.js` (keep a backup) and reload `index.html`.
7. Check product sorting, filtering, bag totals and the customization form.

## Site content changes

- Settings panel → Download `settings.js`: announcement, location, social/contact links, Formspree form endpoint and demo warning.
- Products and Games panel → Download `catalog.js`: products and activities.
- `index.html`: promotional headline, about-us copy, FAQ, quality promise.
- `css/styles.css`: main colors (`--bg`, `--orange`, `--purple`, `--red`) and design styling.
- `css/responsive.css`: mobile layout; check 390px and 768px widths after changing it.
- `assets/images/`: customizable SVG illustrations and any real photos.

## Launch gate

- [ ] Replace sample prices with approved final prices.
- [ ] Replace sample quantities with verified inventory.
- [ ] Confirm all images are authorized and do not misrepresent the products.
- [ ] Confirm school permission, location, event dates/hours and booth instructions.
- [ ] Check game safety, rules, equipment and staff assignments.
- [ ] Set `demoMode: false` **only after** the public catalog is accurate.
- [ ] Choose manual order slips or configure and test an authorized Formspree endpoint.
- [ ] Verify that no confidential contact data or password is included in the code.
- [ ] Don't deploy `team-editor.html` or its editor CSS/JS.
- [ ] Test desktop, mobile, cart, customizations, stock and actual order receiving.

## Inventory limitation

Stock quantities here are **static values** in `catalog.js` and only prevent individual browsers from exceeding the displayed quantity. Multiple visitors can request the same stock. It is not a live centralized inventory system and cannot prevent overselling. Staff must verify remaining inventory before accepting an order.
