To create the necessary JavaScript functions for the listing page, buying NFT page, affiliate dashboard, and master owner control dashboard, we'll organize them into separate files according to their functionality. Here's a suggested structure:

```plaintext
project-directory/
│
├── index.html
├── js/
│   ├── listingPage.js          // Functions for the NFT listing page
│   ├── buyingPage.js           // Functions for buying NFTs
│   ├── affiliateDashboard.js   // Functions for the affiliate dashboard
│   ├── adminDashboard.js       // Functions for the master owner control dashboard
│   ├── contractsSetup.js       // Setting up interactions with smart contracts
│   ├── eventListeners.js       // Event listeners for UI interactions
│   ├── utils.js                // Utility functions
│   └── web3Setup.js            // Setting up Web3 and Ethereum provider
│
└── app.js                      // Main application logic
```

Now, let's list the JavaScript functions needed for each file:

### `listingPage.js`
1. Function to fetch and display NFT listings.
2. Function to handle user interactions for filtering or sorting NFT listings.
3. Function to handle UI updates when a new NFT is listed.

### `buyingPage.js`
1. Function to fetch and display details of an NFT for sale.
2. Function to handle the purchase process when a user buys an NFT.
3. Function to handle payment processing using Web3 and Ethereum.
4. Function to handle UI updates during the buying process.

### `affiliateDashboard.js`
1. Function to fetch and display affiliate-specific information, such as earnings and commission rates.
2. Function to handle affiliate-specific actions, such as withdrawing earnings.
3. Function to handle UI updates for the affiliate dashboard.

### `adminDashboard.js`
1. Function to fetch and display master owner control dashboard information, such as affiliate registrations and commission rates.
2. Function to handle master owner control actions, such as registering or revoking affiliates, updating commission rates, or toggling direct payments.
3. Function to handle UI updates for the master owner control dashboard.

### `contractsSetup.js`
1. Function to set up interactions with smart contracts, including contract instantiation and function calls.
2. Function to handle contract events and update UI accordingly.

### `eventListeners.js`
1. Event listeners for user interactions, such as clicking buttons or submitting forms.
2. Event listeners for contract events to trigger UI updates.

### `utils.js`
1. Utility functions used across different parts of the application, such as formatting data or handling errors.

### `web3Setup.js`
1. Function to set up Web3 and Ethereum provider, including connecting to MetaMask or other wallets.
2. Function to handle authentication and authorization for Ethereum transactions.

These functions provide the basic functionality needed for each section of the application. Additional functions may be required depending on specific requirements and features of your application.
