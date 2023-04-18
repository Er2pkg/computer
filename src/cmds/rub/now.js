import {rub, _wants} from './common.js'
export default {
	options: [
		{ type: 'string',
			name: 'valutes'
		}
	],
	run: async (C, msg) => {
		let wants = new Set(_wants)
		let valutes = msg.args.valutes
		if (valutes)
			valutes.split(/[,\s]+/)
			.forEach(i => wants.add(i.toUpperCase()))
		try {
			let [res, date, founds] = await rub.now(wants)
			let nf = []
			for (let i of wants)
				if (!founds.has(i)) nf.push(i)
			let out = msg.loc.curr + date +':\n' + res.join('\n')
			if (nf.length) out += msg.loc.notf + nf.join(', ')
			out += msg.loc.prov
			msg.createMessage(out)
		} catch (err) {
			msg.createEphemeral(C.locale.get('error', 'req_err', msg.locale))
			console.log(err)
		}
	}
}

