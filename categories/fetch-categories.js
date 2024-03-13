const webflow_request = require('request');
let webf_arr_category = new Array();

let arr_category = new Array();

async function fetch_cat(collection, webflowAPIKey){

//Fetch webflow data
const options = {
    method: 'GET',
    url: 'https://api.webflow.com/collections/'+ collection +'/items',
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
    
}


module.exports = { fetch_cat };