// contractsSetup.js
export async function setupContracts(provider) {
    const signer = provider.getSigner();

    const mintAbi = await (await fetch('./mint_abi.json')).json();
    const affiliateAbi = await (await fetch('./affiliate_abi.json')).json();

    const nftContractAddress = "0x0D3f36AC41e73FDCAb1d119a239305e58bfb2568";
    const affiliateContractAddress = "0x4A6E0AbC1b0A6c3D1893bEe81e4aAe2BB8016CAA";

    const nftContract = new ethers.Contract(nftContractAddress, mintAbi, signer);
    const affiliateContract = new ethers.Contract(affiliateContractAddress, affiliateAbi, signer);

    return { nftContract, affiliateContract };
}

