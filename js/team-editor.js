/* Offline, unauthenticated, export-only team editor. Never use as a production admin. */
;(function () {
	'use strict'
	const $ = (s) => document.querySelector(s),
		$$ = (s) => Array.from(document.querySelectorAll(s))
	const escapeHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
	const DRAFT_KEY = 'charmistry-team-edit-draft-v1'
	const initial = { products: window.CHARMISTRY_PRODUCTS || [], games: window.CHARMISTRY_ACTIVITIES || [], settings: window.CHARMISTRY_SETTINGS || {} }
	let state = JSON.parse(JSON.stringify(initial)),
		tab = 'products',
		selected = { products: 0, games: 0 }
	try {
		const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
		if (saved && Array.isArray(saved.products) && Array.isArray(saved.games) && saved.settings && typeof saved.settings === 'object') state = saved
	} catch (_) {}
	function status(msg) {
		$('#editor-status').textContent = msg
	}
	function remember() {
		try {
			localStorage.setItem(DRAFT_KEY, JSON.stringify(state))
		} catch (_) {}
		status('✓ Draft saved in this browser. Download the updated file to publish.')
	}
	function toInput(form, name, value) {
		const input = form.elements.namedItem(name)
		if (!input) return
		if (input.type === 'checkbox') input.checked = !!value
		else input.value = value ?? ''
	}
	function fromInput(form, name) {
		const input = form.elements.namedItem(name)
		return input.type === 'checkbox' ? input.checked : input.value.trim()
	}
	function showTab(next) {
		tab = next
		$$('[data-tab]').forEach((b) => {
			const yes = b.dataset.tab === next
			b.classList.toggle('selected', yes)
			b.setAttribute('aria-pressed', String(yes))
		})
		$$('.editor-screen').forEach((el) => (el.hidden = el.id !== 'editor-' + next))
		$('.editor-sidebar').hidden = next === 'settings'
		$('.editor-layout').style.gridTemplateColumns = next === 'settings' ? '1fr' : ''
		$('#item-heading').textContent = next === 'games' ? 'Booth games' : 'Products'
		renderList()
		if (next === 'settings') fillSettings()
		else fillEntry()
	}
	function renderList() {
		const list = $('#entry-list')
		list.innerHTML = ''
		if (tab === 'settings') return
		const arr = state[tab]
		$('#prod-count').textContent = state.products.length
		arr.forEach((item, i) => {
			const b = document.createElement('button')
			b.type = 'button'
			b.className = i === selected[tab] ? 'selected' : ''
			b.innerHTML = `${escapeHtml(item.name || 'Unnamed item')}<small>${tab === 'products' ? `₱${Number(item.price || 0).toLocaleString('en-PH')} · ${item.stock || 0} in stock` : escapeHtml(item.type || 'Booth activity')}</small>`
			b.addEventListener('click', () => {
				selected[tab] = i
				renderList()
				fillEntry()
			})
			list.append(b)
		})
		$('#add-entry').hidden = false
	}
	function fillEntry() {
		if (tab === 'settings') return
		const arr = state[tab],
			form = $(tab === 'products' ? '#product-form' : '#game-form'),
			item = arr[selected[tab]]
		form.hidden = !item
		if (!item) {
			status('Add your first item with the + Add button.')
			return
		}
		const names = tab === 'products' ? ['id', 'name', 'category', 'badge', 'description', 'price', 'stock', 'image', 'color', 'featured', 'customizable'] : ['id', 'name', 'tagline', 'description', 'type', 'image', 'color']
		names.forEach((n) => toInput(form, n, item[n]))
	}
	function fillSettings() {
		const form = $('#settings-form')
		Object.entries(state.settings).forEach(([k, v]) => toInput(form, k, v))
	}
	function saveProduct(e) {
		e.preventDefault()
		const f = e.currentTarget,
			i = selected.products,
			existing = state.products[i]
		if (!existing) return
		const obj = {
			id: fromInput(f, 'id'),
			name: fromInput(f, 'name'),
			category: fromInput(f, 'category'),
			description: fromInput(f, 'description'),
			price: Number(fromInput(f, 'price')),
			stock: Number(fromInput(f, 'stock')),
			badge: fromInput(f, 'badge'),
			image: fromInput(f, 'image'),
			color: fromInput(f, 'color'),
			customizable: fromInput(f, 'customizable'),
			featured: Number(fromInput(f, 'featured')),
		}
		if (state.products.some((p, index) => index !== i && p.id === obj.id)) {
			status('⚠ Product ID already exists. Choose another unique ID.')
			return
		}
		if (!Number.isFinite(obj.price) || obj.price < 0 || !Number.isInteger(obj.stock) || obj.stock < 0) {
			status('⚠ Price and stock must be valid nonnegative numbers.')
			return
		}
		state.products[i] = obj
		remember()
		renderList()
		fillEntry()
	}
	function saveGame(e) {
		e.preventDefault()
		const f = e.currentTarget,
			i = selected.games
		if (!state.games[i]) return
		const obj = {}
		;['id', 'name', 'tagline', 'description', 'type', 'image', 'color'].forEach((n) => (obj[n] = fromInput(f, n)))
		if (state.games.some((g, index) => index !== i && g.id === obj.id)) {
			status('⚠ Game ID already exists.')
			return
		}
		state.games[i] = obj
		remember()
		renderList()
		fillEntry()
	}
	function saveSettings(e) {
		e.preventDefault()
		const f = e.currentTarget
		for (const key of Object.keys(state.settings)) {
			if (f.elements.namedItem(key)) state.settings[key] = fromInput(f, key)
		}
		remember()
	}
	function addEntry() {
		if (tab === 'products') {
			const id = 'new-product-' + Date.now().toString(36)
			state.products.push({
				id,
				name: 'New Halloween treat',
				category: 'mystery',
				description: 'Add a description for your product.',
				price: 0,
				stock: 0,
				badge: 'NEW',
				image: 'assets/images/product-pouch.svg',
				color: 'purple',
				customizable: false,
				featured: state.products.length + 1,
			})
			selected.products = state.products.length - 1
		} else if (tab === 'games') {
			state.games.push({
				id: 'new-game-' + Date.now().toString(36),
				name: 'New booth game',
				tagline: 'A fun school-booth challenge',
				description: 'Describe how to enjoy the activity.',
				image: 'assets/images/game-jenga.svg',
				type: 'BOOTH GAME',
				color: 'purple',
			})
			selected.games = state.games.length - 1
		}
		remember()
		renderList()
		fillEntry()
	}
	function removeEntry(section) {
		const arr = state[section],
			idx = selected[section],
			item = arr[idx]
		if (!item || !confirm(`Delete ${item.name} from your draft catalog?`)) return
		arr.splice(idx, 1)
		selected[section] = Math.max(0, Math.min(idx, arr.length - 1))
		remember()
		renderList()
		fillEntry()
	}
	function download(name, contents) {
		const blob = new Blob([contents], { type: 'text/javascript;charset=utf-8' }),
			url = URL.createObjectURL(blob),
			a = document.createElement('a')
		a.href = url
		a.download = name
		document.body.append(a)
		a.click()
		a.remove()
		setTimeout(() => URL.revokeObjectURL(url), 1000)
		status(`✓ Downloaded ${name}. Replace the matching file in your website js/ folder to publish.`)
	}
	function exportCatalog() {
		download('catalog.js', `/* CHARMISTRY CATALOG — exported by the local Team Editor */\nwindow.CHARMISTRY_PRODUCTS = ${JSON.stringify(state.products, null, 2)};\nwindow.CHARMISTRY_ACTIVITIES = ${JSON.stringify(state.games, null, 2)};\n`)
	}
	function exportSettings() {
		download('settings.js', `/* CHARMISTRY SETTINGS — exported by the local Team Editor */\nwindow.CHARMISTRY_SETTINGS = ${JSON.stringify(state.settings, null, 2)};\n`)
	}
	$$('[data-tab]').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)))
	$('#product-form').addEventListener('submit', saveProduct)
	$('#game-form').addEventListener('submit', saveGame)
	$('#settings-form').addEventListener('submit', saveSettings)
	$('#add-entry').addEventListener('click', addEntry)
	$('#remove-product').addEventListener('click', () => removeEntry('products'))
	$('#remove-game').addEventListener('click', () => removeEntry('games'))
	$('#export-catalog').addEventListener('click', exportCatalog)
	$('#export-settings').addEventListener('click', exportSettings)
	$('#reset-drafts').addEventListener('click', () => {
		if (!confirm('Discard all browser drafts and reload the original catalog/settings files?')) return
		state = JSON.parse(JSON.stringify(initial))
		try {
			localStorage.removeItem(DRAFT_KEY)
		} catch (_) {}
		selected = { products: 0, games: 0 }
		showTab(tab)
		status('Browser drafts reset to the website files.')
	})
	showTab('products')
})()
