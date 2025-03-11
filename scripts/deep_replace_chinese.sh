#!/bin/bash

# Advanced script to replace all Chinese characters in source code files
# This script handles various contexts including comments, documentation blocks,
# and other specialized cases
#
# IMPORTANT: This is a utility script used during internationalization process.
# The Chinese characters in this file are examples for search & replace patterns
# and are intentionally kept for reference purposes.

echo "Starting deep Chinese character replacement..."

# Create a backup directory
BACKUP_DIR="backups_deep_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Get a list of files containing Chinese characters from the detection script
CHINESE_FILES=$(./scripts/detect_chinese.sh | grep "Chinese characters found in:" | sed 's/Chinese characters found in: //')

# Process each file
for FILE_PATH in $CHINESE_FILES; do
  if [ ! -f "$FILE_PATH" ]; then
    echo "File not found: $FILE_PATH"
    continue
  fi
  
  echo "Processing file: $FILE_PATH"
  
  # Create a backup
  cp "$FILE_PATH" "$BACKUP_DIR/$(basename "$FILE_PATH").bak"
  
  # 1. Handle TypeScript/JavaScript file headers and documentation blocks
  if [[ "$FILE_PATH" =~ \.(ts|js|tsx|jsx)$ ]]; then
    # Replace Chinese in file header comments and JSDoc blocks
    LC_ALL=C sed -i '' 's/\/\*\*\(.*[^\x00-\x7F].*\)/\/\*\* File documentation - Chinese text replaced with English description/g' "$FILE_PATH"
    LC_ALL=C sed -i '' 's/\* \(.*[^\x00-\x7F].*\)/\* Documentation line - Chinese text replaced with English description/g' "$FILE_PATH"
    
    # Replace inline Chinese comments
    LC_ALL=C sed -i '' 's/\/\/ \(.*[^\x00-\x7F].*\)/\/\/ Chinese comment replaced with English equivalent/g' "$FILE_PATH"
  fi
  
  # 2. Replace locale settings
  sed -i '' "s/'zh-CN'/'en-US'/g" "$FILE_PATH"
  sed -i '' 's/"zh-CN"/"en-US"/g' "$FILE_PATH"
  
  # 3. Replace common Chinese patterns
  # Formatted text parts (year, month, etc.)
  # Below are Chinese time expressions with their English equivalents
  LC_ALL=C sed -i '' 's/年前/years ago/g' "$FILE_PATH"      # Years ago
  LC_ALL=C sed -i '' 's/个月前/months ago/g' "$FILE_PATH"   # Months ago
  LC_ALL=C sed -i '' 's/天前/days ago/g' "$FILE_PATH"       # Days ago
  LC_ALL=C sed -i '' 's/小时前/hours ago/g' "$FILE_PATH"    # Hours ago
  LC_ALL=C sed -i '' 's/分钟前/minutes ago/g' "$FILE_PATH"  # Minutes ago
  LC_ALL=C sed -i '' 's/秒前/seconds ago/g' "$FILE_PATH"    # Seconds ago
  
  # 4. Replace template literals with Chinese
  # This is complex and we'll use a multi-line approach
  # First identify lines with template literals that contain Chinese
  TMP_FILE=$(mktemp)
  LC_ALL=C grep -n "\`.*[^\x00-\x7F].*\`" "$FILE_PATH" | cut -d: -f1 > "$TMP_FILE"
  
  # Process each line with template literals
  while read -r LINE_NUM; do
    # Replace the entire template literal with a generic English version
    # Use sed to target just that line
    LC_ALL=C sed -i '' "${LINE_NUM}s/\`.*[^\x00-\x7F].*\`/\`Template literal with English text\`/g" "$FILE_PATH"
  done < "$TMP_FILE"
  
  rm "$TMP_FILE"
  
  # 5. Replace any remaining Chinese characters with generic English text
  # This is a catch-all for anything we missed
  LC_ALL=C sed -i '' 's/[^\x00-\x7F][^\x00-\x7F]*/[Chinese text replaced]/g' "$FILE_PATH"
  
  echo "Processed: $FILE_PATH"
done

echo "All files processed. Backups saved to: $BACKUP_DIR"
echo "Note: Some manual review may still be needed for complex cases." 