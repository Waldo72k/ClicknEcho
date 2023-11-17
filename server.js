const express = require('express');
const ping = require('ping');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function broadcastPing(callback) {
  const startIP = '140.10.1.1';
  const endIP = '140.10.3.255';

  const results = [];
  const ipAddresses = [];

  const startParts = startIP.split('.').map(Number);
  const endParts = endIP.split('.').map(Number);

  let currentIPParts = [...startParts];

  while (true) {
    const ip = currentIPParts.join('.');
    ipAddresses.push(ip);

    if (currentIPParts.join('.') === endIP) {
      break;
    }

    // Increment the IP address parts
    currentIPParts[3]++;

    // Check for overflow and adjust the parts accordingly
    for (let i = 3; i >= 0; i--) {
      if (currentIPParts[i] > 255) {
        currentIPParts[i] = 0;
        currentIPParts[i - 1]++;
      }
    }
  }

  const totalDevices = ipAddresses.length;
  let completedDevices = 0;

  ipAddresses.forEach((device) => {
    ping.sys.probe(device, (isAlive) => {
      const status = isAlive ? 'alive' : 'dead';
      results.push({ device, status });

      completedDevices++;
      if (completedDevices === totalDevices) {
        callback(results);
      }
    });
  });
}

app.post('/ping', (req, res) => {
  broadcastPing((results) => {
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
