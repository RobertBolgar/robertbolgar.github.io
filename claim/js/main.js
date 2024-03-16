import { connectWallet } from './ethereumConnection.js';
import { initContract } from './contractInteractions.js';
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';
import { sendPLRTToContract } from './contractInteractions.js';
import { calculatePLRTAmount } from './uiHelpers.js';

async function main() {
    const signer = await connectWallet();
    const contract = await initContract(signer);
    const userAddress = await signer.getAddress();
    const roleDetails = await determineRoleAndFetchDetails(contract, userAddress);
    displayVestingDetailsForRole(roleDetails);
}

document.getElementById('connectWalletButton').addEventListener('click', main);


// Example function to handle user interaction
async function handleWithdrawal() {
    const signer = await connectWallet();
    if (signer) {
        const nftCount = 5; // Replace with actual count from UI
        const plrtAmount = calculatePLRTAmount(nftCount); // Calculate PLRT amount based on NFT count
        const success = await sendPLRTToContract(signer, plrtAmount);
        if (success) {
            // Handle success
        } else {
            // Handle failure
        }
    } else {
        // Handle connection failure
    }
}

// Add event listeners or UI triggers to call handleWithdrawal

