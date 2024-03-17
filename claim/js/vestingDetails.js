import { showDetails, showError } from './uiHelpers.js';

export function displayVestingDetailsForRole(roleDetails) {
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
        case 'teamMember':
            // Customize display for team members
            break;
        case 'privateSaleNFTHolder':
            // Customize display for private sale NFT holders
            break;
        case 'treasury':
            // Customize display for treasury
            break;
        default:
            // Handle unrecognized roles
            break;
    }
}
