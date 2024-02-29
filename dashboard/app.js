// app.js
import { initializeWeb3 } from './web3Setup.js';
import { setupContracts } from './contractsSetup.js';
import { setupEventListeners } from './eventListeners.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const provider = await initializeWeb3();
        const { nftContract, affiliateContract } = await setupContracts(provider);
        setupEventListeners(nftContract, affiliateContract);
        // Any other initialization code
    } catch (error) {
        console.error("Initialization failed:", error.message);
    }
});

