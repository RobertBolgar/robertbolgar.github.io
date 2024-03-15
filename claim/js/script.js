// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0x03e8a3ef9e2D241d64e7C38951AC6444066E897E";
const nftContractAddress = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
const plrtAddress = '0xe7ABbf79eD30AaDf572478f3293e31486F7d10cB';

let vestingContract, nftContract, plrtContract;

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

        // Fetch and initialize the PLRT token contract
        const plrtABI = await fetchABI('./abi/plrt_abi.json');
        plrtContract = new ethers.Contract(plrtAddress, plrtABI, provider);

        // Update UI with wallet address
        const accounts = await provider.listAccounts();
        const userAddress = accounts[0];
        document.getElementById('walletAddress').innerText = userAddress;
        showElement('walletAddressDisplay');
        hideElement('connectWalletText');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Determine user role and fetch vesting details accordingly
        determineUserRoleAndFetchDetails(userAddress);
        
    } catch (error) {
        console.error("An error occurred during contract initialization:", error);
    }
}

async function determineUserRoleAndFetchDetails(userAddress) {
    try {
        // Example of checking NFT ownership for a specific role
        const nftBalance = await nftContract.balanceOf(userAddress);
        if (nftBalance.gt(0)) {
            await fetchPrivateSaleNFTVestingDetails(userAddress);
            return; // Exit if the user is a private sale NFT holder
        }
        
        // Using a hypothetical contract method to determine the user's group
        const userGroup = await vestingContract.getUserGroup(userAddress);
        
        switch(userGroup.toNumber()) {
            case 0:
                // Treasury
                fetchTreasuryVestingDetails();
                break;
            case 1:
                // Team Member
                fetchTeamMemberVestingDetails(userAddress);
                break;
            case 2:
                // Private Sale NFT Holder
                fetchPrivateSaleNFTVestingDetails(userAddress);
                break;
            default:
                console.log("User does not belong to any specific group.");
                // Handle cases where the user doesn't belong to any group
        }
    } catch (error) {
        console.error("Error determining user role:", error);
    }
}

// Assuming the treasury vesting details can be fetched directly
async function fetchTreasuryVestingDetails() {
    try {
        const details = await vestingContract.treasuryVestingSchedule();
        displayVestingDetails(details, "Treasury");
    } catch (error) {
        console.error("Error fetching treasury vesting details:", error);
    }
}


// Fetch Team Member Vesting Details
async function fetchTeamMemberVestingDetails(userAddress) {
    try {
        const details = await vestingContract.teamVestingSchedules(userAddress);
        if (details.totalAllocation.gt(0)) {
            displayVestingDetails(details, "Team Member");
        }
    } catch (error) {
        console.error("Error fetching team member vesting details:", error);
    }
}

// Fetch Private Sale NFT Holder Vesting Details
async function fetchPrivateSaleNFTVestingDetails(userAddress) {
    try {
        const details = await vestingContract.privateSaleNFTVestingSchedules(userAddress);
        if (details.totalAllocation.gt(0)) {
            displayVestingDetails(details, "Private Sale NFT Holder");
        }
    } catch (error) {
        console.error("Error fetching private sale NFT holder vesting details:", error);
    }
}

// Display vesting details in the UI
function displayVestingDetails(details, groupType) {
    document.getElementById('vestingGroupType').textContent = groupType;
    document.getElementById('totalAllocation').textContent = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
    document.getElementById('amountWithdrawn').textContent = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
    // Update other details similarly
    
    showElement('vestingDetailsDisplay');
}

document.addEventListener('DOMContentLoaded', async () => {
    // Register event listener for Connect Wallet button
    document.getElementById('connectWalletButton').addEventListener('click', initContracts);

    // Automatically initiate contracts if the wallet is already connected
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
        await initContracts();
    }
});
