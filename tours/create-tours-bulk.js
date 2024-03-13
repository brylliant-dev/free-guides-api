require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const toursCollection = process.env.TOURS_COLLECTION_ID;
const categoryCollection = process.env.CATEGORIES_COLLECTION_ID;
const fs_tourscollection = process.env.TOURS_COLLECTION_NAME;
const webflow_request = require('request');
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
let fs_arr_questions = new Array();

//Guides
let fs_arr_guide_id = new Array();
let fs_arr_guide_fname = new Array();
let fs_arr_guide_lname = new Array();
let fs_arr_guide_bio= new Array();
let fs_arr_guide_country = new Array();
let fs_arr_guide_picture = new Array();
let fs_arr_guide_follows = new Array();
let isCreateDone = false;

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
      try {
        if (error) throw new Error(error);
      } catch (error) {
        
      }
     
  
      try {
        for (let index = 0; index < body.items.length; index++) {
          webf_arr_category.push([body.items[index]._id, body.items[index].name]);
      } 
      } catch (error) {
        
      }
    
      });   

async function fetch(
  questionReply,
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
  collection, 
  tours_size){


 return new Promise((resolve) => {

  //Call category fetch

  //convert to array
  fs_arr_questions = questionReply;
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

      try {
        for (let index = 0; index < body.items.length; index++) {
          webf_arr_docid.push(body.items[index].docid);
        }
      } catch (error) {
        
      }
       

      if (body.total !== 0){


        // Check if items exist in webflow
        //     Fetch webflow data
            const options = {
              method: 'GET',
              url: 'https://api.webflow.com/collections/'+ collection +'/items',
              qs: {offset: '0', limit: '100'},
            headers: {'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey},
            json: true
            };
            
            webflow_request(options, async function (error, response, body) {
            
              if (error) throw new Error(error);

                if (body.total !== 0){

                  for (let x = 0; x < fs_arr_id.length; x++) {

                    if (webf_arr_docid.includes(fs_arr_id[x])){
                      console.log('Tour exist in webflow CMS Tour ID: ' + webf_arr_docid[webf_arr_docid.indexOf(fs_arr_id[x])]);
                    }
                    else {
                      //Fetch Category Reference Experience
                      var webf_ref_id = "";
                      for (let index = 0; index < webf_arr_category.length; index++) {
                        //const element = array[index];
                        if (webf_arr_category[index][1]===fs_arr_category[x]){
                          webf_ref_id = webf_arr_category[index][0];
                        }
                      }
                      //End Fetch Category Reference
          
                      //Check Duration Value
                      let duration_val = [x];
                      if (duration_val === 'NaN'){
                        duration_val = 0;
                      }
                      else {
                        duration_val = fs_arr_duration[x];
                      }
                      //End Check Duration Value
          
          
                      //Check Tour Name Value
                      var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','w','x','y','z']; 
                      var randomstring = ''; 
                      for(var i = 0; i < 5; i++){randomstring += letters[parseInt(Math.random() * 25)]};
                      let slug_name = randomstring;
                      if (slug_name === '' || slug_name === undefined || slug_name === null){
                        slug_name = randomstring;
                      }
                      else {
                        try {
                          slug_name = fs_arr_name[x].replaceAll(' ', '-').toLowerCase();
                        } catch (error) {
                          
                        }
                       
                      }
                      //End Check Tour Name Value
                      
          
                      //Check for empty likes
                      let get_likes = new Object();
                      if (fs_arr_likes[x] !== undefined){
                      get_likes = fs_arr_likes[x];
                      }
                      //End check for empty likes
          
                      //Check for super experience
                      let get_quality = new Object();
                      let isSuperExp = false;
                      if (fs_arr_superexp[x] !== undefined){
                        get_quality = fs_arr_superexp[x].quality;
                        if (get_quality == 'super'){
                          isSuperExp = true;
                        }
                      }
                      //End Check for super experience
          
                      //Check for paid data
                      let get_amount = 0;
                      let get_currency = "";
                      if (fs_arr_paid_data[x] !== undefined){
                        get_amount = fs_arr_paid_data[x].amount;
                        get_currency = fs_arr_paid_data[x].currency;
                        
                      }
                      //End Check for paid data
          
                      //Fetch Individual Stops
                      let stops_location = new Object();
                      let arr_stops_location = new Array();
                      if (fs_arr_stops[x] !== undefined){
                        for (let index = 0; index <fs_arr_stops[x].length; index++) {
                          arr_stops_location.push(fs_arr_stops[x]);
                        }
                      }
                      stops_location = JSON.stringify(arr_stops_location);
                      var objLocation = JSON.parse(stops_location);
                      var resLocation = [];
                      for(var i_loc in objLocation)
                      resLocation.push(objLocation[i_loc]);
                      //End Fetch Individual Stops
          
                      //Fetch Individual Cover Image
                      let cover_img_url = new Object();
                      let arr_cover_img_url = new Array();
                      let cover_img_arr = new Array();
                      if (fs_arr_cover_img[x] !== undefined){
                        try {
                          for (let index = 0; index <fs_arr_cover_img[x].length; index++) {
                            cover_img_arr.push(fs_arr_cover_img[x][index]);
                            arr_cover_img_url.push({url: fs_arr_cover_img[x][index], alt: null});
                          }
                        } catch (error) {}
                        
                      }
          
                      cover_img_url = JSON.stringify(arr_cover_img_url);
          
                      var obj = JSON.parse(cover_img_url);
                      var res = [];
          
                      for(var i in obj)
                      res.push(obj[i]);
                      //End Fetch Individual Cover Image
          
                      console.log('Adding... Not included in webflow CMS ' + fs_arr_id[x]);

                      // if(x == 30){
          
                      //   console.log('Timeout..');
          
                      //   setTimeout(() => {
                          
                      //   }, 30000);
          
                      // }
          
                      // else{
          
                      // }
          
                      // setTimeout(function() {
                        // Add tasks to do
                   
                            //CREATE Webflow Items
                            const options = {
                              method: 'POST',
                              url: 'https://api.webflow.com/collections/'+ collection +'/items',
                              qs: {live: 'true'},
                              headers: {
                                'Accept-Version': '1.0.0',
                                Authorization: 'Bearer '+ webflowAPIKey,
                                'content-type': 'application/json'
                              },
                              body: {
                                fields: {
                                  name: fs_arr_name[x],
                                  slug: slug_name,
                                  docid: fs_arr_id[x],
                                  active: fs_arr_active[x],
                                  description: fs_arr_desc[x],
                                  approvalstatus: fs_arr_approval[x],
                                  coverimages : res,
                                  maincoverimage: res[0],
                                  booked: fs_arr_booked[x],
                                  //category: fs_arr_category[x],
                                  deleted: fs_arr_deleted[x],
                                  duration: duration_val,
                                  guide: fs_arr_guide[x],
                                  guideprofilepic: { url: fs_arr_guide_pic[x], alt: null},
                                  language: fs_arr_lang[x],
                                  likes: get_likes.length,
                                  owner: fs_arr_owner[x],
                                  ispaid: fs_arr_isPaid[x],
                                  issuperexperience: isSuperExp,
                                  stops: JSON.stringify(resLocation[0]),
                                  tags: JSON.stringify(fs_arr_tags[x]),
                                  questionreply: JSON.stringify(fs_arr_questions[x]),
                                  paidamount: get_amount,
                                  paidcurrency: get_currency,
                                  rank: fs_arr_rank[x],
                                  rating: fs_arr_rating[x],
                                  toursrun: fs_arr_toursRun[x],
                                  expcategory: webf_ref_id,
                                  _archived: false,
                                  _draft: false
                                }
                              },
                              json: true
                            };
                            
                            webflow_request(options, async function (error, response, body) {
                              if (error) throw new Error(error);
                              console.log(body);
                              
                              // Add a new document in collection "cities" with ID 'LA'
                              //const res = await db.collection('cities').doc('LA').set(data);
                              
                              resolve(true);
                              
                              try {
                                const res = await db.collection(fs_tourscollection).doc(body.docid).update({webflowId: body._id});

                              } catch (error) {
                                
                              }
                             
                              //webf_guides(body.owner, body._id);
                                
                            });
                            //END CREATE Webflow Items
          
                          // }, 400 * x);
                    }
                  }

                }
                // else {
                //   console.log('Tour exist in webflow CMS Tour ID: ' + webf_arr_docid[webf_arr_docid.indexOf(fs_arr_id[x])]);
                // }
            });
        //End Check if items exist in webflow

      }
      else {
        console.log('Collection is empty');

        for (let x = 0; x < tours_size; x++) {

            //Fetch Category Reference Experience
            var webf_ref_id = "";
            for (let index = 0; index < webf_arr_category.length; index++) {
              //const element = array[index];
              if (webf_arr_category[index][1]===fs_arr_category[x]){
                webf_ref_id = webf_arr_category[index][0];
              }
            }
            //End Fetch Category Reference

            //Check Duration Value
            let duration_val = [x];
            if (duration_val === 'NaN'){
              duration_val = 0;
            }
            else {
              duration_val = fs_arr_duration[x];
            }
            //End Check Duration Value

            //Check Tour Name Value
            var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','w','x','y','z']; 
            var randomstring = ''; for(var i = 0; i < 5; i++){randomstring += letters[parseInt(Math.random() * 25)]};
            let slug_name = fs_arr_name[x];
            if (slug_name === '' || slug_name === undefined || slug_name === null){
              slug_name = randomstring;
            }
            else {
              slug_name =  fs_arr_name[x];
            }
            //End Check Tour Name Value

            //Check for empty likes
            let get_likes = new Object();
            if (fs_arr_likes[x] !== undefined){
            get_likes = fs_arr_likes[x];
            }
            //End check for empty likes

            //Check for super experience
            let get_quality = new Object();
            let isSuperExp = false;
            if (fs_arr_superexp[x] !== undefined){
              get_quality = fs_arr_superexp[x].quality;
              if (get_quality == 'super'){
                isSuperExp = true;
              }
            }
            //End Check for super experience

            //Check for paid data
            let get_amount = 0;
            let get_currency = "";
            if (fs_arr_paid_data[x] !== undefined){
              get_amount = fs_arr_paid_data[x].amount;
              get_currency = fs_arr_paid_data[x].currency;
              
            }
            //End Check for paid data

            //Fetch Individual Stops
            let stops_location = new Object();
            let arr_stops_location = new Array();
            if (fs_arr_stops[x] !== undefined){
              for (let index = 0; index <fs_arr_stops[x].length; index++) {
                arr_stops_location.push(fs_arr_stops[x]);
              }
            }
            stops_location = JSON.stringify(arr_stops_location);
            var objLocation = JSON.parse(stops_location);
            var resLocation = [];
            for(var i_loc in objLocation)
            resLocation.push(objLocation[i_loc]);
            //End Fetch Individual Stops

            //Fetch Individual Cover Image
            let cover_img_url = new Object();
            let arr_cover_img_url = new Array();
            let cover_img_arr = new Array();
            if (fs_arr_cover_img[x] !== undefined){
              try {
                for (let index = 0; index <fs_arr_cover_img[x].length; index++) {
                  cover_img_arr.push(fs_arr_cover_img[x][index]);
                  arr_cover_img_url.push({url: fs_arr_cover_img[x][index], alt: null});
                }
              } catch (error) {}
              
            }

            cover_img_url = JSON.stringify(arr_cover_img_url);

            var obj = JSON.parse(cover_img_url);
            var res = [];

            for(var i in obj)
            res.push(obj[i]);
            //End Fetch Individual Cover Image

            console.log('Adding... Not included in webflow CMS ' + fs_arr_id[x]);


            // if(x == 30){

            //   console.log('Timeout..');

            //   setTimeout(() => {
                
            //   }, 30000);

            // }

            // else{

            // }

          //setTimeout(function() {
              // Add tasks to do

                  //CREATE Webflow Items
                  const options = {
                    method: 'POST',
                    url: 'https://api.webflow.com/collections/'+ collection +'/items',
                    qs: {live: 'true'},
                    headers: {
                      'Accept-Version': '1.0.0',
                      Authorization: 'Bearer '+ webflowAPIKey,
                      'content-type': 'application/json'
                    },
                    body: {
                      fields: {
                        name: fs_arr_name[x],
                        slug: slug_name.replaceAll(' ','-').toLowerCase(),
                        docid: fs_arr_id[x],
                        active: fs_arr_active[x],
                        description: fs_arr_desc[x],
                        approvalstatus: fs_arr_approval[x],
                        coverimages : res,
                        maincoverimage: res[0],
                        booked: fs_arr_booked[x],
                        //category: fs_arr_category[x],
                        deleted: fs_arr_deleted[x],
                        duration: duration_val,
                        guide: fs_arr_guide[x],
                        guideprofilepic: { url: fs_arr_guide_pic[x], alt: null},
                        language: fs_arr_lang[x],
                        likes: get_likes.length,
                        owner: fs_arr_owner[x],
                        ispaid: fs_arr_isPaid[x],
                        issuperexperience: isSuperExp,
                        stops: JSON.stringify(resLocation[0]),
                        tags: JSON.stringify(fs_arr_tags[x]),
                        questionreply: JSON.stringify(fs_arr_questions[x]),
                        paidamount: get_amount,
                        paidcurrency: get_currency,
                        rank: fs_arr_rank[x],
                        rating: fs_arr_rating[x],
                        toursrun: fs_arr_toursRun[x],
                        expcategory: webf_ref_id,
                        _archived: false,
                        _draft: false
                      }
                    },
                    json: true
                  };
                  
                  webflow_request(options, async function (error, response, body) {
                    if (error) throw new Error(error);
                    console.log(body);
                    
                    
                    resolve(true);
                      //webf_guides(body.owner, body._id);
                      try {
                        const res = await db.collection(fs_tourscollection).doc(body.docid).update({webflowId: body._id});
                      
                      } catch (error) {
                        
                      }
                     
          
                  });
                  //END CREATE Webflow Items

               //}, 400 * x);

        }
      }
    
     
    });


  });       

}


module.exports = { fetch };