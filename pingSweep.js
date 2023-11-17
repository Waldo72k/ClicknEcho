const ping = require('ping');

const startIP = '192.168.1.1'; // IP con la que inicia el scan ipddr
const endIP = '192.168.1.255'; // IP con la que termina el scan

//Arreglo donde se guardaran las IPs escaneadas con exito
const ipAddresses = [];

//Impresion de los IP que se encuentran conectados al momento del scan
function scanIP(ip) {
  ping.sys.probe(ip, isAlive => {
    if (isAlive) {
      console.log(`El host ${ip} esta conectada`);
    }
  });
}

//Funcion del scaneo de los ips que se encuentran en la red
function startScan() {
  const ipParts = startIP.split('.');
  let currentIP = startIP;

  while (currentIP !== endIP) {
    ipAddresses.push(currentIP);
    const parts = currentIP.split('.');
    for (let i = 3; i >= 0; i--) {
      parts[i] = (parseInt(parts[i]) + 1) % 256;
      if (parts[i] !== 0) break;
    }
    currentIP = parts.join('.');
  }

  ipAddresses.push(endIP);

  ipAddresses.forEach(ip => scanIP(ip));
}

startScan();