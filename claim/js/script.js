// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";
let contract; // This will hold the contract instance

// Placeholder ABI array - replace with your contract's ABI
const contractABI = [abi/vesting_abi.json]; // <-- Your contract ABI goes here

async function detectAndConnectMetaMaskAutomatically() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("MetaMask is installed!");
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            document.getElementById('walletAddress').innerText = address;
            showElement('walletAddressDisplay');
            showElement('withdrawTokensButton');
            hideElement('connectWalletText');
            hideElement('connectWalletButton');
            document.getElementById('connectWalletButton').innerText = 'Connected';
            initContract(signer);
            await fetchAndDisplayVestingDetails(address);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log("MetaMask is not installed or not accessible.");
        document.getElementById('connectWalletButton').innerText = 'MetaMask Not Detected';
    }
}

function initContract(signer) {
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    // You can now interact with the contract
}

async function fetchAndDisplayVestingDetails(walletAddress) {
    try {
        const details = await contract.vestingDetails(walletAddress);
        // Assuming vestingDetails function exists and returns an object with these properties
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation);
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn);
        // Additional details and UI updates here...
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }
}

// Event listener for the Withdraw Tokens button
document.addEventListener('DOMContentLoaded', () => {
    const withdrawButton = document.getElementById('withdrawTokensButton');
    if (withdrawButton) {
        withdrawButton.addEventListener('click', async () => {
            try {
                const tx = await contract.withdrawTokens();
                await tx.wait();
                displayMessage('Your withdrawal transaction was successful.');
                // Optionally, refresh vesting details to show updated info
                await fetchAndDisplayVestingDetails(ethers.utils.getAddress(document.getElementById('walletAddress').innerText));
            } catch (error) {
                console.error("Withdrawal transaction failed:", error);
                displayMessage('Withdrawal transaction failed. Please try again.');
            }
        });
    }
});
