rm /tmp/spleeter-portable-linux-x86_64.zip
wget 'https://github.com/zak-45/SpleeterGUI-Chataigne-Module/releases/download/0.0.0.0/spleeter-portable-linux-x86_64.zip' -P /tmp
unzip -o /tmp/spleeter-portable-linux-x86_64.zip -d $HOME/Documents/Chataigne/xtra
rm -r $HOME/Documents/Chataigne/xtra/PySp3.10
mv $HOME/Documents/Chataigne/xtra/tmp/PySp3.10  $HOME/Documents/Chataigne/xtra/PySp3.10
rm /tmp/spleeter-portable-linux-x86_64.zip

