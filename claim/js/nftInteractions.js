// nftInteractions.js

import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
import { nftContractAddress, nftContractABI } from './contractConfig.js'; // Import NFT contract details

// Connect to Ethereum provider (e.g., MetaMask)
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Instantiate NFT contract
const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, provider);

// Fetch user's NFTs
export async function fetchUserNFTs() {
    try {
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const userNFTs = await nftContract.balanceOf(userAddress); // Example: Fetch user's NFT balance
        console.log('User NFTs:', userNFTs);
        return userNFTs;
    } catch (error) {
        console.error('Error fetching user NFTs:', error);
    }
}

// Assuming you have already established `nftContract` with the ethers.Contract instance in nftInteractions.js
export async function getNFTDetails(userAddress) {
    try {
        const nftBalance = await nftContract.balanceOf(userAddress);
        const nftDetailsList = [];

        for (let i = 0; i < nftBalance; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i); // Assuming ERC-721 Enumerable extension
            const tokenURI = await nftContract.tokenURI(tokenId);
            // Optionally fetch metadata from the tokenURI if it's a URL to a JSON file
            const metadataResponse = await fetch(tokenURI);
            const metadata = await metadataResponse.json();

            nftDetailsList.push({
                tokenId: tokenId.toString(),
                tokenURI,
                metadata // Contains metadata like name, image, etc.
            });
        }

        console.log(nftDetailsList);
        return nftDetailsList;
    } catch (error) {
        console.error('Error fetching NFT details:', error);
        throw error; // Allows the calling function to handle the error
    }
}


// Add more functions for interacting with the NFT contract as needed
// For example, functions to transfer NFTs, fetch NFT metadata, etc.
