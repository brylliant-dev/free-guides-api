require('dotenv').config();
const webflowAPIKey = process.env.WEBF_API_KEY;
const webflow_request = require('request');
const toursCollection = process.env.TOURS_COLLECTION_ID;
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

  webf_arr_tours = tours;

  //Check Tours
  // let delete_tour = '';
  // for (let index = 0; index < webf_arr_tours.length; index++) {
  //    if (webf_arr_tours[index][1] === tours){
  //         delete_tour = webf_arr_tours[index][0];
  //    }
  // }
  //End Check Tours

  for (let x = 0; x < webf_arr_tours.length; x++) {

    setTimeout(() => {

      //Fetch webflow data
      const options = {
        method: 'DELETE',
        url: 'https://api.webflow.com/collections/' + toursCollection + '/items/' + webf_arr_tours[x],
        qs: { live: 'false' },
        headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
        json: true
      };

      webflow_request(options, async function (error, response, body) {

        if (error) throw new Error(error);

        console.log('Deleting Doc ID: ' + webf_arr_tours[x]);

        //PUBLISH
        const options = {
          method: 'POST',
          url: 'https://api.webflow.com/sites/' + siteID + '/publish',
          headers: {
            'Accept-Version': '1.0.0',
            Authorization: 'Bearer ' + webflowAPIKey,
            'content-type': 'application/json'
          },
          body: { domains: ['' + websiteDomains + ''] },
          json: true
        };


        webflow_request(options, function (error, response, body) {
          if (error) throw new Error(error);

          console.log(body);

        });
        //END PUBLISH


      });

    }, 200 * x);


  }


}

module.exports = { remove };
