// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utils.js 
import { showElement, hideElement, displayMessage } from './utils.js';

const contractABI = [ { "inputs": [ { "internalType": "contract IERC20", "name": "_tokenAddress", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "oldAddress", "type": "address" }, { "internalType": "address", "name": "newAddress", "type": "address" } ], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "plrToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teamMembers", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "VESTING_PERIOD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "vestingDetails", "outputs": [ { "internalType": "uint256", "name": "totalAllocation", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "vestingStart", "type": "uint256" }, { "internalType": "uint256", "name": "lastWithdrawal", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];
const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";

// Function to detect and connect MetaMask automatically
async function detectAndConnectMetaMaskAutomatically() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("MetaMask is installed!");
        try {
            // Request accounts from MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(); // Define signer here, obtaining it from the provider
            const address = await signer.getAddress(); // Use signer to get the address

            // Now that signer is defined, the rest of your function can proceed using it
            document.getElementById('walletAddress').innerText = address;
            showElement('walletAddressDisplay');
            showElement('withdrawTokensButton');
            hideElement('connectWalletText');
            hideElement('connectWalletButton');

            // If you need to use the signer for further operations, make sure it's accessible in the scope of those operations
            await fetchAndDisplayVestingDetails(address, signer); // Pass signer as an argument if needed
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log("MetaMask is not installed or not accessible.");
    }
}

async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    try {
        const details = await contract.vestingDetails(walletAddress);
        
        // Assuming `details` contains the vesting information in the structure { totalAllocation, amountWithdrawn, vestingStart, lastWithdrawal }
        // And you want to display them in the respective <span> elements within your HTML
        
        // Update the UI with the fetched details
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
        
        // Convert UNIX timestamp to a readable format
        const vestingStart = new Date(details.vestingStart * 1000).toLocaleString();
        const lastWithdrawal = new Date(details.lastWithdrawal * 1000).toLocaleString();
        document.getElementById('vestingStart').innerText = vestingStart;
        document.getElementById('lastWithdrawal').innerText = lastWithdrawal;

        // Calculate available to withdraw and days until next withdrawal if applicable
        // This calculation will depend on your contract's logic, for example:
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const timeSinceLastWithdrawal = now - details.lastWithdrawal.toNumber();
        const VESTING_PERIOD = await contract.VESTING_PERIOD(); // Fetch vesting period from contract
        const isEligibleToWithdraw = timeSinceLastWithdrawal > VESTING_PERIOD;
        document.getElementById('availableToWithdraw').innerText = isEligibleToWithdraw ? 'Yes' : 'No';

        // Calculate days until next withdrawal
        const daysUntilNextWithdrawal = isEligibleToWithdraw ? 0 : (VESTING_PERIOD - timeSinceLastWithdrawal) / (60 * 60 * 24);
        document.getElementById('daysUntilNextWithdrawal').innerText = Math.ceil(daysUntilNextWithdrawal) + ' days';

        // Make the vesting details visible
        showElement('vestingDetailsDisplay');

    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
}


// Function to handle withdrawal button click
async function handleWithdrawButtonClick() {
    showElement('loadingIndicator');
    try {
        await performWithdrawal();
        displayMessage('messageBox', 'Withdrawal initiated successfully.', true);
    } catch (error) {
        if (error.message.includes("vesting period not met")) {
            displayMessage('messageBox', 'Vesting period not met.', false);
        } else {
            displayMessage('messageBox', 'Withdrawal failed. Please try again.', false);
        }
    } finally {
        hideElement('loadingIndicator');
    }
}

async function performWithdrawal() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(); // Ensure signer is defined in this scope
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    const tx = await contract.withdrawTokens();
    await tx.wait();
}



// Function to fetch and display vesting details
async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
    try {
        const details = await contract.vestingDetails(walletAddress);
        console.log(details); // For debugging

        // Update UI with fetched details...
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    detectAndConnectMetaMaskAutomatically();

    const withdrawButton = document.getElementById('withdrawTokensButton');
    if (withdrawButton) {
        withdrawButton.addEventListener('click', handleWithdrawButtonClick);
    } else {
        console.log('Withdraw Tokens Button not found');
    }
});
