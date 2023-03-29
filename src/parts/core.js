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

			try {
				let res = require('../' + what +'/'+ v)
				switch (what) {
				case 'events':
					this.api.on(v, res.bind(this, this, this.api))
					break
				case 'cmds':
					this.cmds[v] = res
					this.stats.cmds++
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
		console.log('Loaded ' + wh.length +' '+ what)
		this.stats.loaded = Date.now()
	}
}

let core = new Core()

