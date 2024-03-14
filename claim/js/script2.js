// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";
const nftContractAddress = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
const teamMemberContractAddress = "0xe7ABbf79eD30AaDf572478f3293e31486F7d10cB";

let vestingContract, nftContract, teamMemberContract;

// Utility function to fetch ABI from a local JSON file
async function fetchABI(path) {
    const response = await fetch(path);
    return await response.json();
}

// Initialize Ethereum contracts for NFT holders
async function initNFTHolderContracts() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Fetch and initialize the NFT contract
        const nftABI = await fetchABI('./abi/nft_abi.json');
        nftContract = new ethers.Contract(nftContractAddress, nftABI, signer);

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const userAddress = accounts[0];
        document.getElementById('walletAddress').innerText = userAddress;
        showElement('walletAddressDisplay');
        hideElement('connectWalletText');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Check NFT ownership before enabling withdrawal
        await checkNFTOwnershipAndDisplayVestingDetails(userAddress);
    } catch (error) {
        console.error("An error occurred during NFT holder contract initialization:", error);
    }
}

// Initialize Ethereum contracts for team members
async function initTeamMemberContracts() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Fetch and initialize the vesting contract for team members
        const vestingABI = await fetchABI('./abi/vesting_abi.json');
        vestingContract = new ethers.Contract(vestingContractAddress, vestingABI, signer);

        // Fetch and display the connected wallet address for team members
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const address = accounts[0];
        document.getElementById('walletAddress').innerText = address;
        showElement('walletAddressDisplay');
        showElement('withdrawTokensButton');
        hideElement('connectWalletText');
        hideElement('connectWalletButton');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Fetch and display vesting details for team members
        await fetchAndDisplayVestingDetails(address);
    } catch (error) {
        console.error("An error occurred during team member contract initialization:", error);
    }
}

// Check NFT ownership and display vesting details for NFT holders
async function checkNFTOwnershipAndDisplayVestingDetails(address) {
    try {
        const nftBalance = await nftContract.balanceOf(address);
        if (nftBalance.toNumber() > 0) {
            showElement('withdrawTokensButton');
            await fetchAndDisplayVestingDetails(address);
        } else {
            displayMessage('You do not own the required NFT to withdraw tokens.');
            hideElement('withdrawTokensButton');
        }
    } catch (error) {
        console.error('Error checking NFT ownership:', error);
    }
}

// Fetch and display vesting details for team members
async function fetchAndDisplayVestingDetails(walletAddress) {
    try {
        // Fetch vesting details for team members
        const details = await vestingContract.vestingDetails(walletAddress);

        // Update UI with fetched details
        document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
        // Additional details and UI updates here...

        showElement('vestingDetailsDisplay');
    } catch (error) {
        console.error('Error fetching and displaying vesting details:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check if the user is an NFT holder, team member, or treasury
        const userRole = /* Logic to determine the user's role */;
        switch (userRole) {
            case 'NFTHolder':
                await initNFTHolderContracts();
                break;
            case 'TeamMember':
                await initTeamMemberContracts();
                break;
            case 'Treasury':
                await initTreasuryContracts();
                break;
            default:
                displayMessage('Unknown user role.');
                break;
        }
    } catch (error) {
        console.error("An error occurred during contract initialization:", error);
    }

    // Event listener for Connect Wallet button (for all user roles)
    const connectWalletButton = document.getElementById('connectWalletButton');
    connectWalletButton.addEventListener('click', async () => {
        try {
            await initContracts();
        } catch (error) {
            console.error("Failed to initialize contracts:", error);
        }
    });
});

