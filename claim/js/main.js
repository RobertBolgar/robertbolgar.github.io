import { connectWallet } from './ethereumConnection.js';
import { initContract } from './contractInteractions.js';
import { determineRoleAndFetchDetails } from './roleDetermination.js';
import { displayVestingDetailsForRole } from './vestingDetails.js';

async function main() {
    const signer = await connectWallet();
    const contract = await initContract(signer);
    const userAddress = await signer.getAddress();
    const roleDetails = await determineRoleAndFetchDetails(contract, userAddress);
    displayVestingDetailsForRole(roleDetails);
}

document.getElementById('connectWalletButton').addEventListener('click', main);
