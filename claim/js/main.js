import { connectWallet } from './ethereumConnection.js';
import { initContracts, claimTokens } from './contractInteractions.js'; // Ensure claimTokens is correctly exported
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';
import { getNFTDetails } from './nftInteractions.js'; // Ensure this is correctly implemented and exported
import { calculatePLRTAmount } from './uiHelpers.js';

async function main() {
  try {
    // Connect wallet
    const signer = await connectWallet();

    // Initialize contracts
    await initContracts(); // Corrected to not pass 'signer' as initContracts does not require it

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

    // Get and display NFT details
    const nftDetailsList = await getNFTDetails(userAddress); // Assuming successful retrieval

    if (nftDetailsList.length > 0) {
      // Update UI to display NFT details (replace with your specific display logic)
      const nftDetailsContainer = document.getElementById('nftDetails');
      nftDetailsContainer.innerHTML = ''; // Clear existing content
      for (const nftDetails of nftDetailsList) {
        const nftDetailsElement = document.createElement('div');
        nftDetailsElement.classList.add('nft-detail'); // Add a CSS class for styling

        nftDetailsElement.innerHTML = `
          <p>Token ID: ${nftDetails.tokenId}</p>
          <p>Token URI: ${nftDetails.tokenURI}</p>
          ${nftDetails.metadata ? `<p>Metadata: ${JSON.stringify(nftDetails.metadata)}</p>` : ''}
        `;

        nftDetailsContainer.appendChild(nftDetailsElement);
      }
      nftDetailsContainer.style.display = 'block'; // Show the NFT details container
    } else {
      console.log('User has no NFTs.');
      // Optionally display a message indicating no NFTs found
    }

    // Conditionally show claim tokens button if applicable
    if (roleDetails) {
      document.getElementById('claimTokensButton').style.display = 'block';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('errorDisplay').textContent = 'Error: ' + error.message;
    document.getElementById('errorDisplay').style.display = 'block';
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
