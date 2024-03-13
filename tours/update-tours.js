require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const webflow_request = require('request');
const toursCollection = process.env.TOURS_COLLECTION_ID;
const categoryCollection = process.env.CATEGORIES_COLLECTION_ID;
const siteID = process.env.WEBF_SITE_ID;
const websiteDomains = process.env.WEBF_SITE_DOMAIN;
const FieldValue = require('firebase-admin').firestore.FieldValue;
const path = require('path');
let fs_dir = path.join(__dirname,'../../');
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
      url: 'https://api.webflow.com/collections/'+ categoryCollection +'/items',
      qs: {offset: '0', limit: '100'},
      headers: {'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey},
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
  geopoint,
  tourId,
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
  paid){

  //Call category fetch
setTimeout(function() {
//convert to array
  //fs_arr_paid_data = paiddata;
  //fs_arr_isPaid = ispaid;
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
  fs_arr_guide_pic = guide_pic
  fs_arr_rank = rank;
  fs_arr_rating = rating;
  fs_arr_toursRun = toursRun;
 // fs_arr_likes = likes;
  fs_arr_owner = owner;


    //Fetch webflow data
    const options = {
      method: 'GET',
      url: 'https://api.webflow.com/collections/'+ toursCollection +'/items',
      qs: {offset: '0', limit: '100'},
    headers: {'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey},
    json: true
    };
    
    webflow_request(options, async function (error, response, body) {
     
      if (error) throw new Error(error);

      
      if (body.total !== 0){

        //Check likes
        if (likes !== undefined || likes !== null || likes !== '' ){
          try {
            likes = likes.length;
          } catch (error) {
            
          }
        }
        else {
          likes = 0;
        }
        //Check likes

        //Check Category
        let webf_cat_id = '';
        for (let index = 0; index < webf_arr_category.length; index++) {
          if (webf_arr_category[index][1] === category){
            webf_cat_id = webf_arr_category[index][0];
          }
        }
        //End Check Category

        //Check Super Experience
        let isSuperExp = false;
        if (fs_arr_superexp !== undefined || fs_arr_superexp !== null || fs_arr_superexp !== '' ){
          try {
            if (fs_arr_superexp.quality === 'super'){
              isSuperExp = true;
            }
            else {
              isSuperExp = false;
            }
             
          } catch (error) {
            
          }
        }
        else {
          likes = 0;
        }
        //End Check Super Experience

        //Check Paid Amount
        let paid_amount = 0;
        let paid_currency = '';
        try {
          if (paid.amount !== undefined || paid.amount !== null || paid.amount !== '' ){
            paid_amount = paid.amount;
          }
          else {
            paid_amount = 0;
          }

          if (paid.currency !== undefined || paid.currency !== null || paid.currency !== '' ){
            paid_currency = paid.currency;
          }
          else {
            paid_currency = '';
          }


        } catch (error) {
          
        }

      //Check Question Reply
      let questions = '';
      if (questionReply !== undefined || questionReply !== ''){
        questions = questionReply;
      }
      //End Check Question Reply
        
        //Check Cover Images
        let arr_cover_img_url = new Array();
        let cover_img_arr = new Array();
          try {
            for (let index = 0; index < coverimages.length; index++) {
              cover_img_arr.push(coverimages[index]);
              arr_cover_img_url.push({url: coverimages[index], alt: null});
            }
          }catch(err){}
        //End Check Cover Images


        //Split Geopoint
        let geolatitude = '';
        let geolongitude = '';
        if (geopoint !== undefined){
        let arr_geopoint = new Array();
        arr_geopoint.push(geopoint);
        let geo_string = JSON.stringify(geopoint);
        const geo_text = geo_string.replace(/[{}"]/g, '');
        arr_geopoint = [];
        arr_geopoint.push(geo_text);
        let geo_split = arr_geopoint.toString().replace('_latitude:','').replace('_longitude:','').replace('[','').replace(']','');
        let geolocation = geo_split.split(',');
        geolatitude = geolocation[0];
        geolongitude = geolocation[1];
        }
        //End Split Geopoint


    //Get Guide Information
    const docRef = db.collection('users').doc(''+ owner +'');
    
    const doc = await docRef.get();

    let followers = 0;
    let guideRating = new Array();
    let guideBIO = doc.data().bio;
    let guideCountry = doc.data().country;
    
    let cover_images = new Array();
    let main_cover = '';
    
    let tour_country = "";
    let country_code = "";
    //followers = doc.data().follows;
    guideRating = doc.data().guideRating;


    if (!doc.exists) {
      console.log('No such document!');
    } else {

    
      if (doc.data().guideRating === undefined || doc.data().guideRating === null || doc.data().guideRating === ''){
        guideRating = 0;
      }
      if (doc.data().bio === undefined || doc.data().bio === null || doc.data().bio === ''){
        guideBIO = "";
      }
      if (doc.data().country === undefined || doc.data().country === null || doc.data().country === ''){
        guideCountry = "";
      }

      const cTCol = db.collection('users');
      const snapshotCT = await cTCol.where('follows','array-contains', ''+ owner +'').get();

      console.log('Guide Followers ' + snapshotCT.size);
      followers = snapshotCT.size;

    
      //Get Cover Images and Guide Image
      let stops_images = new Object();

      cover_images = coverimages;
      //stops_images = doc.data().Stops;
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
    
      if (cover_images[0] === undefined){
        main_cover = '';
      }

      } catch (error) {}
      //End Get Cover Images and Guide Image


      //Get Country Name From Geolocation
      const res = await fetch('https://nominatim.openstreetmap.org/reverse?lat='+ geolatitude +'&lon='+ geolongitude +'&zoom=3&format=json');
      const json = await res.json();
      var countryMap = {"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"};

      try {
        country_code = json.address.country_code.toUpperCase();
        tour_country = countryMap[country_code];

        //console.log(tour_country);

      } catch (error) {}
      //End Get Country Name From Geolocation

      }
      //End Get Guide Information

                  if (approval === 'rejected'){

                     //Fetch webflow data
                     const optionsDelete = {
                      method: 'DELETE',
                      url: 'https://api.webflow.com/collections/'+ toursCollection +'/items/' + tourId,
                      qs: {live: 'false'},
                      headers: {'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey},
                      json: true
                      };
                    
                    webflow_request(optionsDelete, async function (error, response, body) {
                    
                      if (error) throw new Error(error);

                      console.log('Deleting Doc ID: ' + tours);

                      //PUBLISH
                      const optionsPublish = {
                        method: 'POST',
                        url: 'https://api.webflow.com/sites/'+ siteID +'/publish',
                        headers: {
                        'Accept-Version': '1.0.0',
                        Authorization: 'Bearer ' + webflowAPIKey,
                        'content-type': 'application/json'
                        },
                        body: {domains: [''+websiteDomains+'']},
                        json: true
                        };

                      
                        webflow_request(optionsPublish, function (error, response, body) {
                        if (error) throw new Error(error);

                            console.log(body);
                            
                        });
                        //END PUBLISH

                      });

                  }
                  else {


                     //  //CREATE Webflow Items
                     const options = {
                      method: 'PATCH',
                      url: 'https://api.webflow.com/collections/'+ toursCollection +'/items/' + tourId,
                      qs: {live: 'true'},
                      headers: {
                        'Accept-Version': '1.0.0',
                        Authorization: 'Bearer '+ webflowAPIKey,
                        'content-type': 'application/json'
                      },
                      body: {
                        fields: {
                          name: name,
                          //slug: name.replaceAll(' ','-').toLowerCase(),
                          docid: tours,
                          active: active,
                          description: desc,
                          approvalstatus: approval,
                          coverimages: arr_cover_img_url,
                          maincoverimage: arr_cover_img_url[0],
                          //booked: booked,
                          //category: category,
                          deleted: deleted,
                          duration: duration,
                          guide: guide,
                          guideprofilepic: { url: guide_pic, alt: null},
                          language: lang,
                          likes: likes,
                          owner: owner,
                          ispaid: ispaid,
                          issuperexperience: isSuperExp,
                          stops: JSON.stringify(stops),
                          tags: JSON.stringify(tags),
                          paidamount: paid_amount,
                          paidcurrency: paid_currency,
                          rank: rank,
                          rating: rating,
                          toursrun: toursRun,
                          expcategory: webf_cat_id,
                          questionreply: JSON.stringify(questions),
                          geolatitude: geolatitude,
                          geolongitude: geolongitude,


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
                      if (error) throw new Error(error);
                      //console.log(body);
                      console.log(body._id + ' updated');

                        //webf_guides(body.owner, body._id);
                    });
                  //   //END CREATE Webflow Items

                  }
      

                
              //}


        //}
       
        

        //Check if items exist in webflow
        for (let x = 0; x < fs_arr_id.length; x++) {
          if (webf_arr_docid.includes(fs_arr_id[x])){
            console.log('Update: Included in webflow CMS Doc ID: ' + webf_arr_docid[webf_arr_docid.indexOf(fs_arr_id[x])]);
             

          }
          
        }
        //End Check if items exist in webflow
        
      }
      else {
        console.log('Collection is empty');
      }
    
     
    });

  }, 2000);
}


module.exports = { patch };