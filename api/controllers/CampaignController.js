/**
 * CampaignController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const axios = require('axios').default;
const xrpl = require("xrpl");
const { XummSdk } = require('xumm-sdk');
const Sdk = new XummSdk(sails.config.custom.xumm_api_key, sails.config.custom.xumm_api_secret);

module.exports = {

    auth: function(req, res) {
        start();

        async function start() {
            try {
                let data = { 
                    txjson: {
                        TransactionType: 'SignIn'
                    }
                };

                let config = {
                    method: 'post',
                    url: `${sails.config.custom.xumm_api}/payload`,
                    headers: { 
                        'Content-Type': 'application/json', 
                        'X-API-Key': `${sails.config.custom.xumm_api_key}`, 
                        'X-API-Secret': `${sails.config.custom.xumm_api_secret}`
                    },
                    data: data
                };

                let response = await axios(config);

                return res.status(200).json({
                    status: 'success',
                    data: response.data
                });
            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    create2: function(req, res) {
        let id = req.param('id');
        let title = req.param('title');
        let description = req.param('description');
        let reward = parseInt(req.param('reward'));
        let data = JSON.parse(req.param('data'));
        let example_task = req.file('example_task');

        if (id, title, description, reward, example_task) {
            uploadImage(); //
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id, title, description, reward, example_task)'
            });
        }

        async function uploadImage() {
            try {
                var cloudinary = await sails.helpers.uploadImage.with({
                    file: example_task,
                    folder: `vortex/`,
                    id: 1
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                if (cloudinary) {

                    let image = cloudinary.secure_url;
                    start(image);

                    // return res.status(200).json({
                    //     status: 'success image',
                    //     image
                    // });
                } else {
                    return res.status(200).json({
                        status: 'error',
                        message: `Couldn't upload example_task image`
                    });
                }
            } catch (error) {
                return res.serverError(error);
            }
        }

        async function start(image) {
            try {
                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var instruction = await instructions(image);

                var template = await sails.helpers.template.with({
                    data: data
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                //

                const campaignToIpfs = {
                    title: title,
                    description: description,
                    instructions: instruction,
                    template: template,
                    image: 'https://res.cloudinary.com/gettechnologies/image/upload/v1640485213/delos/image_labeling_task_yy94ao.png',
                    category: 'Image Labeling',
                    example_task: {'image_url': image},
                    version: 1,
                    reward: 1
                }

                const efx_quantity = '1'

                const campaign = await client.force.makeCampaign(campaignToIpfs, efx_quantity);
                // const last_campaign = await client.force.getMyLastCampaign();

                return res.status(200).json({
                    status: 'success',
                    campaign: {},
                });

            } catch (error) {
                return res.serverError(error);
            }
        }

        async function instructions(image) {
var instruction = `# Hi there 👋!
With **delos** the first UI for Effect Network 💥, specifically thought for image labeling tasks.
You will be able to help individuals and companies from different industries to label important pieces of the images they sent to our API.

### Instructions

1. Read the text inside each rectangle.
2. Type the text from the rectangle inside the text input with the **same color**.
2.1. If the image is not readable then check the *unrecognizable image* box.
3. Click on the submit button.

***Note**: Only the image in the instruction will have the rectangles drawn, so check regularly the instructions in order to add the text correctly.*

![Example Image](${image})`;

return instruction
        }

    },

    account: function(req, res) {
        var payload = req.param('payload');

        if (payload) {
            start();
        } else {
            return res.status(401).json({
                status: 'error',
                message: 'Required parameters are not present (payload) or header'
            });
        }

        async function start() {
            try {
                const user = await Sdk.payload.get(payload);
                
                if (user) {
                    let account = user.response.account;

                    // Define the network client
                    const client = new xrpl.Client("wss://s.altnet.rippletest.net/");
                    await client.connect();
    
                    // ... custom code goes here
                    // Get info from the ledger about the address we just funded
                    const response = await client.request({
                        "command": "account_info",
                        "account": account,
                        "ledger_index": "validated"
                    })
                    // Disconnect when done (If you omit this, Node.js won't end the process)
                    client.disconnect();

                    return res.status(200).json({
                        status: 'success',
                        address: response.result.account_data.Account
                    });
                } else {
                    return res.status(401).json({
                        status: 'error',
                        user: 'expired'
                    });
                }
            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    user: function(req, res) {
        var account = req.param('account');

        if (account) {
            start();
        } else {
            return res.status(401).json({
                status: 'error',
                message: 'Required parameters are not present (account) or header'
            });
        }

        async function start() {
            try {
                // Define the network client
                const client = new xrpl.Client("wss://s.altnet.rippletest.net/");
                await client.connect();

                // ... custom code goes here
                // Get info from the ledger about the address we just funded
                const response = await client.request({
                    "command": "account_info",
                    "account": account,
                    "ledger_index": "validated"
                })
                // Disconnect when done (If you omit this, Node.js won't end the process)
                client.disconnect();

                return res.status(200).json({
                    status: 'success',
                    user: response
                });
            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    socket: function(req, res) {
        start();

        async function start() {

            sails.sockets.broadcast('5963de684bb804b6e139cdec', 'address', 'xrpl_address');

            return res.status(200).json({
                status: 'success'
            });
        }
    },

    webhook: function(req, res) {
        start();

        async function start() {
            try {
                console.log('body', req.body);

                return res.status(200).json({
                    status: 'success',
                });
            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    create: function(req, res) {
        let account = req.param('account');
        let title = req.param('title');
        let description = req.param('description');
        let prize = req.param('prize');
        let winners = req.param('winners');
        let end_date = req.param('end_date');
        let active = req.param('active');
        let file = req.file('file');

        if (account, title, description, prize, winners, end_date, file, active) {
            uploadImage(); //
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (account, title, description, prize, winners, end_date, file, active)'
            });
        }

        async function uploadImage() {
            try {
                var cloudinary = await sails.helpers.uploadImage.with({
                    file: file,
                    folder: `vortex/`,
                    id: 1
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                if (cloudinary) {

                    let image = cloudinary.secure_url;
                    start(image);

                } else {
                    return res.status(200).json({
                        status: 'error',
                        message: `Couldn't upload image`
                    });
                }
            } catch (error) {
                return res.serverError(error);
            }
        }

        async function start(image) {
            try {
                let campaign = await Campaign.create({
                    account: account,
                    title: title,
                    description: description,
                    prize: prize,
                    winners: winners,
                    end_date: end_date,
                    image: image,
                    active: active,
                }).fetch();

                return res.status(200).json({
                    status: 'success',
                    campaign
                });

            } catch (error) {
                return res.serverError(error);
            }
        }

    },

    userCampaigns: function(req, res) {
        let account = req.param('account');

        if (account) {
            start(); //
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (account)'
            });
        }

        async function start() {
            try {
                let campaigns = await Campaign.find({
                    account: account
                }).populate('players');

                return res.status(200).json({
                    status: 'success',
                    campaigns
                });
            } catch (error) {
                return res.serverError(error);
            }
        }

    },

    addPlayer: function(req, res) {
        let account = req.param('account');
        let id_campaign = req.param('campaign');
        let name = req.param('name');
        let email = req.param('email');

        if (account, id_campaign, name, email) {
            start(); //
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (account, campaign, name, email)'
            });
        }

        async function start() {
            try {
                let campaign = await Campaign.findOne({
                    id: id_campaign
                });

                if (campaign && campaign.active === true) {
                    let player = await Player.create({
                        account: account,
                        name: name,
                        email: email,
                        campaign: id_campaign,
                    }).fetch();

                    return res.status(200).json({
                        status: 'success',
                        campaign,
                        player
                    });
                } else {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Campaign Inactive'
                    });
                }
            } catch (error) {
                return res.serverError(error);
            }
        }
    }

};

