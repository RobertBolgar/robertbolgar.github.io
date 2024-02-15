// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

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
        document.getElementById('availableToWithdraw').innerText = `Available to Withdraw: ${isEligibleToWithdraw ? 'Y' : 'N'}`;
        document.getElementById('daysUntilNextWithdrawal').innerText = `Days until next withdrawal: ${Math.max(0, Math.ceil(daysUntilNextWithdrawal))}`;

        // Format and display "Vesting Start" and "Last Withdrawal" dates
        document.getElementById('vestingStart').innerText = `Vesting Start: ${new Date(vestingStart * 1000).toLocaleString()}`;
        document.getElementById('lastWithdrawal').innerText = `Last Withdrawal: ${new Date(lastWithdrawal * 1000).toLocaleString()}`;

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
