// Assuming the ethers.js library is included in your HTML file

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
});
