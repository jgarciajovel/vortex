/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const { EffectClient, createAccount, createWallet } = require('@effectai/effect-js');

module.exports = {
    create: function(req, res) {
        let name = req.param('name');
        let lastname = req.param('lastname');
        let email = req.param('email');
        let password = req.param('password');

        if (name && email && password) {
            start();
        } else {
            return res.status(500).json({
                status: 'error',
                message: 'Required parameters are not present (name, lastname, email, password)'
            });
        }

        async function start() {
            try {
                var user = await User.findOne({
                   email: email, 
                });

                if (user) {
                    return res.status(500).json({
                        status: 'error',
                        message: 'User already exists'
                    });
                } else {
                    createUser();
                }

            } catch (error) {
                return res.serverError(error);
            }
        }

        async function createUser() {
            try {
                var user = await User.create({
                   name: name,
                   lastname: lastname,
                   email: email,
                   password: password 
                }).fetch();

                wallet(user);

                // return res.status(200).json({
                //     status: 'success',
                //     user: user
                // });

            } catch (error) {
                return res.serverError(error);
            }
        }

        async function wallet(user) {
            try {
                sails.log.info(':: 📣  Creating Wallet');
                const client = new EffectClient('jungle');
            
                // Instantiating bsc account.
                // const account = createAccount('d2a2c812325ec34e8bdbdb8792ee1efc00cb58be9b57a1b8f8e4c20c139c1d54');
                const account = createAccount();

                if (account) {
                    // process.argv[2] = 'd2a2c812325ec34e8bdbdb8792ee1efc00cb58be9b57a1b8f8e4c20c139c1d54';
            
                    // Generate web3 instance from account with private key.
                    // Could also be the web3 object with a MetaMask connection etc.
                    const web3 = createWallet(account);
                
                    // Connect web3 account to SDK
                    const effectAccount = await client.connectAccount(web3);

                    var user_update = await User.update({
                        id: user.id
                    }, {
                        effect_account: effectAccount
                    }).fetch();
                
                    return res.status(200).json({
                        status: 'success',
                        user_update
                    });
                } else {
                    return res.status(200).json({
                        status: 'error',
                        account_error: 'Could not create an Effect Network account'
                    });
                }

            } catch (error) {
                return res.serverError(error);
            }
        }
    },

    getUser: function(req, res) {
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

                if (user) {
                    const private_key = user.effect_account.privateKey;

                    const client = new EffectClient('jungle');
                        
                    // Instantiating bsc account.
                    const account = createAccount(private_key);
            
                    const web3 = createWallet(account);
            
                    const effectAccount = await client.connectAccount(web3);

                    return res.status(200).json({
                        status: 'success',
                        account: effectAccount
                    });
                } else {
                    return res.status(200).json({
                        status: 'error',
                        message: `Couldn't get any user with ID ${id}`
                    });
                }
            } catch (error) {
                return res.serverError(error);
            }
        }

    },

    transfer: function(req, res) {
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
                    private_key: '0xd2a2c812325ec34e8bdbdb8792ee1efc00cb58be9b57a1b8f8e4c20c139c1d54',
                }).tolerate('issues', (error)=>{
                    sails.log.warn(error);
                });

                // var from_account = '031e78424c879d2428bc0dbef2949b81bf71c1ff';
                // var to_account = 117;

                var from_account = sails.config.custom.account_name;
                var to_account = user.effect_account.vAccountRows[0].id;

                const transfer = await client.account.vtransfer('debb9347439135dd86ed9fb5443b36330cab0db4', 139, '1.0000');
                // const transfer = await client.account.getVAccountById(139);

                return res.status(200).json({
                    status: 'success',
                    transfer,
                    from_account,
                    to_account
                });
            } catch (error) {
                return res.serverError(error);
            }
        }

    },
};

