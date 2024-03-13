require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const webflow_request = require('request');
const toursCollection = process.env.TOURS_COLLECTION_ID;
const categoryCollection = process.env.CATEGORIES_COLLECTION_ID;
const FieldValue = require('firebase-admin').firestore.FieldValue;
const path = require('path');
let fs_dir = path.join(__dirname, '../../');
const init = require(fs_dir + 'fs-init.js');

let webf_body = new Object();
let webf_arr_docid = new Array();
let fs_arr_id = new Array();
let fs_arr_name = new Array();
let fs_arr_active = new Array();
let fs_arr_desc = new Array();
let fs_arr_lang = new Array();
let fs_arr_cover_img = new Array();
let fs_arr_approval = new Array();
let fs_arr_booked = new Array();
let fs_arr_category = new Array();
let fs_arr_deleted = new Array();
let fs_arr_duration = new Array();
let fs_arr_guide = new Array();
let fs_arr_guide_pic = new Array();
let fs_arr_likes = new Array();
let fs_arr_isPaid = new Array();
let fs_arr_paid_amt = new Array();
let fs_arr_paid_curr = new Array();
let fs_arr_rank = new Array();
let fs_arr_rating = new Array();
let fs_arr_toursRun = new Array();
let fs_arr_stops = new Array();
let fs_arr_tags = new Array();
let fs_arr_owner = new Array();
let fs_arr_superexp = new Array();
let fs_arr_paid_data = new Array();
let webf_arr_category = new Array();
let fs_arr_geopoint = new Array();

const db = init.fs.firestore();

//Fetch webflow categories data
const options = {
  method: 'GET',
  url: 'https://api.webflow.com/collections/' + categoryCollection + '/items',
  qs: { offset: '0', limit: '100' },
  headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
  json: true
};

webflow_request(options, function (error, response, body) {

  if (error) throw new Error(error);

  try {
    for (let index = 0; index < body.items.length; index++) {
      webf_arr_category.push([body.items[index]._id, body.items[index].name]);
    }
  } catch (error) {

  }


});

async function patch(
  tourId,
  guideId) {

  //Call category fetch
  setTimeout(function () {

    //convert to array
    //fs_arr_paid_data = paiddata;
    //fs_arr_isPaid = ispaid;
    // fs_arr_stops = stops;
    // fs_arr_tags = tags;
    // fs_arr_superexp = superexp;
    // fs_arr_cover_img = coverimages;
    // fs_arr_id = tours;
    // fs_arr_name = name;
    // fs_arr_active = active;
    // fs_arr_desc = desc;
    // fs_arr_lang = lang;
    // fs_arr_approval = approval;
    // fs_arr_booked = booked;
    // fs_arr_category = category;
    // fs_arr_deleted = deleted;
    // fs_arr_duration = duration;
    // fs_arr_guide = guide;
    // fs_arr_guide_pic = guide_pic
    // fs_arr_rank = rank;
    // fs_arr_rating = rating;
    // fs_arr_toursRun = toursRun;
    // fs_arr_likes = likes;
    //fs_arr_owner = owner;


    //  //CREATE Webflow Items
    const options = {
      method: 'PATCH',
      url: 'https://api.webflow.com/collections/' + toursCollection + '/items/' + tourId,
      qs: { live: 'true' },
      headers: {
        'Accept-Version': '1.0.0',
        Authorization: 'Bearer ' + webflowAPIKey,
        'content-type': 'application/json'
      },
      body: {
        fields: {
          linkedguide: guideId,
          _archived: false,
          _draft: false
        }
      },
      json: true
    };

    webflow_request(options, async function (error, response, body) {
      if (error) throw new Error(error);
      //console.log(body);
      console.log(body);

      //webf_guides(body.owner, body._id);
    });


  });

}


module.exports = { patch };
