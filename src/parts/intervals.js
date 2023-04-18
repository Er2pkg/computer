import cpuse from 'cpuse'

export default (C) => {
	setInterval(async () => {
		C.stats.cpu = await cpuse.usageAvg()
	}, 5000)
	setInterval(() => {
		if (!C.api.startTime || C.beta) return

		try {
			C.api.editMessage(C.config.stats.channel, C.config.stats.message,
				{embed: C.info(C, 'ru')}
			)
		} catch (err) {
			console.log(err)
		}
	}, 15000)
}

