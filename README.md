## Description

Microservice to provide cached network status and discoverability,
 also give access to some low-level network commands like `ping`, `nmap` and `arp` via
 REST API.

A script running on background will request and cache all devices within the network every minute.
## Endpoints

### status

Full fast network status (returns cached results from sqlite3)

```
/status

{
	error: null,
	response: [{
		id: 18,
		mac: "<incompleto>",
		ip: "192.168.2.102",
		status: 1,
		time: 1465590755024
	}, {
		id: 16,
		mac: "b8:27:eb:24:92:ec",
		ip: "192.168.2.151",
		status: 1,
		time: 1465590755020
	}, {
		id: 17,
		mac: "c8:91:f9:45:a1:6e",
		ip: "192.168.2.1",
		status: 1,
		time: 1465590755020
	}]
}
```
### Ping

Do a ping on a specific IP address
```
    /ping?i=192.168.2.100

    {
        response: true
    }
```

### ARP

```
{
	response: [{
		ip: "192.168.2.20",
		host: "?",
		mac: "c0:ee:fb:25:13:39"
	}, {
		ip: "192.168.2.151",
		host: "?",
		mac: "b8:27:eb:24:92:ec"
	}, {
		ip: "192.168.2.150",
		host: "?",
		mac: "b8:27:eb:8c:2a:c5"
	}]
}
```
### NMAP

Might be slow
```
/nmap

{
	response: [{
		ip: "192.168.2.1"
	}, {
		ip: "192.168.2.150"
	}, {
		ip: "192.168.2.151"
	}]
}
```
