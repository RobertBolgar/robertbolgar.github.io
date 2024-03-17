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

export async function getNFTDetails(userAddress) {
    try {
        const nftCount = await nftContract.balanceOf(userAddress);
        const nftDetails = [];

        for (let i = 0; i < nftCount; i++) {
            const tokenId = await nftContract.tokenOfOwnerByIndex(userAddress, i);
            const tokenURI = await nftContract.tokenURI(tokenId);
            // Fetch metadata from the tokenURI if it's a URL
            const metadata = await fetch(tokenURI).then((response) => response.json());
            nftDetails.push({
                tokenId: tokenId.toString(),
                tokenURI,
                metadata, // This contains the NFT metadata such as name, description, image, etc.
            });
        }

        return nftDetails;
    } catch (error) {
        console.error('Error fetching NFT details:', error);
        throw error; // Propagate the error to be handled by the caller
    }
}

// Add more functions for interacting with the NFT contract as needed
// For example, functions to transfer NFTs, fetch NFT metadata, etc.
