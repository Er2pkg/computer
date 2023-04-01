module.exports = {
	token: process.env.TokenBot,
	dbtoken: process.env.TokenMongoDB,

	owner: '544031928358273045',
	stats: {
		channel: '695980819650576384',
		message: '695981096202010654',
	},
	cmds: [
		'eval',
		'shell',
		'color',
		'keyboard-translator',
		'note',
		'info',
		'rub',
	],
	events: [
		'ready',
		'interactionCreate',
	],
	parts: [
		'locale',
		'client',
		'intervals',
		'db',
	],
	models: [
		'User',
	],
}

