global.Eris = require('eris')
global.ephemeral = 64

require('../../etc/Embed')

module.exports = (C) => {
	console.log('Client initialization')
	C.api = new Eris.Client('Bot ' + C.config.token, {
		allowedMentions: {everyone: false},
		maxShards: 'auto',
	})
	C.api.on('error', console.log)
	C.api.on('ready', () => {
		console.log('Logged on as ' + C.api.user.username)
		delete C.config.token
	})
	C.load('events')
	C.info = require('../../etc/info')
	C.api.connect()
}

