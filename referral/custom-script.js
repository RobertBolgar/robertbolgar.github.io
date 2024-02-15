
const contractABI = [ { "inputs": [ { "internalType": "contract IERC20", "name": "_tokenAddress", "type": "address" }, { "internalType": "address", "name": "initialOwner", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" } ], "name": "OwnableInvalidOwner", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "OwnableUnauthorizedAccount", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "oldAddress", "type": "address" }, { "internalType": "address", "name": "newAddress", "type": "address" } ], "name": "updateTeamMemberAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdrawTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "plrToken", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "teamMembers", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "VESTING_PERIOD", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "vestingDetails", "outputs": [ { "internalType": "uint256", "name": "totalAllocation", "type": "uint256" }, { "internalType": "uint256", "name": "amountWithdrawn", "type": "uint256" }, { "internalType": "uint256", "name": "vestingStart", "type": "uint256" }, { "internalType": "uint256", "name": "lastWithdrawal", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_RATE", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];
const contractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";

// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

async function detectAndConnectMetaMask() {
    if (window.ethereum && window.ethereum.isMetaMask) {
        console.log("MetaMask is installed!");
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            document.getElementById('walletAddress').innerText = address;
            document.getElementById('walletAddressDisplay').style.display = 'block';
            document.getElementById('withdrawTokensButton').style.display = 'block';
            // Additional logic here...
        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
        }
    } else {
        console.log("MetaMask is not installed or not accessible.");
    }
}

document.addEventListener('DOMContentLoaded', detectAndConnectMetaMask);



async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, contractABI, provider.getSigner());
    try {
        // Assume these functions exist and correctly fetch data from your contract
        const details = await contract.vestingDetails(walletAddress);

 document.getElementById('totalAllocation').innerText = ethers.utils.formatUnits(details.totalAllocation, 'ether') + ' PLRT';
        
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
        document.getElementById('availableToWithdraw').innerText = await calculateAvailableToWithdraw(walletAddress) + ' PLRT'; // Implement this based on your contract logic
        document.getElementById('vestingStart').innerText = new Date(details.vestingStart * 1000).toLocaleString();
        document.getElementById('lastWithdrawal').innerText = new Date(details.lastWithdrawal * 1000).toLocaleString();

        // Make the vesting details visible
        document.getElementById('vestingDetailsDisplay').style.display = 'block';
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }


        // Check if the user is eligible to withdraw yet
        const timeNow = Date.now() / 1000; // Current time in seconds
        const timeElapsedSinceLastWithdrawal = timeNow - details.lastWithdrawal.toNumber();
        if (timeElapsedSinceLastWithdrawal < VESTING_PERIOD) {
            document.getElementById('withdrawalStatus').innerText = "Can't withdraw yet";
        }
    } catch (error) {
        console.error('Error fetching vesting details:', error);
    }
}

document.getElementById('withdrawTokensButton').addEventListener('click', async () => {
    const walletAddress = await ethereum.request({ method: 'eth_accounts' }).then(accounts => accounts[0]);
    checkWithdrawalEligibility(walletAddress);
});

async function checkWithdrawalEligibility(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const detail = await contract.vestingDetails(walletAddress);

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const lastWithdrawal = detail.lastWithdrawal.toNumber();
    const timeSinceLastWithdrawal = now - lastWithdrawal;
    const isEligibleToWithdraw = timeSinceLastWithdrawal >= VESTING_PERIOD;

    if (isEligibleToWithdraw) {
        withdrawTokens(); // Proceed to attempt withdrawal
    } else {
        document.getElementById('withdrawalStatus').innerText = "Can't withdraw yet. Please wait until the next vesting period.";
    }
}


async function withdrawTokens() {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('MetaMask is not installed or not accessible.');
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    try {
        const tx = await contract.withdrawTokens();
        console.log('Withdrawal transaction:', tx);
        await tx.wait();
        document.getElementById('withdrawalStatus').innerText = 'Withdrawal successful!';
        // Optionally, refresh the vesting details display here after withdrawal
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await fetchAndDisplayVestingDetails(accounts[0]);
        }
    } catch (error) {
        console.error('Error during token withdrawal:', error);
        document.getElementById('withdrawalStatus').innerText = 'Withdrawal failed. See console for details.';
    }
}


