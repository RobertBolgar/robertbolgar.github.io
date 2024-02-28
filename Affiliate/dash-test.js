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
    const nftContractAddress = "0x0D3f36AC41e73FDCAb1d119a239305e58bfb2568";
    const affiliateContractAddress = "0x4A6E0AbC1b0A6c3D1893bEe81e4aAe2BB8016CAA";

    // Contract instances
    const nftContract = new ethers.Contract(nftContractAddress, mintAbi, signer);
    const affiliateContract = new ethers.Contract(affiliateContractAddress, affiliateAbi, signer);

    // Function to set the AffiliateTracker contract address
    async function setAffiliateTrackerAddress(address) {
        try {
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
            // Log the new rate value for debugging
            console.log("New rate value:", newRate);

            // Validate commission rate input
            if (isNaN(newRate) || newRate < 0 || newRate > 100) {
                throw new Error("Invalid commission rate. Please provide a value between 0 and 100.");
            }

            // Convert commission rate to BigNumber if necessary
            const commissionRate = ethers.utils.parseUnits(newRate.toString(), 0); // Assuming rate is passed as a percentage

            // Log the parsed commission rate for debugging
            console.log("Parsed commission rate:", commissionRate.toString());

            // Call the setCommissionRate function from the NFTmint contract
            const tx = await nftContract.setCommissionRate(commissionRate);

            // Wait for the transaction to be confirmed
            await tx.wait();

            // Provide feedback to the user
            console.log("Commission rate set successfully");
        } catch (error) {
            console.error("Error setting commission rate:", error.message);
        }
    }

   // Function to fetch the current status of direct payments
async function fetchDirectPaymentStatus() {
    try {
        // Call the isDirectPaymentEnabled function from the AffiliateTracker contract
        const isEnabled = await affiliateContract.isDirectPaymentEnabled();

        // Display the status on the dashboard
        const statusElement = document.getElementById('directPaymentStatus');
        statusElement.textContent = isEnabled ? 'Enabled' : 'Disabled';
    } catch (error) {
        console.error("Error fetching direct payment status:", error.message);
    }
}


    // Function to toggle direct payment
    async function toggleDirectPayment() {
        try {
            // Call the toggleDirectPayment function from the contract
            const tx = await affiliateContract.toggleDirectPayment();

            // Wait for the transaction to be confirmed
            await tx.wait();

            // Provide feedback to the user
            console.log("Direct payment toggled successfully");
        } catch (error) {
            console.error("Error toggling direct payment:", error.message);
        }
    }

    // Event listeners for admin actions

    // Event listener for the "Approve User" button click event
    document.getElementById('approveUserBtn').addEventListener('click', async () => {
        const userAddress = document.getElementById('userAddress').value;
        await approveUser(userAddress);
    });

    // Event listener for the "Revoke User" button click event
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
        const newRateInput = document.getElementById('newCommissionRate').value.trim();
        if (newRateInput === "") {
            console.error("Error setting commission rate: Commission rate cannot be empty.");
            return;
        }
        const newRate = parseFloat(newRateInput);
        await setCommissionRate(newRate);
    });

    // Event listener for the "Set AffiliateTracker Address" button click event
    document.getElementById('setAffiliateTrackerAddressBtn').addEventListener('click', async () => {
        const affiliateTrackerAddress = document.getElementById('affiliateTrackerAddress').value;
        await setAffiliateTrackerAddress(affiliateTrackerAddress);
    });

    // Event listener for the "Toggle Direct Payment" button click event
    document.getElementById('toggleDirectPaymentBtn').addEventListener('click', async () => {
        await toggleDirectPayment();
        await fetchDirectPaymentStatus();
    });

    // Event listener for the "Fetch Direct Payment Status" button click event
    document.getElementById('fetchDirectPaymentStatusBtn').addEventListener('click', async () => {
    await fetchDirectPaymentStatus();
    });


    // Additional event listeners and functions

  // Function to withdraw funds
async function withdrawFunds() {
    try {
        // Get the contract balance
        const contractBalance = await ethers.provider.getBalance(nftContractAddress);

        // Check if the contract has balance
        if (contractBalance.gt(0)) {
            // Get the signer
            const signer = ethers.provider.getSigner();

            // Send the contract balance to the signer's address
            const tx = await signer.sendTransaction({
                to: signer.getAddress(),
                value: contractBalance
            });

            // Wait for the transaction to be confirmed
            await tx.wait();

            // Provide feedback to the user
            console.log("Funds withdrawn successfully");
        } else {
            console.log("Contract balance is zero");
        }
    } catch (error) {
        console.error("Error withdrawing funds:", error.message);
    }
}


     // Function to display the NFT contract balance in BNB
async function displayNFTContractBalance() {
    try {
        // Ensure your provider is connected to the Binance Smart Chain
        const contractBalance = await provider.getBalance(nftContractAddress);
        const balanceInBNB = ethers.utils.formatEther(contractBalance); // BNB has the same decimal resolution as Ether
        document.getElementById('nftContractBalanceResult').textContent = `NFT Contract Balance: ${balanceInBNB} BNB`;
        console.log("NFT contract balance displayed successfully in BNB");
    } catch (error) {
        console.error("Error displaying NFT contract balance in BNB:", error.message);
        document.getElementById('nftContractBalanceResult').textContent = "Error displaying NFT contract balance in BNB.";
    }
}

// Function to activate the emergency stop
async function activateEmergencyStop() {
    try {
        const tx = await nftContract.setEmergencyStop(true);
        await tx.wait(); // Wait for the transaction to be mined
        console.log("Emergency stop activated successfully.");
        alert("Emergency stop has been activated!");
    } catch (error) {
        console.error("Error activating emergency stop:", error.message);
        alert("Failed to activate emergency stop: " + error.message);
    }
}

// Function to deactivate the emergency stop
async function deactivateEmergencyStop() {
    try {
        const tx = await nftContract.setEmergencyStop(false);
        await tx.wait(); // Wait for the transaction to be mined
        console.log("Emergency stop deactivated successfully.");
        alert("Emergency stop has been deactivated!");
    } catch (error) {
        console.error("Error deactivating emergency stop:", error.message);
        alert("Failed to deactivate emergency stop: " + error.message);
    }
}

// Function to fetch and display sales
async function fetchSales() {
    try {
        // Replace this with your actual logic to fetch sales data
        const salesData = await getSalesData(); // Assuming you have a function to fetch sales data

        // Display the sales data in the HTML
        displaySalesData(salesData);
        
        // Provide feedback to the user
        console.log("Sales fetched successfully");
    } catch (error) {
        console.error("Error fetching sales:", error.message);
    }
}

// Function to simulate fetching sales data
async function getSalesData() {
    // Simulated sales data
    const salesData = [
        { id: 1, product: "Product A", price: 100 },
        { id: 2, product: "Product B", price: 200 },
        { id: 3, product: "Product C", price: 150 }
    ];

    // Simulate delay to mimic asynchronous operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return salesData;
}

// Function to display sales data in the HTML
function displaySalesData(salesData) {
    const salesDataElement = document.getElementById('salesData');
    salesDataElement.innerHTML = ''; // Clear previous data

    // Iterate over the sales data and create HTML elements to display it
    salesData.forEach(sale => {
        const saleElement = document.createElement('div');
        saleElement.textContent = `Product: ${sale.product}, Price: ${sale.price}`;
        salesDataElement.appendChild(saleElement);
    });
}

   // Function to set the default affiliate in the NFTMint contract
async function setDefaultAffiliate(affiliateAddress) {
    try {
        // Check if the provided address is valid
        if (!ethers.utils.isAddress(affiliateAddress)) {
            throw new Error("Invalid affiliate address");
        }

        // Get the signer
        const signer = await ethers.provider.getSigner();

        // Get the instance of the NFTMint contract
        const nftMintContract = new ethers.Contract(contractAddress, nftMintAbi, signer);

        // Call the setDefaultAffiliate function
        const tx = await nftMintContract.setDefaultAffiliate(affiliateAddress);

        // Wait for the transaction to be confirmed
        await tx.wait();

        // Provide feedback to the user
        console.log("Default affiliate set successfully");
    } catch (error) {
        console.error("Error setting default affiliate:", error.message);
    }
}

    // Additional event listeners for new buttons

   // Event listener for the HTML button
document.getElementById('withdrawFundsButton').addEventListener('click', confirmWithdrawal);

    // Event listener for the "Set Default Affiliate" button click event
document.getElementById('setDefaultAffiliateBtn').addEventListener('click', async () => {
    const affiliateAddress = prompt("Enter the address of the default affiliate:");
    if (affiliateAddress) {
        await setDefaultAffiliate(affiliateAddress);
    }
});



    // Add event listener for the "Display NFT Contract Balance" button
document.getElementById('displayNFTContractBalanceBtn').addEventListener('click', async () => {
    await displayNFTContractBalance();
});
 

 // Event listener for the "Activate Emergency Stop" button
document.getElementById('activateEmergencyStopBtn').addEventListener('click', async () => {
    await activateEmergencyStop();
});

// Event listener for the "Deactivate Emergency Stop" button
document.getElementById('deactivateEmergencyStopBtn').addEventListener('click', async () => {
    await deactivateEmergencyStop();
})


    // Event listener for the "Fetch Sales" button click event
document.getElementById('fetchSalesBtn').addEventListener('click', async () => {
    await fetchSales();
});

});
