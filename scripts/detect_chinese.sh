#!/bin/bash

# Script to detect Chinese characters in source code files
# This script scans the project for any files containing Chinese characters
# and outputs their locations for further processing.

echo "Scanning for files containing Chinese characters..."

# Directories to exclude from scanning
EXCLUDE_DIRS=(
  "node_modules"
  ".git"
  "build"
  "dist"
  "coverage"
  ".next"
  "scripts"  # Exclude scripts directory as it contains intentional Chinese characters for translation
)

# File extensions to scan
EXTENSIONS=(
  "js"
  "jsx"
  "ts"
  "tsx"
  "html"
  "css"
  "scss"
  "md"
  "json"
  "yaml"
  "yml"
)

# Build exclude pattern
EXCLUDE_PATTERN=""
for dir in "${EXCLUDE_DIRS[@]}"; do
  EXCLUDE_PATTERN="$EXCLUDE_PATTERN -not -path \"*/$dir/*\""
done

# Build extension pattern
EXT_PATTERN=""
for ext in "${EXTENSIONS[@]}"; do
  if [ -z "$EXT_PATTERN" ]; then
    EXT_PATTERN="-name \"*.$ext\""
  else
    EXT_PATTERN="$EXT_PATTERN -o -name \"*.$ext\""
  fi
done

# Find command to locate files with Chinese characters
FIND_CMD="find . $EXCLUDE_PATTERN \( $EXT_PATTERN \) -type f -exec grep -l \"[^\x00-\x7F]\" {} \;"

# Execute the find command
eval $FIND_CMD | while read -r file; do
  echo "Chinese characters found in: $file"
  
  # Optional: Show the lines containing Chinese characters
  grep -n "[^\x00-\x7F]" "$file" | head -5
  
  # If there are more than 5 instances, indicate there are more
  COUNT=$(grep -c "[^\x00-\x7F]" "$file")
  if [ $COUNT -gt 5 ]; then
    echo "... and $((COUNT - 5)) more instances"
  fi
  
  echo "-----------------------------------"
done

echo "Scan complete." 