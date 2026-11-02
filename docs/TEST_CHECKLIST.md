# Charmistry Co. storefront: quick acceptance tests

Run these tests in Chrome or Edge. For final launch testing, use the HTTPS-hosted public site.

| Test | Steps | Expected result |
| --- | --- | --- |
| Page navigation | Click Shop, Booth Games, Our Story, Find Us | Scrolls to correct section |
| Responsive layout | Open on a phone-sized screen | No sideways horizontal overflow; menu opens and closes |
| Search | Type `ghost` into the search field | Only matching product(s) appear |
| Filters | Click Mystery Pouches then Fuzzy Wire Friends | Matching categories display |
| Sort | Choose Price: low to high | Product prices sort ascending |
| Add to bag | Add a mystery pouch | Bag drawer opens; item count and subtotal update |
| Quantity | Increase and decrease a bag item | Totals update; quantity cannot exceed configured stock |
| Customization | Select a customizable fuzzy wire product | Select character and color; notes appear in bag and slip |
| Out of stock | In local editor, set a test item's stock to 0 and export | Sold-out button is disabled |
| Bag persistence | Add an item; reload storefront in same browser | Bag item stays saved via localStorage |
| Manual checkout | Keep endpoint blank, create a slip | Text explicitly says **NOT SUBMITTED**, can be copied/downloaded/printed |
| Optional endpoint | Configure and submit to a verified Formspree endpoint | Only an actual successful response displays **Request sent** |
| Endpoint failure | Use a nonworking test endpoint | Error appears; bag is not cleared |
| Team editor | Change price, Save, Download catalog.js, replace the file | Updated price appears after refreshing storefront |
| Reset drafts | Click Reset browser drafts in editor | Unsaved local draft is discarded; original loaded files are restored |
| Images | Check cards and page illustrations | All assets load, no broken images |
| Booth location | Click Find directions | Opens a Google Maps search for the school |
| Accessibility | Use Tab / Shift+Tab and Escape in bag and dialogs | Keyboard navigation works and overlays close |

Do not place real orders during testing without coordinating with the team. Confirm school privacy requirements for any test involving student contact information.
