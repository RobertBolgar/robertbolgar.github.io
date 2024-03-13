// NFTMint.js


document.addEventListener('DOMContentLoaded', async () => {
    // Initialize connection to Ethereum
    let provider;
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
    } else {
        console.error('Ethereum provider is not available');
        return;
    }

    const signer = provider.getSigner();

    // Fetch ABI files asynchronously
    const mintAbiResponse = await fetch('./contracts/ABI/NFTMint_ABI.json');
    const mintAbi = await mintAbiResponse.json();

    // Contract address
    const nftContractAddress = "0xe9Ac226DBC108dAEeba3dbe55B8b1cE3ae52381E";

    // Contract instance
    const nftContract = new ethers.Contract(nftContractAddress, mintAbi, signer);


    // Function to mint an NFT
    async function mintNFT(event) {
        event.preventDefault(); // Prevent form submission

        const name = document.getElementById('name').value;
        const tokenURI = document.getElementById('tokenURI').value;
        const price = document.getElementById('price').value;

        try {
            // Call the mintNFT function from the contract
            const tx = await nftContract.mintNFT(name, tokenURI, price);
            await tx.wait(); // Wait for the transaction to be confirmed

            // Provide feedback to the user
            console.log("NFT minted successfully");
            alert("NFT minted successfully!");
        } catch (error) {
            console.error("Error minting NFT:", error.message);
            alert("Failed to mint NFT. See console for more details.");
        }

    // Admin functions

    // Function to approve a user
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

    // Function to revoke a user
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

    // Function to withdraw funds
    async function withdrawFunds() {
        try {
            const contractBalance = await provider.getBalance(nftContractAddress);
            if (contractBalance.gt(0)) {
                const tx = await signer.sendTransaction({
                    to: await signer.getAddress(),
                    value: contractBalance
                });
                await tx.wait();
                console.log("Funds withdrawn successfully");
            } else {
                console.log("Contract balance is zero");
            }
        } catch (error) {
            console.error("Error withdrawing funds:", error.message);
        }
    }

    // Add event listener to the mint form submission
    document.getElementById('mintForm').addEventListener('submit', mintNFT);

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

    // Event listener for the "Withdraw Funds" button click event
    document.getElementById('withdrawFundsButton').addEventListener('click', withdrawFunds);
});

