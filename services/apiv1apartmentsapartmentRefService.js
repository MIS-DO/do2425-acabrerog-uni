'use strict'

var db = require('../db');


module.exports.findByapartmentRef = function findByapartmentRef(req, res) {
    var apartmentRef = req.params.apartmentRef;
    if (!apartmentRef) {
        console.warn("New GET request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New GET request to /apartments/" + apartmentRef);
        db.find({ "apartmentRef": parseInt(apartmentRef) }, function (err, filteredApartments) {
            if (err) {
                console.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (filteredApartments.length > 0) {
                    var apartment = filteredApartments[0]; //since we expect to have exactly ONE apartment with this name
                    console.info("Sending apartment: " + JSON.stringify(apartment, 2, null));
                    res.send(apartment);
                } else {
                    console.warn("There are no apartments with apartmentRef " + apartmentRef);
                    res.status(404).send(); // not found
                }
            }
        });
    }

}

module.exports.updateApartment = function updateApartment(req, res) {
    res.send({
        message: 'This is the mockup controller for updateApartment'
    });
}

module.exports.deleteApartment = function deleteApartment(req, res) {
    res.send({
        message: 'This is the mockup controller for deleteApartment'
    });
}

