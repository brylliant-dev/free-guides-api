require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const guideCollection = process.env.GUIDES_COLLECTION_ID;
const toursCollection = process.env.TOURS_COLLECTION_ID; //This is the Collection ID from Webflow CMS
const fs_tourscollection = process.env.TOURS_COLLECTION_NAME;
const webflow_request = require('request');
const path = require('path');
let fs_dir = path.join(__dirname, '../../');
const init = require(fs_dir + 'fs-init.js');
const webflow_update_linked_guide = require("../tours/update-linked-guide.js");

let webf_arr_userid = new Array();
let webf_linkedexp = new Array();
let guide_arr = new Array();
let guide_arr_fname = new Array();
let guide_arr_lname = new Array();
let guide_arr_bio = new Array();
let guide_arr_country = new Array();
let guide_arr_picture = new Array();
let guide_arr_follows = new Array();
let guide_tour_id = new Array();
let guide_tour_rating = new Array();

const db = init.fs.firestore();

async function fetchGuides(
    owner,
    webflowIds
) {

    return new Promise(async (resolve) => {

        // guide_tour_rating = rating;
        // guide_tour_id = webflowIds;
        // guide_arr_picture = pic;    
        // guide_arr_follows = follows;
        // guide_arr = guideID;    
        // guide_arr_fname = fname;
        // guide_arr_lname = lname;
        // guide_arr_bio = bio;
        // guide_arr_country = country;
        // webf_linkedexp = webflowIds;


        //Query users collection
        let snapshotGuide;
        let guideCol;
        try {
            guideCol = db.collection('users').doc(owner);

        } catch (error) {

        }


        try {
            snapshotGuide = await guideCol.get();
        } catch (error) { }


        try {
            snapshotGuide.forEach(async docUser => {

                // if (owner == docUser.id){

                //Update  
                try {
                    const resGuides = await db.collection('users').doc(docUser.id).update({ linkedexp: FieldValue.arrayUnion(webflowIds) });
                } catch (error) { }

                setTimeout(() => {


                    //Guide Followers
                    let get_followers = 0;
                    guide_arr_follows = docUser.data().follows;
                    if (guide_arr_follows !== undefined) {
                        get_followers = guide_arr_follows.length;
                    }


                    let guide_name = docUser.data().firstName + ' ' + docUser.data().lastName;
                    guide_name = guide_name.replace(/[^a-zA-Z ]/g, "");
                    console.log(guide_name);
                    // //setTimeout(function() {
                    //     // Add tasks to do

                    let avg_rating = 0;
                    guide_tour_rating = docUser.data().ratinglist;
                    try {
                        let sum = 0;
                        guide_tour_rating.forEach(function (num) { sum += parseFloat(num) || 0; });
                        //console.log('Sum of Rating: '+ sum/guide_tour_rating.length);
                        avg_rating = (sum / guide_tour_rating.length);
                    } catch (error) { }


                    //CREATE Webflow Guide Items
                    const options = {
                        method: 'POST',
                        url: 'https://api.webflow.com/collections/' + guideCollection + '/items',
                        qs: { live: 'true' },
                        headers: {
                            'Accept-Version': '1.0.0',
                            Authorization: 'Bearer ' + webflowAPIKey,
                            'content-type': 'application/json'
                        },
                        body: {
                            fields: {
                                name: guide_name,
                                slug: guide_name.replaceAll(' ', '-').toLowerCase(),
                                country: docUser.data().country,
                                bio: docUser.data().bio,
                                userid: docUser.id,
                                linkedexperiences: docUser.data().linkedexp,
                                picture: { url: docUser.data().picture, alt: null },
                                follows: get_followers,
                                rating: avg_rating,
                                imageurl: docUser.data().picture,
                                _archived: false,
                                _draft: false
                            }
                        },
                        json: true
                    };

                    webflow_request(options, async function (error, response, body) {
                        if (error) throw new Error(error);
                        resolve(true);
                        //console.log('Guide ' + body.name + ' successfully created.');
                        console.log(body);

                        //Get Completed Tours
                        const CTCol = db.collection('completedTours');

                        let snapshotCT

                        try {
                            snapshotCT = await CTCol.get();
                        } catch (error) {

                        }


                        try {
                            snapshotCT.forEach(async docUser => {

                                if (docUser.data().userId === body.userid) {
                                    // console.log('Tourist: ' + doc.data().tourist);
                                    // console.log('Feedback: ' + doc.data().feedback);
                                    console.log('Creating Completed Tours Linked Guide: ' + body._id);

                                    const resCT = await db.collection('completedTours').doc(docUser.id).update({ linkedguide: body._id });
                                    const resTour = await db.collection(fs_tourscollection).doc(docUser.data().tourId).update({ linkedguide: body._id });

                                }



                            });

                        } catch (error) { }

                        //End Get Guides

                        //Get Guides
                        const guideCol = db.collection('users');
                        let snapshotGuide;

                        try {
                            snapshotGuide = await guideCol.get();
                        } catch (error) { }


                        try {
                            snapshotGuide.forEach(async docUser => {


                                if (docUser.id === body.userid) {
                                    // console.log('Tourist: ' + doc.data().tourist);
                                    // console.log('Feedback: ' + doc.data().feedback);

                                    const resGuide = await db.collection('users').doc(docUser.id).update({ webflowId: body._id });
                                    const resGuidesInWebflow = await db.collection('users').doc(docUser.id).update({ inWebflow: true });
                                }



                            });
                            //End Get Guides
                        } catch (error) { }



                    });
                    //END CREATE Webflow Guide Items

                }, 1000);



                // }
                // else {

                //     console.log('No guides to sync..');
                // }

            });

        } catch (err) { }





        //Skips guides that has no linked experiences



    });

}

module.exports = { fetchGuides };
