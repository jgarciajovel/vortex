/**
 * CampaignController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

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

};

