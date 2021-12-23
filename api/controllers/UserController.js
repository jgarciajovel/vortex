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
};

