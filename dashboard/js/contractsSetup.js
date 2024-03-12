// contractsSetup.js
export async function setupContracts(provider) {
    const signer = provider.getSigner();
    const contracts = {};

    // Contract configuration
    const contractConfig = [
        { name: "PLRToken", address: "0xe7ABbf79eD30AaDf572478f3293e31486F7d10cB", abiPath: "./ABI/PLRToken_ABI.json" },
        { name: "PromotionTracker", address: "0x8f37006580c0D4f6584c18A4cfed6C4647415272", abiPath: "./ABI/Promotion_ABI.json" },
        { name: "AffiliateTracker", address: "0xE5729c133b3192E1540c466EDB443D6dB10E2800", abiPath: "./ABI/affiliate_abi.json" },
        { name: "NFTMint", address: "0xe9Ac226DBC108dAEeba3dbe55B8b1cE3ae52381E", abiPath: "./ABI/mint_abi.json" },
        { name: "ContentAccessControl", address: "0xfe9B191772256FAd10A1378740D622Df981405b4", abiPath: "./ABI/Access_ABI.json" },
        { name: "NFTStaking", address: "0xab378329d0c310b1Bcb71F34FFDf9b3B61882165", abiPath: "./ABI/Staking_ABI.json" },
        { name: "NFTMarketplace", address: "0xC6f089b1A49Ec443e3891695CcEAD602683BdCba", abiPath: "./ABI/Marketplace_ABI.json" },
    ];

    // Fetch and setup contracts
    for (const contract of contractConfig) {
        const abi = await (await fetch(contract.abiPath)).json();
        contracts[contract.name] = new ethers.Contract(contract.address, abi, signer);
    }

    return contracts;
}
