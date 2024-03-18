import { showDetails, showError } from './uiHelpers.js';
import { vestingFunctions, treasuryFunctions } from './contractInteractions.js';

export async function displayVestingDetailsForRole(roleDetails) {
    if (!roleDetails) {
        showError("Unable to determine role or fetch details.");
        return;
    }

    const { role, details } = roleDetails;

    if (!details) {
        showError(`No details found for ${role} role.`);
        return;
    }

    showDetails(details);

    // Additional logic to customize the display based on the role
    switch (role) {
        case 'Team Member':
            const teamMemberDetails = details.teamMember;
            // Call a function to display team member details (e.g., vesting amount, start time, cliff duration)
            displayTeamMemberDetails(teamMemberDetails);
            break;
        case 'Private Sale NFT Holder':
            const privateSaleNFTDetails = details.privateSaleNFT;
            // Call a function to display private sale NFT holder details (e.g., NFT IDs, vesting schedules)
            displayPrivateSaleNFTDetails(privateSaleNFTDetails);
            break;
        case 'Treasury':
            const treasuryDetails = await treasuryFunctions.getTreasuryWallet(); // Assuming treasury details require a call
            displayTreasuryDetails(treasuryDetails); // Call the function to display treasury details
            break;
        default:
            console.log("Role does not have a specific details section to display.");
            break;
    }
}
