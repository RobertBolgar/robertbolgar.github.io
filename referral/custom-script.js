// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utils.js 
import { showElement, hideElement, displayMessage } from './utils.js';

const contractABI = [ { "inputs": [ { "internalType": "contract IERC20", "name": "_tokenAddress", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "oldAddress", "type": "address" }, { "internalType": "address", "name": "newAddress", "type": "address" } ], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "plrToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teamMembers", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "VESTING_PERIOD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "vestingDetails", "outputs": [ { "internalType": "uint256", "name": "totalAllocation", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "vestingStart", "type": "uint256" }, { "internalType": "uint256", "name": "lastWithdrawal", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];
const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";

// This function is defined to detect and connect MetaMask automatically
async function detectAndConnectMetaMaskAutomatically() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("MetaMask is installed!");
        try {
            // Request accounts from MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            // Display connected wallet address
            document.getElementById('walletAddress').innerText = `${address}`;
            document.getElementById('walletAddressDisplay').style.display = 'block';
            document.getElementById('withdrawTokensButton').style.display = 'block';

            // Hide the "Connect Your Wallet" text and button
            document.getElementById('connectWalletText').style.display = 'none';
            document.getElementById('connectWalletButton').style.display = 'none';

            // Fetch and display vesting details
            await fetchAndDisplayVestingDetails(address);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log("MetaMask is not installed or not accessible.");
    }
}

async function fetchDataAndDisplay() {
    try {
        showElement('loadingIndicator');
        // Simulate fetching data or any async operation
        await fetchData(); // Assume this function is defined elsewhere to fetch your data
        hideElement('loadingIndicator');
        displayMessage('messageBox', 'Successfully connected', true);
        // Further processing and displaying data
    } catch (error) {
        hideElement('loadingIndicator');
        displayMessage('messageBox', 'Failed to connect', false);
        console.error(error);
    }
}

// Event listeners or direct calls to initiate parts of your app
document.addEventListener('DOMContentLoaded', () => {
    // You can call fetchDataAndDisplay here if you want to auto-fetch data
    // Or set up event listeners for user actions
    document.getElementById('fetchButton').addEventListener('click', fetchDataAndDisplay);
});


document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('actionButton');
    
    button.addEventListener('click', async () => {
        try {
            showElement('loadingIndicator'); // Show loading
            // Simulate a task (e.g., fetching data or processing something)
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
            hideElement('loadingIndicator'); // Hide loading once task is done

            // Display a success message
            displayMessage('messageBox', 'Success!', true);
        } catch (error) {
            // If there's an error, hide the loading indicator and show an error message
            hideElement('loadingIndicator');
            displayMessage('messageBox', 'Action failed. Please try again.', false);
            console.error(error);
        }
    });
});

document.getElementById('withdrawTokensButton').addEventListener('click', async () => {
    showElement('loadingIndicator'); // Show loading indicator
    try {
        // Assume performWithdrawal is an async function that attempts the withdrawal
        // It should resolve if successful, and reject if the vesting period is not met
        await performWithdrawal(); // You'll need to implement this based on your contract interaction
        
        // If the promise resolves, withdrawal was initiated successfully
        displayMessage('messageBox', 'Withdrawal initiated successfully.', true);
    } catch (error) {
        // If the promise rejects, check if it's due to the vesting period not being met
        if (error.message.includes("vesting period not met")) {
            displayMessage('messageBox', 'Vesting period not met.', false);
        } else {
            // For other errors, display a generic error message
            displayMessage('messageBox', 'Withdrawal failed. Please try again.', false);
        }
    } finally {
        hideElement('loadingIndicator'); // Hide loading indicator
    }
});


// Optionally, you might have other functions that directly use the imported utilities
function showLoading() {
    showElement('loadingIndicator');
}

function hideLoading() {
    hideElement('loadingIndicator');
}

async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
    try {
        // Fetch vesting details from the contract for the given wallet address
        const details = await contract.vestingDetails(walletAddress);
        console.log(details); // Debug: See the retrieved details

        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const lastWithdrawal = details.lastWithdrawal.toNumber(); // Convert BigNumber to number
        const vestingStart = details.vestingStart.toNumber(); // Convert BigNumber to number for vestingStart
        const timeSinceLastWithdrawal = now - lastWithdrawal;
        
        // Fetch the VESTING_PERIOD directly from the contract
        const VESTING_PERIOD = await contract.VESTING_PERIOD();
        const daysUntilNextWithdrawal = (VESTING_PERIOD / (60 * 60 * 24)) - (timeSinceLastWithdrawal / (60 * 60 * 24));
        const isEligibleToWithdraw = timeSinceLastWithdrawal >= VESTING_PERIOD;

        // Update the text elements with the formatted details
        document.getElementById('availableToWithdraw').innerText = `${isEligibleToWithdraw ? 'Y' : 'N'}`;
        document.getElementById('daysUntilNextWithdrawal').innerText = `${Math.max(0, Math.ceil(daysUntilNextWithdrawal))}`;

        // Format and display "Vesting Start" and "Last Withdrawal" dates
        document.getElementById('vestingStart').innerText = `${new Date(vestingStart * 1000).toLocaleString()}`;
        document.getElementById('lastWithdrawal').innerText = `${new Date(lastWithdrawal * 1000).toLocaleString()}`;

        // Make the vesting details visible
        document.getElementById('vestingDetailsDisplay').style.display = 'block';
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    detectAndConnectMetaMaskAutomatically();

    // Manual connection trigger, ensure button exists
    const connectButton = document.getElementById('connectWalletButton');
    if (connectButton) {
        connectButton.addEventListener('click', detectAndConnectMetaMaskAutomatically);
    }
});
