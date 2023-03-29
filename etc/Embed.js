class Embed {
	constructor(data = {}) {
		this.data = {...data}
		if (data.timestamp) this.data.timestamp = new Date(data.timestamp).toISOString()
	}

	title(text) {
		if (text.length > 256) throw new Error('Embed title > 256 characters')
		this.data.title = text.toString()
		return this
	}

	description(text) {
		if (text.length > 2048) throw new Error('Embed description > 2048 characters')
		this.data.description = text.toString()
		return this
	}

	footer(text, icon_url) {
		if (text.length > 2048) throw new Error('Embed footer > 2048 characters')
		this.data.footer = {text, icon_url}
		return this
	}

	url(url) {
		this.data.url = url.toString()
		return this
	}

	color(data) {
		let base = 10
		if (typeof data == 'string') {
			base = 16
			data = data.replace('#', '')
		}
		let color = parseInt(data, base)
		if (color < 0 || color > 0xFFFFFF) throw new Error('Embed color is outside of allowed values')
		else if (color && isNaN(color)) throw new Error('Embed color conversion failed')
		this.data.color = color
		return this
	}

	author(name, icon_url, url) {
		this.data.author = {name, icon_url, url}
		return this
	}

	timestamp(data = Date.now()) {
		this.data.timestamp = data ? new Date(data).toISOString() : undefined
		return this
	}

	thumbnail(url, options = {}) {
		this.data.thumbnail = {url, width: options.width, height: options.height}
		return this
	}

	image(url, options = {}) {
		this.data.image = {url, width: options.width, height: options.height}
		return this
	}

	field(name, value, inline = false) {
		if (this.data.fields && this.data.fields.length >= 25) throw new Error('Embed fields count > 25')
		if (name.length > 256) throw new Error('Embed field name > 256 characters')
		if (value.length > 1024) throw new Error('Embed field value > 1024 characters')
		let field = {name, value, inline}
		if (this.data.fields) this.data.fields.push(field)
		else this.data.fields = [field]
		return this
	}

	toJSON() {
		return {...this.data}
	}
}

Eris.Embed = Embed

