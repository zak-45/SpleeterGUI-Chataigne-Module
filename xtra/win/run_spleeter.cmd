@echo off
Rem this is the cmd file for spleeter
Rem need to be adapted depend on the running OS, this one is for Win
Rem will receive these parameters on entry " " + SPLoutputOptions + " -o " + '"' + SPLoutputFolder + '" -p ' +  SPLstems+' "' + targetFile + '" ' + verbose
Rem which will give " separate -c mp3 -o audio_output -p spleeter:2stems audio_example.mp3 --verbose" for example

Rem path to portable Python
PATH=%USERPROFILE%\Documents\Chataigne\xtra\PySp3.10\bin;%PATH%
PATH=%USERPROFILE%\Documents\Chataigne\xtra\PySp3.10\Scripts;%PATH%

Rem go to module xtra dir
cd %USERPROFILE%\Documents\Chataigne\modules\SpleeterGUI-Chataigne-Module-main\xtra

python -m extract_tags %8

if NOT "%1"=="ffprobeOnly" spleeter.exe %1 %2 %3 %4 %5 %6 %7 %8 %9
