import {rub, _wants} from './common.js'

let intrCreate = (C, msg, wants, date1, date2, days, m) => {
	let to = setTimeout(() => {
		C.api.off('interactionCreate', interaction)
		renderChart(C, msg, wants, date1, date2, days, true)
	}, 300_000)
	let interaction = intr => {
		if (intr.type != 3
			|| !intr.message
			|| intr.message.id != m.id
			|| !(intr.member?.user.id == msg.user.id
				|| intr.user?.id == msg.user.id
			    )
		) return
		intr.deferUpdate()
		C.api.off('interactionCreate', interaction)
		clearTimeout(to)
		switch (intr.data.custom_id) {
		case 'left':
			date1.setDate(date1.getDate() - days)
			date2.setDate(date1.getDate() - days)
			break
		case 'right':
			date1.setDate(date1.getDate() + days)
			date2.setDate(date1.getDate() + days)
			break
		default:
			msg.createEphemeral(C.locale.get('error', 'req_err', msg.locale))
			return
		}
		renderChart(C, msg, wants, date1, date2, days)
	}
	C.api.on('interactionCreate', interaction)
}
let renderChart = async (C, msg, wants, date1, date2, days, nobuttons) => {
	try {
		let [res, founds] = await rub.chart(wants, date1, date2)
		let nf = []
		for (let i of wants)
			if (!founds.has(i)) nf.push(i)
		let out = ''
		if (nf.length) out += msg.loc.notf + nf.join(', ')
		out += msg.loc.prov + '\n'
		out += msg.loc.curr
			+ date1.toLocaleDateString('ru-RU') + ' - '
			+ date2.toLocaleDateString('ru-RU') + ':'
		if (nobuttons)
			return msg.editOriginalMessage({content: out, components: []})
		msg.editOriginalMessage({content: out, components: [{type: 1, components: [
			{ type: 2,
				label: '◀️ ' + msg.loc.left,
				style: 2,
				custom_id: 'left'
			},
			{ type: 2,
				label: '▶️ ' + msg.loc.right,
				style: 2,
				disabled: date2.toLocaleDateString('ru-RU') == new Date().toLocaleDateString('ru-RU'),
				custom_id: 'right'
			}
		]}], attachments: []}, {file: res, name: 'chart.png'})
		let m = await msg.getOriginalMessage()
		intrCreate(C, msg, wants, date1, date2, days, m)
	} catch (err) {
		msg.editOriginalMessage(C.locale.get('error', 'req_err', msg.locale))
		console.log(err)
	}
}

export default {
	options: [
		{ type: 'string',
			name: 'valutes'
		},
		{ type: 'integer',
			min_value: 1,
			max_value: 365,
			name: 'days'
		}
	],
	run: async (C, msg) => {
		let wants = new Set(_wants)
		let valutes = msg.args.valutes
		let days = msg.args.days || 7
		if (valutes)
			valutes.split(/[,\s]+/)
			.forEach(i => wants.add(i.toUpperCase()))
		await msg.createMessage('Please wait...')
		let date1 = new Date()
		let date2 = new Date()
		date1.setDate(date1.getDate() - days)
		await renderChart(C, msg, wants, date1, date2, days)
	}
}

