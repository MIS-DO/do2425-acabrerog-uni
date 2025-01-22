'use strict'
var db = require('../db');


module.exports.getApartments = function getApartments(req, res) {
    res.send({
        message: 'This is the mockup controller for getApartments'
    });
}

module.exports.addApartment = function addApartment(req, res) {
    
    var addedApartment = req.body;
    console.info("req.body: " + JSON.stringify(req.body, 2, null));
    
    var apartmentRef = req.params.apartmentRef;
    console.info("apartmentRef: " + apartmentRef);

    if (!addedApartment) {
        console.warn("New ADD request to /apartment/:apartmentRef without apartmentRef, sending 400...");
        res.status(400).send(); // bad request
    } else {
        console.info("New ADD request to /apartments/" + apartmentRef + " with data " + JSON.stringify(addedApartment, 2, null));
        if (addedApartment.apartmentRef == null || !addedApartment.country || !addedApartment.city || !addedApartment.area || !addedApartment.type || addedApartment.m2 == null || addedApartment.hasGarage === null) {
            console.warn("The apartment " + JSON.stringify(addedApartment, 2, null) + " is not well-formed, sending 422...");
            res.status(422).send(); // unprocessable entity
        } else {
            console.info("searching for apartment with apartmentRef: " + apartmentRef);
            db.find({ "apartmentRef": parseInt(apartmentRef) }, function (err, apartments) {
            console.info("after db.find ");
            if (err) {
                console.error('Error getting data from DB');
                res.status(500).send(); // internal server error
            } else {
                if (apartments.length > 0) {
                    console.warn("There is an apartment with this apartmentRef " + apartmentRef +  ". Can't added with this reference");
                    res.status(404).send(); // not found 
                
                } else {
                    db.insert(addedApartment);
                    console.info("Adding apartment with apartmentRef " + apartmentRef + " with data " + JSON.stringify(addedApartment, 2, null));
                    res.status(204).send(); // no content
                    console.info("Apartment added: " + JSON.stringify(addedApartment, 2, null));
                }
            }
        });
        }
    }
}

   

