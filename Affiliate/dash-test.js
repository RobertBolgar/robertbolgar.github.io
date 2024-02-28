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
    const nftContractAddress = "0xd940B79622e07E8CC54DEB37037bD35c18387Dc2";
    const affiliateContractAddress = "0x17B4166EA43F770Bd6ff36D68E6A9De4D4d2Ff42";

    // Contract instances
    const nftContract = new ethers.Contract(nftContractAddress, mintAbi, signer);
    const affiliateContract = new ethers.Contract(affiliateContractAddress, affiliateAbi, signer);


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



    async function approveAffiliate(affiliateAddress) {
        try {
            // Validate affiliate input
            if (!ethers.utils.isAddress(affiliateAddress)) {
                throw new Error("Invalid affiliate address");
            }

            // Implement the logic to approve an affiliate
            // ...

            // Provide feedback to the user
            console.log("Affiliate approved successfully");
        } catch (error) {
            console.error("Error approving affiliate:", error.message);
        }
    }

    async function revokeAffiliate(affiliateAddress) {
        try {
            // Validate affiliate input
            if (!ethers.utils.isAddress(affiliateAddress)) {
                throw new Error("Invalid affiliate address");
            }

            // Implement the logic to revoke an affiliate
            // ...

            // Provide feedback to the user
            console.log("Affiliate revoked successfully");
        } catch (error) {
            console.error("Error revoking affiliate:", error.message);
        }
    }

    async function setCommissionRate(newRate) {
        try {
            // Validate commission rate input
            if (isNaN(newRate) || newRate < 0 || newRate > 100) {
                throw new Error("Invalid commission rate");
            }

            // Implement the logic to set commission rate
            // ...

            // Provide feedback to the user
            console.log("Commission rate set successfully");
        } catch (error) {
            console.error("Error setting commission rate:", error.message);
        }
    }

    async function toggleDirectPayment() {
        try {
            // Implement the logic to toggle direct payment
            // ...

            // Provide feedback to the user
            console.log("Direct payment toggled successfully");
        } catch (error) {
            console.error("Error toggling direct payment:", error.message);
        }
    }
    
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
    }

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
        const userAddress = document.getElementById('userAddress').value;
        await revokeUser(userAddress);
    });


});
