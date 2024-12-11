import json
import taglib
import sys

def extract_mp3_tags(file_name):
    """Extract MP3 tags from a audio file and save them to a JSON file.

    This function reads the tags from the specified MP3 file and writes
    the extracted information into a JSON file named 'song_tags_info.json'.

    Args:
        file_name (str): The path to the MP3 file from which to extract tags.
    """
    with taglib.File(file_name) as song:
        tags = song.tags

    with open('song_tags_info.json', 'w') as json_file:
        json.dump(tags, json_file, indent=4)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_tags.py <path_to_mp3_file>")
        sys.exit(1)

    mp3_file = sys.argv[1]
    extract_mp3_tags(mp3_file)
