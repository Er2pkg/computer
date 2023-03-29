// Information generation
const os = require('os')
const cpuse = require('cpuse')

module.exports = (C, lang) => {
	const ping = C.api.shards.reduce((i, c) => i + c.latency, 0) / C.api.shards.size
	const loc = C.locale.get('cmds', 'info', lang)
	const uptime = Date.now() - C.stats.loaded
	let info = [
		[ loc.latency, [
			`${loc.ping}: ${ping} ms`,
			`${loc.ram }: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} / ${Math.floor(os.totalmem() / 1024 / 1024)} ${loc.mb}`,
			`${loc.cpu }: ${C.stats.cpu}`,
		]],
		[ loc.cmds, [
			`${C.stats.cmds}`
		]],
		[ loc.time, [
			`${loc.turned}: ${new Date(C.api.startTime).toLocaleString('ru-RU', {timezone: 'Europe/Moscow', hour12: false})} MSK`,
			`${loc.uptime}: ${Math.round(uptime / (1000 * 60 * 60))}h, ${Math.floor(uptime / (1000 * 60)) % 60}m`,
		]]
	]
	let embed = new Eris.Embed()
		.title('Bot ' + C.api.user.username +'#'+ C.api.user.discriminator)
		.thumbnail(C.api.user.dynamicAvatarURL('webp'))
		.color(C.beta ? '7289DA' : '00fff0')
	info
		.map(i => [i[0], '> ' + i[1].join('\n> ')])
		.forEach(i => embed.field(i[0], i[1]))
	return embed.toJSON()
}
