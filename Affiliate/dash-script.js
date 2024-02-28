const contractABI = /* ABI JSON */;
const contractAddress = "YOUR_CONTRACT_ADDRESS";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const nftMintContract = new ethers.Contract(contractAddress, contractABI, signer);

async function approveUser() {
    const userAddress = document.getElementById('userAddress').value;
    const transaction = await nftMintContract.approveUser(userAddress);
    await transaction.wait();
    console.log(`User ${userAddress} approved.`);
}

async function revokeUser() {
    const userAddress = document.getElementById('userAddress').value;
    const transaction = await nftMintContract.revokeUser(userAddress);
    await transaction.wait();
    console.log(`User ${userAddress} revoked.`);
}

async function approveAffiliate() {
    const affiliateAddress = document.getElementById('affiliateAddress').value;
    const transaction = await nftMintContract.approveAffiliate(affiliateAddress);
    await transaction.wait();
    console.log(`Affiliate ${affiliateAddress} approved.`);
}

async function revokeAffiliate() {
    const affiliateAddress = document.getElementById('affiliateAddress').value;
    const transaction = await nftMintContract.revokeAffiliate(affiliateAddress);
    await transaction.wait();
    console.log(`Affiliate ${affiliateAddress} revoked.`);
}

async function setCommissionRate() {
    const rate = document.getElementById('commissionRate').value;
    const transaction = await nftMintContract.setCommissionRate(rate);
    await transaction.wait();
    console.log(`Commission rate set to ${rate}%.`);
}
