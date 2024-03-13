require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const toursCollection = process.env.TOURS_COLLECTION_ID;
const categoryCollection = process.env.CATEGORIES_COLLECTION_ID;
const fs_tourscollection = process.env.TOURS_COLLECTION_NAME;
const webflow_request = require('request');
const path = require('path');
let fs_dir = path.join(__dirname, '../../');
const init = require(fs_dir + 'fs-init.js');
const webflow_create_tours = require("../tours/create-tours.js");
let fs_arr_id = new Array();
let fs_arr_name = new Array();
let fs_arr_active = new Array();
let fs_arr_desc = new Array();
let fs_arr_lang = new Array();
let fs_arr_cover_img = new Array();
let fs_arr_approval = new Array();
let fs_arr_booked = new Array();
let fs_arr_category = new Array();
let fs_arr_cover_img_ver = new Array();
let fs_arr_deleted = new Array();
let fs_arr_duration = new Array();
let fs_arr_geo_latitude = new Array();
let fs_arr_geo_longitude = new Array();
let fs_arr_guide = new Array();
let fs_arr_guide_pic = new Array();
let fs_arr_likes = new Array();
let fs_arr_isPaid = new Array();
let fs_arr_paid_data = new Array();
let fs_arr_paid_amt = new Array();
let fs_arr_paid_curr = new Array();
let fs_arr_rank = new Array();
let fs_arr_rating = new Array();
let fs_arr_toursRun = new Array();
let fs_arr_stops = new Array();
let fs_arr_tags = new Array();
let fs_arr_owner = new Array();
let fs_arr_superexp = new Array();
let fs_tours_size = 0;
let webf_arr_id = new Array();
let fs_arr_questionReply = new Array();
let fs_arr_geopoint = new Array();

async function read(webflowId) {

  return new Promise((resolve) => {
    const db = init.fs.firestore();

    //Fetch webflow categories data
    const options = {
      method: 'GET',
      url: 'https://api.webflow.com/collections/' + toursCollection + '/items/' + webflowId,
      qs: { offset: '0', limit: '100' },
      headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
      json: true
    };

    webflow_request(options, async function (error, response, body) {

      if (error) throw new Error(error);

      if (body.total !== 0) {
        console.log('Tours exist in webflow');
      }
      else {
        console.log('Tours does not exist in webflow. Creating...');

      }

    });

  });

}


module.exports = { read };
