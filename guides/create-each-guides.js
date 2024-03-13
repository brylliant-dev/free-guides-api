require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const guideCollection = process.env.GUIDES_COLLECTION_ID;
const toursCollection = process.env.TOURS_COLLECTION_ID; //This is the Collection ID from Webflow CMS
const fs_tourscollection =  process.env.TOURS_COLLECTION_NAME;
const webflow_request = require('request');
const path = require('path');
let fs_dir = path.join(__dirname,'../../');
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
    //tours,
    rating,
    webflowIds,
    pic,
    follows,
    guideID,
    fname,
    lname,
    bio,
    country){

  return new Promise((resolve) => {

    guide_tour_rating = rating;
    guide_tour_id = webflowIds;
    guide_arr_picture = pic;    
    guide_arr_follows = follows;
    guide_arr = guideID;    
    guide_arr_fname = fname;
    guide_arr_lname = lname;
    guide_arr_bio = bio;
    guide_arr_country = country;
    webf_linkedexp = webflowIds;

   
                        //Guide Followers
                        let get_followers = 0;

                      
                            if ( guide_arr_follows !== undefined){
                                try {
                                get_followers = guide_arr_follows.length;
                                } catch (error) {
                            }
              
                       
                            
                        }
                   
                        let guide_name = fname + ' ' + lname;
                        guide_name = guide_name.replace(/[^a-zA-Z ]/g, "");
                        // //setTimeout(function() {
                        //     // Add tasks to do

                        let avg_rating = 0;
                        try {
                        let sum = 0;
                        rating.forEach(function(num){sum+=parseFloat(num) || 0;});
                        //console.log('Sum of Rating: '+ sum/guide_tour_rating.length);
                        avg_rating = (sum/guide_tour_rating.length);
                        } catch (error) {}

                        //Skips guides that has no linked experiences
                        if (webflowIds === '' || webflowIds === undefined || webflowIds === null){
                            console.log('Guide has no linked experiences. Skipping..');
                        }
                        else {

                            //CREATE Webflow Guide Items
                            const options = {
                                method: 'POST',
                                url: 'https://api.webflow.com/collections/'+ guideCollection +'/items',
                                qs: {live: 'true'},
                                headers: {
                                'Accept-Version': '1.0.0',
                                Authorization: 'Bearer '+ webflowAPIKey,
                                'content-type': 'application/json'
                                },
                                body: {
                                fields: {
                                    name: guide_name,
                                    slug: guide_name.replaceAll(' ','-').toLowerCase(),
                                    country: country,
                                    bio: bio,
                                    userid: guideID,
                                    linkedexperiences: webflowIds,
                                    picture: {url: pic, alt:null},
                                    follows: get_followers,
                                    rating: avg_rating,
                                    imageurl: pic,
                                    _archived: false,
                                    _draft: false
                                }
                                },
                                json: true
                            };
                            
                            webflow_request(options, async function (error, response, body) {
                                if (error) throw new Error(error);
                                resolve(true);
                                try {
                                    console.log('Guide ' + body.name + ' successfully created.');
                                    console.log(body);
                                } catch (error) {
                                    
                                }


                               try{
                                    const resGuide = await db.collection('users').doc(body.userid).update({webflowId: body._id});
                                  
                               } catch (error) {}
                          
                                                            
                                //Get Completed Tours
                                    const CTCol = db.collection('completedTours');
                                    
                                    let snapshotCT 
                                    
                                    try {
                                        snapshotCT = await CTCol.get();
                                    } catch (error) {
                                        
                                    }
                                   

                                    try {
                                    snapshotCT.forEach(async docUser => {

                                    if (docUser.data().userId === body.userid){
                                        // console.log('Tourist: ' + doc.data().tourist);
                                        // console.log('Feedback: ' + doc.data().feedback);
                                        console.log('Creating Completed Tours Linked Guide: ' +  body._id);

                                        
                                        const resCT = await db.collection('completedTours').doc(docUser.id).update({linkedguide: body._id});
                                        const resTour = await db.collection(fs_tourscollection).doc(docUser.data().tourId).update({linkedguide: body._id});
                                    
                                    }

                                   

                                    });

                                    } catch (error) {}

                                    //End Get Guides

                                     //Get Guides
                                     const guideCol = db.collection('users');
                                     let snapshotGuide;

                                    try {
                                        snapshotGuide = await guideCol.get();
                                    } catch (error) {}
                                    
 
                                    try {
                                     snapshotGuide.forEach(async docUser => {
 
                                   
                                     if (docUser.id === body.userid){
                                         // console.log('Tourist: ' + doc.data().tourist);
                                         // console.log('Feedback: ' + doc.data().feedback);
                                         
                                         const resGuide = await db.collection('users').doc(docUser.id).update({webflowId: body._id});
                                         const resGuidesInWebflow = await db.collection('users').doc(docUser.id).update({inWebflow: false});
                                     }
 
                                     
 
                                     });
                                     //End Get Guides
                                    } catch (error) {}

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


                        }
                       
                        
                          
                       

                });
        
}

module.exports = { fetchGuides };