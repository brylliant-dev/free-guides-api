//Trigger Sync
exports.webflow_sync = functions.runWith({
  timeoutSeconds: 540,
  memory: "8GB",
}).https.onRequest(async (request, response) => {

  const cTCol = db.collection(fs_tourscollection);
  const snapshotCT = await cTCol.where('ApprovalStatus', '==', 'approved').get();

  //console.log('Guide Followers ' + snapshotCT.size);
  let delay = 0;
  let now = new Date();
  let formattedDate = now.toISOString();

  try {

    const options = {
      method: 'GET',
      url: 'https://api.webflow.com/collections/' + lastSyncCollection + '/items/',
      qs: { offset: '0', limit: '100' },
      headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
      json: true
    };

    webflow_request(options, async function (error, response, body) {

      if (error) throw new Error(error);

      if (body.total !== 0) {

        //Update Last Sync CMS
        const options = {
          method: 'PATCH',
          url: 'https://api.webflow.com/collections/' + lastSyncCollection + '/items/' + body.items[0]._id,
          qs: { live: 'true' },
          headers: {
            'Accept-Version': '1.0.0',
            Authorization: 'Bearer ' + webflowAPIKey,
            'content-type': 'application/json'
          },
          body: {
            fields: {

              'last-sync-date': formattedDate,
              _archived: false,
              _draft: false
            }
          },
          json: true
        };

        webflow_request(options, async function (error, response, body) {
          if (error) {
            console.log(error);
          }

          console.log(body);

        });
      }
      else {
        console.log('No last sync exist in webflow');

      }

    });

    //Create/Update all tours
    snapshotCT.forEach(async (doc, i) => {

      delay = delay + 1;

      //setTimeout(async function(){

      if (doc.data().webflowId === undefined) {

        //Check guide profile
        const userRef = db.collection('users').doc('' + doc.data().Owner + '');
        const docUser = await userRef.get();
        if (!docUser.exists) {

          //User does not exist in firestore
          console.log('User does not exist in firestore');

        }
        else {

          //User exist in firestore and webflow
          if (docUser.data().webflowId !== undefined) {
            console.log('Tour: ' + doc.data().Name + ' is NOT in webflow! Creating tour with tour guide ' + doc.data().Guide + ' webflow ID: ' + docUser.data().webflowId);

            toursUpdate(doc.id);

            setTimeout(async () => {
              //Update guide profile

              //Check guide profile
              const tourRef = db.collection(fs_tourscollection).doc('' + doc.id + '');
              const docTour = await tourRef.get();
              if (docTour.exists) {

                //Check guide profile
                const profileRef = db.collection('users').doc('' + docTour.data().Owner + '');
                const docProfile = await profileRef.get();
                if (docProfile.exists) {

                  const options = {
                    method: 'PATCH',
                    url: 'https://api.webflow.com/collections/' + toursCollection + '/items/' + docTour.data().webflowId,
                    qs: { live: 'true' },
                    headers: {
                      'Accept-Version': '1.0.0',
                      Authorization: 'Bearer ' + webflowAPIKey,
                      'content-type': 'application/json'
                    },
                    body: {
                      fields: {

                        'guide-profile': docProfile.data().webflowId,
                        _archived: false,
                        _draft: false
                      }
                    },
                    json: true
                  };

                  webflow_request(options, async function (error, response, body) {
                    if (error) {
                      console.log(error);
                    }

                    console.log(body);

                  });

                }

              }

            }, 20000);

          }

          //User does not exist in webflow creating...
          else {

            //createGuide(docUser.id, doc.data().webflowId);

            setTimeout(async () => {
              toursUpdate(doc.id);
            }, 10000);

            setTimeout(async () => {
              //Update guide profile

              //Check guide profile
              const tourRef = db.collection(fs_tourscollection).doc('' + doc.id + '');
              const docTour = await tourRef.get();
              if (docTour.exists) {

                //Check guide profile
                const profileRef = db.collection('users').doc('' + docTour.data().Owner + '');
                const docProfile = await profileRef.get();
                if (docProfile.exists) {

                  const options = {
                    method: 'PATCH',
                    url: 'https://api.webflow.com/collections/' + toursCollection + '/items/' + docTour.data().webflowId,
                    qs: { live: 'true' },
                    headers: {
                      'Accept-Version': '1.0.0',
                      Authorization: 'Bearer ' + webflowAPIKey,
                      'content-type': 'application/json'
                    },
                    body: {
                      fields: {

                        'guide-profile': docProfile.data().webflowId,
                        _archived: false,
                        _draft: false
                      }
                    },
                    json: true
                  };

                  webflow_request(options, async function (error, response, body) {
                    if (error) {
                      console.log(error);
                    }

                    console.log(body);

                  });

                }





              }

            }, 20000);


            setTimeout(async () => {

              //Check tour cover image
              const tourRef = db.collection(fs_tourscollection).doc('' + doc.id + '');
              const docTour = await tourRef.get();
              if (docTour.exists) {

                const clientId = "e3524eb189a94c6";
                const options = {
                  method: 'GET',
                  url: 'https://api.webflow.com/collections/' + toursCollection + '/items/' + docTour.data().webflowId,
                  qs: { offset: '0', limit: '100' },
                  headers: { 'Accept-Version': '1.0.0', Authorization: 'Bearer ' + webflowAPIKey },
                  json: true
                };

                webflow_request(options, async function (error, response, body) {

                  let cover_img_len = 0;

                  try {
                    cover_img_len = body.items[0].coverimages.length;
                  } catch (error) { }

                  if (cover_img_len === 0) {

                    var options = {
                      method: "POST",
                      url: "https://api.imgur.com/3/image",
                      headers: {
                        Authorization: "Client-ID " + clientId,
                      },
                      formData: {
                        image:
                          docTour.data().CoverImages[0],
                      },
                      json: true,
                    };
                    webflow_request(options, async function (error, response) {

                      console.log(error);

                      let upload_img = "https://uploads-ssl.webflow.com/635087442347dc107b2db976/63742b4634551c421005f6a1_default-img.png";

                      try {
                        upload_img = response.body.data.link;

                        upload_img = upload_img.replace(".jpg", "l.jpg");
                      } catch (error) { }

                      const options = {
                        method: 'PATCH',
                        url: 'https://api.webflow.com/collections/' + toursCollection + '/items/' + docTour.data().webflowId,
                        qs: { live: 'true' },
                        headers: {
                          'Accept-Version': '1.0.0',
                          Authorization: 'Bearer ' + webflowAPIKey,
                          'content-type': 'application/json'
                        },
                        body: {
                          fields: {

                            coverimages: { url: upload_img, alt: null },
                            maincoverimage: { url: upload_img, alt: null },
                            _archived: false,
                            _draft: false
                          }
                        },
                        json: true
                      };

                      webflow_request(options, async function (error, response, body) {
                        if (error) {
                          console.log(error);
                        }

                        console.log(body);

                      });

                    });

                  }

                });
              }

            }, 25000);

          }

        }

      }
      else {

        console.log('Tour: ' + doc.data().Name + ' is in webflow');


      }

      //}, delay * 500);

    });

    response.sendStatus('Tours Updated! Total: ' + snapshotCT.size);


  } catch (error) { }



});
