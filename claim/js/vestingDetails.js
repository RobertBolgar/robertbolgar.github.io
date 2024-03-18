import { showDetails, showError } from './uiHelpers.js';

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
    switch (role.toLowerCase()) {
        case 'teammember': // Ensure this matches the role name fetched from the smart contract
            // Customize display for team members
            break;
        case 'privatesalenftholder': // Ensure this matches the role name fetched from the smart contract
            // Customize display for private sale NFT holders
            break;
        case 'treasury': // Ensure this matches the role name fetched from the smart contract
            // Customize display for treasury
            break;
        default:
            console.log("Role does not have a specific details section to display.");
            break;
    }
}



