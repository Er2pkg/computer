export default {
	token: process.env.TokenBot,
	dbtoken: process.env.TokenMongoDB,

	owner: '544031928358273045',
	stats: {
		channel: '695980819650576384',
		message: '695981096202010654',
	},
	cmds: [
		'color',
		'keyboard-translator',
		'info',
		'admin/eval',
		'admin/shell',
		'rub/now',
		'rub/chart',
		'note/add',
		'note/delete',
		'note/edit',
		'note/list',
		'note/purge',
		'note/show',
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

