module.exports = {
	options: [
		{ type: 'command',
			name: 'list',
		},
		{ type: 'command',
			name: 'show',
			options: [
				{ type: 'integer',
					name: 'id',
					required: true
				}
			]
		},
		{ type: 'command',
			name: 'add',
			options: [
				{ type: 'string',
					name: 'text',
					required: true
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
					name: 'id',
					required: true
				},
				{ type: 'string',
					name: 'text',
					required: true
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
					name: 'id',
					required: true
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
			if (notes.length < 1) return msg.createMessage({content: msg.loc.nothing, flags: ephemeral})
			msg.createMessage({content: notes.map((i, k) => `${k+1} (${i.name})`).join('\n'), flags: ephemeral})
			break
		case 'show':
			id = msg.args[0].options[0].value
			note = notes[id-1]
			if (!note) return msg.createMessage({content: msg.loc.missing, flags: ephemeral})
			msg.createMessage(note.text)
			break
		case 'add':
			text = msg.args[0].options[0].value
			name = msg.args[0].options[1]?.value || text.slice(0, 10)+'...'
			id = notes.length + 1
			notes.push({name, text})
			await db.save()
			msg.createMessage({content: msg.loc.created +' '+ id, flags: ephemeral})
			break
		case 'edit':
			id = msg.args[0].options[0].value
			text = msg.args[0].options[1].value
			name = msg.args[0].options[2]?.value || text.slice(0, 10)+'...'
			note = notes[id - 1]
			if (!note) return msg.createMessage({content: msg.loc.missing, flags: ephemeral})
			note.name = name
			note.text = text
			await db.save()
			msg.createMessage({content: msg.loc.updated +' '+ id, flags: ephemeral})
			break
		case 'delete':
			id = msg.args[0].options[0].value
			note = notes[id - 1]
			if (!note) return msg.createMessage({content: msg.loc.missing, flags: ephemeral})
			notes.splice(id - 1, 1)
			await db.save()
			msg.createMessage({content: msg.loc.deleted +' '+ id, flags: ephemeral})
			break
		case 'purge':
			//msg.createMessage({content: msg.loc.sure, flags: ephemeral})
			db.notes = []
			await db.save()
			msg.createMessage({content: msg.loc.purged +' '+ id, flags: ephemeral})
			break
		}
	}
}

