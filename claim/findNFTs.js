// Assuming ethers is already included in your HTML or you can import it here as well
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

// Connect to Ethereum provider (e.g., MetaMask)
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Prompt user to connect their wallet
await provider.send("eth_requestAccounts", []);

const signer = provider.getSigner();

// Replace "NFT_CONTRACT_ADDRESS" with the actual contract address
const NFT_CONTRACT_ADDRESS = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";

// Function to load the ABI from an external file
async function loadABI(path) {
  const response = await fetch(path);
  const data = await response.json();
  return data;
}

// Load the ABI for the NFT contract
const abi = await loadABI('abi_nft.json');

// Instantiate NFT contract with signer for write transactions
const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);

export async function countNFTs(userAddress) {
  try {
    const ownedTokenIds = await nftContract.balanceOf(userAddress);
    return ownedTokenIds.toString(); // Convert BigNumber to string for easier handling
  } catch (error) {
    console.error("Error fetching NFT count:", error);
    return '0'; // Handle errors gracefully
  }
}

// Example of fetching user address and counting NFTs
(async () => {
  const userAddress = await signer.getAddress();
  const nftCount = await countNFTs(userAddress);
  console.log("User has", nftCount, "NFTs");
  // Update your UI or display the count here
})();
