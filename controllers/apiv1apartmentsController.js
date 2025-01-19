const service = require('../services/apiv1apartmentsService.js');

module.exports.getApartments = function getApartments(req, res) {
    service.getApartments(req, res);
}

module.exports.addApartment = function addApartment(req, res) {
    service.addApartment(req, res);
}

