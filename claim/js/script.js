async function fetchAndDisplayVestingDetails(walletAddress) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(vestingContractAddress, vestingABI, signer); // Fix here
    
    try {
        const details = await contract.vestingDetails(walletAddress);
       
        document.getElementById('totalAllocation').innerText = await convertEthToPlrt(ethers.utils.formatEther(details.totalAllocation));
        document.getElementById('amountWithdrawn').innerText = ethers.utils.formatEther(details.amountWithdrawn);
        
        const vestingStart = new Date(details.vestingStart * 1000).toLocaleString();
        const lastWithdrawal = new Date(details.lastWithdrawal * 1000).toLocaleString();
        document.getElementById('vestingStart').innerText = vestingStart;
        document.getElementById('lastWithdrawal').innerText = lastWithdrawal;

       // Use BigNumber methods for any arithmetic operations involving BigNumbers
        const now = Math.floor(Date.now() / 1000); // Current time in seconds, only declared once
        const timeSinceLastWithdrawal = ethers.BigNumber.from(now).sub(details.lastWithdrawal);
        const VESTING_PERIOD = await contract.VESTING_PERIOD();
        const isEligibleToWithdraw = timeSinceLastWithdrawal.gte(VESTING_PERIOD);

        const VESTING_PERIOD_SECONDS = (await contract.VESTING_PERIOD()).toNumber();
        const WITHDRAWAL_RATE = (await contract.WITHDRAWAL_RATE()).toNumber();

         // Calculate periods elapsed since the last withdrawal or vesting start
        const periodsElapsedSinceLastWithdrawal = Math.floor((now - details.lastWithdrawal.toNumber()) / VESTING_PERIOD_SECONDS);
        const totalWithdrawableNow = details.totalAllocation.mul(WITHDRAWAL_RATE).div(100).mul(periodsElapsedSinceLastWithdrawal);
        let availableToWithdraw = totalWithdrawableNow.sub(details.amountWithdrawn);

         // Ensure availableToWithdraw is not negative and does not exceed totalAllocation
        availableToWithdraw = availableToWithdraw.lt(0) ? ethers.constants.Zero : availableToWithdraw;
        availableToWithdraw = availableToWithdraw.add(details.amountWithdrawn).gt(details.totalAllocation) ? details.totalAllocation.sub(details.amountWithdrawn) : availableToWithdraw;
         

          // Ensure the display includes the calculation, accounting for no available tokens
       document.getElementById('tokensAvailableForWithdrawal').innerText = ethers.utils.formatEther(availableToWithdraw) + ' PLRT';
        
        // Update button text based on withdrawal eligibility
        const withdrawButton = document.getElementById('withdrawTokensButton');
        if (isEligibleToWithdraw) {
            withdrawButton.innerText = 'Withdraw Tokens';
            withdrawButton.disabled = false; // Enable the button if withdrawal is possible
        } else {
            withdrawButton.innerText = 'Unable to Withdraw'; // Change text to indicate withdrawal is not possible
            withdrawButton.disabled = true; // Optionally disable the button to prevent clicks
        }

        document.getElementById('availableToWithdraw').innerText = isEligibleToWithdraw ? 'Yes' : 'No';

        const daysUntilNextWithdrawal = isEligibleToWithdraw ? 0 : (VESTING_PERIOD - timeSinceLastWithdrawal) / (60 * 60 * 24);
        document.getElementById('daysUntilNextWithdrawal').innerText = Math.ceil(daysUntilNextWithdrawal) + ' days';

        showElement('vestingDetailsDisplay');

    } catch (error) {
        console.error('Error fetching vesting details:', error);
        displayMessage('messageBox', 'Failed to fetch vesting details.', false);
    }
}
