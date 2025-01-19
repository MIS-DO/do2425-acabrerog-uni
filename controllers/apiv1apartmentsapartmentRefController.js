const service = require('../services/apiv1apartmentsapartmentRefService.js');

module.exports.findByapartmentRef = function findByapartmentRef(req, res) {
    service.findByapartmentRef(req, res);
}

module.exports.updateApartment = function updateApartment(req, res) {
    service.updateApartment(req, res);
}

module.exports.deleteApartment = function deleteApartment(req, res) {
    service.deleteApartment(req, res);
}

