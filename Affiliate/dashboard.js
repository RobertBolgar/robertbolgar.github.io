document.addEventListener('DOMContentLoaded', async () => {
    // Initialize connection to Ethereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();

    // Contract addresses and ABIs
    const nftContractAddress = "YOUR_NFT_CONTRACT_ADDRESS";
    const affiliateContractAddress = "YOUR_AFFILIATE_CONTRACT_ADDRESS";
    const nftContractABI = [...]; // Your NFT contract ABI
    const affiliateContractABI = [...]; // Your Affiliate Tracker contract ABI

    // Create contract instances
    const nftContract = new ethers.Contract(nftContractAddress, nftContractABI, signer);
    const affiliateContract = new ethers.Contract(affiliateContractAddress, affiliateContractABI, signer);

    // Admin functions
    async function approveUser(userAddress) {
        try {
            const tx = await nftContract.approveUser(userAddress);
            await tx.wait();
            alert(`User ${userAddress} approved.`);
        } catch (error) {
            console.error('Error approving user:', error);
            alert('Failed to approve user.');
        }
    }

    async function revokeUser(userAddress) {
        try {
            const tx = await nftContract.revokeUser(userAddress);
            await tx.wait();
            alert(`User ${userAddress} revoked.`);
        } catch (error) {
            console.error('Error revoking user:', error);
            alert('Failed to revoke user.');
        }
    }

    async function approveAffiliate(affiliateAddress) {
        try {
            const tx = await affiliateContract.approveAffiliate(affiliateAddress);
            await tx.wait();
            alert(`Affiliate ${affiliateAddress} approved.`);
        } catch (error) {
            console.error('Error approving affiliate:', error);
            alert('Failed to approve affiliate.');
        }
    }

    async function revokeAffiliate(affiliateAddress) {
        try {
            const tx = await affiliateContract.revokeAffiliate(affiliateAddress);
            await tx.wait();
            alert(`Affiliate ${affiliateAddress} revoked.`);
        } catch (error) {
            console.error('Error revoking affiliate:', error);
            alert('Failed to revoke affiliate.');
        }
    }

    async function setCommissionRate(newRate) {
        try {
            const tx = await affiliateContract.setCommissionRate(newRate);
            await tx.wait();
            alert(`Commission rate set to ${newRate}%.`);
        } catch (error) {
            console.error('Error setting commission rate:', error);
            alert('Failed to set commission rate.');
        }
    }

    async function toggleDirectPayment() {
        try {
            const tx = await affiliateContract.toggleDirectPayment();
            await tx.wait();
            const directPaymentEnabled = await affiliateContract.directPaymentEnabled();
            alert(`Direct payment ${directPaymentEnabled ? 'enabled' : 'disabled'}.`);
        } catch (error) {
            console.error('Error toggling direct payment:', error);
            alert('Failed to toggle direct payment.');
        }
    }
    
    async function toggleDirectPaymentForUser(userAddress) {
    try {
        const tx = await affiliateContract.toggleDirectPaymentForUser(userAddress);
        await tx.wait();
        const directPaymentEnabled = await affiliateContract.directPaymentEnabledForUser(userAddress);
        alert(`Direct payment ${directPaymentEnabled ? 'enabled' : 'disabled'} for user ${userAddress}.`);
    } catch (error) {
        console.error('Error toggling direct payment for user:', error);
        alert('Failed to toggle direct payment for user.');
    }
}

    async function setDefaultAffiliateWithRate(defaultAffiliateAddress, commissionRate) {
    try {
        const tx = await nftContract.setDefaultAffiliateWithRate(defaultAffiliateAddress, commissionRate);
        await tx.wait();
        alert(`Default affiliate set to ${defaultAffiliateAddress} with commission rate ${commissionRate}%.`);
    } catch (error) {
        console.error('Error setting default affiliate:', error);
        alert('Failed to set default affiliate.');
    }
}

    // JavaScript function to handle Withdraw Funds button click event
async function withdrawFunds() {
    try {
        // Call the withdrawFunds function on the NFTMint contract
        const tx = await nftContract.withdrawFunds();
        await tx.wait();
        alert('Funds withdrawn successfully.'); // Display success message
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        alert('Failed to withdraw funds.'); // Display error message
    }
}

    // JavaScript function to handle View Contract Balance button click event
async function viewContractBalance() {
    try {
        // Call the balanceOf function on the NFTMint contract to get the contract balance
        const balance = await provider.getBalance(nftContract.address);
        const balanceInEth = ethers.utils.formatEther(balance); // Convert balance to Ether

        // Display the contract balance to the user
        alert(`Contract Balance: ${balanceInEth} ETH`);
    } catch (error) {
        console.error('Error fetching contract balance:', error);
        alert('Failed to fetch contract balance.');
    }
}

    // JavaScript function to trigger emergency stop
async function triggerEmergencyStop() {
    try {
        const tx = await nftContract.emergencyStop();
        await tx.wait();
        alert('Emergency stop successfully triggered.');
    } catch (error) {
        console.error('Error triggering emergency stop:', error);
        alert('Failed to trigger emergency stop.');
    }
}

// Event listener for emergencyStopBtn to trigger emergency stop
document.getElementById('emergencyStopBtn').addEventListener('click', () => {
    triggerEmergencyStop();
});


// Event listener for View Contract Balance button
document.getElementById('viewContractBalanceBtn').addEventListener('click', () => {
    viewContractBalance();
});


// Event listener for Withdraw Funds button
document.getElementById('withdrawFundsBtn').addEventListener('click', () => {
    withdrawFunds();
});


document.getElementById('setDefaultAffiliateBtn').addEventListener('click', () => {
    const defaultAffiliateAddress = document.getElementById('defaultAffiliateAddress').value;
    const commissionRate = parseInt(document.getElementById('defaultAffiliateCommissionRate').value, 10);
    setDefaultAffiliateWithRate(defaultAffiliateAddress, commissionRate);
});


document.getElementById('toggleDirectPaymentForUserBtn').addEventListener('click', () => {
    const userAddress = document.getElementById('userAddress').value;
    toggleDirectPaymentForUser(userAddress);
});


    // Event listeners for admin actions
    document.getElementById('approveUserBtn').addEventListener('click', () => {
        const userAddress = document.getElementById('userAddress').value;
        approveUser(userAddress);
    });

    document.getElementById('revokeUserBtn').addEventListener('click', () => {
        const userAddress = document.getElementById('userAddress').value;
        revokeUser(userAddress);
    });

    document.getElementById('approveAffiliateBtn').addEventListener('click', () => {
        const affiliateAddress = document.getElementById('affiliateAddress').value;
        approveAffiliate(affiliateAddress);
    });

    document.getElementById('revokeAffiliateBtn').addEventListener('click', () => {
        const affiliateAddress = document.getElementById('affiliateAddress').value;
        revokeAffiliate(affiliateAddress);
    });

    document.getElementById('setCommissionRateBtn').addEventListener('click', () => {
        const rate = parseInt(document.getElementById('commissionRate').value, 10);
        setCommissionRate(rate);
    });

    document.getElementById('toggleDirectPaymentBtn').addEventListener('click', () => {
        toggleDirectPayment();
    });


    async function getApprovedAffiliates() {
    try {
        const affiliates = await affiliateContract.getApprovedAffiliates();
        const affiliateList = document.getElementById('affiliateList');
        affiliateList.innerHTML = '';
        affiliates.forEach(affiliate => {
            const listItem = document.createElement('li');
            listItem.textContent = affiliate;
            affiliateList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching approved affiliates:', error);
    }
}

async function getApprovedUsers() {
    try {
        const users = await nftContract.getApprovedUsers();
        const userList = document.getElementById('userList');
        userList.innerHTML = '';
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = user;
            userList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching approved users:', error);
    }
}

// Call the functions to fetch and display the lists of approved affiliates and users
getApprovedAffiliates();
getApprovedUsers();


    // Function to fetch and display sales
    async function fetchSales() {
        try {
            // Fetch past events from the NFTMint contract
            const filter = nftContract.filters.NFTSold(null, null, null, null, null);
            const events = await nftContract.queryFilter(filter);

            // Display sale details
            const salesList = document.getElementById('salesList');
            salesList.innerHTML = ''; // Clear previous list
            
            events.forEach(event => {
                const tokenId = event.args.tokenId.toString();
                const buyer = event.args.buyer;
                const seller = event.args.seller;
                const affiliate = event.args.affiliate;
                const salePrice = ethers.utils.formatEther(event.args.salePrice);

                const listItem = document.createElement('li');
                listItem.textContent = `Token ID: ${tokenId}, Buyer: ${buyer}, Seller: ${seller}, Affiliate: ${affiliate}, Sale Price: ${salePrice} ETH`;
                salesList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching sales:', error);
            alert('Failed to fetch sales.');
        }
    }


    document.getElementById('emergencyStopBtn').addEventListener('click', async () => {
    try {
        await contract.setEmergencyStop(true);
        alert('Emergency stop activated');
    } catch (error) {
        console.error('Error setting emergency stop:', error);
        alert('Failed to set emergency stop');
    }
});

document.getElementById('resumeBtn').addEventListener('click', async () => {
    try {
        await contract.setEmergencyStop(false);
        alert('Emergency stop lifted');
    } catch (error) {
        console.error('Error lifting emergency stop:', error);
        alert('Failed to lift emergency stop');
    }
});


    // Event listener for fetching sales
    document.getElementById('fetchSalesBtn').addEventListener('click', () => {
        fetchSales();
    });
});
