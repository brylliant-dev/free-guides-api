require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const completedToursCollection = process.env.COMPLETED_TOURS_COLLECTION_ID;
const toursCollection = process.env.TOURS_COLLECTION_ID; //This is the Collection ID from Webflow CMS
const webflow_request = require('request');
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


async function fetchCT(
    tourname,
    touristpic,
    timestamp,
    tourid,
    feedback,
    rating,
    tourist) {

    return new Promise((resolve) => {

        tourist_arr_tourname = tourname;
        tourist_arr_pic = touristpic;
        tourist_arr_timestamp = timestamp;
        tourist_arr_tourid = tourid;
        tourist_arr_feedback = feedback;
        tourist_arr_rating = rating;
        tourist_arr_name = tourist;

        let offset = 0;

        // let guide = new Array();

        // for (let index = 0; index < guide_arr.length; index++) {
        //     //guide.push({ [guide_arr[index]] : {guides: ''}});
        //     guide[index] = {[guide_arr[index]]: []};
        // }

        //Fetch webflow experiences data
        const options = {
            method: 'GET',
            url: 'https://api.webflow.com/collections/' + toursCollection + '/items',
            qs: { offset: '0', limit: '100' },
            headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
            json: true
        };

        webflow_request(options, function (error, response, body) {

            if (error) throw new Error(error);

            //Check total items
            // if (body.total > 100){

            // offset = Math.floor(body.total / 100);

            // console.log('Offset is set to ' + offset);

            // }
            //End Check total items

            try {
                for (let index = 0; index < body.items.length; index++) {
                    webf_arr_owner.push([body.items[index]._id, body.items[index].docid]);
                }
            } catch (error) {

            }


            //let match_guide = [];

            // for (let index = 0; index <  webf_arr_owner.length; index++) {

            //     for (let x = 0; x <guide_arr.length; x++) {

            //         if (guide_arr[x] === webf_arr_owner[index][1]){

            //             guide[x][guide_arr[x]].push(webf_arr_owner[index][0]);

            //         }

            //     }                

            // }
            if (body.total !== 0) {

                try {
                    for (let index = 0; index < body.items.length; index++) {
                        webf_arr_tourid.push(body.items[index].tourid);
                    }
                } catch (error) {

                }


                //Fetch webflow guides data
                const options = {
                    method: 'GET',
                    url: 'https://api.webflow.com/collections/' + completedToursCollection + '/items',
                    qs: { offset: '0', limit: '100' },
                    headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
                    json: true
                };

                webflow_request(options, function (error, response, body) {

                    if (error) throw new Error(error);

                    if (body.total !== 0) {

                        for (let index = 0; index < webf_arr_tourid.length; index++) {

                            if (tourist_arr_tourid.includes(webf_arr_tourid[index])) {

                                console.log('Included')

                            }
                            else {

                                console.log('Not Included')

                            }
                        }

                    }
                    else {

                        resolve();
                        console.log('Completed Tours is Empty');

                        for (let x = 0; x < tourist_arr_tourid.length; x++) {

                            //Get LinkedExperience
                            let linkedexp = "";
                            for (let index = 0; index < webf_arr_owner.length; index++) {
                                if (webf_arr_owner[index][1] === tourist_arr_tourid[x]) {
                                    console.log('Experience ' + webf_arr_owner[index][1] + ' === ' + tourist_arr_tourid[x]);
                                    linkedexp = webf_arr_owner[index][0];
                                    // console.log(linkedexp);
                                }
                            }
                            //End Get LinkedExperience

                            var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z'];
                            var randomstring = ''; for (var i = 0; i < 5; i++) { randomstring += letters[parseInt(Math.random() * 25)] };

                            let tourname_slug = randomstring;
                            //tourist_arr_feedback[x].replaceAll(' ', '-').toLowerCase();

                            try {
                                tourname_slug = tourist_arr_tourname[x].replaceAll(' ', '-').toLowerCase();
                            } catch (error) {

                            }

                            let timestamp_converted = Date.now();
                            try {
                                timestamp_converted = new Date(timestamp);
                            } catch (error) {

                            }


                            //setTimeout(function() {
                            // Add tasks to do

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
                                        name: tourist_arr_tourname[x],
                                        slug: tourname_slug,
                                        tourist: tourist_arr_name[x],
                                        tourid: tourist_arr_tourid[x],
                                        rating: tourist_arr_rating[x],
                                        feedback: tourist_arr_feedback[x],
                                        touristpic: { url: tourist_arr_pic[x], alt: null },
                                        timestamp: timestamp_converted.getDate(),
                                        linkedexperience: linkedexp,
                                        _archived: false,
                                        _draft: false
                                    }
                                },
                                json: true
                            };

                            webflow_request(options, function (error, response, body) {
                                if (error) throw new Error(error);
                                console.log(body);

                            });
                            //END CREATE Webflow Guide Items

                            //}, 1000 * x);

                        }

                        console.log(tourist_arr_pic);
                        console.log(tourist_arr_timestamp);
                        console.log(tourist_arr_tourid);
                        console.log(tourist_arr_feedback);
                        console.log(tourist_arr_rating);
                        console.log(tourist_arr_name);


                    }

                });


            }
            else {
                console.log('Empty Tours');


            }


        });


    });
}

module.exports = { fetchCT };
