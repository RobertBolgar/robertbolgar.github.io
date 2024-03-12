// Import ethers.js
import { ethers } from "ethers";

// Import setupContracts function
import { setupContracts } from "./contractsSetup";

// Initialize Web3
async function initializeWeb3() {
    let provider;
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        return provider;
    } else {
        console.error('Ethereum provider is not available');
        throw new Error('Ethereum provider is not available');
    }
}

// Connect to the contract
async function connectToContract() {
    try {
        const provider = await initializeWeb3();
        const contracts = await setupContracts(provider);

        // Access the NFTMarketplace contract
        const nftMarketplace = contracts.NFTMarketplace;

        // Now you can use nftMarketplace to call functions on the contract
        console.log("NFTMarketplace contract connected:", nftMarketplace.address);

        // Example: List an NFT for sale
        const tokenId = 123; // Example tokenId
        const price = ethers.utils.parseEther("1"); // Example price in Ether
        await nftMarketplace.listNFTForSale(tokenId, price);

        // Example: Buy an NFT
        // const affiliate = "0x123..."; // Example affiliate address
        // await nftMarketplace.buyNFT(tokenId, affiliate);
    } catch (error) {
        console.error("Error connecting to contract:", error);
    }
}

// Connect to the contract when the window loads
window.onload = connectToContract;
