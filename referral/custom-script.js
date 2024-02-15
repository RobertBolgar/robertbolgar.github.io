// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

const contractABI = [ { "inputs": [ { "internalType": "contract IERC20", "name": "_tokenAddress", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "oldAddress", "type": "address" }, { "internalType": "address", "name": "newAddress", "type": "address" } ], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "plrToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teamMembers", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "VESTING_PERIOD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "vestingDetails", "outputs": [ { "internalType": "uint256", "name": "totalAllocation", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "vestingStart", "type": "uint256" }, { "internalType": "uint256", "name": "lastWithdrawal", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];
const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";

document.addEventListener('DOMContentLoaded', () => {
    // Attempt to connect automatically
    detectAndConnectMetaMaskAutomatically();

    // Manual connection trigger
    document.getElementById('connectWalletButton').addEventListener('click', detectAndConnectMetaMaskAutomatically);
});


// Function to detect and connect MetaMask automatically
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
            document.getElementById('walletAddress').innerText = `Wallet address: ${address}`;
            document.getElementById('walletAddressDisplay').style.display = 'block';
            document.getElementById('withdrawTokensButton').style.display = 'block';

            // Fetch and display vesting details
            await fetchAndDisplayVestingDetails(address);
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log("MetaMask is not installed or not accessible.");
    }
}

// Function to fetch and display vesting details
async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
    try {
        const details = await contract.vestingDetails(walletAddress);
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const lastWithdrawal = details.lastWithdrawal.toNumber();
        const timeSinceLastWithdrawal = now - lastWithdrawal;
        const VESTING_PERIOD = await contract.VESTING_PERIOD();
        const daysUntilNextWithdrawal = (VESTING_PERIOD / (60 * 60 * 24)) - (timeSinceLastWithdrawal / (60 * 60 * 24));
        const isEligibleToWithdraw = timeSinceLastWithdrawal >= VESTING_PERIOD;

        document.getElementById('availableToWithdraw').innerText = `Tokens available for withdrawal: ${isEligibleToWithdraw ? 'Y' : 'N'}`;
        document.getElementById('daysUntilNextWithdrawal').innerText = `Days until next withdrawal: ${Math.max(0, Math.ceil(daysUntilNextWithdrawal))}`;

        // Make the vesting details visible
        document.getElementById('vestingDetailsDisplay').style.display = 'block';
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }
}

// Event listener for automatic MetaMask connection
document.addEventListener('DOMContentLoaded', detectAndConnectMetaMaskAutomatically);



