const fs = require('fs')

class Locale {
	list = [
		'en-US',
		'ru',
	]
	main = this.list[0]

	constructor() {
		this[this.main] = {}
		for (let v of this.list) {
			try {
				let f = fs.readFileSync('src/locales/' + v +'.json')
				this[v] = JSON.parse(f)
			} catch (err) {
				console.error(err)
			}
		}
	}

	get(category, key, lang) {
		console.assert(category, 'Category not provided!')
		console.assert(key, 'Key not provided!')
		lang = lang || this.main
		let lng = this[lang]
		if (!lng) lng = this[this.main]
		let cat = lng[category]
		if (!cat) cat = this[this.main][category]
		if (!cat) return ''
		let res = cat[key]
		if (!res) res = this[this.main][category][key]
		return res || ''
	}
}

module.exports = (C) => {
	C.locale = new Locale()
}

