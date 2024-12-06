@echo off
Rem This script will install Spleeter Portable version in %USERPROFILE%\Documents\Chataigne\xtra
cls

Rem Download from GIT
powershell -F install-spleeter.ps1

Rem Extract zip file
.\7-ZipPortable\App\7-Zip64\7z.exe x Pysp-tmp.zip -o%USERPROFILE%\Documents\Chataigne\xtra

Rem remove zip file
del Pysp-tmp.zip
