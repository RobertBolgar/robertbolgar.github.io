import { connectWallet } from './ethereumConnection.js';
import { initContract } from './contractInteractions.js';
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';
import { sendPLRTToContract } from './contractInteractions.js';
import { calculatePLRTAmount } from './uiHelpers.js';

async function main() {
    try {
        // Connect wallet
        const signer = await connectWallet();
        
        // Initialize contract
        const contract = await initContract(signer);
        
        // Get user's wallet address
        const userAddress = await signer.getAddress();
        document.getElementById('userAddress').textContent = `Your Connected Wallet Address: ${userAddress}`;
        
        // Determine user's role and fetch vesting details
        const roleDetails = await determineRoleAndFetchDetails(contract, userAddress);
        
        // Display vesting details
        displayVestingDetailsForRole(roleDetails);
        
        // Show user details and vesting details sections
        document.getElementById('userDetails').style.display = 'block';
        document.getElementById('vestingDetails').style.display = 'block';

        // Show claim tokens button
        document.getElementById('claimTokensButton').style.display = 'block';
    } catch (error) {
        // Handle errors
        console.error('Error:', error);
        document.getElementById('errorDisplay').textContent = 'Error: ' + error.message;
        document.getElementById('errorDisplay').style.display = 'block';
    }
}

// Add event listener to connect wallet button
document.getElementById('connectWalletButton').addEventListener('click', main);

// Event listener for claiming tokens
document.getElementById('claimTokensButton').addEventListener('click', async () => {
    try {
        // Connect wallet
        const signer = await connectWallet();
        
        // Claim tokens
        await claimTokens(signer);
        
        // Handle success
        console.log('Tokens claimed successfully.');
    } catch (error) {
        // Handle error
        console.error('Error claiming tokens:', error);
    }
});

// Example function to handle user withdrawal
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

