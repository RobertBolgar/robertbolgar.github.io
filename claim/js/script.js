// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";
const nftContractAddress = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
let vestingContract, nftContract;

// Utility function to fetch ABI from a local JSON file
async function fetchABI(path) {
    const response = await fetch(path);
    return await response.json();
}

// Initialize Ethereum contracts
async function initContracts() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Fetch and initialize the vesting contract
        const vestingABI = await fetchABI('./abi/vesting_abi.json');
        vestingContract = new ethers.Contract(vestingContractAddress, vestingABI, signer);

        // Fetch and initialize the NFT contract
        const nftABI = await fetchABI('./abi/nft_abi.json');
        nftContract = new ethers.Contract(nftContractAddress, nftABI, signer);

        const address = await signer.getAddress();
        document.getElementById('walletAddress').innerText = address;
        showElement('walletAddressDisplay');
        hideElement('connectWalletText');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Check NFT ownership before enabling withdrawal
        await checkNFTOwnershipAndDisplayVestingDetails(address);
    } catch (error) {
        console.error("An error occurred during contract initialization:", error);
    }
}

async function checkNFTOwnershipAndDisplayVestingDetails(address) {
    try {
        const nftBalance = await nftContract.balanceOf(address);
        if (nftBalance.toNumber() > 0) {
            showElement('withdrawTokensButton');
            await fetchAndDisplayVestingDetails(address);
        } else {
            displayMessage('You do not own the required NFT to withdraw tokens.');
            hideElement('withdrawTokensButton');
        }
    } catch (error) {
        console.error('Error checking NFT ownership:', error);
    }
}

async function fetchAndDisplayVestingDetails(walletAddress) {
    try {
        // Fetch vesting details
        const details = await vestingContract.vestingDetails(walletAddress);

        // Update UI with fetched details
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
        // Additional details and UI updates here...

        showElement('vestingDetailsDisplay');
    } catch (error) {
        console.error('Error fetching and displaying vesting details:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Register event listener for Connect Wallet button
    document.getElementById('connectWalletButton').addEventListener('click', initContracts);

    // Assume MetaMask is already connected, so initiate contract initialization immediately
    if (window.ethereum && window.ethereum.selectedAddress) {
        await initContracts();
    }
});
