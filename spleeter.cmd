@echo off
Rem this is the cmd file for spleeter
Rem need to be adapted depend on the running OS, this one is for Win
Rem will receive these parameters on entry " " + SPLoutputOptions + " -o " + '"' + SPLoutputFolder + '" -p ' +  SPLstems+' "' + targetFile + '" ' + verbose
Rem which will give " separate -c mp3 -o audio_output -p spleeter:2stems audio_example.mp3 --verbose" for example

call "%USERPROFILE%\Documents\Chataigne\xtra\PySpleeter\WPy64-310111\scripts\env_for_icons.bat"

cd %WINPYDIRBASE%

ffprobe -show_format -print_format json %8 > %TMP%/ffprobefileinfo.json

if NOT "%1"=="ffprobeOnly" spleeter.exe %1 %2 %3 %4 %5 %6 %7 %8 %9