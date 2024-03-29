#!/bin/bash

is_example() {
    # Get the parent directory of the given path
    parent_dir=$(dirname "$1")

    # Check if the parent directory ends with "Example"
    if [[ "$parent_dir" == *"Examples" ]]; then
        return 0 # Parent directory ends with "Example", return true
    else
        return 1 # Parent directory does not end with "Example", return false
    fi
}

dir=$(dirname $0)/..

if [ "$#" -eq 0 ]; then
    # "Script was called without any arguments."
    for file in "$dir"/src/Examples/*.elm; do
        # Check if the current item is a file (not a directory)
        if [ -f "$file" ]; then
            $(dirname $0)/convert.sh $file
        fi
    done
fi

if is_example "$@"; then
    $(dirname $0)/convert.sh $@
fi

elm make $dir/src/Main.elm --output=$dir/main.js


