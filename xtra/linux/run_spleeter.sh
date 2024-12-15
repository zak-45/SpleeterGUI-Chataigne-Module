#!/bin/bash

# This is the shell script for Spleeter
# Adapted for Linux

# Set path to portable Python
export PATH="$HOME/Documents/Chataigne/xtra/PySp3.10/bin:$HOME/Documents/Chataigne/xtra/PySp3.10/Scripts:$PATH"

# Go to module xtra directory
cd "$HOME/Documents/Chataigne/modules/SpleeterGUI-Chataigne-Module-main/xtra" || exit

echo "$1"
echo "$2"
echo "$3"
echo "$4"
echo "$5"
echo "$6"
echo "$7"
echo "$8"

# replace '"' by '' (Chataigne problem)
export audio_file=${8/\"/}
export folder_name=${5/\"/}

# extract mp3 tags
python3 -m extract_tags "$audio_file"

# run spleeter
if [ "$1" != "mp3tags" ]; then
    spleeter "$1" "$2" "$3" "$4" "$folder_name" "$6" "$7" "$audio_file" "$9"
fi
