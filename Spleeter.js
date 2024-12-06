/* 

author:	zak45
date:	07/02/2023
version:2.0.0

Chataigne Module for  Deezer /spleeter

This will separate audio file into stems ( 2 / 4 / 5 )
work with mp3 file.
Mainly used to separate vocals from a song.
Need python / tensorflow // ffmpeg ffprobe

Repo: https://github.com/zak-45/SpleeterGUI-Chataigne-Module

Portable Spleeter version available here : https://github.com/zak-45/SpleeterGUI-Chataigne-Module/releases/tag/0.0.0.0

*/

// Main module parameters 

var shouldProcessSpl = false;
var shouldProcessInstall = false;
var installIsRunning = false;
var fileToTest = "";

var spOS = "";
var homeDIR = "";
var winHOME = "";
var moduleDIR = "";

var	sequence = "";
var	targetFile = "";
var	model = "";
var newAudio = "";

// spleeter cmd file name (required)
var spleeterCMDName = "spleeter.cmd";

// check spleeter
var spleeterIsRunning = false;

// CMD options
var splOutputOptions = " separate -c mp3 ";

// verbose
var verbose = " -verbose";

// Output folder location, if blank, set it to audio_output
var splOutputFolder = "audio_output";

// stems 
var splStems = "spleeter:2stems";

// TEMP dir (required)
var tempDIR = "";

// init test
var isInit = true;

//SCAnalyzer
var SCAexist = root.modules.getItemWithName("SCAnalyzer");

// increase timeout
script.setExecutionTimeout(300);

//We create necessary entries in modules & sequences. We need OS / sound card and  Sequence with Trigger / Audio.
function init()
{

	script.log("-- Custom command called init()");	

	// we check required TMP folder
	spTmpPath();
	script.log("Temp folder : "+tempDIR);
	if (tempDIR == "")
	{
		util.showMessageBox("Spleeter  !", "TMP, TMPDIR or TEMP env variable not found", "warning", "OK");
	}
	
	var infos = util.getOSInfos(); 
	script.log("Hello "+infos.username);	
	script.log("We run under : "+infos.name);
	spOS = infos.name;
	
	if ( infos.name.contains("Win") )
	{
		homeDIR = util.getEnvironmentVariable("USERPROFILE") + "/Documents/Chataigne";
		winHOME = util.getEnvironmentVariable("USERPROFILE");
		moduleDIR = homeDIR + "/modules/SpleeterGUI-Chataigne-Module-main";
        fileToTest = homeDIR + "/xtra/PySp3.10/Scripts/spleeter.exe";

	} else {
		
		homeDIR = util.getEnvironmentVariable("$HOME") + "/Chataigne";
		moduleDIR = homeDIR + "/modules/SpleeterGUI-Chataigne-Module-main";
		fileToTest = homeDIR + "/modules/xtra/PySp3.10/bin/spleeter";
	}
}

function update()
{
	// init once
	if (isInit)
	{
		isInit = false;
					
		// modules  test
		var OSexist = root.modules.getItemWithName("OS");
		var SCexist = root.modules.getItemWithName("Sound Card");
		var SPLexist = root.modules.getItemWithName("Spleeter");	

		if (SCexist.name == "soundCard" || SPLexist.name == "spleeter")
		{	
			script.log("Module Sound Card exist");
			
		} else {
				
			var newSCModule = root.modules.addItem("Sound Card"); 		
		}
		
		if (OSexist.name == "os")
		{
			script.log("Module OS exist");
			
		} else {
				
			var newOSModule = root.modules.addItem("OS");
				
		}
		
		// test sequence
		var SQexist = root.sequences.getItemWithName("Sequence");
		
		if (SQexist.name == "sequence")
		{
			script.log("Sequences Sequence exist");
			
		} else {

			var newSequence = root.sequences.addItem();
			var newTSequence = newSequence.layers.addItem("Trigger");
			var newASequence = newSequence.layers.addItem("Audio");			
		}
			
		// local.parameters.spleeterParams.spleeterCommand.set(homeDIR+"/Chataigne/modules/Spleeter/spleeter.cmd");
		
		if (SCAexist.name == "sCAnalyzer")
		{	
			script.log("SCAnalyzer present");
			// avoid Chataigne Crash
			//root.modules.sCAnalyzer.scripts.sCAnalyzer.reload.trigger();
			var Spleetercontainer = SCAexist.parameters.getChild("Spleeter Params");
			Spleetercontainer.setCollapsed(false);
		
		} else {
				
			script.log('No SCAnalyzer found');			
		}
		
	} else {

		// start long pocess on it's own thread to run in blocking mode but not block the main UI
		if (shouldProcessSpl)
		{
			shouldProcessSpl = false;
			runSpleeter (sequence, targetFile, model);
		}
		if (shouldProcessInstall && !installIsRunning)
		{
			shouldProcessInstall = false;
			runInstall();
		}
		if (installIsRunning)
		{
			if (util.fileExists(fileToTest)) {
			    installIsRunning = false;
			    util.showMessageBox("Spleeter", "install finished", "information", "ok");

			}
		}
	}
}

function scriptParameterChanged (param)
{
	script.log("Script Param changed : "+param.name);	
}

function moduleParameterChanged (param)
{
	script.log("Module Param changed : "+param.name);	
	if (param.name == "spleeterInfo") {
			
			util.gotoURL('https://research.deezer.com/projects/spleeter.html');
	}
	if (param.name == "install") {

	    if (installIsRunning == true) {

	    	util.showMessageBox("Spleeter", "Installation is already running ....", "warning", "ok");

	    } else {

            util.showYesNoCancelBox("install", "Spleeter", "proceed with installation", ["question"] );
        }
	}

}

function messageBoxCallback(id, value) {

    script.log('message box callback' + id + value );
    if (id == "install" && value == 1) {
        if (util.fileExists(fileToTest)) {

            util.showMessageBox("Spleeter", "Already installed", "info", "ok");

        } else {
            shouldProcessInstall = true;
        }
    }
}

function moduleValueChanged (value) 
{	
	script.log("Module value changed : "+value);
}


// check to see if something to do
function Spleeter (insequence, intargetFile, inmodel)
{
	if (insequence == "" && intargetFile == "" )
	{
		script.log('Nothing to do');
		
	} else {
		
		sequence = insequence;
		targetFile = intargetFile;
		model = inmodel;
		
		util.showMessageBox("Spleeter", "This could take a while ...", "warning", "ok");		
		shouldProcessSpl = true;
	}
}

// Run Spleeter: wait and read output folder files to create audio entry into sequence
function runSpleeter (sequence, targetFile, model)
{
	// Spleeter command	
	spleeterCMDName = local.parameters.spleeterParams.spleeterCommand.getAbsolutePath();
	// check to see if Spleeter exe exist
	if (util.fileExists(spleeterCMDName) == 1)
	{
		spleeterIsRunning = true;
		
		// options to add
		splOutputOptions = local.parameters.spleeterParams.spleeterOptions.get();

		// result output folder
		splOutputFolder = local.parameters.spleeterParams.outputFolder.get();
		// if output folder not set, we set it as default
		if (splOutputFolder == "")
		{						
			splOutputFolder =  tempDIR + "/" + "audio_output";
		}			
		
		splStems = model;
		
		// we have some work to do, target first else file 
		if (sequence.contains("/"))
		{
			script.log('Retreive data from sequence : ' + sequence);
			var splitseq = sequence.split("/");
			var sequenceName = splitseq[2];
			var audioName = splitseq[4];
			// set newSequence to existing one
			var newSequence =  root.sequences.getItemWithName(sequenceName);
			// set newAudio to existing one 
			newAudio =  newSequence.layers.getItemWithName(audioName);
			// targetFile
			var targetFile = newAudio.clips.audioClip.filePath.getAbsolutePath();
			script.log('Target file  from sequence : ' + targetFile);								
					
		} else if (targetFile != ""){

			script.log('Create new sequence from filename :' + targetFile);
			// create new sequence / audio clip 
			var newSequence =  root.sequences.addItem('Sequence');	
			newAudio =  newSequence.layers.addItem('Audio');
			var newAudioClip =  newAudio.clips.addItem('audioClip');	
			newAudioClip.filePath.set(targetFile);
			
		} else {
			
			script.log('Not able to define start point');
			script.logError("Something wrong with Spleeter....");
			spleeterIsRunning = false;
			return;
		}
		
		// get audio name
		var songname = getFilename(targetFile).replace(".mp3","");
		
		// check to see if separation files already exist 
		var vocals = util.fileExists(splOutputFolder + "/" + songname + "/vocals.mp3");
		if (model.contains("spleeter:2stems"))
		{
			script.log("Check files for 2 stems");
			
			var accompaniment = util.fileExists(splOutputFolder + "/" + songname +  "/accompaniment.mp3");
			
		} else if ( model.contains("spleeter:4stems") || model.contains("spleeter:5stems")){
			
			script.log("Check files for 4/5 stems");

			var drums = util.fileExists(splOutputFolder + "/" + songname +  "/drums.mp3");
			var bass = util.fileExists(splOutputFolder + "/" + songname +  "/bass.mp3");
			var other = util.fileExists(splOutputFolder + "/" + songname +  "/other.mp3");
			
		}
		if ( model.contains("spleeter:5stems") )
		{
			
			script.log("Check files for 5 stems");

			var piano = util.fileExists(splOutputFolder + "/" + songname + "/piano.mp3");
		}
		
		// run spleeter only on Force or missing file, this will execute ffprobe also
		if ((local.parameters.spleeterParams.force.get() == 1) || 
			(model.contains("spleeter:2stems") && (vocals == 0 || accompaniment == 0)) ||
			(model.contains("spleeter:4stems") && (vocals == 0 || drums == 0 || bass == 0 || other == 0)) ||
			(model.contains("spleeter:5stems") && (vocals == 0 || drums == 0 || bass == 0 || other == 0 || piano == 0))
			)
		{							
			// run Spleeter 
			if (local.parameters.spleeterParams.verbose.get() == 1)
			{
				verbose = "--verbose";
			} else {
				verbose = "";
			}
			var exeOPT = " " + splOutputOptions + " -o " + '"' + splOutputFolder + '" -p ' +  splStems+' "' + targetFile + '" ' + verbose;
			script.log('command to run : '+ spleeterCMDName + exeOPT);
			// we execute the Spleeter command in blocking mode to wait end of execution;
			var launchresult = root.modules.os.launchProcess(spleeterCMDName + exeOPT, true);
			script.log(launchresult);
			
		} else {
			
			splOutputOptions = "ffprobeOnly for info";

			var exeOPT = " " + splOutputOptions + " -o " + '"' + splOutputFolder + '" -p ' +  splStems+' "' + targetFile + '" ' + verbose;
			script.log('command to run : '+ spleeterCMDName + exeOPT);
			// we execute the Spleeter command file for ffprobe only 
			var launchresult = root.modules.os.launchProcess(spleeterCMDName + exeOPT, true);
			script.log(launchresult);			
		}

		// set sequence to artist name /audio to title: info come from ffprobe 
		newSequence.setName(readMp3Tags("artist"));
		newAudio.setName(readMp3Tags("title"));
		
		// read the result 
		script.log("we read from : " + splOutputFolder);
		var newtargetFile = splOutputFolder + "/" + songname + "/vocals.mp3";
		
		// vocals is common file to all stems
		var newvocals = util.fileExists(newtargetFile);				
		if (newvocals)
		{
			script.log('vocal file exist:' + newtargetFile);
			
			newAudio =  newSequence.layers.addItem('Audio');
			var newAudioClip =  newAudio.clips.addItem('audioClip');	
			newAudioClip.filePath.set(newtargetFile);		
			newAudio.setName("vocals");
			
		} else {
			
			script.log('vocal file do not exist :' + newtargetFile);
			script.logError("Something wrong with Spleeter....");
		}

		if (model.contains("spleeter:2stems"))
		{
			script.log("Check files for 2 stems");
			
			// instrumental file 
			var newtargetFile = splOutputFolder + "/" + songname + "/accompaniment.mp3";					
			var newaccompaniment = util.fileExists(newtargetFile);
			if (newaccompaniment)
			{
				script.log('accompaniment file exist:' + newtargetFile);
				
				newAudio =  newSequence.layers.addItem('Audio');
				var newAudioClip =  newAudio.clips.addItem('audioClip');	
				newAudioClip.filePath.set(newtargetFile);		
				newAudio.setName("accompaniment");
			
			} else {
				
				script.log('accompaniment file do not exist :' + newtargetFile);
			}
			
		} else if (model.contains("spleeter:4stems") || model.contains("spleeter:5stems")) {

			script.log("Check files for 4/5 stems");
			
			// bass common for 4 or 5
			var newtargetFile = splOutputFolder + "/" + songname + "/bass.mp3";
			var newbass = util.fileExists(newtargetFile);
			if (newbass)
			{
				script.log('bass file exist:' + newtargetFile);
				
				newAudio =  newSequence.layers.addItem('Audio');
				var newAudioClip =  newAudio.clips.addItem('audioClip');	
				newAudioClip.filePath.set(newtargetFile);		
				newAudio.setName("bass");
			
			} else {
				
				script.log('bass file do not exist :' +newtargetFile);
			}
			
			// drums common for 4 or 5
			var newtargetFile = splOutputFolder + "/" + songname + "/drums.mp3";
			var newdrums = util.fileExists(newtargetFile);
			if (newdrums)
			{
				script.log('drums file exist:' +newtargetFile);
				
				newAudio =  newSequence.layers.addItem('Audio');
				var newAudioClip =  newAudio.clips.addItem('audioClip');	
				newAudioClip.filePath.set(newtargetFile);		
				newAudio.setName("drums");
			
			} else {
				
				script.log('drums file do not exist :' + newtargetFile);
			}

			// other common for 4 or 5
			var newtargetFile = splOutputFolder + "/" + songname + "/other.mp3";
			var newother = util.fileExists(newtargetFile);				
			if (newother)
			{
				script.log('other file exist:' + newtargetFile);
				
				newAudio =  newSequence.layers.addItem('Audio');
				var newAudioClip =  newAudio.clips.addItem('audioClip');	
				newAudioClip.filePath.set(newtargetFile);		
				newAudio.setName("other");
			
			} else {
				
				script.log('other file do not exist :' + newtargetFile);
			}
		}
		
		if ( model.contains("spleeter:5stems"))
		{
			script.log("Check files for 5 stems");
			
			// piano for 5 stems
			var newtargetFile = splOutputFolder + "/" + songname + "/piano.mp3";
			var newpiano = util.fileExists(newtargetFile);				
			if (newpiano)
			{
				script.log('piano file exist:' + newtargetFile);
				
				newAudio =  newSequence.layers.addItem('Audio');
				var newAudioClip =  newAudio.clips.addItem('audioClip');	
				newAudioClip.filePath.set(newtargetFile);		
				newAudio.setName("piano");
			
			} else {
				
				script.log('piano file do not exist :' + newtargetFile);
			}
		}			

		util.showMessageBox("Spleeter !", "Process finished for : " + newSequence.name, "info", "OK");

	} else {
		
		spleeterIsRunning = false;
		
		script.log("Spleeter  cmd  not found");				
		util.showMessageBox("Spleeter  !", "spleeter not found", "warning", "OK");	
		script.logError("Something wrong with Spleeter....");
	}
	
	spleeterIsRunning = false;
}

// retreive temp location
function spTmpPath ()
{
	script.log("Retreive temp folder");
	// TMP, TMPDIR, and TEMP environment variables 
	var pathTMP = util.getEnvironmentVariable("TMP");
	var pathTMPDIR = util.getEnvironmentVariable("TMPDIR");	
	var pathTEMP = util.getEnvironmentVariable("TEMP");
	
	if (pathTMP != "")
	{
		tempDIR = pathTMP;
		return tempDIR;
		
	} else if (pathTMPDIR != ""){
		tempDIR = pathTMPDIR;
		return tempDIR;

	} else if (pathTEMP != ""){
		tempDIR = pathTEMP;
		return tempDIR;	
	}
	
	script.log('ERROR temp directory not found');
	script.logError("Something wrong with Spleeter....");
	
return tempDIR;
}

// retreive file name from absolute path
function getFilename(songname)
{
	var splitcount = songname.split("/");
	var filename = splitcount[splitcount.length-1];

return filename		
}

// retreive tags from json file (generated by ffprobe)
function readMp3Tags(type)
{
	var tag = "";
	
	if (util.fileExists(tempDIR + "/ffprobefileinfo.json"))
	{
		var SCAJSONContent = util.readFile(tempDIR + "/ffprobefileinfo.json",true);
		if ( type == "artist" )
		{
			tag = SCAJSONContent.format.tags.artist;
		} else if ( type == "album" ){
			tag = SCAJSONContent.format.tags.album;
		} else if ( type == "title" ){
			tag = SCAJSONContent.format.tags.title;
		} else if ( type == "date"  ){
			tag = SCAJSONContent.format.tags.date;
		} else {
			tag = "undefined";
		}
		
	} else {
	
		tag = "nofile";
		script.log('File does not exist : ' + tempDIR + "/ffprobefileinfo.json");
	
	}
	
return tag;	
}

function runInstall() {

    installIsRunning = true;
	util.showMessageBox("Spleeter !", "Installation is running... this will take a while, coffee time ! ", "info", "OK");
	script.log('installation for os : '+spOS);

	if ( spOS.contains("Win") )
	{
    	var launchresult = root.modules.os.launchApp(moduleDIR + "/xtra/install.cmd", "");
		script.log(launchresult);



	} else {

	    script.log('installation for os : '+spOS);

	}
}

// used for value/expression testing .......
function testScript(songname)
{
	script.log("test");
}
