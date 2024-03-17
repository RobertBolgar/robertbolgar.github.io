// nftInteractions.js

import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@5.2/dist/ethers.umd.min.js';
import { nftContractAddress, nftContractABI } from './nftContractConfig.js'; // Import NFT contract details

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

// Add more functions for interacting with the NFT contract as needed
// For example, functions to transfer NFTs, fetch NFT metadata, etc.
