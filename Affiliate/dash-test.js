document.addEventListener('DOMContentLoaded', async () => {
    // Initialize connection to Ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

   // Fetch ABI files asynchronously
    const mintAbiResponse = await fetch('./mint_abi.json');
    const mintAbi = await mintAbiResponse.json();

    const affiliateAbiResponse = await fetch('./affiliate_abi.json');
    const affiliateAbi = await affiliateAbiResponse.json();

    // Contract addresses
    const nftContractAddress = "0xDCe273D77326f888A441E65E4AaA6a008A5cAD66";
    const affiliateContractAddress = "0x761c5c5409D80D042242344f075B3B570c51Eb70";

    // Contract instances
    const nftContract = new ethers.Contract(nftContractAddress, mintAbi, signer);
    const affiliateContract = new ethers.Contract(affiliateContractAddress, affiliateAbi, signer);

// Function to set the address of the new AffiliateTracker contract
async function setAffiliateTrackerAddress(address) {
    try {
        // Validate the input address
        if (!ethers.utils.isAddress(address)) {
            throw new Error("Invalid address");
        }

        // Call the setAffiliateTrackerAddress function from the NFTmint contract
        const tx = await nftContract.setAffiliateTrackerAddress(address);

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Provide feedback to the user
        console.log("AffiliateTracker address set successfully");
    } catch (error) {
        console.error("Error setting AffiliateTracker address:", error.message);
    }
}
// Admin function to approve a user
async function approveUser(userAddress) {
    try {
        // Validate user input
        if (!ethers.utils.isAddress(userAddress)) {
            throw new Error("Invalid user address");
        }

        // Call the approveUser function from the contract
        const tx = await nftContract.approveUser(userAddress);

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Provide feedback to the user
        console.log("User approved successfully");
    } catch (error) {
        console.error("Error approving user:", error.message);
    }
}


// Admin function to revoke a user
   async function revokeUser(userAddress) {
    try {
        // Validate user input
        if (!ethers.utils.isAddress(userAddress)) {
            throw new Error("Invalid user address");
        }

        // Call the contract function to revoke the user
        const tx = await nftContract.revokeUser(userAddress);

        // Wait for the transaction to be mined
        await tx.wait();

        // Provide feedback to the user
        console.log("User revoked successfully");
    } catch (error) {
        console.error("Error revoking user:", error.message);
    }
}



    // Admin function to approve and register an affiliate
async function approveAndRegisterAffiliate(affiliateAddress, commissionRate) {
    try {
        // Validate inputs
        if (!ethers.utils.isAddress(affiliateAddress)) {
            throw new Error("Invalid affiliate address");
        }
        if (isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
            throw new Error("Invalid commission rate");
        }

        // Call the approveAndRegisterAffiliate function from the NFTmint contract
        const tx = await nftContract.approveAndRegisterAffiliate(affiliateAddress, commissionRate);

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Provide feedback to the user
        console.log("Affiliate approved and registered successfully");
    } catch (error) {
        console.error("Error approving and registering affiliate:", error.message);
    }
}




    // Function to revoke an affiliate
async function revokeAffiliate(affiliateAddress) {
    try {
        // Validate affiliate input
        if (!ethers.utils.isAddress(affiliateAddress)) {
            throw new Error("Invalid affiliate address");
        }

        // Call the revokeAffiliate function from the NFTmint contract
        const tx = await nftContract.revokeAffiliate(affiliateAddress);

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Provide feedback to the user
        console.log("Affiliate revoked successfully");
    } catch (error) {
        console.error("Error revoking affiliate:", error.message);
    }
}


    // Function to set commission rate using the NFTmint contract
async function setCommissionRate(newRate) {
    try {
        // Validate commission rate input
        if (isNaN(newRate) || newRate < 0 || newRate > 100) {
            throw new Error("Invalid commission rate");
        }

        // Call the setCommissionRate function from the NFTmint contract
        const tx = await nftContract.setCommissionRate(newRate);

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Provide feedback to the user
        console.log("Commission rate set successfully");
    } catch (error) {
        console.error("Error setting commission rate:", error.message);
    }
}

   /* // Function to fetch the current status of direct payments
    async function fetchDirectPaymentStatus() {
        try {
            // Call a function to check if direct payments are enabled or disabled
            const isDirectPaymentEnabled = await affiliateContract.getDirectPaymentStatus();

            // Update the button text and display the current status
            const toggleDirectPaymentBtn = document.getElementById('toggleDirectPaymentBtn');
            if (isDirectPaymentEnabled) {
                toggleDirectPaymentBtn.textContent = 'Disable Direct Payment';
            } else {
                toggleDirectPaymentBtn.textContent = 'Enable Direct Payment';
            }
        } catch (error) {
            console.error("Error fetching direct payment status:", error.message);
        }
    } */

    /*
    async function toggleDirectPayment() {
    try {
        // Call the toggleDirectPayment function from the contract
        const tx = await affiliateTracker.toggleDirectPayment();

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Provide feedback to the user
        console.log("Direct payment toggled successfully");
    } catch (error) {
        console.error("Error toggling direct payment:", error.message);
    }
} */
    
  /*
    async function toggleDirectPaymentForUser(userAddress) {
        try {
            // Validate user input
            if (!ethers.utils.isAddress(userAddress)) {
                throw new Error("Invalid user address");
            }

            // Implement the logic to toggle direct payment for a user
            // ...

            // Provide feedback to the user
            console.log("Direct payment toggled successfully for user");
        } catch (error) {
            console.error("Error toggling direct payment for user:", error.message);
        }
    } */

    async function setDefaultAffiliateWithRate(defaultAffiliateAddress, commissionRate) {
        try {
            // Validate inputs
            if (!ethers.utils.isAddress(defaultAffiliateAddress) || isNaN(commissionRate) || commissionRate < 0 || commissionRate > 100) {
                throw new Error("Invalid inputs");
            }

            // Implement the logic to set default affiliate with rate
            // ...

            // Provide feedback to the user
            console.log("Default affiliate set with rate successfully");
        } catch (error) {
            console.error("Error setting default affiliate with rate:", error.message);
        }
    }

    // JavaScript function to handle Withdraw Funds button click event
    async function withdrawFunds() {
        try {
            // Implement the logic to withdraw funds
            // ...

            // Provide feedback to the user
            console.log("Funds withdrawn successfully");
        } catch (error) {
            console.error("Error withdrawing funds:", error.message);
        }
    }

    // JavaScript function to handle View Contract Balance button click event
    async function viewContractBalance() {
        try {
            // Implement the logic to view contract balance
            // ...

            // Provide feedback to the user
            console.log("Contract balance viewed successfully");
        } catch (error) {
            console.error("Error viewing contract balance:", error.message);
        }
    }

    // JavaScript function to trigger emergency stop
    async function triggerEmergencyStop() {
        try {
            // Implement the logic to trigger emergency stop
            // ...

            // Provide feedback to the user
            console.log("Emergency stop triggered successfully");
        } catch (error) {
            console.error("Error triggering emergency stop:", error.message);
        }
    }

    // Function to fetch and display sales
    async function fetchSales() {
        try {
            // Implement the logic to fetch and display sales
            // ...

            // Provide feedback to the user
            console.log("Sales fetched successfully");
        } catch (error) {
            console.error("Error fetching sales:", error.message);
        }
    }

    
    // Add event listeners admin actions

    // Event listener for the approveUser button
    document.getElementById('approveUserBtn').addEventListener('click', async () => {
        const userAddress = document.getElementById('userAddress').value;
        await approveUser(userAddress);
    });


       // Add an event listener for the "Revoke User" button click event
    document.getElementById('revokeUserBtn').addEventListener('click', async () => {
        const userAddress = document.getElementById('userAddressToRemove').value;
        await revokeUser(userAddress);
    });

    
    // Event listener for the "Approve and Register Affiliate" button click event
    document.getElementById('approveAndRegisterAffiliateBtn').addEventListener('click', async () => {
        const affiliateAddress = document.getElementById('affiliateAddress').value;
        const commissionRate = document.getElementById('commissionRate').value;
        await approveAndRegisterAffiliate(affiliateAddress, commissionRate);
    });

    // Event listener for the "Revoke Affiliate" button click event
    document.getElementById('revokeAffiliateBtn').addEventListener('click', async () => {
        const affiliateAddress = document.getElementById('affiliateAddress').value;
        await revokeAffiliate(affiliateAddress);
    });

    // Event listener for the "Set Commission Rate" button click event
    document.getElementById('setCommissionRateBtn').addEventListener('click', async () => {
        const newRate = document.getElementById('commissionRate').value;
        await setCommissionRate(newRate);
    });

    // Event listener for the Set AffiliateTracker Address button click event
    document.getElementById('setAffiliateTrackerAddressBtn').addEventListener('click', async () => {
        const address = document.getElementById('affiliateTrackerAddress').value;
        await setAffiliateTrackerAddress(address);
    });

   /* // Event listener for the "Toggle Direct Payment" button click event
    document.getElementById('toggleDirectPaymentBtn').addEventListener('click', async () => {
        await toggleDirectPayment();
    }); */

  /*  // Event listener for the "Toggle Direct Payment" button
    document.getElementById('toggleDirectPaymentBtn').addEventListener('click', async () => {
        try {
            // Toggle the direct payment status when the button is clicked
            await affiliateContract.toggleDirectPayment();

            // Fetch and update the status after toggling
            await fetchDirectPaymentStatus();
        } catch (error) {
            console.error("Error toggling direct payment:", error.message);
        }
    }); */




});
