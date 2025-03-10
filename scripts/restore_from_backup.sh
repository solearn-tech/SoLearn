#!/bin/bash

# Script to restore files from backup

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <backup_directory>"
  exit 1
fi

BACKUP_DIR="$1"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "Error: Backup directory '$BACKUP_DIR' not found"
  exit 1
fi

echo "Restoring files from $BACKUP_DIR..."

# Process each backup file
for BACKUP_FILE in "$BACKUP_DIR"/*.bak; do
  if [ ! -f "$BACKUP_FILE" ]; then
    continue
  fi
  
  # Extract the filename without path and .bak extension
  FILENAME=$(basename "$BACKUP_FILE" .bak)
  
  # Find the original file
  ORIGINAL_FILE=$(find . -name "$FILENAME" -type f | grep -v "node_modules" | grep -v "\.git" | head -1)
  
  if [ -z "$ORIGINAL_FILE" ]; then
    echo "Warning: Could not find original file for $BACKUP_FILE"
    continue
  fi
  
  echo "Restoring $ORIGINAL_FILE from $BACKUP_FILE"
  cp "$BACKUP_FILE" "$ORIGINAL_FILE"
done

echo "Restoration complete." 