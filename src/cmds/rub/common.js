// Do not add this to config.js!
// This is common file for subcommands

import request  from '../../../etc/request.js'
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
let _wants = [
	'USD',
	'EUR',
]
export {rub, _wants}

