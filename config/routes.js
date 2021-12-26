/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },

  'POST /auth': { controller: 'Auth', action: 'index' },

  'GET /user/:id': { controller: 'User', action: 'getUser' },

  'GET /campaign/:id': { controller: 'Campaign', action: 'getCampaigns' },

  'GET /campaign/:id/last': { controller: 'Campaign', action: 'getMyLastCampaign' },

  'DELETE /campaign': { controller: 'Campaign', action: 'delete' },

  'POST /campaign': { controller: 'Campaign', action: 'create' },

  'GET /batch/:id/:id_campaign': { controller: 'Campaign', action: 'getBatches' },

  'GET /batch/:id/batch/:id_batch': { controller: 'Campaign', action: 'getBatchResults' },

  'POST /batch': { controller: 'Campaign', action: 'createBatch' },

  'POST /v1/batch': { controller: 'Campaign', action: 'createBatchAPI' },

  'POST /upload-image': { controller: 'Campaign', action: 'uploadFile' },

  'POST /transfer-funds': { controller: 'User', action: 'transfer' },

  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};
