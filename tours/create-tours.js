require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const toursCollection = process.env.TOURS_COLLECTION_ID;
const categoryCollection = process.env.CATEGORIES_COLLECTION_ID;
const fs_tourscollection = process.env.TOURS_COLLECTION_NAME;
const FieldValue = require('firebase-admin').firestore.FieldValue;
const webflow_request = require('request');
const path = require('path');
const e = require('express');
let fs_dir = path.join(__dirname, '../../');
const init = require(fs_dir + 'fs-init.js');
// const fs = require('fs');
// const fetchImg = require('node-fetch');
// const sharp = require('sharp');

let webf_arr_id = new Array();
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
let fs_arr_questions = new Array();
let fs_arr_geopoint = new Array();

//Guides
let fs_arr_guide_id = new Array();
let fs_arr_guide_fname = new Array();
let fs_arr_guide_lname = new Array();
let fs_arr_guide_bio = new Array();
let fs_arr_guide_country = new Array();
let fs_arr_guide_picture = new Array();
let fs_arr_guide_follows = new Array();
let isCreateDone = false;

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


async function fetch(
  sharelink,
  geopoint,
  paiddata,
  ispaid,
  stops,
  tags,
  superexp,
  coverimages,
  tours,
  name,
  active,
  desc,
  lang,
  approval,
  booked,
  category,
  deleted,
  duration,
  guide,
  guide_pic,
  rank,
  rating,
  toursRun,
  likes,
  owner,
  questionReply,
  tours_size) {

  return new Promise(async (resolve) => {

    //Call category fetch
    //convert to array
    //webf_arr_id = webf_id;
    fs_arr_geopoint = geopoint;
    fs_arr_paid_data = paiddata;
    fs_arr_isPaid = ispaid;
    fs_arr_stops = stops;
    fs_arr_tags = tags;
    fs_arr_superexp = superexp;
    fs_arr_cover_img = coverimages;
    fs_arr_id = tours;
    fs_arr_name = name;
    fs_arr_active = active;
    fs_arr_desc = desc;
    fs_arr_lang = lang;
    fs_arr_approval = approval;
    fs_arr_booked = booked;
    fs_arr_category = category;
    fs_arr_deleted = deleted;
    fs_arr_duration = duration;
    fs_arr_guide = guide;
    fs_arr_guide_picture = guide_pic
    fs_arr_rank = rank;
    fs_arr_rating = rating;
    fs_arr_toursRun = toursRun;
    fs_arr_likes = likes;
    fs_arr_owner = owner;
    fs_arr_questions = questionReply;

    let upload_img = "https://uploads-ssl.webflow.com/635087442347dc107b2db976/63742b4634551c421005f6a1_default-img.png";
    let slug_name = '' + name + ''.toString();
    //Check Tour Name Value
    var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'w', 'x', 'y', 'z'];
    var randomstring = '';
    for (var i = 0; i < 5; i++) { randomstring += letters[parseInt(Math.random() * 25)] };

    if (slug_name === '' || slug_name === undefined || name === '' || name === undefined) {
      slug_name = randomstring;
    }
    else {
      try {
        slug_name = fs_arr_name[x].replaceAll(' ', '-').toLowerCase();
      } catch (error) {

      }

    }
    //End Check Tour Name Value

    //Check for paid data
    let get_amount = 0;
    let get_currency = "";
    if (paiddata !== undefined) {
      try {
        get_amount = paiddata.amount;
        get_currency = paiddata.currency;
      } catch (err) { }

    }
    //End Check for paid data

    //Check for super experience
    let get_quality = new Object();
    let isSuperExp = false;
    if (superexp !== undefined) {
      get_quality = superexp.quality;
      if (get_quality == 'super') {
        isSuperExp = true;
      }
    }
    //End Check for super experience


    //Fetch Category Reference Experience
    var webf_ref_id = "";
    for (let index = 0; index < webf_arr_category.length; index++) {
      //const element = array[index];
      if (webf_arr_category[index][1] === category) {
        webf_ref_id = webf_arr_category[index][0];
      }
    }
    //End Fetch Category Reference

    //Check Duration Value
    let duration_val = duration;
    if (duration_val === 'NaN') {
      duration_val = 0;
    }
    else {
      duration_val = duration;
    }
    //End Check Duration Value

    //Check Likes
    try {
      likes = likes.length;
      if (likes !== undefined || likes !== '') {
        //likes = likes.length;
      }
      else {
        likes = 0;
      }
    } catch (error) {

    }

    //End Check Likes

    // //Fetch Individual Cover Image
    // var obj = coverimages;
    // var res = [];

    // for(var i in obj)
    // res.push(obj[i]);
    // //End Fetch Individual Cover Image

    //Check Question Reply
    let questions = '';
    if (questionReply !== undefined || questionReply !== '') {
      questions = questionReply;
    }
    //End Check Question Reply

    //Check Cover Images
    let arr_cover_img_url = new Array();
    let cover_img_arr = new Array();
    try {
      for (let index = 0; index < coverimages.length; index++) {
        cover_img_arr.push(coverimages[index]);
        arr_cover_img_url.push({ url: coverimages[index], alt: null });
      }
    } catch (error) {

    }

    //End Check Cover Images

    //Split Geopoint
    let geolatitude = '';
    let geolongitude = '';
    if (geopoint !== undefined) {
      let arr_geopoint = new Array();
      arr_geopoint.push(geopoint);
      let geo_string = JSON.stringify(geopoint);
      const geo_text = geo_string.replace(/[{}"]/g, '');
      arr_geopoint = [];
      arr_geopoint.push(geo_text);
      let geo_split = arr_geopoint.toString().replace('_latitude:', '').replace('_longitude:', '').replace('[', '').replace(']', '');
      let geolocation = geo_split.split(',');
      geolatitude = geolocation[0];
      geolongitude = geolocation[1];
      if (geolatitude === 'null' || geolatitude === '') {
        geolatitude = 0;
      }
      else {
        geolatitude = geolocation[0];
      }
      if (geolongitude === 'null' || geolongitude === '') {
        geolongitude = 0;
      }
      else {
        geolongitude = geolocation[1];
      }

    }
    //End Split Geopoint



    //Covert Image
    //console.log(arr_cover_img_url[0]);
    // try {
    //   const image = fetchImg(coverimages[0]);
    //   const imageBuffer = image.buffer();
    //   const imageSharp = sharp(imageBuffer).toFile(
    //     "images/downloaded-file.webp"
    //   );
    // } catch (error) {

    // }

    //console.log(imageSharp);
    // const file = fs.readFileSync('images/downloaded-file.webp')
    // const base64String = Buffer.from(file, 'binary').toString('base64')

    // let arr_cover_imgur = new Array();

    //     for (let index = 0; index < fs_arr_cover_img.length; index++) {
    //     //console.log(fs_arr_cover_img[index]);

    //       setTimeout(() => {

    //       try{
    //       var optionsImgur = {
    //         'method': 'POST',
    //         'url': 'https://api.imgur.com/3/image',
    //         'headers': {
    //           'Authorization': 'Client-ID e3524eb189a94c6'
    //         },
    //         formData: {
    //           'image': fs_arr_cover_img[index]
    //         },
    //         json: true
    //       };
    //       webflow_request(optionsImgur, function (error, response) {
    //         if (error) throw new Error(error);

    //         //End Covert Image
    //         console.log(response.body);
    //         //let resize_img = JSON.stringify(response.body.data.link);
    //         arr_cover_imgur.push({url: response.body.data.link, alt: null});

    //         });
    //       } catch (error) {}

    //       }, 1000 * index);
    //     }


    //Get Images in Stops
    let json_stringify = JSON.stringify(stops);
    var json_parse;
    let json_get_json;
    try {
      json_parse = JSON.parse(json_stringify);
      json_get_json = json_parse[0].media;
    } catch (error) { }

    let json_cover_img = arr_cover_img_url[0];
    //fs_arr_content_img.push(json_get_json[0].content);
    try {
      if (arr_cover_img_url[0] === '' || arr_cover_img_url[0] === undefined || arr_cover_img_url[0] === null) {
        json_cover_img = json_get_json[0].content;
        arr_cover_img_url.push(json_cover_img);
      }
      console.log(json_cover_img);
    } catch (error) { }

    //End Get Images in Stops

    if (approval === 'rejected') {
      console.log('Tour ' + tours + ' is rejected. Skipping...');
    }

    else {

      if (approval === 'draft' || approval === '') {
        approval = 'draft';
      }


      var str = '' + name + '';
      str = str.toLowerCase().replace(/ /g, '-').replace(/[(中禅寺湖):,|私人庄园–@à&+()-]+/g, '-').replace(/[^\w-]+/g, '');

      if (str.charAt(str.length - 1) === '-') {
        str = str.substring(0, str.length - 1);
      }
      if (str.charAt(0) === '-') {
        str = str.substring(1, str.length - 1);
      }

      console.log(str);


      //Get Guide Information
      const docRef = db.collection('users').doc('' + owner + '');

      const doc = await docRef.get();

      let followers = 0;
      let guideRating = 0;
      let guideBIO = '';
      let guideCountry = '';

      try {
        guideBIO = doc.data().bio;
        guideCountry = doc.data().country;
        guideRating = doc.data().guideRating;
      } catch (error) { }


      let cover_images = new Array();
      let stops_images = new Object();
      let main_cover = '';

      let tour_country = "";
      let country_code = "";
      //followers = doc.data().follows;



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
        const snapshotCT = await cTCol.where('follows', 'array-contains', '' + owner + '').get();

        console.log('Guide Followers ' + snapshotCT.size);
        followers = snapshotCT.size;



        //Get Cover Images and Guide Image

        cover_images = coverimages;
        stops_images = doc.data().Stops;
        //let cover_json = JSON.parse({cover_images});

        // for (let index = 0; index < cover_images.length; index++) {
        //   cover_images;
        // }
        // console.log('Cover Images: ' + [cover_images]);
        // console.log('Main Cover Image: ' + cover_images[0]);
        // console.log('Guide Profile: ' + doc.data().guideProfilePic);
        // console.log(stops_images[1].media);
        try {
          main_cover = cover_images[0];


          if (cover_images[0] === undefined) {
            main_cover = '';
          }

        } catch (error) { }
        //End Get Cover Images and Guide Image


        //Get Country Name From Geolocation
        let res;
        let json;

        try {
          res = await fetch('https://nominatim.openstreetmap.org/reverse?lat=' + geolatitude + '&lon=' + geolongitude + '&zoom=3&format=json');
          json = await res.json()
        } catch (error) { }


        var countryMap = { "BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique" };


        try {
          country_code = json.address.country_code.toUpperCase();
          tour_country = countryMap[country_code];

          //console.log(tour_country);

        } catch (error) { }
        //End Get Country Name From Geolocation

      }
      //End Get Guide Information


      //CREATE Webflow Items
      const options = {
        method: 'POST',
        url: 'https://api.webflow.com/collections/' + toursCollection + '/items',
        qs: { live: 'true' },
        headers: {
          'Accept-Version': '1.0.0',
          Authorization: 'Bearer ' + webflowAPIKey,
          'content-type': 'application/json'
        },
        body: {
          fields: {
            name: name,
            slug: str,
            docid: tours,
            active: active,
            description: desc,
            approvalstatus: approval,
            //coverimages : arr_cover_img_url,
            //maincoverimage: arr_cover_img_url[0],
            coverimages: [{ url: upload_img }],
            //maincoverimage: json_cover_img,
            //booked: booked,
            //category: category,
            deleted: deleted,
            duration: duration_val,
            guide: guide,
            //guideprofilepic: { url: guide_pic, alt: null},
            language: lang,
            likes: likes,
            owner: owner,
            ispaid: ispaid,
            issuperexperience: isSuperExp,
            stops: JSON.stringify(stops),
            tags: JSON.stringify(tags),
            paidamount: get_amount,
            paidcurrency: get_currency,
            rank: rank,
            rating: rating,
            toursrun: toursRun,
            expcategory: webf_ref_id,
            questionreply: JSON.stringify(questions),
            geolatitude: geolatitude,
            geolongitude: geolongitude,
            sharelink: sharelink,

            guiderating: guideRating,
            guidefollowers: followers,
            guidebio: guideBIO,
            guidecountry: guideCountry,

            tourcountry: tour_country,
            coverimagesurl: JSON.stringify(cover_images),
            maincoverurl: main_cover,
            guideimageurl: guide_pic,


            _archived: false,
            _draft: false
          }
        },
        json: true
      };

      webflow_request(options, async function (error, response, body) {

        try {
          if (error) throw new Error(error);

        } catch (error) {

        }


        resolve(body._id);

        console.log(body);




        //Tours
        try {
          const res = await db.collection(fs_tourscollection).doc(body.docid).update({ webflowId: body._id });

        } catch (error) { }

        //console.log(body);
        try {
          //console.log(body._id + ' created.');
        } catch (error) {

        }

        try {

          if (body._id !== undefined || body._id !== null || body._id !== '') {
            const resId = await db.collection(fs_tourscollection).doc(body.docid).update({ inWebflow: true });
          }

        } catch (error) { }



        // if (){

        // }
        // try {
        //   const updateGuides = await db.collection('users').doc(body.owner).update({linkedexp: [body._id]});
        // } catch (error) {}

        try {
          const resGuides = await db.collection('users').doc(body.owner).update({ linkedexp: FieldValue.arrayUnion(body._id) });
        } catch (error) {
        }

        //Get Completed Tours
        const CTCol = db.collection('completedTours');
        let snapshotCT;

        try {
          snapshotCT = await CTCol.get();
        } catch (error) { }



        try {

          snapshotCT.forEach(async doc => {

            if (doc.data().tourId === body.docid) {
              // console.log('Tourist: ' + doc.data().tourist);
              // console.log('Feedback: ' + doc.data().feedback);
              console.log('Creating Completed Tours Linked Experience: ' + body._id);
              const res = await db.collection('completedTours').doc(doc.id).update({ linkedexp: body._id });
              const resEating = await db.collection('users').doc(body.owner).update({ ratinglist: FieldValue.arrayUnion(doc.data().rating) });

            }

          });

        } catch (error) { }



        //End Get Completed Tours

      });

    }
    //console.log(body.response);

  });
  //End Convert Image

}
module.exports = { fetch };

