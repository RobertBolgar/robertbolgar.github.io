Based on your JavaScript code and the functionality you've described wanting to implement, it seems the calculation or assignment for `availableToWithdraw` isn't effectively capturing the amount based on the contract's rules for withdrawal eligibility and amounts.

The primary issue likely lies in the calculation or lack thereof for `availableToWithdraw`. From what's provided, `availableToWithdraw` is set but not calculated according to the vesting details before displaying it. To resolve this and properly calculate "Tokens available for withdrawal," you'll need to implement logic that matches how your smart contract determines the amount available for withdrawal.

Given the structure of your contract, here's an approach to calculating `availableToWithdraw` correctly:

1. **Calculate the Time Since the Last Withdrawal**: This is crucial for understanding how many vesting periods have passed since either the vesting start or the last withdrawal, which determines how much of the total allocation is available for withdrawal.

2. **Determine the Withdrawal Amount Based on Vesting Details**: Use the `WITHDRAWAL_RATE` and the number of periods elapsed to calculate the total amount that should be available for withdrawal.

Here's a more detailed approach, incorporating a mock calculation for `availableToWithdraw`:

```javascript
async function fetchAndDisplayVestingDetails(walletAddress) {
    // Other setup code remains unchanged...

    try {
        const details = await contract.vestingDetails(walletAddress);
        // Existing code for setting up details...

        const now = Math.floor(Date.now() / 1000);
        const VESTING_PERIOD_SECONDS = (await contract.VESTING_PERIOD()).toNumber();
        const WITHDRAWAL_RATE = (await contract.WITHDRAWAL_RATE()).toNumber();

        // Calculate periods elapsed since the last withdrawal or vesting start
        const periodsElapsedSinceLastWithdrawal = Math.floor((now - details.lastWithdrawal.toNumber()) / VESTING_PERIOD_SECONDS);
        const totalWithdrawableNow = details.totalAllocation.mul(WITHDRAWAL_RATE).div(100).mul(periodsElapsedSinceLastWithdrawal);
        let availableToWithdraw = totalWithdrawableNow.sub(details.amountWithdrawn);

        // Ensure availableToWithdraw is not negative and does not exceed totalAllocation
        availableToWithdraw = availableToWithdraw.lt(0) ? ethers.constants.Zero : availableToWithdraw;
        availableToWithdraw = availableToWithdraw.add(details.amountWithdrawn).gt(details.totalAllocation) ? details.totalAllocation.sub(details.amountWithdrawn) : availableToWithdraw;

        // Update UI for available to withdraw
        document.getElementById('tokensAvailableForWithdrawal').innerText = ethers.utils.formatEther(availableToWithdraw) + ' PLRT';

        // Rest of your existing code...

    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
}
```

### Important Notes:

- This logic uses mock calculations based on your smart contract's design. You'll need to adjust it to fit the actual logic of how your contract calculates available withdrawals.
- Ensure that all BigNumber operations use ethers.js methods (`mul`, `div`, `sub`, `lt`, `gt`, etc.) to prevent errors.
- This example assumes `details.totalAllocation`, `details.amountWithdrawn`, and other contract values are BigNumbers. Adjust as necessary based on actual contract return types.
- The calculation assumes `WITHDRAWAL_RATE` is a percentage. Adjust this logic if your contract uses a different scale or method for determining withdrawal amounts.

Ensure this logic accurately reflects your smart contract's rules for vesting and withdrawals. Adjustments may be necessary to match your contract's specific implementation details.
