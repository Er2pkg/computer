let https = require('https')
module.exports = url => new Promise((res, rej) => {
	https.get(url, R => {
		R.setEncoding('binary')
		let s = ''
		R
		.on('data', d => s += d)
		.on('end', () => res(s))
	}).on('error', e => rej(e))
})

