'use strict';

var mongoose = require('mongoose'),
	Customer = mongoose.model('Customer'),
	Product = mongoose.model('Product'),
	SalesOrder = mongoose.model('SalesOrder'),
	log = require('../../log'),
	Q = require('q');



var createCustomers = function() {
	var deferred = Q.defer();

	Customer.find({}).remove(function() {
		Customer.create(
			{
				name: 'Miriam Escobar',
				address: 'Santa Marta',
				state: 'Magdalena',
				country: 'Colombia'
			},


			function(err, customer) {
				if (err) {
					log.error('Error loading dummy customers: ' + err);
					deferred.reject(err);
				}
				else {
					log.info('Finished populating dummy customers');
					deferred.resolve(customer);
				}
			}
		);
	});

	return deferred.promise;

};

var createProducts = function() {
	var deferred = Q.defer();

	Product.find({}).remove(function() {
		Product.create(
			{
				description: 'Televisor 42" LCD Panasonic',
				price: 750.000,00
			},
			{
				description: 'Sofa 2 puestos',
				price: 250.000,00
			},
			{
				description: 'Escritorio laminado blanco',
				price: 450.00,00
			},
			{
				description: 'Mesa de madera y vidrio',
				price: 600.00,00
			},
			{
				description: 'Aire Acondicionado MiniSplit Royal 9000 btu 220v',
				price: 350.00,00
			},
			{
				description: 'Lavadora ',
				price: 130.00,00
			},
			{
				description: 'Abanico de pie',
				price: 40.000,00
			},
			{
				description: 'Caballetes (10)',
				price: 30.000,00
			},
			{
				description: 'Acesorios Cocina',
				price: 5.000,00 - 50.000,00
			},
			{
				description: 'Impresora Laser Canon ML-1675',
				price: 50.000,00
			},
			{
				description: 'Obras',
				price: 50.000,00 - 1.000.000,00
			},
			{
				description: 'Juego de cuarto',
				price: 750.000,00
			},
			{
				description: 'Silla de Oficina',
				price: 50.000,00
			},
			{
				description: 'Acesocios de oficina',
				price: 5.000,00 - 50.000,00
			},
			{
				description: 'Projector con Pantalla',
				price: 250.000,00
			},
			{
				description: 'Mesa de noche (negra)',
				price: 25.000,00
			},
			function(err, product) {
				if (err) {
					log.error('Error loading dummy products: ' + err);
					deferred.reject(err);
				}
				else {
					log.info('Finished populating dummy products');
					deferred.resolve(product);
				}
			}
		);
	});

	return deferred.promise;

};


var getSalesOrderToCreate = function(state, customer, product, quantity, price) {

	var salesOrder = new SalesOrder( {
		state: state,
		customer: customer,
		lines: [
			{
				product: product,
				quantity: quantity,
				price: price
			},
			{
				product: product,
				quantity: (quantity + 1),
				price: (price * 2)
			}
		]
	} );

	return salesOrder;

};


var createSalesOrders = function(params) {

	var customer = params[0],
		product = params[1],
		deferred = Q.defer();

	SalesOrder.find({}).remove(function() {

		var salesOrder = getSalesOrderToCreate('received', customer, product, 1, 13);
		salesOrder.save();

		salesOrder = getSalesOrderToCreate('preparing', customer, product, 1, 5);
		salesOrder.save();

		salesOrder = getSalesOrderToCreate('closed', customer, product, 2, 50);
		salesOrder.save(function(err, createdSalesOrder) {
			if (err) { deferred.reject(err); }

			log.info('Finished populating dummy sales orders');
			deferred.resolve(createdSalesOrder);
		});


	});

	return deferred.promise;

};


var findSalesOrder = function() {

	SalesOrder
		.findOne({})
		.populate('customer lines.product')
		.exec(function(err, salesOrder) {

			if (err) { log.error(err); }
			log.info('SalesOrder created: ' + salesOrder);
			//log.info('customer: ' + salesOrder.customer.name);
			//log.info('product: ' + salesOrder.lines[0].product.description);

		});

};



Q.all([createCustomers(), createProducts()])
	.then(createSalesOrders)
	.then(findSalesOrder)
	.done();
