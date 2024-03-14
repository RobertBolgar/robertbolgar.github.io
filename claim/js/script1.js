// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";

// Async function to fetch ABI and initialize the contract
async function initContract() {
    try {
        // Fetch the ABI from a local JSON file
        const abiResponse = await fetch('./abi/vesting_abi.json');
        const contractABI = await abiResponse.json();

        // Assuming MetaMask is installed and the user has connected their wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Initialize the contract with the fetched ABI and signer
        window.contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Fetch and display the connected wallet address
        const address = await signer.getAddress();
        document.getElementById('walletAddress').innerText = address;
        showElement('walletAddressDisplay');
        showElement('withdrawTokensButton');
        hideElement('connectWalletText');
        hideElement('connectWalletButton');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Fetch and display vesting details
        await fetchAndDisplayVestingDetails(address);
    } catch (error) {
        console.error("An error occurred during contract initialization:", error);
    }
}

async function fetchAndDisplayVestingDetails(walletAddress) {
    console.log("fetchAndDisplayVestingDetails called for address:", walletAddress);
    try {
        const details = await window.contract.vestingDetails(walletAddress);
        console.log("Vesting details fetched:", details);
        
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
        // Additional details and UI updates here...
        
        showElement('vestingDetailsDisplay');
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initContract();
    const connectWalletButton = document.getElementById('connectWalletButton');
    connectWalletButton.addEventListener('click', detectAndConnectMetaMaskAutomatically);

    const withdrawButton = document.getElementById('withdrawTokensButton');
    if (withdrawButton) {
        withdrawButton.addEventListener('click', async () => {
            try {
                const tx = await window.contract.withdrawTokens();
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
