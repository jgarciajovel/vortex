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

  'GET /auth': { controller: 'Campaign', action: 'auth' },

  'POST /webhook': { controller: 'Campaign', action: 'webhook' },

  'GET /account/:payload': { controller: 'Campaign', action: 'account' },

  'GET /user/:account': { controller: 'Campaign', action: 'user' },

  'GET /socket': { controller: 'Campaign', action: 'socket' },
 
  'POST /campaign/create': { controller: 'Campaign', action: 'create' },

  'GET /user/:account/campaign': { controller: 'Campaign', action: 'userCampaigns' },

  'POST /campaign/player': { controller: 'Campaign', action: 'addPlayer' },

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
