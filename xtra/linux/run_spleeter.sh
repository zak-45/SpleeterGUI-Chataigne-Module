#!/bin/bash

# This is the shell script for Spleeter
# Adapted for Linux

# Set path to portable Python
export PATH="$HOME/Documents/Chataigne/xtra/PySp3.10/bin:$HOME/Documents/Chataigne/xtra/PySp3.10/Scripts:$PATH"

# Go to module xtra directory
cd "$HOME/Documents/Chataigne/modules/SpleeterGUI-Chataigne-Module-main/xtra" || exit

# echo variables
echo "$1"
echo "$2"
echo "$3"
echo "$4"
echo "$5"
echo "$6"
echo "$7"
echo "$8"


# terminal
if [ "$1" == "cmd" ]; then
  # Create a temporary file
  TMPFILE=$(mktemp)

  echo "PS1=spleeter-cmd\>" > "$TMPFILE"
  echo "spleeter --help" >> "$TMPFILE"
  echo "rm -f $TMPFILE" >> "$TMPFILE"

  # execute new terminal
  gnome-terminal -- $SHELL --rcfile "$TMPFILE"
  exit
fi


# replace '"' by '' (Chataigne on linux problem)
audio_file=$(echo "$8" | sed -e "s/\"//g")
export audio_file
folder_name=$(echo "$5" | sed -e "s/\"//g")
export folder_name

echo "audio file : ${audio_file}"
echo "output folder : ${folder_name}"

# extract mp3 tags
python3 -m extract_tags "$audio_file"

# run spleeter
if [ "$1" != "mp3tags" ]; then
    spleeter "$1" "$2" "$3" "$4" "$folder_name" "$6" "$7" "$audio_file" "$9"
fi

