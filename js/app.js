;(function () {
	'use strict'
	const S = window.CHARMISTRY_SETTINGS || {}
	const P = Array.isArray(window.CHARMISTRY_PRODUCTS) ? window.CHARMISTRY_PRODUCTS : []
	const A = Array.isArray(window.CHARMISTRY_ACTIVITIES) ? window.CHARMISTRY_ACTIVITIES : []
	const Cart = window.CharmistryStore
	const $ = (sel, ctx = document) => ctx.querySelector(sel)
	const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel))
	const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
	const money = (n) => `${S.currencySymbol || '₱'}${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
	const productById = (id) => P.find((p) => p.id === id)
	const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
	const refreshIcons = (root = document) => window.lucide?.createIcons({ root, attrs: { 'stroke-width': 2 } })
	let filter = 'all',
		term = '',
		sort = 'featured',
		selectedCustomId = '',
		currentOrderText = '',
		lastFocused = null,
		activeModal = null,
		toastTimer = null

	function toast(msg) {
		const el = $('#toast')
		el.textContent = msg
		el.classList.add('show')
		clearTimeout(toastTimer)
		toastTimer = setTimeout(() => el.classList.remove('show'), 2900)
	}
	function setupContent() {
		document.title = `${S.businessName || 'Charmistry Co.'} | ${S.tagline || 'Where Cuteness Meets Spookiness'}`
		if (S.businessName && S.businessName !== 'Charmistry Co.') $$('.brand-type').forEach((el) => (el.textContent = S.businessName))
		$('#footer-tagline').textContent = (S.tagline || 'Where Cuteness Meets Spookiness') + '.'
		$('#footer-address').textContent = S.locationAddress || 'Taguig National High School, Taguig City'
		$('#footer-landmark').textContent = S.locationLandmark || ''
		$('#announcement-text').textContent = S.announcement || 'Handmade magic, Halloween edition'
		$('#year').textContent = String(new Date().getFullYear())
		$('#location-address').textContent = S.locationAddress || 'Taguig National High School, Taguig City'
		$('#location-landmark').textContent = S.locationLandmark || ''
		if (S.mapsUrl && /^https:\/\//.test(S.mapsUrl)) $('#maps-link').href = S.mapsUrl
		if (S.demoMode) $('#demo-notice').hidden = false
		const social = $('#social-links')
		for (const [key, label] of [
			['facebookUrl', 'Facebook'],
			['instagramUrl', 'Instagram'],
		]) {
			const url = S[key]
			if (typeof url === 'string' && /^https:\/\//.test(url)) {
				const a = document.createElement('a')
				a.href = url
				a.target = '_blank'
				a.rel = 'noopener noreferrer'
				a.textContent = label
				social.append(a)
			}
		}
		if (S.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.contactEmail)) {
			const a = document.createElement('a')
			a.textContent = 'Email us'
			a.href = `mailto:${S.contactEmail}`
			social.append(a)
		}
		if (S.orderEndpoint) {
			$('#checkout-submit').innerHTML = 'Send order request <i data-lucide="arrow-right"></i>'
			refreshIcons($('#checkout-submit'))
		}
	}
	function renderProducts() {
		let visible = P.filter((p) => filter === 'all' || p.category === filter).filter((p) => `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(term))
		if (sort === 'price-asc') visible.sort((a, b) => a.price - b.price)
		else if (sort === 'price-desc') visible.sort((a, b) => b.price - a.price)
		else if (sort === 'name') visible.sort((a, b) => a.name.localeCompare(b.name))
		else visible.sort((a, b) => (a.featured || 999) - (b.featured || 999))
		$('#product-empty').hidden = visible.length > 0
		$('#product-grid').innerHTML = visible
			.map((p) => {
				const out = (Number(p.stock) || 0) <= 0
				return `<article class="product-card ${out ? 'product-sold-out' : ''}">
      <div class="product-image-wrap ${esc(p.color || 'purple')}"><span class="product-badge">${out ? 'SOLD OUT' : esc(p.badge || 'HANDMADE')}</span><img src="${esc(p.image)}" alt="Illustration of ${esc(p.name)}" loading="lazy" width="430" height="350"></div>
      <div class="product-info"><div class="product-category">${p.category === 'mystery' || p.category === 'second product' ? '<i data-lucide="sparkles"></i> Mystery pouch' : '<i data-lucide="sparkles"></i> Fuzzy wire character'}</div>
        <div class="product-title-row"><h3>${esc(p.name)}</h3><span class="product-price">${money(p.price)}</span></div><p class="product-desc">${esc(p.description)}</p>
        <div class="product-stock">${out ? 'Currently unavailable' : p.customizable ? '<i data-lucide="palette"></i> Your character, your colors' : '<i data-lucide="gift"></i> A surprise inside every pouch'}</div>
        <div class="product-action"><button class="button ${out ? 'button-outline' : 'button-primary'}" type="button" data-add="${esc(p.id)}" ${out ? 'disabled' : ''}>${out ? 'Out of stock' : p.customizable ? 'Customize yours' : 'Add to my bag'} <span aria-hidden="true">${p.customizable ? '<i data-lucide="sparkles"></i>' : '<i data-lucide="arrow-up-right"></i>'}</span></button></div>
      </div></article>`
			})
			.join('')
		refreshIcons($('#product-grid'))
	}
	function renderGames() {
		$('#games-grid').innerHTML = A.map(
			(g) =>
				`<article class="game-card ${esc(g.color || 'purple')}"><img src="${esc(g.image)}" alt="Illustration of ${esc(g.name)}" loading="lazy" width="300" height="240"><div class="game-card-body"><div class="game-type"><i data-lucide="sparkles"></i> ${esc(g.type || 'BOOTH GAME')}</div><h3>${esc(g.name)}</h3><strong>${esc(g.tagline || '')}</strong><p>${esc(g.description || '')}</p></div></article>`,
		).join('')
		refreshIcons($('#games-grid'))
	}
	function renderCart() {
		$('#cart-count').textContent = Cart.count()
		$('#cart-subtotal').textContent = money(Cart.total())
		$('#checkout-open').disabled = Cart.count() === 0
		const items = Cart.get()
		$('#cart-items').innerHTML = items.length
			? items
					.map((it) => {
						const p = productById(it.id)
						if (!p) return ''
						const key = esc(Cart.key(it))
						const meta = it.custom ? `${it.custom.character} · ${it.custom.color}${it.custom.notes ? ' · ' + it.custom.notes : ''}` : 'A surprise awaits!'
						return `<article class="cart-item"><img class="cart-thumb" src="${esc(p.image)}" alt="" width="91" height="94"><div class="cart-item-info"><div class="cart-item-title"><h3>${esc(p.name)}</h3><span class="cart-item-price">${money(p.price * it.qty)}</span></div><div class="cart-item-meta">${esc(meta)}</div><div class="cart-qty"><button type="button" data-cart-action="minus" data-key="${key}" aria-label="Decrease quantity of ${esc(p.name)}">−</button><span>${it.qty}</span><button type="button" data-cart-action="plus" data-key="${key}" aria-label="Increase quantity of ${esc(p.name)}">+</button><button class="cart-remove" type="button" data-cart-action="remove" data-key="${key}">Remove</button></div></div></article>`
					})
					.join('')
			: `<div class="cart-empty"><div class="emoji"><i data-lucide="ghost"></i></div><h3>Your bag is feeling lonely!</h3><p>Our cute little treats are ready to meet you.</p><button class="button button-primary" id="empty-shop" type="button">Explore the collection</button></div>`
		refreshIcons($('#cart-items'))
	}
	function lockScroll() {
		document.body.classList.add('lock-scroll')
	}
	function maybeUnlock() {
		if (!activeModal && !$('#cart-drawer').classList.contains('open')) document.body.classList.remove('lock-scroll')
	}
	function openCart() {
		lastFocused = document.activeElement
		$('#drawer-backdrop').hidden = false
		$('#cart-drawer').classList.add('open')
		$('#cart-drawer').setAttribute('aria-hidden', 'false')
		lockScroll()
		$('#cart-close').focus()
	}
	function closeCart(restore = true) {
		$('#drawer-backdrop').hidden = true
		$('#cart-drawer').classList.remove('open')
		$('#cart-drawer').setAttribute('aria-hidden', 'true')
		maybeUnlock()
		if (restore && lastFocused?.focus) lastFocused.focus()
	}
	function openModal(name) {
		lastFocused = document.activeElement
		activeModal = name
		const bd = $(`#${name}-backdrop`)
		bd.hidden = false
		lockScroll()
		bd.querySelector('.modal-close').focus()
	}
	function closeModal(name) {
		const bd = $(`#${name}-backdrop`)
		bd.hidden = true
		activeModal = null
		maybeUnlock()
		if (lastFocused?.focus) lastFocused.focus()
	}
	function addProduct(id) {
		if (Cart.add(id)) {
			toast('A little magic added to your bag!')
			openCart()
		} else toast('That item has reached its available stock.')
	}
	function openCustomize(id) {
		const p = productById(id)
		if (!p || !p.customizable) return
		selectedCustomId = id
		$('#customize-form').reset()
		$('#customize-product-name').textContent = p.name
		openModal('customize')
	}
	function beginCheckout() {
		if (!Cart.count()) return
		closeCart(false)
		$('#checkout-form-view').hidden = false
		$('#checkout-result-view').hidden = true
		$('#checkout-form').reset()
		$('#checkout-error').hidden = true
		$('#checkout-mini-summary').innerHTML =
			Cart.get()
				.map((it) => {
					const p = productById(it.id)
					return `<div class="mini-summary-row"><span>${esc(p?.name || it.id)} × ${it.qty}</span><strong>${money((p?.price || 0) * it.qty)}</strong></div>`
				})
				.join('') + `<div class="mini-summary-row mini-summary-total"><span>Estimated total</span><strong>${money(Cart.total())}</strong></div>`
		openModal('checkout')
	}
	function createOrder() {
		const items = Cart.get().map((it) => ({ name: productById(it.id)?.name || it.id, unitPrice: productById(it.id)?.price || 0, qty: it.qty, custom: it.custom }))
		const reference = 'CC-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 7).toUpperCase()
		return {
			reference,
			createdAt: new Date().toLocaleString('en-PH'),
			name: $('#customer-name').value.trim(),
			contact: $('#customer-contact').value.trim(),
			notes: $('#order-notes').value.trim(),
			pickup: S.locationAddress || 'TNHS booth',
			items,
			total: Cart.total(),
			currency: S.currency || 'PHP',
		}
	}
	function orderText(o, submitted) {
		const line = '─────────────────────────────'
		return [
			`CHARMISTRY CO. — ${submitted ? 'SENT REQUEST' : 'ORDER SLIP (NOT SUBMITTED)'}`,
			line,
			`Reference (local): ${o.reference}`,
			`Prepared: ${o.createdAt}`,
			`Name: ${o.name}`,
			`Contact: ${o.contact}`,
			`Pickup: ${o.pickup}`,
			line,
			...o.items.flatMap((it) => [`${it.qty} × ${it.name} — ${money(it.qty * it.unitPrice)}`, it.custom ? `  Character: ${it.custom.character}; Color: ${it.custom.color}${it.custom.notes ? '; Notes: ' + it.custom.notes : ''}` : '']),
			line,
			`ESTIMATED TOTAL: ${money(o.total)}`,
			`Additional notes: ${o.notes || 'None'}`,
			line,
			submitted ? 'Online request sent successfully. Wait for the booth team to confirm.' : 'This slip has NOT been sent to the team. Share it with the booth staff to request your items.',
			'Prices, availability and pickup are subject to staff confirmation.',
			'No online payment has been collected.',
		].join('\n')
	}
	function showOrderResult(order, submitted) {
		currentOrderText = orderText(order, submitted)
		$('#checkout-form-view').hidden = true
		$('#checkout-result-view').hidden = false
		$('#checkout-result-heading').textContent = submitted ? 'Request sent!' : 'Order slip ready!'
		$('#checkout-result-text').textContent = submitted
			? 'Your order request was submitted to the configured team form. The team still needs to confirm your items and pickup.'
			: 'This order has NOT been sent to our team. Download, copy, or print this slip and share it with the booth staff to request your items.'
		$('#checkout-result-detail').textContent = currentOrderText
		$('#order-copy-status').textContent = ''
		const emailLink = $('#email-order')
		if (S.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.contactEmail)) {
			emailLink.hidden = false
			emailLink.href = `mailto:${S.contactEmail}?subject=${encodeURIComponent('Charmistry Co. order request ' + order.reference)}&body=${encodeURIComponent(currentOrderText)}`
		} else emailLink.hidden = true
		$('.checkout-modal').scrollTop = 0
	}
	async function submitCheckout(event) {
		event.preventDefault()
		if (!Cart.count()) {
			showError('Your bag is empty.')
			return
		}
		if (!$('#checkout-agree').checked) {
			showError('Please confirm that you understand the request terms.')
			return
		}
		const order = createOrder()
		const endpoint = String(S.orderEndpoint || '').trim()
		if (!endpoint) {
			showOrderResult(order, false)
			return
		}
		if (!/^https:\/\//.test(endpoint)) {
			showError('The team has not configured a valid HTTPS order endpoint. Download an order slip instead by clearing orderEndpoint in js/settings.js.')
			return
		}
		const button = $('#checkout-submit')
		button.disabled = true
		button.textContent = 'Sending request…'
		$('#checkout-error').hidden = true
		try {
			// Works with Formspree endpoints. No secret token is embedded in the storefront.
			const payload = {
				name: order.name,
				contact: order.contact,
				reference: order.reference,
				pickup: order.pickup,
				items: order.items.map((i) => `${i.qty} x ${i.name}${i.custom ? ' | ' + JSON.stringify(i.custom) : ''}`).join('\n'),
				estimated_total: money(order.total),
				notes: order.notes || 'None',
				_subject: `Charmistry Co. order request ${order.reference}`,
			}
			const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
			if (!response.ok) throw Error(`Submission failed (HTTP ${response.status})`)
			showOrderResult(order, true)
			Cart.clear()
		} catch (e) {
			showError(`${e.message}. Your bag is still saved. Try again or ask the team for help.`)
		} finally {
			button.disabled = false
			button.innerHTML = 'Send order request <i data-lucide="arrow-right"></i>'
			refreshIcons(button)
		}
	}
	function showError(s) {
		$('#checkout-error').textContent = s
		$('#checkout-error').hidden = false
	}
	async function copyText(text) {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text)
			return
		}
		const el = document.createElement('textarea')
		el.value = text
		el.style.position = 'fixed'
		el.style.left = '-99999px'
		document.body.append(el)
		el.select()
		const ok = document.execCommand('copy')
		el.remove()
		if (!ok) throw Error('Copy unavailable')
	}
	function setupEvents() {
		$('#cart-open').addEventListener('click', openCart)
		$('#footer-cart-open').addEventListener('click', openCart)
		$('#cart-close').addEventListener('click', () => closeCart())
		$('#drawer-backdrop').addEventListener('click', () => closeCart())
		$('#keep-shopping').addEventListener('click', () => closeCart())
		$('#checkout-open').addEventListener('click', beginCheckout)
		$('#product-grid').addEventListener('click', (e) => {
			const btn = e.target.closest('[data-add]')
			if (!btn) return
			const p = productById(btn.dataset.add)
			if (p?.customizable) openCustomize(p.id)
			else addProduct(p?.id)
		})
		$('#customize-form').addEventListener('submit', (e) => {
			e.preventDefault()
			const custom = { character: $('#character-choice').value, color: $('#color-choice').value, notes: $('#custom-notes').value.trim() }
			closeModal('customize')
			addProductWithCustom(selectedCustomId, custom)
		})
		$('#cart-items').addEventListener('click', (e) => {
			if (e.target.closest('#empty-shop')) {
				closeCart()
				$('#shop').scrollIntoView({ behavior: 'smooth' })
				return
			}
			const btn = e.target.closest('[data-cart-action]')
			if (!btn) return
			const action = btn.dataset.cartAction,
				key = btn.dataset.key
			if (action === 'remove') Cart.remove(key)
			else if (!Cart.change(key, action === 'plus' ? 1 : -1)) toast('No additional stock available for this item.')
		})
		window.addEventListener('charmistry:cartchange', renderCart)
		$$('.filter-pill').forEach((btn) =>
			btn.addEventListener('click', () => {
				filter = btn.dataset.filter
				$$('.filter-pill').forEach((b) => {
					b.classList.toggle('active', b === btn)
					b.setAttribute('aria-pressed', String(b === btn))
				})
				renderProducts()
			}),
		)
		$('#product-search').addEventListener('input', (e) => {
			term = e.target.value.trim().toLowerCase()
			renderProducts()
		})
		$('#product-sort').addEventListener('change', (e) => {
			sort = e.target.value
			renderProducts()
		})
		$('#clear-filters').addEventListener('click', () => {
			filter = 'all'
			term = ''
			sort = 'featured'
			$('#product-search').value = ''
			$('#product-sort').value = sort
			$$('.filter-pill').forEach((b) => {
				const active = b.dataset.filter === 'all'
				b.classList.toggle('active', active)
				b.setAttribute('aria-pressed', String(active))
			})
			renderProducts()
		})
		$$('[data-close-modal]').forEach((b) => b.addEventListener('click', () => closeModal(b.dataset.closeModal)))
		$$('.modal-backdrop').forEach((b) =>
			b.addEventListener('mousedown', (e) => {
				if (e.target === b) closeModal(b.id.replace('-backdrop', ''))
			}),
		)
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				if (activeModal) closeModal(activeModal)
				else if ($('#cart-drawer').classList.contains('open')) closeCart()
			}
			if (e.key === 'Tab') {
				const root = activeModal ? $(`#${activeModal}-backdrop`) : $('#cart-drawer').classList.contains('open') ? $('#cart-drawer') : null
				if (root) trapTab(root, e)
			}
		})
		$('#checkout-form').addEventListener('submit', submitCheckout)
		$('#copy-order').addEventListener('click', async () => {
			try {
				await copyText(currentOrderText)
				$('#order-copy-status').textContent = 'Copied! You can now share this with the booth team.'
			} catch (_) {
				$('#order-copy-status').textContent = 'Automatic copy is unavailable. Select and copy the order slip above.'
			}
		})
		$('#download-order').addEventListener('click', () => {
			const blob = new Blob([currentOrderText], { type: 'text/plain;charset=utf-8' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `Charmistry_Order_Slip_${new Date().toISOString().slice(0, 10)}.txt`
			document.body.append(a)
			a.click()
			a.remove()
			setTimeout(() => URL.revokeObjectURL(url), 500)
		})
		$('#print-order').addEventListener('click', () => window.print())
		$('#checkout-done').addEventListener('click', () => closeModal('checkout'))
		const menu = $('#menu-toggle'),
			nav = $('#mobile-nav')
		menu.addEventListener('click', () => {
			const open = menu.getAttribute('aria-expanded') === 'true'
			menu.setAttribute('aria-expanded', String(!open))
			menu.setAttribute('aria-label', open ? 'Open menu' : 'Close menu')
			menu.innerHTML = `<i data-lucide="${open ? 'menu' : 'x'}" aria-hidden="true"></i>`
			refreshIcons(menu)
			nav.hidden = open
		})
		$$('#mobile-nav a').forEach((a) =>
			a.addEventListener('click', () => {
				nav.hidden = true
				menu.setAttribute('aria-expanded', 'false')
				menu.setAttribute('aria-label', 'Open menu')
				menu.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>'
				refreshIcons(menu)
			}),
		)
	}
	function addProductWithCustom(id, custom) {
		if (Cart.add(id, custom)) {
			toast('Your custom cutie is in the bag!')
			openCart()
		} else toast('Sorry! No more stock is available for that item.')
	}
	function trapTab(root, event) {
		const elements = $$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])', root).filter((e) => e.getClientRects().length)
		if (!elements.length) return
		const first = elements[0],
			last = elements[elements.length - 1]
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault()
			last.focus()
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault()
			first.focus()
		}
	}
	setupContent()
	refreshIcons()
	renderProducts()
	renderGames()
	renderCart()
	setupEvents()
})()
