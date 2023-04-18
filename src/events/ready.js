const parseOptions = (opts, C, k, kk) => {
	for (let o of opts) {
		switch(o.type) {
		case 'command':
			o.type = 1
			break
		case 'group':
			o.type = 2
			break
		case 'string':
			o.type = 3
			break
		case 'integer':
			o.type = 4
			break
		case 'boolean':
			o.type = 5
			break
		case 'user':
			o.type = 6
			break
		default:
			console.warn('wut?')
		}
		o.name_localizations = {}
		o.description_localizations = {}
		for (let lang of C.locale.list) {
			let cmd = C.locale.get('cmds', kk, lang)
			if (!cmd.options || !cmd.options[o.name]) continue
			let opt = cmd.options[o.name]
			o.name_localizations[lang] = opt[0]
			o.description_localizations[lang] = opt[1]
		}
		o.name = o.name_localizations[C.locale.main]
		o.description = o.description_localizations[C.locale.main]

		if ((o.type == 1 || o.type == 2) && o.options) // subcommand and subgroup
			parseOptions(o.options, C, k, kk)
	}
}
const parseCmd = (k, kk, v, C) => {
	let cmd = {
		type: v.messagecmd ? 3 : 1,
		name: k,
		name_localizations: {},
		description_localizations: {},
		options: v.options,
	}
	if (v.options && !v._rd)
		parseOptions(v.options, C, k, kk)
	v._rd = true
	for (let lang of C.locale.list) {
		let loc = C.locale.get('cmds', kk, lang)
		let locsub = []
		if (loc && loc.options && loc.options[k]) locsub = loc.options[k]
		cmd.name_localizations[lang] = locsub[0] || loc.name || k
		if (!v.messagecmd)
			cmd.description_localizations[lang] = locsub[1] || loc.desc || ''
	}
	if (!v.messagecmd)
		cmd.description = cmd.description_localizations[C.locale.main]
	return cmd
}

let cmds = 0
export default (C, api) => {
	if (cmds != C.stats.cmds) {
		console.log('Registering commands')
		cmds = C.stats.cmds

		let a = [], sub = {}
		for (let k in C.cmds) {
			let v = C.cmds[k]
			if (k.search('/') > 0) {
				let [cmd, name] = k.split('/')
				if (!sub[cmd]) {
					sub[cmd] = parseCmd(cmd, cmd, {options: []}, C)
				}
				sub[cmd].options.push(parseCmd(name, cmd, v, C))
				continue
			}
			let cmd = parseCmd(k, k, v, C)
			// eris patches
			cmd.nameLocalizations = cmd.name_localizations
			cmd.descriptionLocalizations = cmd.description_localizations
			a.push(cmd)
		}
		for (let cmd in sub) {
			// eris patches
			sub[cmd].nameLocalizations = sub[cmd].name_localizations
			sub[cmd].descriptionLocalizations = sub[cmd].description_localizations
			a.push(sub[cmd])
		}

		C.api.bulkEditCommands(a)
	}
	C.api.editStatus('online', [
		{name: 'every server', type: 3}
	])
}

