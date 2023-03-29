module.exports = (C) => {
	C.db = require('mongoose')
	C.db.connect(C.config.dbtoken)
	.catch(console.error)
	.then(() => {
		delete C.config.dbtoken
		console.log('Database connected!')
		C.load('models')
	})
}

