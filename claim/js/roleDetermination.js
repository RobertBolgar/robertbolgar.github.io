import { vestingFunctions } from './contractInteractions.js';

export async function determineRoleAndFetchDetails(contract, userAddress) {
    try {
        // Check if the user is a team member
        const teamDetails = await vestingFunctions.getTeamMemberVestingDetails(contract, userAddress).catch(() => null);
        if (teamDetails) return { role: "Team Member", details: teamDetails };

        // Check if the user is a private sale NFT holder
        const privateSaleNFTDetails = await vestingFunctions.getPrivateSaleNFTVestingDetails(contract, userAddress).catch(() => null);
        if (privateSaleNFTDetails) return { role: "Private Sale NFT Holder", details: privateSaleNFTDetails };

        // Check if the user is in the treasury
        const treasuryDetails = await vestingFunctions.getTreasuryVestingDetails(contract).catch(() => null);
        if (treasuryDetails) return { role: "Treasury", details: treasuryDetails };

        // If the user is not in any of the above roles, return null
        return null;
    } catch (error) {
        console.error("Error determining role or fetching details: ", error);
        return null;
    }
}

