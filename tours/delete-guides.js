require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const webflow_request = require('request');
const guidesCollection = process.env.GUIDES_COLLECTION_ID;
const siteID = process.env.WEBF_SITE_ID;
const websiteDomains = process.env.WEBF_SITE_DOMAIN;
const fs_tourscollection = process.env.TOURS_COLLECTION_NAME;
let webf_arr_tours = new Array();

//Fetch webflow tours data
// const options = {
//     method: 'GET',
//     url: 'https://api.webflow.com/collections/'+ toursCollection +'/items',
//     qs: {offset: '0', limit: '100'},
//     headers: {'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey},
//     json: true
//     };

//     webflow_request(options, function (error, response, body) {

//     if (error) throw new Error(error);

//       for (let index = 0; index < body.items.length; index++) {
//         webf_arr_tours.push(body.items[index]._id, body.items[index].docid);
//       }

//     });   

async function remove(tours) {

  //Fetch webflow data
  const options = {
    method: 'DELETE',
    url: 'https://api.webflow.com/collections/' + guidesCollection + '/items/' + tours,
    qs: { live: 'false' },
    headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
    json: true
  };

  webflow_request(options, async function (error, response, body) {

    if (error) throw new Error(error);

    console.log('Deleting Doc ID: ' + tours);

    //PUBLISH
    const options = {
      method: 'POST',
      url: 'https://api.webflow.com/sites/' + siteID + '/publish',
      headers: {
        'Accept-Version': '1.0.0',
        Authorization: 'Bearer ' + webflowAPIKey,
        'content-type': 'application/json'
      },
      body: { domains: ['' + websiteDomains + '', 'freeguides.com', 'www.freeguides.com'] },
      json: true
    };


    webflow_request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);

    });
    //END PUBLISH


  });


}

module.exports = { remove };
