const cpuse = require('cpuse')

module.exports = (C) => {
	setInterval(async () => {
		C.stats.cpu = await cpuse.usageAvg()
	}, 5000)
	setInterval(() => {
		if (!C.api.startTime) return

		try {
			C.api.editMessage(C.config.stats.channel, C.config.stats.message,
				{embed: C.info(C, 'ru')}
			)
		} catch (err) {
			console.log(err)
		}
	}, 15000)
}

