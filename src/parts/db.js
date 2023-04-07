import mongoose from 'mongoose'

export default (C) => {
	C.db = mongoose
	C.db.connect(C.config.dbtoken)
	.catch(console.error)
	.then(() => {
		delete C.config.dbtoken
		console.log('Database connected!')
		C.load('models')
	})
}

