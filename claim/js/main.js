import { connectWallet } from './ethereumConnection.js';
import { initContracts, claimTokens } from './contractInteractions.js';
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';
import { countNFTs } from './nftInteractions.js'; // Import countNFTs instead

async function main() {
  try {
    // Connect wallet
    const signer = await connectWallet();

    // Initialize contracts
    await initContracts();

    // Get user's wallet address
    const userAddress = await signer.getAddress();
    document.getElementById('userAddress').textContent = `Your Connected Wallet Address: ${userAddress}`;

    // Determine user's role and fetch vesting details
    const roleDetails = await determineRoleAndFetchDetails(userAddress);

    // Display vesting details
    displayVestingDetailsForRole(roleDetails);

    // Show user details and vesting details sections
    document.getElementById('userDetails').style.display = 'block';
    document.getElementById('vestingDetails').style.display = 'block';

    // Get NFT count and calculate total PLRT claimable
    const nftCount = await countNFTs(userAddress);
    const totalPLRTClaimable = parseInt(nftCount) * 20000; // Assuming PLRT value is 20,000
    console.log("Total PLRT claimable:", totalPLRTClaimable);
    
    // Update UI to display the total PLRT claimable
    const totalPLRTAclaimableElement = document.getElementById('totalPLRTAclaimable');
    if (totalPLRTAclaimableElement) {
        totalPLRTAclaimableElement.textContent = `Total PLRT Claimable: ${totalPLRTClaimable}`;
    }

    // Optionally, reveal claim tokens button based on conditions (e.g., if claimable amount > 0)
    if (totalPLRTClaimable > 0) {
        document.getElementById('claimTokensButton').style.display = 'block';
    }
  } catch (error) {
    console.error('Error in main function:', error);
    document.getElementById('errorDisplay').textContent = `Error: ${error.message}`;
    document.getElementById('errorDisplay').style.display = 'block';
  }
}

document.getElementById('connectWalletButton').addEventListener('click', main);

document.getElementById('claimTokensButton').addEventListener('click', async () => {
  try {
    await claimTokens(); // Assuming claimTokens correctly uses the signer from connectWallet or initContracts
    console.log('Tokens claimed successfully.');
    // After claiming, you may want to update the UI to reflect changes
    // This might involve re-fetching role details, NFT count, or updating claimable amounts
  } catch (error) {
    console.error('Error claiming tokens:', error);
    document.getElementById('errorDisplay').textContent = `Error claiming tokens: ${error.message}`;
    document.getElementById('errorDisplay').style.display = 'block';
  }
});

async function handleWithdrawal() {
  // Implementation for handling withdrawal action
}
