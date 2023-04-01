class Core {
	config = require('../../config.js')
	cmds = {}
	models = {}
	stats = {
		cpu: 0,
		loaded: 0,
		cmds: 0,
	}

	constructor() {
		if (!this.config.token) throw new Error('Provide TokenBot=!')
		this.load('parts')
		console.log('Done!')
	}

	stop() {
		this.api.disconnect()
		console.log('Stopped')
		console.log('Uptime:', Date.now() - this.loaded, 'seconds')
	}

	load(what) {
		let wh = this.config[what]
		for (let i in wh) {
			let v = wh[i]
			console.log('Loading ' + what.slice(0, -1) + ' (' +(parseInt(i)+1)+' / '+wh.length + ') ' + v + '...')

			this._load(what, v)
		}
		console.log('Loaded ' + wh.length +' '+ what)
		this.stats.loaded = Date.now()
	}

	reload(category, target, off) {
		let tgt = require.resolve('../' + category +'/' + target)
		console.log(tgt)
		let cache = require.cache[tgt]
		if (cache && category == 'events')
			this.api.off(cache)
		if (cache) delete require.cache[tgt]
		if (off) return
		this._load(category, target)
	}

	_load(cat, v) {
			try {
				let res = require('../' + cat +'/'+ v)
				switch (cat) {
				case 'events':
					this.api.on(v, res.bind(this, this, this.api))
					break
				case 'cmds':
					if (!this.cmds[v]) this.stats.cmds++
					this.cmds[v] = res
					break
				case 'parts':
					res(this)
					break
				case 'models':
					this.models[v] = this.db.model(v, new this.db.Schema(res))
					break
				default:
					throw new Error('wut?')
				}
			} catch (err) {
				console.log(err)
				console.log('failed')
			}
	}
}

let core = new Core()

