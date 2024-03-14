// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0xDebe77CeBCF3213A35425b962cdeD29de937C686";
const nftContractAddress = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
const plrtAddress = '0xe7ABbf79eD30AaDf572478f3293e31486F7d10cB';


let vestingContract, nftContract, plrtContract;

const ownerAddress = await vestingContract.owner();
const treasuryWalletAddress = ownerAddress;

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

        // Check NFT ownership before enabling withdrawal
        await checkNFTOwnershipAndDisplayVestingDetails(userAddress);

        // Fetch team membership status
        const isTeamMember = await vestingContract.vestingDetails(userAddress);
        if (isTeamMember.group === 1 || isTeamMember.group === 0) { // Assuming 'Team' is 1 and 'PrivateSale' is 0
            // Display special features for team members and private sale participants
            document.getElementById('teamMembershipDetails').innerText = `You are a team member with a total allocation of ${isTeamMember.totalAllocation} PLRT`;
            showElement('teamMembershipDetails');
        }
        
        // Check if the connected wallet is the Treasury
        const ownerAddress = await vestingContract.owner();
        const isTreasury = (userAddress === ownerAddress);
        if (isTreasury) {
            // Display special features for the Treasury wallet
        }
    } catch (error) {
        console.error("An error occurred during contract initialization:", error);
    }
}

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

// Fetches and displays vesting details for the connected wallet
async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
     try {
        const details = await contract.vestingDetails(walletAddress);
       
        // Convert total allocation from ETH to PLRT
        const totalAllocationEth = ethers.utils.formatEther(details.totalAllocation);
        const totalAllocationPlrt = await convertEthToPlrt(parseFloat(totalAllocationEth));
        
        // Update Total Allocation with the converted PLRT amount
        document.getElementById('totalAllocation').innerText = totalAllocationPlrt + ' PLRT';

        // Update other details...
    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
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
