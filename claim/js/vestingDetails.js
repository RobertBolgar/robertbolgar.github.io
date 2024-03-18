import { showDetails, showError } from './uiHelpers.js';
import { vestingFunctions, treasuryFunctions } from './contractInteractions.js';

export async function displayVestingDetailsForRole(roleDetails) {
    // Assuming showError and showDetails are already defined and handle general error/display logic
    if (!roleDetails) {
        showError("Unable to determine role or fetch details.");
        return;
    }

    const { role, details } = roleDetails;

    if (!details) {
        showError(`No details found for ${role} role.`);
        return;
    }

    showDetails(details); // Show general details applicable to all roles

    // Handle specific role-based display logic
    switch (role) {
        case 'Team Member':
            const teamMemberDetails = details.teamMember;
            console.log('Displaying Team Member Details:', teamMemberDetails);
            // Directly manipulate the DOM to display team member details
            document.getElementById('teamMemberDetails').textContent = JSON.stringify(teamMemberDetails);
            document.getElementById('teamMemberDetails').style.display = 'block';
            break;

        case 'Private Sale NFT Holder':
            const privateSaleNFTDetails = details.privateSaleNFT;
            console.log('Displaying Private Sale NFT Details:', privateSaleNFTDetails);
            // Directly manipulate the DOM to display private sale NFT details
            document.getElementById('privateSaleDetails').textContent = JSON.stringify(privateSaleNFTDetails);
            document.getElementById('privateSaleDetails').style.display = 'block';
            break;

        case 'Treasury':
            // Assuming details contains treasury-specific information
            const treasuryDetails = details.treasury;
            console.log('Displaying Treasury Details:', treasuryDetails);
            // Directly manipulate the DOM to display treasury details
            // Update this with actual IDs and logic relevant to your application
            document.getElementById('treasuryDetails').textContent = JSON.stringify(treasuryDetails);
            document.getElementById('treasuryDetails').style.display = 'block';
            break;

        // Additional cases for other roles...
    }
}
