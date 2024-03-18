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

    // Directly integrate display logic for each role within this function
    switch (role) {
        case 'Team Member':
            const teamMemberDetails = details.teamMember;
            // Directly integrated logic to display team member details
            console.log('Displaying Team Member Details:', teamMemberDetails);
            // Replace console.log with actual DOM manipulation or UI update logic
            break;
        case 'Private Sale NFT Holder':
            const privateSaleNFTDetails = details.privateSaleNFT;
            // Directly integrated logic to display private sale NFT holder details
            console.log('Displaying Private Sale NFT Details:', privateSaleNFTDetails);
            // Replace console.log with actual DOM manipulation or UI update logic
            break;
        case 'Treasury':
            const treasuryDetails = await treasuryFunctions.getTreasuryWallet();
            // Directly integrated logic to display treasury details
            console.log('Displaying Treasury Details:', treasuryDetails);
            // Replace console.log with actual DOM manipulation or UI update logic
            break;
        default:
            console.log("Role does not have a specific details section to display.");
            break;
    }
}
