// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';
// Import utility functions for UI manipulation
import { showElement, hideElement, displayMessage } from './utils.js';

const vestingContractAddress = "0xFb630816DFa6E71b22C7b8C37e8407700Dec40b5";
const nftContractAddress = "0x7CbCC978336624be38Ce0c52807aEbf119081EA9";
const contractAddress = "0xe7ABbf79eD30AaDf572478f3293e31486F7d10cB"; // Update with your contract address

let vestingContract, nftContract;

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

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const userAddress = accounts[0];
        document.getElementById('walletAddress').innerText = userAddress;
        showElement('walletAddressDisplay');
        hideElement('connectWalletText');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Check NFT ownership before enabling withdrawal
        await checkNFTOwnershipAndDisplayVestingDetails(userAddress);
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

async function fetchAndDisplayVestingDetails(walletAddress) {
    try {
        // Fetch vesting details
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

async function initContract() {
    try {
        // Fetch the ABI from a local JSON file
        const abiResponse = await fetch('./abi/vesting_abi.json');
        const contractABI = await abiResponse.json();

        // Assuming MetaMask is installed and the user has connected their wallet
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();

        // Initialize the contract with the fetched ABI and signer
        window.contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Fetch and display the connected wallet address
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const address = accounts[0];
        document.getElementById('walletAddress').innerText = address;
        showElement('walletAddressDisplay');
        showElement('withdrawTokensButton');
        hideElement('connectWalletText');
        hideElement('connectWalletButton');
        document.getElementById('connectWalletButton').innerText = 'Connected';

        // Fetch and display vesting details
        await fetchAndDisplayVestingDetails(address);
    } catch (error) {
        console.error("An error occurred during contract initialization:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initContracts();
    const connectWalletButton = document.getElementById('connectWalletButton');
    connectWalletButton.addEventListener('click', async () => {
        try {
            await initContracts();
        } catch (error) {
            console.error("Failed to initialize contracts:", error);
        }
    });

    const withdrawButton = document.getElementById('withdrawTokensButton');
    if (withdrawButton) {
        withdrawButton.addEventListener('click', async () => {
            try {
                const tx = await window.contract.withdrawTokens();
                await tx.wait();
                displayMessage('Your withdrawal transaction was successful.');
                // Optionally, refresh vesting details to show updated info
                await fetchAndDisplayVestingDetails(ethers.utils.getAddress(document.getElementById('walletAddress').innerText));
            } catch (error) {
                console.error("Withdrawal transaction failed:", error);
                displayMessage('Withdrawal transaction failed. Please try again.');
            }
        });
    }
});
