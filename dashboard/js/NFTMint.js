import { ethers } from '/ethers';
import { connectToNFTMint, listNFTForSale, buyNFT } from './js/NFTMint.js';

// Initialize connection to Ethereum
let provider;
if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
} else {
    console.error('Ethereum provider is not available');
}

// Connect to NFTMint contract
const nftMintContract = await connectToNFTMint(provider);

// Example usage: List an NFT for sale
const uri = 'https://example.com/nft-metadata';
const price = ethers.utils.parseEther('1'); // Price in ether
await listNFTForSale(nftMintContract, uri, price);

// Example usage: Buy an NFT
const tokenId = 1;
const affiliate = '0x...'; // Address of the affiliate (optional)
const paymentToken = ethers.constants.AddressZero; // Ether
await buyNFT(nftMintContract, tokenId, affiliate, paymentToken);

// You can add more function calls or event listeners here as needed
