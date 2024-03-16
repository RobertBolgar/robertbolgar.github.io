import { vestingFunctions } from './contractInteractions.js';

export async function determineRoleAndFetchDetails(contract, userAddress) {
    // Example logic to determine the role
    // Adjust based on your contract's logic and structure
    try {
        const teamDetails = await vestingFunctions.team(contract, userAddress).catch(() => null);
        if (teamDetails) return { role: "Team", details: teamDetails };

        // Repeat for other roles

    } catch (error) {
        console.error("Error determining role or fetching details: ", error);
        return null;
    }
}
