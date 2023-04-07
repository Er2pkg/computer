let parseOptions = (opts, C, k) => {
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
			let cmd = C.locale.get('cmds', k, lang)
			let opt = cmd.options[o.name]
			if (!opt) continue
			o.name_localizations[lang] = opt[0]
			o.description_localizations[lang] = opt[1]
		}
		o.name = o.name_localizations[C.locale.main]
		o.description = o.description_localizations[C.locale.main]

		if ((o.type == 1 || o.type == 2) && o.options) // subcommand and subgroup
			parseOptions(o.options, C, k)
	}
}

let cmds = 0
export default (C, api) => {
	if (!C.stats.cmds)
		C.load('cmds')

	if (cmds != C.stats.cmds) {
		cmds = C.stats.cmds

		// Register commands
		let a = []
		for (let k in C.cmds) {
			let v = C.cmds[k]
			let b = {
				type: v.messagecmd ? 3 : 1,
				name: k,
				nameLocalizations: {},
				descriptionLocalizations: {},
				options: v.options,
			}
			if (v.options && !v._rd)
				parseOptions(v.options, C, k)
			for (let lang of C.locale.list) {
				let cmd = C.locale.get('cmds', k, lang)
				b.nameLocalizations[lang] = cmd.name || k
				if (!v.messagecmd) b.descriptionLocalizations[lang] = cmd.desc || C.locale.get('cmds', 'not_des', lang)
			}
			if (!v.messagecmd) b.description = b.descriptionLocalizations[C.locale.main]
			v._rd = true
			a.push(b)
		}

		C.api.bulkEditCommands(a)
	}
	C.api.editStatus('online', [
		{name: 'every server', type: 3}
	])
}

