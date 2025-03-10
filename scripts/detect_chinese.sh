#!/bin/bash

# Script to detect Chinese characters in files (UTF-8 encoded)
# This script searches for files containing Chinese characters in the specified directories

echo "Checking for files containing Chinese characters..."

# List of directories to search
DIRS_TO_SEARCH=("apps" "contracts" "docs" "scripts" "shared" "assets" ".")

# Define file extensions to search
FILE_EXTS=("js" "jsx" "ts" "tsx" "md" "json" "css" "scss" "html" "toml" "rs")

# Build the find command with file extensions
FIND_EXT_ARGS=()
for ext in "${FILE_EXTS[@]}"; do
  FIND_EXT_ARGS+=(-o -name "*.$ext")
done

# Remove the first -o from the array
FIND_EXT_ARGS=("${FIND_EXT_ARGS[@]:1}")

# Find files containing Chinese characters using perl (more accurate)
for dir in "${DIRS_TO_SEARCH[@]}"; do
  if [ -d "$dir" ]; then
    echo "Checking directory: $dir"
    find "$dir" -type f \( "${FIND_EXT_ARGS[@]}" \) -not -path "*/node_modules/*" -not -path "*/\.*" -print0 | 
    while IFS= read -r -d '' file; do
      if perl -ne 'exit 1 if /[\x{4e00}-\x{9fff}]/;' "$file"; then
        : # No Chinese characters found
      else
        echo "Chinese characters found in: $file"
      fi
    done
  else
    echo "Directory not found: $dir"
  fi
done

echo "Check completed." 