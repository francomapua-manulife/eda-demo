import os from 'os';

export function getIpAddresses(excludeLocal = true) {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (!(iface.family === 'IPv4' && !iface.internal)) {
                continue;
            }
            if(excludeLocal && (iface.address.startsWith('127.') || iface.address.startsWith('192.'))) {
                continue;
            }
            addresses.push(iface.address);
        }
    }

    return addresses;
}