// Import necessary modules
import { vestingFunctions } from './contractInteractions.js';

// Determine user role and fetch details function
export async function determineRoleAndFetchDetails(userAddress) {
    try {
        const teamDetails = await vestingFunctions.getTeamMemberVestingDetails(userAddress).catch(() => null);
        const privateSaleNFTDetails = await vestingFunctions.getPrivateSaleNFTVestingDetails(userAddress).catch(() => null);
        const treasuryDetails = await vestingFunctions.getTreasuryVestingDetails().catch(() => null);

        if (teamDetails) return { role: "Team Member", details: teamDetails };
        if (privateSaleNFTDetails) return { role: "Private Sale NFT Holder", details: privateSaleNFTDetails };
        if (treasuryDetails) return { role: "Treasury", details: treasuryDetails };

        return null;
    } catch (error) {
        console.error("Error determining role or fetching details: ", error);
        throw error;
    }
}

