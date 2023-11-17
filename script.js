document.addEventListener('DOMContentLoaded', () => {
    const ipRangeInput = document.getElementById('ipRange');
    const scanButton = document.getElementById('scanButton');
    const scanResults = document.getElementById('scanResults');

    scanButton.addEventListener('click', async () => {
        const ipRange = ipRangeInput.value;
        const response = await fetch('/scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ipRange }),
        });

        const results = await response.json();
        displayResults(results);
    });

    function displayResults(results) {
        scanResults.innerHTML = '';
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.textContent = `IP: ${result.ip}, Alive: ${result.alive}`;
            scanResults.appendChild(resultDiv);
        });
    }
});
