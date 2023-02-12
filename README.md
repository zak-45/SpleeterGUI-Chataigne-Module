# SpleeterGUI-Chataigne-Module
Spleeter GUI for Chataigne. Deezer separation tool &amp; models

GitHub: https://github.com/benkuper/Chataigne

![image](https://user-images.githubusercontent.com/121941293/218340772-35ed90bb-fc21-40e5-9da1-e142fc963955.png)

### *** Prerequest ***
Need python 3 / spleeter & tensorflow modules / ffmpeg

This is CPU intensive: on Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz   2.30 GHz, need 90 seconds to separate 3'30" audio track.

![image](https://user-images.githubusercontent.com/121941293/218341418-6566eae2-6e99-4a71-ab5e-c13528a73cf9.png)
![image](https://user-images.githubusercontent.com/121941293/218341436-ee280cd5-8d38-4ad7-b7d2-bed3641bc831.png)


### ***Installation :***

Manual
```
Copy this folder to :
<MyDocuments>/Chataigne/modules/Spleeter
```

### ***Use it :***

```
Open  Chataigne.

Go to Modules, right click, Custom, Spleeter.
```

```
On Inspector:
	Default IP: this will be the default WLED IP address used (cause could be more than one)
	LoopIP : check it if you want to update more than one WLED device.
	     IP set in group WLED -- Custom Variables and only for HTTP.
	UDPReTransmit : number of time to retransmit UDP packet.
	     UDP protocol fast but not reliable, choose how many time retransmit packet in case of (max 5).
	AddIP : click on it to create a new entry where you can put additional WLED IP address to manage.
	     This will create a new IP parameter into the WLED Custom variables group.
```

```
On Command Tester, Spleeter: all Spleeter available commands
```


```
If you want the look and feel of the first screenshots, just use the spleeter.noisette file and the spleeter_bg.png provided.

```
