Given your smart contract for team vesting, we can now accurately adjust the JavaScript function to fetch and display the correct "Tokens available for withdrawal" based on the contract's logic. The contract specifies that withdrawals can occur every 10 days with 10% of the total allocation available each period after the vesting start.

To calculate and display the tokens available for withdrawal in your web interface, you can follow these steps:

1. **Calculate the Time Since the Last Withdrawal**: Determine how much time has passed since the last withdrawal or the vesting start date, whichever is applicable.

2. **Determine the Available Amount for Withdrawal**: Use the `WITHDRAWAL_RATE` and `VESTING_PERIOD` from your contract to calculate how much of the total allocation is available for withdrawal at the current time, considering the amount already withdrawn.

3. **Update the Display**: Show the calculated available amount in the web interface.

Here's how you could implement this in your JavaScript, based on the provided smart contract:

```javascript
async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    
    try {
        const details = await contract.vestingDetails(walletAddress);
        // Format and display other details as before...

        // Calculate the available tokens for withdrawal based on the contract logic
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const timeElapsed = now - details.lastWithdrawal.toNumber();
        const periodsElapsed = Math.floor(timeElapsed / VESTING_PERIOD);
        let availableToWithdraw = details.totalAllocation.mul(WITHDRAWAL_RATE).mul(periodsElapsed).div(100);

        if (availableToWithdraw.add(details.amountWithdrawn) > details.totalAllocation) {
            availableToWithdraw = details.totalAllocation.sub(details.amountWithdrawn);
        }

        // Ensure the display includes the calculation, accounting for no available tokens
        document.getElementById('tokensAvailableForWithdrawal').innerText = ethers.utils.formatEther(availableToWithdraw) + ' PLRT';

    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
}
```

Please note, the calculation for `availableToWithdraw` in the JavaScript snippet above is conceptual and needs to be adjusted to work in your script. JavaScript does not support the `mul`, `div`, and `sub` methods directly on numbers or strings as in Solidity. You'll need to use a library that can handle big numbers (like BigNumber.js, which is included in the ethers.js library) for these operations, especially because Ethereum numbers can exceed JavaScript's safe integer limits.

You might already be using ethers.js for interacting with Ethereum, so you can leverage `ethers.BigNumber` for calculations involving token amounts, similar to how calculations are done in Solidity. Adjust the calculation to fit JavaScript syntax and use ethers.js utilities for handling big numbers.
