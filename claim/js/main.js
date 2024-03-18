import { connectWallet } from './ethereumConnection.js';
import { initContracts, claimTokens, treasuryFunctions, vestingFunctions } from './contractInteractions.js';
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';
import { countNFTs } from './nftInteractions.js';

async function main() {
  try {
    const signer = await connectWallet();
    await initContracts();
    const userAddress = await signer.getAddress();
    document.getElementById('userAddress').textContent = `Your Connected Wallet Address: ${userAddress}`;

    const roleDetails = await determineRoleAndFetchDetails(userAddress);

    if (roleDetails) {
      displayVestingDetailsForRole(roleDetails); // Handles all display logic based on the role
      document.getElementById('userDetails').style.display = 'block';
      document.getElementById('vestingDetails').style.display = 'block';
    } else {
      document.getElementById('userRole').textContent = 'Role not found';
    }

    const nftCount = await countNFTs(userAddress);
    const totalPLRTClaimable = parseInt(nftCount) * 20000;
    console.log("Total PLRT claimable:", totalPLRTClaimable);

    const totalPLRTClaimableElement = document.getElementById('totalPLRTClaimable');
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
  } catch (error) {
    console.error('Error claiming tokens:', error);
    document.getElementById('errorDisplay').textContent = `Error claiming tokens: ${error.message}`;
    document.getElementById('errorDisplay').style.display = 'block';
  }
});

