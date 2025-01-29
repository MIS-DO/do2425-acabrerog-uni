'use strict'
var db = require('../db');
const logger = require('../logger');



module.exports.getApartments = function getApartments(req, res) {
    logger.info("New GET request to /apartments/");
    db.find({}, function (err, allApartments) {
        if (err) {
            logger.error('Error getting data from DB');
            res.status(500).send(); // internal server error
        } else {
            if (allApartments.length > 0) {
                logger.info("Sending apartments: " + JSON.stringify(allApartments, 2, null));
                res.send(allApartments);
            } else {
                logger.warn("There are no apartments");
                res.status(404).send(); // not found
            }
        }
    });
}

module.exports.addApartment = function addApartment(req, res) {
    
    var addedApartment = req.body;
    logger.info("req.body: " + JSON.stringify(req.body, 2, null));
    
    var apartmentRef = req.params.apartmentRef;
    logger.info("apartmentRef: " + apartmentRef);

    if (!addedApartment) {
        logger.warn("New ADD request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        logger.info("New ADD request to /apartments/" + apartmentRef + " with data " + JSON.stringify(addedApartment, 2, null));
        if (addedApartment.apartmentRef == null || !addedApartment.country || !addedApartment.city || !addedApartment.area || !addedApartment.type || addedApartment.m2 == null || addedApartment.hasGarage === null) {
            logger.warn("The apartment " + JSON.stringify(addedApartment, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            logger.info("searching for apartment with apartmentRef: " + apartmentRef);
            db.find({ "apartmentRef": parseInt(apartmentRef) }, function (err, apartments) {
            logger.info("after db.find ");
            if (err) {
                logger.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (apartments.length > 0) {
                    logger.warn("There is an apartment with this apartmentRef " + apartmentRef +  ". Can't added with this reference");
                    res.status(404).send(); // not found 
                
                } else {
                    db.insert(addedApartment);
                    logger.info("Adding apartment with apartmentRef " + apartmentRef + " with data " + JSON.stringify(addedApartment, 2, null));
                    res.status(204).send(); // no content
                    logger.info("Apartment added: " + JSON.stringify(addedApartment, 2, null));
                }
            }
        });
        }
    }
}

   

