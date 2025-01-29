'use strict'

var db = require('../db');
const logger = require('../logger');



module.exports.findByapartmentRef = function findByapartmentRef(req, res) {
    var apartmentRef = req.params.apartmentRef;
    if (!apartmentRef) {
        logger.warn("New GET request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New GET request to /apartments/" + apartmentRef);
        db.find({ "apartmentRef": parseInt(apartmentRef) }, function (err, filteredApartments) {
            if (err) {
                logger.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (filteredApartments.length > 0) {
                    var apartment = filteredApartments[0]; //since we expect to have exactly ONE apartment with this name
                    logger.info("Sending apartment: " + JSON.stringify(apartment, 2, null));
                    res.send(apartment);
                } else {
                    logger.warn("There are no apartments with apartmentRef " + apartmentRef);
                    res.status(404).send(); // not found
                }
            }
        });
    }

}


module.exports.deleteApartment = function deleteApartment(req, res) {
    var apartmentRef = req.params.apartmentRef;
    if (!apartmentRef) {
        logger.warn("New DELETE request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New DELETE request to /apartments/" + apartmentRef);
        db.remove({ "apartmentRef": parseInt(apartmentRef) }, function (err, ApartmentRemoved) {
            if (err) {
                logger.error('Error removing data from DB');
                res.status(500).send(); // internal server error
            } else {
                logger.info("Apartment removed: " + ApartmentRemoved);
                if (ApartmentRemoved ==  1) {
                    logger.info("The apartment with ref: " + apartmentRef+ " has been succesfully deleted, sending 204...");
                    res.status(204).send(); // no content
                } else {
                    logger.warn("There are no apartments to delete ");
                    res.status(404).send(); // not found
                }
            }
        });
    }
}

module.exports.updateApartment = function updateApartment(req, res) {
    
    var updatedApartment = req.body;
    logger.info("req.body: " + JSON.stringify(req.body, 2, null));
    
    var apartmentRef = req.params.apartmentRef;
    logger.info("apartmentRef: " + apartmentRef);

    if (!updatedApartment) {
        logger.warn("New PUT request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New PUT request to /apartments/" + apartmentRef + " with data " + JSON.stringify(updatedApartment, 2, null));
        //if (!updatedApartment.apartmentRef || !updatedApartment.country || !updatedApartment.city || !updatedApartment.area || !updatedApartment.type || !updatedApartment.m2 || !updatedApartment.hasGarage) {
        if (updatedApartment.apartmentRef == null || !updatedApartment.country || !updatedApartment.city || !updatedApartment.area || !updatedApartment.type || updatedApartment.m2 == null || updatedApartment.hasGarage === null) {
            logger.warn("The apartment " + JSON.stringify(updatedApartment, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            logger.info("searching for apartment with apartmentRef: " + apartmentRef);
            db.find({ "apartmentRef": parseInt(apartmentRef) }, function (err, apartments) {
                if (err) {
                    logger.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (apartments.length > 0) {
                        db.update({ "apartmentRef": parseInt(apartmentRef) }, updatedApartment);
                        logger.info("Modifying apartment with apartmentRef " + apartmentRef + " with data " + JSON.stringify(updatedApartment, 2, null));
                        res.status(204).send(); // no content
                        logger.info("Apartment updated: " + JSON.stringify(updatedApartment, 2, null));
                    } else {
                        logger.warn("There are not any apartment with apartmentRef " + apartmentRef);
                        res.status(404).send(); // not found
                    }
                }
            });
        }
    }
}