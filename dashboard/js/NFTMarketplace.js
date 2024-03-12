// NFTmarketplace.js

// Function to initialize the Web3 provider and connect to the NFT marketplace contract
async function initMarketplace() {
    // Initialize Web3 provider
    const provider = await initializeWeb3();
    
    // Setup contracts
    const { nftMarketplaceContract } = await setupContracts(provider);

    // Return initialized marketplace contract
    return nftMarketplaceContract;
}
