/* 

author:	zak45
date:	07/02/2023
version:1.0.0

Chataigne Module for  Deezer /spleeter

This will separate audio file into stems ( 2 / 4 / 5 )
work with mp3 file.
Mainly used to separate vocals from a song.
Need python / tensorflow // ffmpeg


*/

// Main module parameters 

// spleeter exe file name (required)
var SpleeterExeName = "spleeter.exe";

// CMD options
var SPLoutputOptions = "-m spleeter separate ";

// verbose
var verbose = " -verbose";

// Output folder location, if blank, set it to audio_output
var SPLoutputFolder = "audio_output";

// stems 
var SPLstems = "spleeter:2stems";

// TEMP dir (required)
var tempDIR = "";

// info
var moreinfo = "";

// asynchronus mode
var asynch = false;

// increase timeout as we want to run Spleeter in synchronus way (blocking)
script.setExecutionTimeout(180);

//We create necessary entries in modules & sequences. We need OS / sound card and  Sequence with Trigger / Audio.
function init()
{

	script.log("-- Custom command called init()");	

	var infos = util.getOSInfos(); 
	
	script.log("Hello "+infos.username);	
	script.log("We run under : "+infos.name);

	// we check required TMP folder
	SpleeterTMP();
	script.log("Temp folder : "+tempDIR);
	if (tempDIR == "")
	{
		util.showMessageBox("Spleeter  !", "TMP, TMPDIR or TEMP env variable not found", "warning", "OK");
	}
	
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
	
}

// execution depend on the user response
function messageBoxCallback (id, result)
{
	script.log("Message box callback : "+id+" : "+result); 	
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
}

function moduleValueChanged (value) 
{	
	script.log("Module value changed : "+value);	
}


// Run Spleeter: wait and read output folder files to create audio entry into sequence
function RunSpleeter (sequence, targetFile, model)
{
	// check to see if something to do
	if (sequence == "" && targetFile == "" )
	{
		script.log('Nothing to do');
		
	} else {
	
			// Spleeter command	
			SpleeterExeName = local.parameters.spleeterParams.spleeterCommand.getAbsolutePath();
			// check to see if Spleeter exe exist
			if (util.fileExists(SpleeterExeName) == 1)
				{
				// options to add
				SPLoutputOptions = local.parameters.spleeterParams.spleeterOptions.get();

				// result output folder
				SPLoutputFolder = local.parameters.spleeterParams.outputFolder.get();
				// if output folder not set, we set it as default
				if (SPLoutputFolder == "")
				{						
					SPLoutputFolder =  tempDIR + "/" + "audio_output";
				}			
				
				SPLstems = model;
				
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

					script.log('Create new sequence from filename :'+targetFile);
					// create new sequence / audio clip 
					var newSequence =  root.sequences.addItem('Sequence');	
					newAudio =  newSequence.layers.addItem('Audio');
					var newAudioClip =  newAudio.clips.addItem('audioClip');	
					newAudioClip.filePath.set(targetFile);
					
				} else {
					
					script.logError("Something wrong with Spleeter....");
					return;
				}
				
				// set audio name
				var songname = getFilename(targetFile).replace(".mp3","");
				newAudio.setName(songname);
				
				// check to see if separation files already exist 
				var vocals = util.fileExists(SPLoutputFolder + "/" + songname + "/vocals.wav");
				if (model.contains("spleeter:2stems"))
				{
					script.log("Check files for 2 stems");
					
					var accompaniment = util.fileExists(SPLoutputFolder + "/" + songname +  "/accompaniment.wav");
					
				} else if ( model.contains("spleeter:4stems") || model.contains("spleeter:5stems")){
					
					script.log("Check files for 4/5 stems");

					var drums = util.fileExists(SPLoutputFolder + "/" + songname +  "/drums.wav");
					var bass = util.fileExists(SPLoutputFolder + "/" + songname +  "/bass.wav");
					var other = util.fileExists(SPLoutputFolder + "/" + songname +  "/other.wav");
					
				}
				if ( model.contains("spleeter:5stems") )
				{
					
					script.log("Check files for 5 stems");

					var piano = util.fileExists(SPLoutputFolder + "/" + songname + "/piano.wav");
				}
				
				// run spleeter only on Force or missing file
				if ((local.parameters.spleeterParams.force.get() == 1) || 
					(model.contains("spleeter:2stems") && (vocals == 0 ||accompaniment == 0)) ||
					((model.contains("spleeter:4stems") || model.contains("spleeter:5stems")) && (drums == 0 || bass == 0 || other == 0)) ||
					(model.contains("spleeter:5stems") && piano == 0))
				{							
					// run Spleeter 
					if (local.parameters.spleeterParams.verbose.get() == 1)
					{
						verbose = "--verbose";
					} else {
						verbose = "";
					}
					var exeOPT = " " + SPLoutputOptions + " -o " + '"' + SPLoutputFolder + '" -p ' +  SPLstems+' "' + targetFile + '" ' + verbose;
					script.log('command to run : '+ SpleeterExeName + exeOPT);
					// we execute the Spleeter command. Need to use os.launchApp to avoid security problem on Windows.
					var launchresult = root.modules.os.launchApp(SpleeterExeName, exeOPT);

					// Loop to wait process finished before continue. only if asynch false
					asynch = local.parameters.spleeterParams.asynch.get();
					if (asynch == 0)
					{
						moreinfo = "synchro mode";
						util.showMessageBox("Spleeter  ! ", "This could take a while ...."+moreinfo, "info", "Got it");
						var wait = true;
						for ( ;wait === true; )
						{
							var isRunning = root.modules.os.isProcessRunning(getFilename(SpleeterExeName));
							if (isRunning)
							{
								wait = true;
								util.delayThreadMS(2000);
							} else {
								wait = false;
							}
						}
						
					} else {
						
						moreinfo = "Asynchronus mode. you need to re-execute to reload data if you want to see them.";
						util.showMessageBox("Spleeter  ! ", "This could take a while ...."+moreinfo, "info", "Got it");
					}
				}

				// read the result 
				script.log("we read from : " + SPLoutputFolder);
				var newtargetFile = SPLoutputFolder + "/" + songname + "/vocals.wav";
				
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
				}

				if (model.contains("spleeter:2stems"))
				{
					script.log("Check files for 2 stems");
					
					// instrumental file 
					var newtargetFile = SPLoutputFolder + "/" + songname + "/accompaniment.wav";					
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
					var newtargetFile = SPLoutputFolder + "/" + songname + "/bass.wav";
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
					var newtargetFile = SPLoutputFolder + "/" + songname + "/drums.wav";
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
					var newtargetFile = SPLoutputFolder + "/" + songname + "/other.wav";
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
					var newtargetFile = SPLoutputFolder + "/" + songname + "/piano.wav";
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

			} else {
				
				script.log("Spleeter  app not found");				
				util.showMessageBox("Spleeter  !", "spleeter not found", "warning", "OK");
			
		}
	}
}

// retreive temp location
function SpleeterTMP ()
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
	
return tempDIR;
}

// retreive file name from absolute path
function getFilename(songname)
{
	var splitcount = songname.split("/");
	var filename = splitcount[splitcount.length-1];

return filename		
}


// used for value/expression testing .......
function testScript(songname)
{

	script.log("test");

		
}