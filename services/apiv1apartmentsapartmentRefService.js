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

/*
    var updatedContact = req.body;
    var name = req.params.name;
    if (!updatedContact) {
        console.warn("New PUT request to /contacts/ without contact, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New PUT request to /contacts/" + name + " with data " + JSON.stringify(updatedContact, 2, null));
        if (!updatedContact.name || !updatedContact.phone || !updatedContact.email) {
            console.warn("The contact " + JSON.stringify(updatedContact, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            db.find({ "name": updatedContact.name }, function (err, contacts) {
                if (err) {
                    console.error('Error getting data from DB');
                    res.status(500).send(); // internal server error
                } else {
                    if (contacts.length > 0) {
                        db.update({ name: name }, updatedContact);
                        console.info("Modifying contact with name " + name + " with data " + JSON.stringify(updatedContact, 2, null));
                        res.status(204).send(); // no content
                    } else {
                        console.warn("There are not any contact with name " + name);
                        res.status(404).send(); // not found
                    }
                }
            });
        }
    }
*/