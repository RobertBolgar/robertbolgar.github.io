// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0x5511Df64BFd58A6BCE2a96F4D05d623f6a8f1dDc";
const nftContractAddress = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
const plrtAddress = '0xe7ABbf79eD30AaDf572478f3293e31486F7d10cB';

let vestingContract, nftContract, plrtContract;

async function fetchABI(path) {
    const response = await fetch(path);
    return await response.json();
}

ethereum.on('accountsChanged', function (accounts) {
    // Clear previous details
    clearVestingDetails();

    // Fetch and display for the new account
    const newAccountAddress = accounts[0];
    fetchAndDisplayVestingDetails(newAccountAddress);
});


async function initContracts() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    const vestingABI = await fetchABI('./abi/vesting_abi.json');
    vestingContract = new ethers.Contract(vestingContractAddress, vestingABI, signer);

    const nftABI = await fetchABI('./abi/nft_abi.json');
    nftContract = new ethers.Contract(nftContractAddress, nftABI, signer);

    const plrtABI = await fetchABI('./abi/plrt_abi.json');
    plrtContract = new ethers.Contract(plrtAddress, plrtABI, provider);

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    const userAddress = accounts[0];
    document.getElementById('walletAddress').innerText = userAddress;
    showElement('walletAddressDisplay');
    hideElement('connectWalletText');
    document.getElementById('connectWalletButton').innerText = 'Connected';

    await fetchAndDisplayVestingDetails(userAddress);
}

async function connectWallet() {
    await ethereum.request({ method: 'eth_requestAccounts' }); // Request wallet connection
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    initContracts(signer); // Initialize your contracts with the signer

    fetchAndDisplayVestingDetails(walletAddress); // Proceed to fetch and display vesting details
}


async function fetchAndDisplayVestingDetails(walletAddress) {
    clearVestingDetails(); // Function to clear previously displayed details
    
    // Directly working with NFT balance and assuming vesting details are auto-handled by the contract
    try {
        const nftBalance = await nftContract.balanceOf(walletAddress);
        console.log(`NFT Balance: ${nftBalance}`); // Debugging line to see NFT balance
        
        // You might not be able to directly fetch PrivateSale details without setup due to your contract's design.
        // This example assumes you have a method to check if the user has any vested amount or similar.
        // Adjust according to your actual contract methods and expected arguments.
        const privateSaleDetails = await vestingContract["getVestingDetails(uint8)"](2, {from: walletAddress}); // Adjusted to reflect a potential correct call
        
        if (privateSaleDetails) {
            displayVestingDetails('PrivateSale', privateSaleDetails);
        } else {
            console.log("No vesting details found or user is not part of the Private Sale group.");
        }
    } catch (error) {
        console.error("Error fetching Private Sale vesting details:", error);
    }
}





async function fetchVestingDetails(group) {
    try {
        const vestingDetails = await vestingContract.getVestingDetails(group);
        return vestingDetails;
    } catch (error) {
        console.error("Error fetching vesting details for group", group, ":", error);
        return null;
    }
}

// Place this function with your existing JavaScript functions
function clearVestingDetails() {
    document.getElementById('totalAllocation').innerText = '';
    document.getElementById('amountWithdrawn').innerText = '';
    document.getElementById('availableToWithdraw').innerText = '';
    document.getElementById('vestingStart').innerText = '';
    document.getElementById('lastWithdrawal').innerText = '';
    document.getElementById('tokensAvailableForWithdrawal').innerText = '';
    document.getElementById('daysUntilNextWithdrawal').innerText = '';
}


function displayVestingDetails(group, details) {
    // Adjust according to your UI elements
    document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
    document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
    document.getElementById('availableToWithdraw').innerText = ethers.utils.formatEther(details.totalAllocation.sub(details.amountWithdrawn)) + ' PLRT';
    document.getElementById('vestingStart').innerText = new Date(details.vestingStart * 1000).toDateString();
    document.getElementById('lastWithdrawal').innerText = new Date(details.lastWithdrawal * 1000).toDateString();
    document.getElementById('tokensAvailableForWithdrawal').innerText = ethers.utils.formatEther(details.tokensAvailableToWithdraw) + ' PLRT';
    document.getElementById('daysUntilNextWithdrawal').innerText = details.daysUntilNextWithdrawal + ' days';
    document.getElementById('vestingDetailsDisplay').style.display = 'block';
    // Add more details as needed
}



document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('connectWalletButton').addEventListener('click', initContracts);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
        await initContracts();
    }
});
