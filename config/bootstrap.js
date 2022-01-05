/**
 * Seed Function
 * (sails.config.bootstrap)
 *
 * A function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also create a hook.
 *
 * For more information on seeding your app with fake data, check out:
 * https://sailsjs.com/config/bootstrap
 */

var CronJob = require('cron').CronJob;

module.exports.bootstrap = async function() {

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return;
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  let batches = new CronJob('*/3 * * * *', function() {
    sails.log.info(`:: 🪖  Get Batches`);

    sails.config.utils.batches(function(error, batches) {
        if (error) {
          sails.log.warn(':: 😭  Batches Error');
          sails.log.warn(error);
        }
    });

  }, null, true, 'America/El_Salvador');

  let campaigns = new CronJob('*/1 * * * *', function() {
    sails.log.info(`:: 💥  Get Campaigns`);

    sails.config.utils.campaigns(function(error, campaigns) {
        if (error) {
          sails.log.warn(':: 😭  Batches Error');
          sails.log.warn(error);
        }
    });

  }, null, true, 'America/El_Salvador');

  campaigns.start();

};
