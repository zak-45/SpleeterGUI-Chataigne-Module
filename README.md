# SpleeterGUI-Chataigne-Module
Spleeter GUI for Chataigne. Deezer separation tool &amp; models

Official Website : http://benjamin.kuperberg.fr/chataigne/en
 GitHub: https://github.com/benkuper/Chataigne

GUI Front end for Spleeter - AI source separation
![image](https://user-images.githubusercontent.com/121941293/218340772-35ed90bb-fc21-40e5-9da1-e142fc963955.png)

This project will make it easy for users to run Spleeter without needing to use the command line tools to do so.
Built-in Chataigne audio feature will provide you all necessary to see/test the result with few clicks. 
You should be able to hear the song without bass, drums , vocals etc ...or only one of them.
This should work on all OS where Chataigne/Spleeter are supported. 

Windows users can have it running in few minutes.

### *** Videos DEMO ***

https://user-images.githubusercontent.com/121941293/219706114-4a899a6c-35b6-47ac-8f9e-27b58ce189e4.mp4
> 2 stems




https://user-images.githubusercontent.com/121941293/219708676-e8038fb5-9c48-4f2e-ab5a-a6f25eb83d60.mp4
> 5 stems

### *** Prerequest ***
Need python 3 / spleeter & tensorflow modules / ffmpeg

> Spleeter : https://github.com/deezer/spleeter/wiki/1.-Installation
> 
> Portable Python for Win : https://sourceforge.net/projects/portable-python/files/Portable%20Python%203.10/
> 
> ffmpeg download : https://ffmpeg.org/download.html
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
nota: name need to be 'Spleeter'
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
	Force : force command execution
		To optimize the process, SpleeterGUI will check if an already separation file exist and re-use it
		This parameter will force spleeter to execute and overwrite existing files.
	Verbose : provide more informations during command running.
```

![image](https://user-images.githubusercontent.com/121941293/218341664-a9d52373-fab0-4e79-a63c-5c2423da645e.png)


```
On Command Tester, Spleeter: all SpleeterGUI available commands.
	separate : execute the command / options set in Parameters for audio track separate
		* sequence : audioclip file path from an existing sequence (with audio file enveloppe)  . Take in priority if set.
		* file : mp3 audio file name.
		* Model to use : select 2 / 4 or 5 stems
```
![image](https://user-images.githubusercontent.com/121941293/218341957-5ce0c2dc-a228-48d2-b15c-571a334032a2.png)

```
 Example after a 5 stems execution:
```
![image](https://user-images.githubusercontent.com/121941293/218443314-f2a20a5a-7beb-400d-81ec-988c7686a60a.png)

### -- INFO --
This is CPU intensive: on Intel(R) Core(TM) i5-8300H CPU @ 2.30GHz   2.30 GHz, need 70 seconds to separate 3'30" audio track.Second run should be faster anymore.

Not all spleeter features has been implemented. Focus has been set to the separate. SpleeterGUI need a mp3 file as input and produce a wav file as result. 

All others commands can be executed by using spleeter command line if necessary.

Spleeter WIKI : https://github.com/deezer/spleeter/wiki/2.-Getting-started

```
If you want the look and feel of the first screenshots, just use the spleeter.noisette file and the spleeter_bg.png provided.

```
