require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const webflow_request = require('request');
const toursCollection = process.env.TOURS_COLLECTION_ID;
const categoryCollection = process.env.CATEGORIES_COLLECTION_ID;
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
  
        for (let index = 0; index < body.items.length; index++) {
            webf_arr_category.push([body.items[index]._id, body.items[index].name]);
        }

      });   

async function patch(
  //paiddata,
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
  paid){

  //Call category fetch

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
      url: 'https://api.webflow.com/collections/'+ collection +'/items',
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
        
        //End Check Paid Amount
      
        for (let index = 0; index < body.items.length; index++) {

          webf_arr_docid.push(body.items[index].docid);

              if (body.items[index].docid === tours){

                console.log(paid);

                 //  //CREATE Webflow Items
                    const options = {
                      method: 'PATCH',
                      url: 'https://api.webflow.com/collections/'+ collection +'/items/' + body.items[index]._id,
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
                          coverimages : fs_arr_cover_img,
                          maincoverimage: fs_arr_cover_img[0],
                          booked: booked,
                          category: category,
                          deleted: deleted,
                          duration: duration,
                          guide: guide,
                          guideprofilepic: { url: guide_pic, alt: null},
                          language: lang,
                          likes: likes,
                          owner: owner,
                          ispaid: ispaid,
                          issuperexperience: isSuperExp,
                          stops: JSON.stringify(fs_arr_stops),
                          tags: JSON.stringify(fs_arr_tags),
                          paidamount: paid_amount,
                          paidcurrency: paid_currency,
                          rank: rank,
                          rating: rating,
                          toursrun: toursRun,
                          expcategory: webf_cat_id,
                          _archived: false,
                          _draft: false
                        }
                      },
                      json: true
                    };
                    
                    webflow_request(options, function (error, response, body) {
                      if (error) throw new Error(error);
                      console.log(body);
                        //webf_guides(body.owner, body._id);
                    });
                  //   //END CREATE Webflow Items
              }
        }
       
        

        //Check if items exist in webflow
        for (let x = 0; x < fs_arr_id.length; x++) {
          if (webf_arr_docid.includes(fs_arr_id[x])){
            console.log('Update: Included in webflow CMS Doc ID: ' + webf_arr_docid[webf_arr_docid.indexOf(fs_arr_id[x])]);
             

          }
          // else {

          //   //Fetch Category Reference Experience
          //   var webf_ref_id = "";
          //   for (let index = 0; index < webf_arr_category.length; index++) {
          //     //const element = array[index];
          //     if (webf_arr_category[index][1]===fs_arr_category[x]){
          //       webf_ref_id = webf_arr_category[index][0];
          //     }
          //   }
          //   //End Fetch Category Reference
          //   console.log(webf_ref_id);

          //   //Check for empty likes
          //   let get_likes = new Object();
          //   if (fs_arr_likes[x] !== undefined){
          //   get_likes = fs_arr_likes[x];
          //   }
          //   //End check for empty likes

          //   //Check for super experience
          //   let get_quality = new Object();
          //   let isSuperExp = false;
          //   if (fs_arr_superexp[x] !== undefined){
          //     get_quality = fs_arr_superexp[x].quality;
          //     if (get_quality == 'super'){
          //       isSuperExp = true;
          //     }
          //   }
          //   //End Check for super experience

          //   //Check for paid data
          //   let get_amount = 0;
          //   let get_currency = "";
          //   if (fs_arr_paid_data[x] !== undefined){
          //     get_amount = fs_arr_paid_data[x].amount;
          //     get_currency = fs_arr_paid_data[x].currency;
              
          //   }
          //   //End Check for paid data

          //   //Fetch Individual Stops
          //   let stops_location = new Object();
          //   let arr_stops_location = new Array();
          //   if (fs_arr_stops[x] !== undefined){
          //     for (let index = 0; index <fs_arr_stops[x].length; index++) {
          //       arr_stops_location.push(fs_arr_stops[x]);
          //     }
          //   }
          //   stops_location = JSON.stringify(arr_stops_location);
          //   var objLocation = JSON.parse(stops_location);
          //   var resLocation = [];
          //   for(var i_loc in objLocation)
          //   resLocation.push(objLocation[i_loc]);
          //   //End Fetch Individual Stops

          //   //Fetch Individual Cover Image
          //   let cover_img_url = new Object();
          //   let arr_cover_img_url = new Array();
          //   let cover_img_arr = new Array();
          //   if (fs_arr_cover_img !== undefined){
          //     for (let index = 0; index <fs_arr_cover_img[x].length; index++) {
          //       cover_img_arr.push(fs_arr_cover_img[x][index]);
          //       arr_cover_img_url.push({url: fs_arr_cover_img[x][index], alt: null});
          //     }
          //   }

          //   cover_img_url = JSON.stringify(arr_cover_img_url);

          //   var obj = JSON.parse(cover_img_url);
          //   var res = [];

          //   for(var i in obj)
          //   res.push(obj[i]);
          //   //End Fetch Individual Cover Image

          //   console.log('Adding... Not included in webflow CMS ' + fs_arr_id[x]);
                 
          // }
        }
        //End Check if items exist in webflow
        
      }
      else {
        console.log('Collection is empty');
      }
    
     
    });
}


module.exports = { patch };