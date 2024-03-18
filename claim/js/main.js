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
    const totalPLRTAclaimable = parseInt(nftCount) * 20000; // Assuming PLRT value is 20,000
    console.log("Total PLRT claimable:", totalPLRTAclaimable);
    // Optionally update your UI to display the totalPLRTAclaimable value

    // ... rest of your code ...
  } catch (error) {
    // ... error handling ...
  }
}



document.getElementById('connectWalletButton').addEventListener('click', main);

document.getElementById('claimTokensButton').addEventListener('click', async () => {
  try {
    await claimTokens(); // Assuming claimTokens correctly uses the signer from connectWallet or initContracts
    console.log('Tokens claimed successfully.');
  } catch (error) {
    console.error('Error claiming tokens:', error);
  }
});

async function handleWithdrawal() {
  // Example function - adjust as needed based on actual app functionality
}
