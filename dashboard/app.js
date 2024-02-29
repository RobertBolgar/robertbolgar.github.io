// app.js
import { initializeWeb3 } from './js/web3Setup.js';
import { setupContracts } from './js/contractsSetup.js';
import { setupEventListeners } from './js/eventListeners.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const provider = await initializeWeb3();
        const { nftContract, affiliateContract } = await setupContracts(provider);
        setupEventListeners(nftContract, affiliateContract, provider);
        // Any other initialization code goes here
    } catch (error) {
        console.error("Initialization failed:", error.message);
    }
});
