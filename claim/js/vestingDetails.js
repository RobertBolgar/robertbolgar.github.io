import { showDetails, showError } from './uiHelpers.js';

export function displayVestingDetailsForRole(roleDetails) {
    if (!roleDetails) {
        showError("Unable to determine role or fetch details.");
        return;
    }
    showDetails(roleDetails.details);
    // Additional logic to customize the display based on the role
}
