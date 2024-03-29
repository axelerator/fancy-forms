#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <source_file>"
    exit 1
fi

# Assigning argument to a variable
SOURCE_FILE="$1"

# Extracting module name from the source file name
MODULE_NAME=$(basename "$SOURCE_FILE" | sed 's/\.[^.]*$//' | sed 's/[^a-zA-Z0-9]/_/g')

# Checking if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Source file '$SOURCE_FILE' does not exist."
    exit 1
fi

# Getting the content of the source file
CONTENT=$(cat "$SOURCE_FILE")
CONTENT_ESCAPED=$(echo "$CONTENT" | sed 's/\\/\\\\\\\\/g')

parent_dir=$(dirname "$SOURCE_FILE")
#
# Replacing $MODULE and $CONTENT in the template
OUTPUT_FILE="$parent_dir/Code/$MODULE_NAME.elm"
TEMPLATE="module Examples.Code.$MODULE_NAME exposing (code)\n\ncode =\"\"\"\n$CONTENT_ESCAPED\n\"\"\""

# Writing the template to the output file
echo -e "$TEMPLATE" > "$OUTPUT_FILE"

