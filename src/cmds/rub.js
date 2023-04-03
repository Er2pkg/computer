let request = require('../../etc/request')
let win1251 = require('windows-1251')
let xmljs   = require('xml-js')
class Rub {
	url = 'https://www.cbr.ru/scripts/XML_daily.asp'

	getPat(val) {
		return `${val.Nominal._text} ${val.Name._text} (${val.CharCode._text}) — ${val.Value._text} ₽`
	}

	async rate(wants) {
		let raw = await request(this.url)
		let dat = xmljs.xml2js(win1251.decode(raw), {compact: true})
		dat = dat.ValCurs
		if (!dat) throw 'err'

		// Pseudo-valutes
		dat.Valute.push({
			NumCode: {_text: '001'},
			CharCode: {_text: 'RUB'},
			Nominal: {_text: '1'},
			Name: {_text: 'Российский рубль'},
			Value: {_text: '1'},
		})
		let uah = dat.Valute.find(i => i.CharCode._text == 'UAH')
		dat.Valute.push({
			NumCode: {_text: '200'},
			CharCode: {_text: 'SHT'},
			Nominal: {_text: '1'},
			Name: {_text: 'Штаны'},
			// 40 UAH
			Value: {_text: parseInt(uah.Value._text.replace(',', '.')) / parseInt(uah.Nominal._text) * 40},
		})

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
}
// как новый рубль?
let rub = new Rub

module.exports = {
	options: [
		{ type: 'string',
			name: 'valutes'
		}
	],
	run: async (C, msg) => {
		let wants = new Set([
			'USD',
			'EUR',
		])
		if (msg.args[0])
			msg.args[0].value
			.split(/[,\s]+/)
			.forEach(i => wants.add(i.toUpperCase()))
		try {
			let [res, date, founds] = await rub.rate(wants)
			let nf = []
			for (let i of wants)
				if (!founds.has(i)) nf.push(i)
			let out = msg.loc.curr + date +':\n' + res.join('\n')
			if (nf.length) out += msg.loc.notf + nf.join(', ')
			out += msg.loc.prov
			msg.createMessage(out)
		} catch (err) {
			msg.createMessage({content: C.locale.get('error', 'req_err', msg.locale), flags: ephemeral})
			console.log(err)
		}
	}
}

