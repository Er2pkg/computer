export default {
	options: [
		{ type: 'command',
			name: 'list',
		},
		{ type: 'command',
			name: 'show',
			options: [
				{ type: 'integer',
					required: true,
					name: 'id'
				}
			]
		},
		{ type: 'command',
			name: 'add',
			options: [
				{ type: 'string',
					max_length: 2000,
					required: true,
					name: 'text'
				},
				{ type: 'string',
					max_length: 20,
					name: 'short'
				}
			]
		},
		{ type: 'command',
			name: 'edit',
			options: [
				{ type: 'integer',
					required: true,
					name: 'id'
				},
				{ type: 'string',
					max_length: 2000,
					required: true,
					name: 'text'
				},
				{ type: 'string',
					max_length: 20,
					name: 'short'
				}
			]
		},
		{ type: 'command',
			name: 'delete',
			options: [
				{ type: 'integer',
					required: true,
					name: 'id'
				}
			]
		},
		{ type: 'command',
			name: 'purge'
		}
	],
	run: async (C, msg) => {
		let db = await C.models.User.findOne({id: msg.user.id}).exec()
		if (!db) db = await C.models.User.create({id: msg.user.id})
		let notes = db.notes
		let id, name, text, note
		switch(msg.args[0].name) {
		case 'list':
			if (notes.length < 1) return msg.createEphemeral(msg.loc.nothing)
			msg.createEphemeral(notes.map((i, k) => `${k+1} (${i.name})`).join('\n'))
			break
		case 'show':
			id = msg.args[0].options[0].value
			note = notes[id-1]
			if (!note) return msg.createEphemeral(msg.loc.missing)
			msg.createMessage(note.text)
			break
		case 'add':
			text = msg.args[0].options[0].value
			name = msg.args[0].options[1]?.value || text.slice(0, 10)+'...'
			id = notes.length + 1
			notes.push({name, text})
			await db.save()
			msg.createEphemeral(msg.loc.created +' '+ id)
			break
		case 'edit':
			id = msg.args[0].options[0].value
			text = msg.args[0].options[1].value
			name = msg.args[0].options[2]?.value || text.slice(0, 10)+'...'
			note = notes[id - 1]
			if (!note) return msg.createEphemeral(msg.loc.missing)
			note.name = name
			note.text = text
			await db.save()
			msg.createEphemeral(msg.loc.updated +' '+ id)
			break
		case 'delete':
			id = msg.args[0].options[0].value
			note = notes[id - 1]
			if (!note) return msg.createEphemeral(msg.loc.missing)
			notes.splice(id - 1, 1)
			await db.save()
			msg.createEphemeral(msg.loc.deleted +' '+ id)
			break
		case 'purge':
			db.notes = []
			await db.save()
			msg.createEphemeral(msg.loc.purged)
			break
		}
	}
}

