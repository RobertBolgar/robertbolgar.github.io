// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utils.js 
import { showElement, hideElement, displayMessage } from './utils.js';

const contractABI = [ { "inputs": [ { "internalType": "contract IERC20", "name": "_tokenAddress", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "oldAddress", "type": "address" }, { "internalType": "address", "name": "newAddress", "type": "address" } ], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "plrToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teamMembers", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "VESTING_PERIOD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "vestingDetails", "outputs": [ { "internalType": "uint256", "name": "totalAllocation", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "vestingStart", "type": "uint256" }, { "internalType": "uint256", "name": "lastWithdrawal", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];
const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";

// Automatically detects and connects to MetaMask. This function remains the same.
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

            // Optional: Change the button text to "Connected" or similar to indicate success
            document.getElementById('connectWalletButton').innerText = 'Connected';
            await fetchAndDisplayVestingDetails(address);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log("MetaMask is not installed or not accessible.");
        // Change the button text to indicate MetaMask is not detected
        document.getElementById('connectWalletButton').innerText = 'MetaMask Not Detected';
        displayMessage('messageBox', 'MetaMask is not installed. Please install MetaMask to connect.', false);
    }
}

// Fetches and displays vesting details for the connected wallet. This function remains the same.
async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
     try {
        const details = await contract.vestingDetails(walletAddress);
       
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation);
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn);
        
        const vestingStart = new Date(details.vestingStart * 1000).toLocaleString();
        const lastWithdrawal = new Date(details.lastWithdrawal * 1000).toLocaleString();
        document.getElementById('vestingStart').innerText = vestingStart;
        document.getElementById('lastWithdrawal').innerText = lastWithdrawal;

       // Use BigNumber methods for any arithmetic operations involving BigNumbers
        const now = Math.floor(Date.now() / 1000); // Current time in seconds, only declared once
        const timeSinceLastWithdrawal = ethers.BigNumber.from(now).sub(details.lastWithdrawal);
        const VESTING_PERIOD = await contract.VESTING_PERIOD();
        const isEligibleToWithdraw = timeSinceLastWithdrawal.gte(VESTING_PERIOD);

        const VESTING_PERIOD_SECONDS = (await contract.VESTING_PERIOD()).toNumber();
        const WITHDRAWAL_RATE = (await contract.WITHDRAWAL_RATE()).toNumber();

         // Calculate periods elapsed since the last withdrawal or vesting start
        const periodsElapsedSinceLastWithdrawal = Math.floor((now - details.lastWithdrawal.toNumber()) / VESTING_PERIOD_SECONDS);
        const totalWithdrawableNow = details.totalAllocation.mul(WITHDRAWAL_RATE).div(100).mul(periodsElapsedSinceLastWithdrawal);
        let availableToWithdraw = totalWithdrawableNow.sub(details.amountWithdrawn);

         // Ensure availableToWithdraw is not negative and does not exceed totalAllocation
        availableToWithdraw = availableToWithdraw.lt(0) ? ethers.constants.Zero : availableToWithdraw;
        availableToWithdraw = availableToWithdraw.add(details.amountWithdrawn).gt(details.totalAllocation) ? details.totalAllocation.sub(details.amountWithdrawn) : availableToWithdraw;
         
       

          // Ensure the display includes the calculation, accounting for no available tokens
       document.getElementById('tokensAvailableForWithdrawal').innerText = ethers.utils.formatEther(availableToWithdraw) + ' PLRT';
        
        // Update button text based on withdrawal eligibility
        const withdrawButton = document.getElementById('withdrawTokensButton');
        if (isEligibleToWithdraw) {
            withdrawButton.innerText = 'Withdraw Tokens';
            withdrawButton.disabled = false; // Enable the button if withdrawal is possible
        } else {
            withdrawButton.innerText = 'Unable to Withdraw'; // Change text to indicate withdrawal is not possible
            withdrawButton.disabled = true; // Optionally disable the button to prevent clicks
        }

        document.getElementById('availableToWithdraw').innerText = isEligibleToWithdraw ? 'Yes' : 'No';

        const daysUntilNextWithdrawal = isEligibleToWithdraw ? 0 : (VESTING_PERIOD - timeSinceLastWithdrawal) / (60 * 60 * 24);
        document.getElementById('daysUntilNextWithdrawal').innerText = Math.ceil(daysUntilNextWithdrawal) + ' days';

        showElement('vestingDetailsDisplay');

    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
}



// Handles the withdrawal button click. This function remains the same.
async function handleWithdrawButtonClick() {
    showElement('loadingIndicator');
    const result = await performWithdrawal(); // Calls the performWithdrawal function
    
    if (result.success) {
        displayMessage('messageBox', 'Withdrawal initiated successfully.', true);
    } else {
        if (result.error.message.includes("vesting period not met")) {
            displayMessage('messageBox', 'Vesting period not met.', false);
        } else if (result.error.code === -32603) {
            console.log('Internal JSON-RPC error data:', result.error.data);
            displayMessage('messageBox', 'Blockchain error. See console for details.', false);
        } else {
            displayMessage('messageBox', 'Withdrawal failed. Please try again.', false);
        }
    }
    hideElement('loadingIndicator');
}

// Performs the withdrawal operation. This function remains the same.
async function performWithdrawal() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const tx = await contract.withdrawTokens();
        await tx.wait();
        return { success: true };
    } catch (error) {
        console.error("Withdrawal transaction failed:", error);
        return { success: false, error };
    }
}

// DOMContentLoaded event listener setup
document.addEventListener('DOMContentLoaded', () => {
    // Corrected function to handle MetaMask connection
    async function handleConnectWallet() {
        await detectAndConnectMetaMaskAutomatically();
    }

    // Event listener for the Connect Wallet button
    const connectWalletButton = document.getElementById('connectWalletButton');
    if (connectWalletButton) {
        connectWalletButton.addEventListener('click', handleConnectWallet);
    }

    // Event listener for the Withdraw Tokens button
    const withdrawButton = document.getElementById('withdrawTokensButton');
    if (withdrawButton) {
        withdrawButton.addEventListener('click', handleWithdrawButtonClick);
    } else {
        console.log('Withdraw Tokens Button not found');
    }
});
