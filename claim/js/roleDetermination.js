// Import necessary modules
import { vestingFunctions, treasuryFunctions } from './contractInteractions.js';

export async function determineRoleAndFetchDetails(userAddress) {
  try {
    console.log("Fetching role details for address:", userAddress);

    const teamDetails = await vestingFunctions.getTeamMemberVestingDetails(userAddress).catch((error) => {
      console.error("Error fetching team member details:", error);
      return null;
    });
    console.log("Team Member Details:", teamDetails);

    const privateSaleNFTDetails = await vestingFunctions.getPrivateSaleNFTVestingDetails(userAddress).catch((error) => {
      console.error("Error fetching private sale NFT details:", error);
      return null;
    });
    console.log("Private Sale NFT Details:", privateSaleNFTDetails);

    const treasuryDetails = await vestingFunctions.getTreasuryVestingDetails().catch((error) => {
      console.error("Error fetching treasury details:", error);
      return null;
    });
    console.log("Treasury Details:", treasuryDetails);

    // Check if any role details were found
    if (teamDetails || privateSaleNFTDetails || treasuryDetails) {
      // If a role was found, return the corresponding details
      if (teamDetails) return { role: "Team Member", details: teamDetails };
      if (privateSaleNFTDetails) return { role: "Private Sale NFT Holder", details: privateSaleNFTDetails };
      if (treasuryDetails) return { role: "Treasury", details: treasuryDetails };
    } else {
      // If no role was found, return an object with "N/A" role
      return { role: "N/A", details: null };
    }
  } catch (error) {
    console.error("Error determining role or fetching details: ", error);
    throw error;
  }
}
