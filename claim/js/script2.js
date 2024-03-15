// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0xD781F2FD98B1160050b7f5b5724636cA16B5c257";
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

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const userAddress = accounts[0];
        document.getElementById('walletAddress').innerText = userAddress;
        showElement('walletAddressDisplay');
        hideElement('connectWalletText');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Fetch and display vesting details for all three groups
        await fetchAndDisplayVestingDetails(userAddress);

    } catch (error) {
        console.error("An error occurred during contract initialization:", error);
    }
}

async function fetchAndDisplayVestingDetails(walletAddress) {
    try {
        const [foundingTeamDetails, treasuryDetails, privateSaleDetails] = await Promise.all([
            fetchVestingDetails(walletAddress, 'FoundingTeam'), // Founding Team
            fetchVestingDetails(walletAddress, 'Treasury'), // Treasury
            fetchVestingDetails(walletAddress, 'PrivateSale')  // Private Sale
        ]);

        displayVestingDetails('FoundingTeam', foundingTeamDetails);
        displayVestingDetails('Treasury', treasuryDetails);
        displayVestingDetails('PrivateSale', privateSaleDetails);
    } catch (error) {
        console.error("An error occurred while fetching and displaying vesting details:", error);
    }
}

// Define a mapping from group names to numerical IDs
const groupMapping = {
    "FoundingTeam": 0,
    "Treasury": 1,
    "PrivateSale": 2
};

async function fetchVestingDetails(walletAddress, group) {
    try {
        // Call the contract function with only the wallet address argument
        const [
            totalAllocation,
            amountWithdrawn,
            availableToWithdraw,
            vestingStart,
            lastWithdrawal,
            tokensAvailableToWithdraw,
            daysUntilNextWithdrawal
        ] = await vestingContract.getVestingDetails(walletAddress, groupMapping[group]); // Use numerical group ID

        return {
            totalAllocation,
            amountWithdrawn,
            availableToWithdraw,
            vestingStart: new Date(vestingStart * 1000).toLocaleString(),
            lastWithdrawal: new Date(lastWithdrawal * 1000).toLocaleString(),
            tokensAvailableToWithdraw,
            daysUntilNextWithdrawal: Math.ceil(daysUntilNextWithdrawal / (60 * 60 * 24))
        };
    } catch (error) {
        console.error("Error fetching vesting details for wallet address", walletAddress, ":", error);
        return null;
    }
}

function displayVestingDetails(groupName, details) {
    if (!details) {
        console.error("No details found for group", groupName);
        return;
    }

    document.getElementById(groupName + 'TotalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
    document.getElementById(groupName + 'AmountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
    document.getElementById(groupName + 'VestingStart').innerText = details.vestingStart;
    document.getElementById(groupName + 'LastWithdrawal').innerText = details.lastWithdrawal;
    document.getElementById(groupName + 'TokensAvailableToWithdraw').innerText = ethers.utils.formatEther(details.tokensAvailableToWithdraw) + ' PLRT';
    document.getElementById(groupName + 'DaysUntilNextWithdrawal').innerText = details.daysUntilNextWithdrawal + ' days';
}

document.addEventListener('DOMContentLoaded', async () => {
    // Register event listener for Connect Wallet button
    document.getElementById('connectWalletButton').addEventListener('click', initContracts);

    // Assume MetaMask is already connected, so initiate contract initialization immediately
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
        await initContracts();
    }
});
