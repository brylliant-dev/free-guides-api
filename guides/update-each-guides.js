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

async function patchGuides(
  webf_guideID,
  rating,
  webflowIds,
  pic,
  follows,
  guideID,
  fname,
  lname,
  bio,
  country) {

  return new Promise(async (resolve) => {

    guide_tour_id = webflowIds;
    guide_arr_picture = pic;
    guide_arr_follows = follows;
    guide_arr = guideID;
    guide_arr_fname = fname;
    guide_arr_lname = lname;
    guide_arr_bio = bio;
    guide_arr_country = country;
    webf_linkedexp = webflowIds;
    guide_tour_rating = rating;

    let guide = new Array();
    let offset = 0;
    //Guide Followers
    let get_followers = 0;
    if (guide_arr_follows !== undefined) {
      get_followers = guide_arr_follows.length;
    }

    let guide_name = fname + ' ' + lname;
    // //setTimeout(function() {
    //     // Add tasks to do

    //Update for guides
    let avg_rating = 0;
    //console.log('Guide rating ' + guide_tour_rating);
    try {
      let sum = 0;
      rating.forEach(function (num) { sum += parseFloat(num) || 0; });
      //console.log('Sum of Rating: '+ sum/guide_tour_rating.length);
      avg_rating = (sum / guide_tour_rating.length);
    } catch (error) { }

    console.log('Adding Linked Experience ' + guide_tour_id);




    const docRef = db.collection('users').doc('' + guideID + '');

    const doc = await docRef.get();

    let followers = 0;
    let guideRating = new Array();
    let guideBIO = doc.data().bio;
    let guideCountry = doc.data().country;
    //followers = doc.data().follows;
    guideRating = doc.data().guideRating;

    if (!doc.exists) {
      console.log('No such document!');
    } else {

      if (doc.data().guideRating === undefined || doc.data().guideRating === null || doc.data().guideRating === '') {
        guideRating = 0;
      }
      if (doc.data().bio === undefined || doc.data().bio === null || doc.data().bio === '') {
        guideBIO = "";
      }
      if (doc.data().country === undefined || doc.data().country === null || doc.data().country === '') {
        guideCountry = "";
      }

      const cTCol = db.collection('users');
      const snapshotCT = await cTCol.where('follows', 'array-contains', '' + guideID + '').get();

      console.log('Guide Followers ' + snapshotCT.size);
      followers = snapshotCT.size;

    }

    //CREATE Webflow Guide Items
    const options = {
      method: 'PATCH',
      url: 'https://api.webflow.com/collections/' + guideCollection + '/items/' + webf_guideID,
      qs: { live: 'true' },
      headers: {
        'Accept-Version': '1.0.0',
        Authorization: 'Bearer ' + webflowAPIKey,
        'content-type': 'application/json'
      },
      body: {
        fields: {
          name: guide_name,
          //slug: guide_name.replaceAll(' ','-').toLowerCase(),
          country: country,
          bio: bio,
          userid: guideID,
          linkedexperiences: webflowIds,
          picture: { url: pic, alt: null },
          follows: followers,
          rating: rating,
          _archived: false,
          _draft: false
        }
      },
      json: true
    };

    webflow_request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      resolve(true);
      //console.log('Guide ' + body.name + ' successfully updated.');
      console.log(body);


      //Get Completed Tours
      const CTCol = db.collection('completedTours');
      let snapshotCT;

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
      } catch (error) {

      }

      try {
        snapshotGuide.forEach(async docUser => {


          if (docUser.id === body.userid) {
            // console.log('Tourist: ' + doc.data().tourist);
            // console.log('Feedback: ' + doc.data().feedback);

            const resGuide = await db.collection('users').doc(docUser.id).update({ webflowId: body._id });
          }



        });
      } catch (error) { }
      //End Get Guides

      //Get Tours
      // const toursCol = db.collection(fs_tourscollection);
      // const snapshotTours = await toursCol.get();

      // snapshotTours.forEach(async docTours => {

      // try {
      // if (docTours.data().Owner === body.userid){
      //     // console.log('Tourist: ' + doc.data().tourist);
      //     // console.log('Feedback: ' + doc.data().feedback);
      //     console.log('Updating Experiences Linked Guide: ' +  docTours.data().webflowId);

      //     //webflow_update_linked_guide.patch(docTours.data().webflowId,  body._id);
      // }

      // } catch (error) {}

      // });
      //End Get Tours




    });
    //END CREATE Webflow Guide Items


  });

}

module.exports = { patchGuides };
