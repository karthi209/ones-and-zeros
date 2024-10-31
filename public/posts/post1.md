## Exposing a service running in local host in WSL2 to network


![netstat output](posts/images/netstat-img.jpg)


One thing that Microssoft did in WSL2 is make it a real VM! This means that the distro running inside the WSL2 has a different IP address compared to your Windows machine. The WSL2 also uses a separate virtual network adapter. Your windows can communicate with the WSL2, but none of the other devices inside your network can, unless and until you specifically enable the connection to run through windows to the WSL2

First, we need an external device other than your WSL2 or windows host machine to test the connections. I'll use my phone. I've installed an app called **PingTools** - you can use any networking tool.

I'll first ping my windows machine from my phone. This should be successful, if not, just go to 
**Network & Internet > Advanced netwrok settings > Advanded sharing settings** and make sure **Network dicovery** and **File and printer sharing** is enabled in **Private network** section.

Now, you need to enable port forwarding from WSL2 to the Windows host:

```powershell
netsh interface portproxy add v4tov4 listenport=<port-you-need> listenaddress=<windows-host-ip> connectport=<port-you-need> connectaddress=<WSL2-IP>
```

Check the config if it's applied:

```powershell
netsh interface portproxy show all
```

Delete anything you don't need:

```powershell
netsh interface portproxy delete v4tov4 listenport=<port-you-need> listenaddress=<windows-host-ip>
```


Once this is done, your services in WSL2 should be port forwarded to the port in windows host. make sure you're service is actually listening to all devices in your network. Incase of vite-react, I use below config in **vite.config.js**

```
server: {

    host: '0.0.0.0', // Allow access from external devices

    port: 5173,      // Your desired port

    strictPort: true, // Prevents automatic port switching if the port is already in use

}
```

You should now be able to reach you website hosted in WSL2 local by using:

```
http://<windows-host-ip>:<port>
```

Reference: https://learn.microsoft.com/en-us/windows/wsl/networking

