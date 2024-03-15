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
if (isTeamMember.group === 1 || isTeamMember.group === 0) { // Team or Private Sale
    document.getElementById('teamMembershipDetails').innerText = `You are a team member with a total allocation of ${isTeamMember.totalAllocation} PLRT`;
    showElement('teamMembershipDetails');
    showElement('vestingDetailsDisplay'); // Make the section visible
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

async function convertEthToPlrt(ethAmount) {
    // Replace the conversionRate with the actual rate at which 1 Ether is converted to PLRT tokens
    const conversionRate = 1000; // Example conversion rate
    return ethAmount * conversionRate;
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

async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = vestingContract.connect(signer);
    
    try {
        const details = await contract.vestingDetails(walletAddress);
       
        // Convert total allocation from Ether to PLRT
        const totalAllocationInPLRT = await convertEthToPlrt(ethers.utils.formatEther(details.totalAllocation));

        // Format the total allocation value with 8 decimal places and PLRT suffix
        const formattedTotalAllocation = totalAllocationInPLRT.toFixed(8) + ' PLRT';

        document.getElementById('totalAllocation').innerText = formattedTotalAllocation;
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn);
        
        const vestingStart = new Date(details.vestingStart * 1000).toLocaleString();
        const lastWithdrawal = details.lastWithdrawal ? new Date(details.lastWithdrawal * 1000).toLocaleString() : 'N/A';
        document.getElementById('vestingStart').innerText = vestingStart;
        document.getElementById('lastWithdrawal').innerText = lastWithdrawal;

        // Use BigNumber methods for any arithmetic operations involving BigNumbers
        const now = Math.floor(Date.now() / 1000); // Current time in seconds, only declared once
        if (details.lastWithdrawal !== undefined) {
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
        } else {
            console.error('Last withdrawal time is undefined');
            // Handle the case where last withdrawal time is undefined
            document.getElementById('lastWithdrawal').innerText = 'Last withdrawal time not available';
        }

        showElement('vestingDetailsDisplay');

        // Check if the user is a team member and display the appropriate section
        const isTeamMember = await vestingContract.vestingDetails(walletAddress);
        if (isTeamMember.group === 1 || isTeamMember.group === 0) { // Assuming 'Team' is 1 and 'PrivateSale' is 0
            // Display special features for team members and private sale participants
            document.getElementById('teamMembershipDetails').innerText = `You are a member of the PLRT team.`;
            showElement('teamMembershipDetails');
            showElement('vestingDetailsDisplay'); // Ensure the entire section is visible

        }
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




