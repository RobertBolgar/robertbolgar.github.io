// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0xD781F2FD98B1160050b7f5b5724636cA16B5c257";
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

async function fetchAndDisplayVestingDetails(walletAddress) {
    console.log("Fetching vesting details for address:", walletAddress);
    clearVestingDetails(); // Clear existing display
    
    const groups = [0, 1, 2]; // Assuming numeric identifiers for FoundingTeam, Treasury, PrivateSale
    
    for (const group of groups) {
        try {
            const details = await vestingContract.getVestingDetails(group).call({ from: walletAddress });
            if (details && details.totalAllocation.gt(0)) { // Assuming non-zero allocation indicates valid data
                displayVestingDetails(group, details);
            }
        } catch (error) {
            console.error(`Error fetching details for group ${group}:`, error);
        }
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


function displayVestingDetails(groupName, details) {
    if (!details) {
        console.error("No details found for group", groupName);
        return;
    }

    document.getElementById('totalAllocation').innerText = ethers.utils.formatEther(details.totalAllocation) + ' PLRT';
    document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn) + ' PLRT';
    document.getElementById('vestingStart').innerText = new Date(details.vestingStart * 1000).toDateString();
    document.getElementById('lastWithdrawal').innerText = new Date(details.lastWithdrawal * 1000).toDateString();
    document.getElementById('tokensAvailableForWithdrawal').innerText = ethers.utils.formatEther(details.tokensAvailableToWithdraw) + ' PLRT';
    document.getElementById('daysUntilNextWithdrawal').innerText = details.daysUntilNextWithdrawal + ' days';
    document.getElementById('vestingDetailsDisplay').style.display = 'block';

}

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('connectWalletButton').addEventListener('click', initContracts);
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
        await initContracts();
    }
});
