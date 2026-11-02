# Receiving online order requests (optional)

By default, checkout **does not send an order anywhere**. It creates an order slip to give to the booth team. There is no credit-card, GCash, Maya or other payment processing.

## Option A — Manual order slips (recommended for the school pop-up)

Keep `orderEndpoint: ''` in `js/settings.js`.

1. Customer adds products and optional customization.
2. Customer clicks **Prepare order request** and enters a name and preferred contact method.
3. Customer gets an **ORDER SLIP (NOT SUBMITTED)**, which they can download, copy or print.
4. Customer shows/sends it to the booth team by an already-agreed school channel.
5. Staff confirms actual stock, fulfillment timeline, final price and payment in person.

There is **no automatic reservation**. Items in the browser bag do not reduce the team's inventory.

## Option B — Send requests to an authorized Formspree account

1. Authorized staff open `https://formspree.io/` and create a form with an approved team email.
2. Complete account/email verification and review the form's rules, limits and privacy terms.
3. Copy the unique **form endpoint** in the format `https://formspree.io/f/EXAMPLE` (use your real address).
4. Open `team-editor.html` → **Site settings** → paste it in **Order submission endpoint**.
5. Save settings → download `settings.js` → replace `js/settings.js`.
6. Host and test your website on HTTPS. Submit a test order and verify that it reaches the correct account inbox/dashboard.
7. Test a failed submission too: browser retains the shopping bag and displays an error; it does not falsely mark the request as received.
8. Assign a staff member to monitor requests, confirm each order, and notify users of pickup/payment arrangements.

An HTTP 2xx response from the form provider indicates **request submission only**, not seller acceptance, stock locking, payment or production completion. Formspree quotas, email notifications, spam checks, and provider availability are outside this website.

## Optional email-based handoff

If your authorized team has a dedicated email address, set **Contact email** in Site settings. Prepared order slips show an **Email this request** link, which opens the customer's installed/default email app with a prefilled message. The customer must still press Send. This cannot guarantee email delivery.

## Privacy / safety reminders

- Confirm your school's rules before collecting student contact details, particularly if students are minors.
- Do not collect payment credentials, passwords, IDs, home addresses, dates of birth, or other unnecessary personal data.
- Limit access to order forms and delete request information when it is no longer needed.
- Never place secret API keys or passwords in public JavaScript.
