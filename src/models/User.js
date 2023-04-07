export default {
	id: String,
	AFK: {
		isAFK: {type: Boolean, default: false},
		reason: {type: String, default: ''},
	},
	// TODO: Restore economy?
	notes: [{
		name: {type: String, default: ''},
		text: {type: String, default: ''},
	}],
}

