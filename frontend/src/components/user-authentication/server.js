const express = require('express');
const Vault = require('node-vault');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const vault = Vault({
    apiVersion: 'v1',
    endpoint: 'http://127.0.0.1:8200/', // Your Vault endpoint
    token: 'hvs.gdPd6FxKJFuoOvlI071WoVc9', // Your Vault token
});

// Route handler for creating a user account
app.post('/create_account_api/create_account', async (req, res) => {
    const { first_name, last_name, email, password, account_num } = req.body;

    try {
        // Securely store account_num and unhashed password in Vault
        const accountNumSecretPath = `secret/data/${account_num}`;
        const passwordSecretPath = `secret/data/${email}_password`;
        
        // Write account_num to Vault
        await vault.write(accountNumSecretPath, { data: { account_num } });
        console.log('Account number written to Vault successfully');
        
        // Write unhashed password to Vault
        await vault.write(passwordSecretPath, { data: { password } });
        console.log('Password written to Vault successfully');

        // Now you can proceed with creating the user account in your database or wherever needed
        // Example: createUserInDatabase({ first_name, last_name, email });

        res.json({ message: 'Account created successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
