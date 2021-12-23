const { EffectClient, createAccount, createWallet } = require('@effectai/effect-js');

module.exports = {

  friendlyName: 'Connect',


  description: 'Connect something.',


  inputs: {

    private_key: {
      type: 'string',
      example: 'd2a2c812325ec34e8bdbdb8792ee1efc00cb58be9b57a1b8f8e4c20c139c1d54',
      description: 'Effect Network Private Key',
      required: true,
    },

  },


  exits: {

    success: {
      description: 'All done.',
    },

    issues: {
      description: 'Error',
    },

  },


  fn: async function (inputs, exits) {
    try {

      const private_key = inputs.private_key;

      const client = new EffectClient('jungle');
            
      // Instantiating bsc account.
      const account = createAccount(private_key);

      const web3 = createWallet(account);

      const effectAccount = await client.connectAccount(web3);
      
      return exits.success(client);

    } catch (error) {
      return exits.issues(error);
    }
  }


};

