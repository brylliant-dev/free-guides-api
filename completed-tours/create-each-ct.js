require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const completedToursCollection = process.env.COMPLETED_TOURS_COLLECTION_ID;
const toursCollection = process.env.TOURS_COLLECTION_ID; //This is the Collection ID from Webflow CMS
let fs_tourscollection = process.env.TOURS_COLLECTION_NAME;
const webflow_request = require('request');
const path = require('path');
let fs_dir = path.join(__dirname, '../../');
const init = require(fs_dir + 'fs-init.js');

let webf_arr_userid = new Array();
let webf_arr_owner = new Array();
let webf_arr_tourid = new Array();
let tourist_arr_tourname = new Array();
let tourist_arr_pic = new Array();
let tourist_arr_timestamp = new Array();
let tourist_arr_tourid = new Array();
let tourist_arr_feedback = new Array();
let tourist_arr_rating = new Array();
let tourist_arr_name = new Array();

const db = init.fs.firestore();

async function fetchCT(
    tourId_fs,
    ctID,
    tourname,
    touristpic,
    timestamp,
    tourid,
    feedback,
    rating,
    tourist) {

    return new Promise(async (resolve) => {

        tourist_arr_tourname = tourname;
        tourist_arr_pic = touristpic;
        tourist_arr_timestamp = timestamp;
        tourist_arr_tourid = tourid;
        tourist_arr_feedback = feedback;
        tourist_arr_rating = rating;
        tourist_arr_name = tourist;


        var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z'];
        var randomstring = ''; for (var i = 0; i < 5; i++) { randomstring += letters[parseInt(Math.random() * 25)] };

        let tourname_slug = tourname;
        //tourist_arr_feedback[x].replaceAll(' ', '-').toLowerCase();

        try {
            if (tourname === undefined || tourname === null || tourname === '') {
                tourname_slug = randomstring;
            }
            else {
                tourname_slug = tourname.replaceAll(' ', '-').toLowerCase();
            }

        } catch (error) { }

        let timestamp_converted = Date.now();
        if (timestamp !== undefined || timestamp !== null || timestamp !== '') {
            try {
                timestamp_converted = timestamp.toDate();
            } catch (error) {

            }

        }

        //timestamp_converted = timestamp_converted.getDate();

        if (tourid === '' || tourid === undefined || tourid === null) {

            const expCol = db.collection(fs_tourscollection);
            let snapshotExp;

            try {
                snapshotExp = await expCol.get();
            } catch (error) { }


            console.log('Completed tour has no linked experience. Skipping...')
            try {
                snapshotExp.forEach(async doc => {
                    if (doc.id === tourId_fs) {
                        tourid = doc.data().webflowId;
                    }

                });
            } catch (error) { }

        }
        else {

            var str = tourname;
            str = str.toLowerCase().replace(/ /g, '-').replace(/[(中禅寺湖):,|私人庄园–@à&+()-]+/g, '-').replace(/[^\w-]+/g, '');

            if (str.charAt(str.length - 1) === '-') {
                str = str.substring(0, str.length - 1);
            }
            if (str.charAt(0) === '-') {
                str = str.substring(1, str.length - 1);
            }


            //CREATE Webflow Guide Items
            const options = {
                method: 'POST',
                url: 'https://api.webflow.com/collections/' + completedToursCollection + '/items',
                qs: { live: 'true' },
                headers: {
                    'Accept-Version': '1.0.0',
                    Authorization: 'Bearer ' + webflowAPIKey,
                    'content-type': 'application/json'
                },
                body: {
                    fields: {
                        name: tourname,
                        slug: str,
                        tourist: tourist,
                        rating: rating,
                        feedback: feedback,
                        touristpic: { url: touristpic, alt: null },
                        timestamp: timestamp_converted,
                        linkedexperience: tourid,
                        touristurl: touristpic,
                        tourid: tourId_fs,
                        _archived: false,
                        _draft: false
                    }
                },
                json: true
            };

            webflow_request(options, async function (error, response, body) {
                try {
                    if (error) throw new Error(error);


                    resolve(true);
                    console.log(body);
                    console.log(body._id + ' completed tour successfully created.');

                } catch (error) { }

                //Get Completed Tours
                const CTCol = db.collection('completedTours');
                let snapshotCT;

                try {
                    snapshotCT = await CTCol.get();
                }
                catch (err) { }

                try {
                    snapshotCT.forEach(async doc => {

                        if (doc.id === ctID) {
                            // console.log('Tourist: ' + doc.data().tourist);
                            // console.log('Feedback: ' + doc.data().feedback);
                            try {
                                const res = await db.collection('completedTours').doc(doc.id).update({ webflowId: body._id });
                                const resCTInWebflow = await db.collection('completedTours').doc(doc.id).update({ inWebflow: true });

                            } catch (error) {

                            }

                        }



                    });

                } catch (error) { }

            });
            //END CREATE Webflow Guide Items

        }




    });
}

module.exports = { fetchCT };
