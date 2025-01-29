'use strict'

var db = require('../db');
//const console = require('../console');



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


module.exports.deleteApartment = function deleteApartment(req, res) {
    var apartmentRef = req.params.apartmentRef;
    if (!apartmentRef) {
        console.warn("New DELETE request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New DELETE request to /apartments/" + apartmentRef);
        db.remove({ "apartmentRef": parseInt(apartmentRef) }, function (err, ApartmentRemoved) {
            if (err) {
                console.error('Error removing data from DB');
                res.status(500).send(); // internal server error
            } else {
                console.info("Apartment removed: " + ApartmentRemoved);
                if (ApartmentRemoved ==  1) {
                    console.info("The apartment with ref: " + apartmentRef+ " has been succesfully deleted, sending 204...");
                    res.status(204).send(); // no content
                } else {
                    console.warn("There are no apartments to delete ");
                    res.status(404).send(); // not found
                }
            }
        });
    }
}

module.exports.updateApartment = function updateApartment(req, res) {
    
    var updatedApartment = req.body;
    console.info("req.body: " + JSON.stringify(req.body, 2, null));
    
    var apartmentRef = req.params.apartmentRef;
    console.info("apartmentRef: " + apartmentRef);

    if (!updatedApartment) {
        console.warn("New PUT request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New PUT request to /apartments/" + apartmentRef + " with data " + JSON.stringify(updatedApartment, 2, null));
        //if (!updatedApartment.apartmentRef || !updatedApartment.country || !updatedApartment.city || !updatedApartment.area || !updatedApartment.type || !updatedApartment.m2 || !updatedApartment.hasGarage) {
        if (updatedApartment.apartmentRef == null || !updatedApartment.country || !updatedApartment.city || !updatedApartment.area || !updatedApartment.type || updatedApartment.m2 == null || updatedApartment.hasGarage === null) {
            console.warn("The apartment " + JSON.stringify(updatedApartment, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            console.info("searching for apartment with apartmentRef: " + apartmentRef);
            db.find({ "apartmentRef": parseInt(apartmentRef) }, function (err, apartments) {
                if (err) {
                    console.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (apartments.length > 0) {
                        db.update({ "apartmentRef": parseInt(apartmentRef) }, updatedApartment);
                        console.info("Modifying apartment with apartmentRef " + apartmentRef + " with data " + JSON.stringify(updatedApartment, 2, null));
                        res.status(204).send(); // no content
                        console.info("Apartment updated: " + JSON.stringify(updatedApartment, 2, null));
                    } else {
                        console.warn("There are not any apartment with apartmentRef " + apartmentRef);
                        res.status(404).send(); // not found
                    }
                }
            });
        }
    }
}