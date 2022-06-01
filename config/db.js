const mongooose = require('mongoose');
module.exports = async function (key) {
	try {
		await mongooose.connect(key, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Mongo OK!');
	} catch (e) {
		console.log(e);
	}
};
