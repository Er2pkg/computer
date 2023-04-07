import {Client} from 'eris'

import '../../etc/polyfills.cjs'
import info from '../../etc/info.js'

export default (C) => {
	console.log('Client initialization')
	C.api = new Client('Bot ' + C.config.token, {
		allowedMentions: {everyone: false},
		maxShards: 'auto',
	})
	C.api.on('error', console.log)
	C.api.on('ready', () => {
		console.log('Logged on as ' + C.api.user.tag)
		delete C.config.token
	})
	C.load('events')
	C.info = info
	C.api.connect()
}

