// Import ethers from CDN or local installation
import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js';

// Function to show an element by its ID
function showElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'block';
    }
}

// Function to hide an element by its ID
function hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
        element.style.display = 'none';
    }
}

// Function to show team-related elements
function showTeamElements() {
    showElement("teamSection");
    hideElement("privateSaleNFTSection");
    hideElement("treasurySection");
}

// Function to show private sale NFT-related elements
function showPrivateSaleNFTElements() {
    showElement("privateSaleNFTSection");
    hideElement("teamSection");
    hideElement("treasurySection");
}

// Function to show treasury-related elements
function showTreasuryElements() {
    showElement("treasurySection");
    hideElement("teamSection");
    hideElement("privateSaleNFTSection");
}

// Initialize Web3
if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    ethereum.enable();
} else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
} else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}

// Contract address and ABI
const contractAddress = '0xB4308847b8060CB63463aa96bBbbbB23e958aeFa'; // Replace with your contract address
const contractABI = [
    // Contract ABI here
];

// Instantiate contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Get user's wallet address
web3.eth.getAccounts().then(async function(accounts) {
    const userAddress = accounts[0];

    // Get vesting details for the user
    const teamMemberDetails = await contract.methods.getTeamMemberVestingDetails(userAddress).call();
    const privateSaleNFTDetails = await contract.methods.getPrivateSaleNFTVestingDetails(userAddress).call();
    const treasuryDetails = await contract.methods.getTreasuryVestingDetails().call();

    // Display vesting data
    document.getElementById('walletInfo').innerHTML = `
        <h2>Wallet Address: ${userAddress}</h2>

        <div id="teamSection">
            <h3>Team Member Vesting Details:</h3>
            <p>Total Allocation: ${teamMemberDetails[0]}</p>
            <p>Claimed Amount: ${teamMemberDetails[1]}</p>
            <p>Remaining Claimable Amount: ${teamMemberDetails[2]}</p>
        </div>

        <div id="privateSaleNFTSection">
            <h3>Private Sale NFT Vesting Details:</h3>
            <p>Total Allocation: ${privateSaleNFTDetails[0]}</p>
            <p>Claimed Amount: ${privateSaleNFTDetails[1]}</p>
            <p>Remaining Claimable Amount: ${privateSaleNFTDetails[2]}</p>
        </div>

        <div id="treasurySection">
            <h3>Treasury Vesting Details:</h3>
            <p>Total Allocation: ${treasuryDetails[0]}</p>
            <p>Claimed Amount: ${treasuryDetails[1]}</p>
            <p>Remaining Claimable Amount: ${treasuryDetails[2]}</p>
        </div>
    `;
});
