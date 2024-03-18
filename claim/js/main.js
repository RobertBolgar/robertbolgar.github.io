import { connectWallet } from './ethereumConnection.js';
import { initContracts, claimTokens, treasuryFunctions, vestingFunctions } from './contractInteractions.js';
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';
import { countNFTs } from './nftInteractions.js'; // Assuming these imports 

async function main() { 
  try {
    // Connect wallet
    const signer = await connectWallet();
    
    // Initialize contracts
    await initContracts();
    
    // Get user address
    const userAddress = await signer.getAddress();
    document.getElementById('userAddress').textContent = `Your Connected Wallet Address: ${userAddress}`;

    // Determine user role and fetch details
    const roleDetails = await determineRoleAndFetchDetails(contract, userAddress); // Assuming contract is initialized
    
    if (roleDetails) {
      // Display general vesting details
      displayVestingDetailsForRole(roleDetails); // Assumes this function can handle all roles
      document.getElementById('userDetails').style.display = 'block';
      document.getElementById('vestingDetails').style.display = 'block';

      switch(roleDetails.role) {
        case "Treasury":
          // Fetch and display treasury details
          const treasuryDetails = await treasuryFunctions.getTreasuryWallet();
          document.getElementById('treasuryWallet').textContent = `Treasury Wallet Address: ${treasuryDetails.walletAddress}`;
          document.getElementById('treasuryTotalAllocation').textContent = `Total Allocation: ${treasuryDetails.totalAllocation}`;
          document.getElementById('treasuryClaimedAmount').textContent = `Claimed Amount: ${treasuryDetails.claimedAmount}`;
          document.getElementById('treasuryLastClaimTime').textContent = `Last Claim Time: ${treasuryDetails.lastClaimTime}`;
          document.getElementById('treasuryDetails').style.display = 'block';
          break;
        // Add cases and logic for other roles if needed
        default:
          console.log("Role does not have a specific details section to display.");
          break;
      }
    } else {
      // Hide all role-specific sections if no role determined
      document.getElementById('treasuryDetails').style.display = 'none';
      // Add similar lines for other roles
    }

    // Count NFTs and calculate claimable PLRT
    const nftCount = await countNFTs(userAddress);
    const totalPLRTClaimable = parseInt(nftCount) * 20000;
    console.log("Total PLRT claimable:", totalPLRTClaimable);
    
    // Display total PLRT claimable
    const totalPLRTClaimableElement = document.getElementById('totalPLRTAclaimable');
    if (totalPLRTClaimableElement) {
        totalPLRTClaimableElement.textContent = `Total PLRT Claimable: ${totalPLRTClaimable}`;
    }

    // Show claim tokens button if claimable PLRT > 0
    if (totalPLRTClaimable > 0) {
        document.getElementById('claimTokensButton').style.display = 'block';
    }
  } catch (error) {
    console.error('Error in main function:', error);
    document.getElementById('errorDisplay').textContent = `Error: ${error.message}`;
    document.getElementById('errorDisplay').style.display = 'block';
  }
}

// Event listener for connecting wallet
document.getElementById('connectWalletButton').addEventListener('click', main);

// Event listener for claiming tokens
document.getElementById('claimTokensButton').addEventListener('click', async () => {
  try {
    // Claim tokens
    await claimTokens();
    console.log('Tokens claimed successfully.');
    // Consider re-invoking role determination and display logic to update the UI post-claim
  } catch (error) {
    console.error('Error claiming tokens:', error);
    document.getElementById('errorDisplay').textContent = `Error claiming tokens: ${error.message}`;
    document.getElementById('errorDisplay').style.display = 'block';
  }
});
