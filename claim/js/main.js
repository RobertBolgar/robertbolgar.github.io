import { connectWallet } from './ethereumConnection.js';
import { initContracts, claimTokens, treasuryFunctions, vestingFunctions, contract } from './contractInteractions.js'; // Import the contract variable here
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';
import { countNFTs } from './nftInteractions.js'; // Assuming these imports 

async function main() {
  try {
    const signer = await connectWallet();
    await initContracts(); // Make sure contracts are initialized first
    const userAddress = await signer.getAddress();
    document.getElementById('userAddress').textContent = `Your Connected Wallet Address: ${userAddress}`;

    const roleDetails = await determineRoleAndFetchDetails(userAddress);

    if (roleDetails) {
      displayVestingDetailsForRole(roleDetails);
      document.getElementById('userDetails').style.display = 'block';
      document.getElementById('vestingDetails').style.display = 'block';

      switch(roleDetails.role) {
        case "Treasury":
          await fetchAndDisplayTreasuryDetails();
          break;
        // Add cases for other roles if needed
        default:
          console.log("Role does not have a specific details section to display.");
          break;
      }
    } else {
      document.getElementById('treasuryDetails').style.display = 'none';
    }

    const nftCount = await countNFTs(userAddress);
    const totalPLRTClaimable = parseInt(nftCount) * 20000;
    console.log("Total PLRT claimable:", totalPLRTClaimable);
    
    const totalPLRTClaimableElement = document.getElementById('totalPLRTAclaimable');
    if (totalPLRTClaimableElement) {
        totalPLRTClaimableElement.textContent = `Total PLRT Claimable: ${totalPLRTClaimable}`;
    }

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
    await claimTokens();
    console.log('Tokens claimed successfully.');
    // Consider re-invoking role determination and display logic to update the UI post-claim
  } catch (error) {
    console.error('Error claiming tokens:', error);
    document.getElementById('errorDisplay').textContent = `Error claiming tokens: ${error.message}`;
    document.getElementById('errorDisplay').style.display = 'block';
  }
});
