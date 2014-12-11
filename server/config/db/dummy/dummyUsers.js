'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Client = mongoose.model('Client'),
	AccessToken = mongoose.model('AccessToken'),
	RefreshToken = mongoose.model('RefreshToken'),
	log = require('../../log');

User.find({}).remove(function() {
	User.create(
		{
			username: 'miriam',
			password: 'escobar',
			name : 'Miriam Escobar',
			surname : 'Miriam',
			age: 34,
			email: 'francois.dutil@gmail.com'
		},
		function(err) {
				if (err) {
					log.error('Error loading dummy users: ' + err);
				}
				else {
					log.info('Finished populating dummy users');
				}
			}
		);
});



Client.remove({}, function() {
	var client = new Client({ name: 'Web Client', clientId: 'WebClient', clientSecret: 'WebClient' });
	client.save(function(err, client) {
		if(err) { return log.error(err); }
		else { log.info('New client - %s:%s',client.clientId,client.clientSecret); }
	});
});


AccessToken.remove({}, function (err) {
	if (err) { return log.error(err); }
});


RefreshToken.remove({}, function (err) {
	if (err) { return log.error(err); }
});
