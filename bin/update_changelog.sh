#!/bin/bash

# Function to compare semantic versions
version_gt() { test "$(echo "$@" | tr " " "\n" | sort -V | head -n 1)" != "$1"; }

# Get the latest tag following semantic versioning
latest_tag=$(git tag -l --sort=-v:refname | grep -E "^[0-9]+\.[0-9]+\.[0-9]+$" | head -n 1)

# Get all commits since the latest tag
commits=$(git log --oneline --pretty=format:"%s" ${latest_tag}..HEAD)

# Append commits to CHANGELOG file
echo "Commits since ${latest_tag}:" >> CHANGELOG.md
echo "$commits" >> CHANGELOG.md
