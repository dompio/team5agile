const express = require('express');
const router = express.Router();
const calcCrow = require('../lib/DistanceCalculator');


function setDb(newDb) {
    db = newDb;
}

router.get('/zip2coords', (req, res) => {
    let zip = req.query.zip;
    if (zip) {
        let sql = `SELECT * FROM healthcare.zip_coords WHERE zip_Code=${zip}`;
        db.conn.query(sql, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return console.log(`[GET] /zip2coords error: ${err}`);
            }
            res.status(200).send(result);
        });
    } else {
        res.status(400).send('Please provide a zip code');
    }
});

router.get('/providers', (req, res) => {
    let queryParams = req.query.search_query;
    if (queryParams) {
        let sql = `SELECT * FROM healthcare.provider WHERE provider_Name LIKE "%${queryParams}%" OR provider_ID="${queryParams}";`
        db.conn.query(sql, (err, result) => {
            if (err) {
                res.status(500).send(err);
                return console.log(`[GET] /providers error: ${err}`);
            }
            res.status(200).send(result);
        });
    } else {
        res.status(405).send('Need to provide a seach query');
    }
});

router.get('/procedures', (req, res) => {
    let queryParams = req.query.search_query;
    if (queryParams) {
        let sql = `CALL sortRefineOptions("${queryParams}","${queryParams}","","","avg_Covered_Charges","ASC");`
        db.conn.query(sql, (err, procResult) => {
            if (err) {
                res.status(500).send(err);
                return console.log(`[GET] /procedures error: ${err}`);
            }

            //check for aditional params to filter based on location
            // if (req.query.rad && req.query.zip) {
            if (req.query.rad && req.query.lat && req.query.long) {
                let sql = `SELECT * FROM healthcare.zip_coords;`;
                db.conn.query(sql, (err, zip2CoordsRes) => {
                    if (err) {
                        res.status(500).send(err);
                        return console.log(`[GET] / error: ${req.query.rad}`);
                    }

                    // zip2CoordsRes[0].forEach((c) => {

                    // });
                    let locArr = [];
                    procResult[0].forEach(p => {
                        // console.log((zip2CoordsRes));
                        let coords = zip2CoordsRes.find( z => z.zip_Code == p.provider_Zip );
                        
                        if (!coords) return// console.log(`Nothing found for ${p.provider_Zip}`)

                        let dis = calcCrow(req.query.lat,
                            req.query.long,
                            coords.zip_Lat,
                            coords.zip_Long);

                        if (dis <= req.query.rad) {
                            let newProc = p;
                            newProc.provider_Latitude = coords.zip_Lat;
                            newProc.provider_Longitude = coords.zip_Long;
                            newProc.distance = dis;
                            locArr.push(newProc);
                        }
                    });
                    res.status(200).send(locArr);
                });


                // if (req.query.rad && req.query.lat && req.query.lang ) {

            } else {
                res.status(200).send(procResult[0]);
            } // else not all params provided 

        });
    } else {
        res.status(405).send('Need to provide a seach query');
    }
});

module.exports = { router, setDb };