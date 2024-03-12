// NFTMint.js

import { ethers } from 'ethers';
import NFTMint_ABI from './ABI/NFTMint_ABI.json';

const NFTMint_ADDRESS = '0xe9Ac226DBC108dAEeba3dbe55B8b1cE3ae52381E';

export async function connectToNFTMint(provider) {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(NFTMint_ADDRESS, NFTMint_ABI, signer);
    return contract;
}

export async function listNFTForSale(contract, uri, price) {
    try {
        const tx = await contract.listNFTForSale(uri, price);
        await tx.wait();
        console.log('NFT listed for sale successfully');
    } catch (error) {
        console.error('Error listing NFT for sale:', error);
    }
}

export async function buyNFT(contract, tokenId, affiliate, paymentToken) {
    try {
        const tx = await contract.buyNFT(tokenId, affiliate, paymentToken);
        await tx.wait();
        console.log('NFT bought successfully');
    } catch (error) {
        console.error('Error buying NFT:', error);
    }
}

// Add other functions as needed for interacting with the NFTMint contract
