# SpleeterGUI-Chataigne-Module
Spleeter GUI for Chataigne. Deezer separation tool &amp; models

GitHub: https://github.com/benkuper/Chataigne

![image](https://user-images.githubusercontent.com/121941293/218340772-35ed90bb-fc21-40e5-9da1-e142fc963955.png)

### *** Prerequest ***
Need python 3 / spleeter & tensorflow modules / ffmpeg

> Spleeter : https://github.com/deezer/spleeter/wiki/1.-Installation
> 
> Portable Python for Win : https://sourceforge.net/projects/portable-python/files/Portable%20Python%203.10/
> 
> ffmpeg for Win : https://github.com/BtbN/FFmpeg-Builds/releases

For Win users, portable version has been setup with all prerequest.
> No need to install, only extract on some folder:
> https://github.com/zak-45/SpleeterGUI-Chataigne-Module/releases/download/v1.0.0.0/Spleeter_Portable_Python-3.10.5_.x64.exe

For others OS, you need to follow the prerequest.


![image](https://user-images.githubusercontent.com/121941293/218341418-6566eae2-6e99-4a71-ab5e-c13528a73cf9.png)
![image](https://user-images.githubusercontent.com/121941293/218341436-ee280cd5-8d38-4ad7-b7d2-bed3641bc831.png)


### ***Installation :***

Manual
```
Copy this repository to :
<MyDocuments>/Chataigne/modules/Spleeter
```

### ***Use it :***

```
Open  Chataigne.

Go to Modules, right click, Custom, Spleeter.
```
![image](https://user-images.githubusercontent.com/121941293/218341586-ccd6ed27-5d1f-4422-b763-8666b112bae4.png)


```
On Inspector:
	Spleeter command: command to execute
		This is the full path for the command to launch. Need to be adapted to your needs/ installation.
	Spleeter options : options to pass to the command
		Options that will be passed to the executed command.
	OutputFolder :Folder where to store separate audio tracks
		This one will store the separate audio file output
		If left blank, will be set to audio_output under temp location.
	Asynch : select to run the command in asynchronus mode.
		By default, command will be executed as 'blocking', this mean Chataigne will wait end of execution before continue.
	Force : force command execution
		To optimize the process, SpleeterGUI will check if an already separation file exist and re-use it
		This parameter will force spleeter to execute and overwrite existing files.
	Verbose : provide more informations during command running.
```

![image](https://user-images.githubusercontent.com/121941293/218341664-a9d52373-fab0-4e79-a63c-5c2423da645e.png)


```
On Command Tester, Spleeter: all SpleeterGUI available commands
```
![image](https://user-images.githubusercontent.com/121941293/218341957-5ce0c2dc-a228-48d2-b15c-571a334032a2.png)


### -- INFO --
This is CPU intensive: on Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz   2.30 GHz, need 70 seconds to separate 3'30" audio track.Second run should be faster anymore.


```
If you want the look and feel of the first screenshots, just use the spleeter.noisette file and the spleeter_bg.png provided.

```
