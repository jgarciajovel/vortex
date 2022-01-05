/**
 * CampaignController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    getCampaigns: function(req, res) {
        let id = req.param('id');

        if (id) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id)'
            });
        }

        async function start() {
            try {

                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                // var client = await sails.helpers.connect.with({
                //     private_key: user.effect_account.privateKey,
                // }).tolerate('issues', (error)=>{
                //     sails.log.warn(error);
                // });

                console.log(':: Loading...');

                const all_campaigns = await Campaign.find();
                var campaigns = [];

                console.log(':: Got it');

                campaigns = all_campaigns.filter(campaign => campaign.owner[1] === user.effect_account.accountName);

                console.log(campaigns.length);

                for (let index = 0; index < campaigns.length; index++) {
                    let campaign = campaigns[index];
                    campaign.id = campaign.id_effect_network;

                    let batches = [];
                    batches = await getBatches(campaign.id_effect_network);

                    let tasks = 0;
                    let tasks_done = 0;

                    batches.forEach(batch => {
                        tasks += batch.num_tasks;
                        tasks_done += batch.tasks_done;
                    });

                    let progress = 100 - ((tasks - tasks_done) / tasks) * 100;

                    campaign.tasks = tasks;
                    campaign.tasks_done = tasks_done;
                    campaign.progress = parseFloat(progress.toFixed(0));
                    campaign.batches = batches;
                    campaign.info.reward = parseFloat(campaign.info.reward);
                }

                return res.status(200).json({
                    status: 'success',
                    campaigns: campaigns
                });

            } catch (error) {
                return res.serverError(error);
            }
        }

        async function getBatches(id_campaign) {
            const batches = Batch.find({
                campaign_id: id_campaign
            });

            return batches;
        }

    },

    getCampaignDetail: function(req, res) {
        let id = req.param('id');
        let id_campaign = req.param('id_campaign');

        if (id, id_campaign) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id, id_campaign)'
            });
        }

        async function start() {
            try {
                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                const campaign = await client.force.getCampaign(id_campaign);

                return res.status(200).json({
                    status: 'success',
                    campaign
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    getMyLastCampaign: function(req, res) {
        let id = req.param('id');

        if (id) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id)'
            });
        }

        async function start() {
            try {
                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                const campaign = await client.force.getMyLastCampaign();

                campaign.tasks = 0;
                campaign.tasks_done = 0;
                campaign.progress = 0;
                campaign.batches = [];
                campaign.info.reward = parseFloat(campaign.info.reward);

                return res.status(200).json({
                    status: 'success',
                    campaign
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    delete: function(req, res) {
        let id = req.param('id');
        let id_campaign = parseInt(req.param('id_campaign'));

        if (id) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id)'
            });
        }

        async function start() {
            try {
                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                const campaign = await client.force.deleteCampaign(id_campaign);

                return res.status(200).json({
                    status: 'success',
                    campaign
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    create: function(req, res) {
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
                    folder: `delos/`,
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
                const last_campaign = await client.force.getMyLastCampaign();

                return res.status(200).json({
                    status: 'success',
                    campaign: campaign,
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

    getBatches: function(req, res) {
        let id = req.param('id');
        let id_campaign = parseInt(req.param('id_campaign'));

        if (id) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id)'
            });
        }

        async function start() {
            try {
                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                console.log(':: Loading...');
                
                const batches = await client.force.getCampaignBatches(id_campaign);

                return res.status(200).json({
                    status: 'success',
                    batches: batches,
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    deleteBatch: function(req, res) {
        let id = req.param('id');
        let id_campaign = parseInt(req.param('id_campaign'));
        let id_batch = parseInt(req.param('id_batch'));

        if (id) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id)'
            });
        }

        async function start() {
            try {
                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                const batches = await client.force.deleteBatch(id_batch, id_campaign);

                return res.status(200).json({
                    status: 'success',
                    batches
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    getBatchResults: function(req, res) {
        let id = req.param('id');
        let id_batch = parseInt(req.param('id_batch'));

        if (id) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id)'
            });
        }

        async function start() {
            try {
                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                const batch = await client.force.getTaskSubmissionsForBatch(id_batch);

                var results = [];

                batch.forEach(task => {
                    task.data = JSON.parse(task.data);
                    results.push(task);
                });

                return res.status(200).json({
                    status: 'success',
                    results
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    uploadFile: function(req, res) {
        let task = req.file('task');

        if (task) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (task)'
            });
        }

        async function start() {
            try {
                var cloudinary = await sails.helpers.uploadImage.with({
                    file: task,
                    folder: `delos/`,
                    id: 1
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                let image = cloudinary.secure_url;

                return res.status(200).json({
                    status: 'success',
                    image: image
                });
            } catch (error) {
                return res.serverError(error);
            }
        }

    },

    createBatch: function(req, res) {
        let id = req.param('id');
        let id_campaign = parseInt(req.param('id_campaign'));
        let tasks = req.param('tasks');

        if (id, id_campaign, tasks) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id, id_campaign, tasks)'
            });
        }

        async function start() {
            try {

                // Get User Effect Account
                var user = await User.findOne({
                    id: id
                });

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                var content = {
                    tasks
                }

                const new_batch = await client.force.createBatch(id_campaign, content, 1);

                return res.status(200).json({
                    status: 'success',
                    new_batch
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    createBatchAPI: function(req, res) {
        let id = req.param('id');
        let id_campaign = parseInt(req.param('id_campaign'));
        let task = req.file('task');

        if (id, id_campaign, task) {
            uploadImage();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (id, id_campaign, task)'
            });
        }

        async function uploadImage() {
            try {
                var cloudinary = await sails.helpers.uploadImage.with({
                    file: task,
                    folder: `delos/`,
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
                        message: `Couldn't upload task image`
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

                var client = await sails.helpers.connect.with({
                    private_key: user.effect_account.privateKey,
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                var content = {
                    tasks: [
                        {
                            image_url: image
                        }
                    ]
                }

                const new_batch = await client.force.createBatch(id_campaign, content, 1);

                return res.status(200).json({
                    status: 'success',
                    new_batch
                });

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

};

