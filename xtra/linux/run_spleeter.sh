#!/bin/bash

# This is the shell script for Spleeter
# Adapted for Linux

# Set path to portable Python
export PATH="$HOME/Documents/Chataigne/xtra/PySp3.10/bin:$HOME/Documents/Chataigne/xtra/PySp3.10/Scripts:$PATH"

# Go to module xtra directory
cd "$HOME/Documents/Chataigne/modules/SpleeterGUI-Chataigne-Module-main/xtra" || exit

python3 -m extract_tags "$8"

if [ "$1" != "mp3tags" ]; then
    spleeter "$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8" "$9"
fi
