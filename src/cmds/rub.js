import request  from '../../etc/request.js'
import {xml2js} from 'xml-js'
import {decode} from 'windows-1251'
import qc       from 'quickchart-js'

class Rub {
	base    = 'https://www.cbr.ru/scripts/'
	daily   = this.base + 'XML_daily.asp'
	dynamic = this.base + 'XML_dynamic.asp'

	getPat(val) {
		return `${val.Nominal._text} ${val.Name._text} (${val.CharCode._text}) — ${val.Value._text} ₽`
	}

	genPseudo(dat) {
		// Pseudo-valutes
		dat.Valute.push({
			NumCode: {_text: '001'},
			CharCode: {_text: 'RUB'},
			Nominal: {_text: '1'},
			Name: {_text: 'Российский рубль'},
			value: v => 1,
			pseudo: true
		})
		dat.Valute.push({
			NumCode: {_text: '200'},
			CharCode: {_text: 'SHT'},
			Nominal: {_text: '1'},
			Name: {_text: 'Штаны'},
			// 40 UAH
			value: v => parseFloat(v.Value._text) / parseInt(v.Nominal._text) * 40,
			pseudo: 'R01720'
		})

	}

	async values() {
		let dat = xml2js(decode(await request(this.daily)), {compact: true})
		dat = dat.ValCurs
		if (!dat) throw 'err'
		this.genPseudo(dat)
		for (let v of dat.Valute) {
			if (v.pseudo) {
				let val = v.pseudo == true ? null : dat.Valute.find(i => i._attributes.ID == v.pseudo)
				if (val || v.pseudo == true) v.Value = {_text: v.value(val)}
				else v.Value = {_text: 0}
			} else v.Value._text = v.Value._text.replace(',', '.')
		}
		return dat
	}

	async now(wants) {
		let dat = await this.values()
		let res = [], founds
		if (wants.has('ALL')) {
			founds = wants
			for (let v of dat.Valute)
				res.push(this.getPat(v))
		} else {
			founds = new Set()
			for (let v of dat.Valute)
				if (wants.has(v.CharCode._text)) {
					founds.add(v.CharCode._text)
					res.push(this.getPat(v))
				}
		}

		return [res, dat._attributes.Date, founds]
	}

	async chart(wants, date1, date2) {
		date1 = date1.toLocaleDateString('ru-RU')
		date2 = date2.toLocaleDateString('ru-RU')
		let val = await this.values()

		let res = {
			type: 'line',
			data: {
				labels: [],
				datasets: [],
			}
		}
		let founds = new Set()
		for (let v of val.Valute)
			if (wants.has(v.CharCode._text)) {
				let idx = res.data.datasets.push({
					label: v.CharCode._text,
					fill: false,
					pointRadius: 0,
					data: [],
				}) - 1
				if (v.pseudo == true) {
					founds.add(v.CharCode._text)
					for (let x of res.data.labels) res.data.datasets[idx].data.push(v.Value._text)
					continue
				}
				let url = this.dynamic + `?date_req1=${date1}&date_req2=${date2}&VAL_NM_RQ=${v.pseudo || v._attributes.ID}`
				let dat = xml2js(decode(await request(url)), {compact: true})
				dat = dat.ValCurs.Record
				if (!dat) continue
				founds.add(v.CharCode._text)
				for (let c of dat) {
					let i = res.data.labels.findIndex(i => i == c._attributes.Date)
					if (i < 0) i = res.data.labels.push(c._attributes.Date) - 1
					c.Value._text = c.Value._text.replace(',', '.')
					if (v.pseudo) res.data.datasets[idx].data[i] = v.value(c)
					else res.data.datasets[idx].data[i] = parseFloat(c.Value._text) / parseInt(c.Nominal._text)
				}
			}
		let chart = new qc()
		chart.setConfig(res)
		let buf = await chart.toBinary()
		return [buf, founds]
	}
}
// как новый рубль?
let rub = new Rub

let intrCreate = (C, msg, wants, date1, date2, days, m) => {
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
	setTimeout(() => C.api.off('interactionCreate', interaction), 60_000)
}
let renderChart = async (C, msg, wants, date1, date2, days) => {
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
		msg.editOriginalMessage({content: out, components: [{type: 1, components: [
			{ type: 2,
				label: 'Left',
				style: 2,
				custom_id: 'left'
			},
			{ type: 2,
				label: 'Right',
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
		{ type: 'command',
			name: 'now',
			options: [
				{ type: 'string',
					name: 'valutes'
				}
			]
		},
		{ type: 'command',
			name: 'chart',
			options: [
				{ type: 'string',
					name: 'valutes'
				},
				{ type: 'integer',
					min_value: 1,
					max_value: 365,
					name: 'days'
				}
			]
		}
	],
	run: async (C, msg) => {
		let opts = msg.args[0].options
		let wants = new Set([
			'USD',
			'EUR',
		])
		let valutes = opts.find(i => i.name == 'valutes')
		let days = opts.find(i => i.name == 'days')?.value || 7
		if (valutes)
			valutes.value
			.split(/[,\s]+/)
			.forEach(i => wants.add(i.toUpperCase()))
		switch(msg.args[0].name) {
		case 'now':
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
			break
		case 'chart':
			await msg.createMessage('Please wait...')
			let date1 = new Date()
			let date2 = new Date()
			date1.setDate(date1.getDate() - days)
			await renderChart(C, msg, wants, date1, date2, days)
			break
		}
	}
}

