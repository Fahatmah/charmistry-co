/* Small local shopping-bag store. No accounts, payments, or orders are stored on a server. */
;(function () {
	'use strict'
	const KEY = 'charmistry-shopping-bag-v1'
	const products = () => (Array.isArray(window.CHARMISTRY_PRODUCTS) ? window.CHARMISTRY_PRODUCTS : [])
	function normalized(input) {
		if (!Array.isArray(input)) return []
		const out = []
		const totals = {}
		for (const row of input) {
			if (!row || typeof row.id !== 'string') continue
			const p = products().find((x) => x.id === row.id)
			if (!p) continue
			const stock = Math.max(0, Number(p.stock) || 0)
			const remaining = stock - (totals[p.id] || 0)
			const qty = Math.max(0, Math.min(remaining, Math.floor(Number(row.qty) || 0)))
			if (!qty) continue
			const custom =
				p.customizable && row.custom && typeof row.custom === 'object'
					? {
							character: String(row.custom.character || '').slice(0, 90),
							color: String(row.custom.color || '').slice(0, 90),
							notes: String(row.custom.notes || '').slice(0, 180),
						}
					: null
			out.push({ id: p.id, qty, custom })
			totals[p.id] = (totals[p.id] || 0) + qty
		}
		return out
	}
	let items = []
	try {
		items = normalized(JSON.parse(localStorage.getItem(KEY) || '[]'))
	} catch (_) {
		items = []
	}
	const save = () => {
		try {
			localStorage.setItem(KEY, JSON.stringify(items))
		} catch (_) {}
		window.dispatchEvent(new CustomEvent('charmistry:cartchange'))
	}
	const itemKey = (it) => JSON.stringify([it.id, it.custom || null])
	window.CharmistryStore = {
		get: () => items.map((x) => ({ ...x, custom: x.custom ? { ...x.custom } : null })),
		count: () => items.reduce((a, x) => a + x.qty, 0),
		total: () => items.reduce((sum, it) => sum + it.qty * (Number(products().find((x) => x.id === it.id)?.price) || 0), 0),
		quantityFor: (id) => items.filter((x) => x.id === id).reduce((a, x) => a + x.qty, 0),
		add(id, custom = null) {
			const p = products().find((x) => x.id === id)
			if (!p) return false
			const available = Math.max(0, Number(p.stock) || 0) - this.quantityFor(id)
			if (available < 1) return false
			const entry = { id, qty: 1, custom: p.customizable ? custom : null }
			const key = itemKey(entry)
			const existing = items.find((x) => itemKey(x) === key)
			if (existing) existing.qty++
			else items.push(entry)
			save()
			return true
		},
		change(key, delta) {
			const it = items.find((x) => itemKey(x) === key)
			if (!it) return false
			const p = products().find((x) => x.id === it.id)
			const allowed = Math.max(0, Number(p?.stock) || 0)
			if (delta > 0 && this.quantityFor(it.id) >= allowed) return false
			it.qty += delta
			items = items.filter((x) => x.qty > 0)
			save()
			return true
		},
		remove(key) {
			items = items.filter((x) => itemKey(x) !== key)
			save()
		},
		clear() {
			items = []
			save()
		},
		key: itemKey,
	}
})()
