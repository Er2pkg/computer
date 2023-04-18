import config from '../../config.js'

class Core {
	config = config
	cmds = {}
	models = {}
	stats = {
		cpu: 0,
		loaded: 0,
		cmds: 0,
		uses: 0,
	}

	constructor() {
		if (!this.config.token) throw new Error('Provide TokenBot=!')
		this.beta = !!process.env.BETA
		if (this.beta) console.log('Running in beta mode')
		this.load('parts')
	}

	stop() {
		this.api.disconnect()
		console.log('Stopped')
		console.log('Uptime:', Date.now() - this.loaded, 'seconds')
	}

	async load(cat) {
		let wh = this.config[cat]
		for (let i in wh) {
			let v = wh[i]
			console.log('Loading ' + cat.slice(0, -1) + ' (' +(parseInt(i)+1)+' / '+wh.length + ') ' + v + '...')

			try {
				let res = (await import('../' + cat +'/'+ v + '.js')).default
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
				console.log('failed')
				console.log(err)
			}
		}
		console.log('Loaded ' + wh.length +' '+ cat)
		this.stats.loaded = Date.now()
	}
}

let core = new Core()

