#!/bin/bash

# Script to manually replace specific Chinese patterns in source code
# This approach uses precise replacements rather than catch-all patterns

BACKUP_DIR="backups_manual_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Get files with Chinese characters
CHINESE_FILES=$(./scripts/detect_chinese.sh | grep "Chinese characters found in:" | sed 's/Chinese characters found in: //')

echo "Processing files with manual replacements..."

# Handles specific source files that we know need treatment
process_file() {
  local FILE="$1"
  local BASENAME=$(basename "$FILE")
  
  # Create backup
  cp "$FILE" "$BACKUP_DIR/${BASENAME}.bak"
  
  echo "Processing $FILE"
  
  # Replace locale settings
  sed -i '' "s/'zh-CN'/'en-US'/g" "$FILE"
  sed -i '' 's/"zh-CN"/"en-US"/g' "$FILE"
  
  # Replace common interface/component comment headers
  sed -i '' 's/\/\/ 评论作者类型/\/\/ Comment author type/g' "$FILE"
  sed -i '' 's/\/\/ 评论回复类型/\/\/ Comment reply type/g' "$FILE"
  sed -i '' 's/\/\/ 评论类型/\/\/ Comment type/g' "$FILE"
  sed -i '' 's/\/\/ 评论组件参数/\/\/ Comment component props/g' "$FILE"
  sed -i '' 's/\/\/ 评论区参数/\/\/ Comment section props/g' "$FILE"
  sed -i '' 's/\/\/ 评论区组件/\/\/ Comment section component/g' "$FILE"
  
  # Replace comment line in helpers.ts
  sed -i '' 's/\* SoLearn 实用工具函数库/\* SoLearn Utility Function Library/g' "$FILE"
  sed -i '' 's/\* 包含格式化、数据处理、验证等常用函数/\* Includes formatting, data processing, validation and other common functions/g' "$FILE"
  
  # Replace common inline Chinese text in UI components
  sed -i '' 's/管理员/Admin/g' "$FILE"
  sed -i '' 's/讲师/Instructor/g' "$FILE"
  sed -i '' 's/已置顶/Pinned/g' "$FILE"
  sed -i '' 's/已编辑/Edited/g' "$FILE"
  sed -i '' 's/保存/Save/g' "$FILE"
  sed -i '' 's/取消/Cancel/g' "$FILE"
  sed -i '' 's/赞/Like/g' "$FILE"
  sed -i '' 's/回复/Reply/g' "$FILE"
  sed -i '' 's/编辑/Edit/g' "$FILE"
  sed -i '' 's/确认删除?/Confirm Delete?/g' "$FILE"
  sed -i '' 's/删除/Delete/g' "$FILE"
  sed -i '' 's/违规内容/Violation content/g' "$FILE"
  sed -i '' 's/举报/Report/g' "$FILE"
  sed -i '' 's/写下你的回复.../Write your reply.../g' "$FILE"
  sed -i '' 's/发布/Post/g' "$FILE"
  sed -i '' 's/查看所有 \([0-9]*\) 条回复/View all \1 replies/g' "$FILE"
  sed -i '' 's/收起回复/Hide replies/g' "$FILE"
  sed -i '' 's/暂无评论，成为第一个发表评论的人吧！/No comments yet, be the first to post a comment!/g' "$FILE"
  sed -i '' 's/写下你的评论.../Write your comment.../g' "$FILE"
  sed -i '' 's/评论/Comments/g' "$FILE"
  sed -i '' 's/发表评论/Post Comment/g' "$FILE"
  sed -i '' 's/加载评论中.../Loading comments.../g' "$FILE"
  
  # Replace time-ago strings
  sed -i '' 's/ 年前/ years ago/g' "$FILE"
  sed -i '' 's/ 个月前/ months ago/g' "$FILE"
  sed -i '' 's/ 天前/ days ago/g' "$FILE"
  sed -i '' 's/ 小时前/ hours ago/g' "$FILE"
  sed -i '' 's/ 分钟前/ minutes ago/g' "$FILE"
  sed -i '' 's/ 秒前/ seconds ago/g' "$FILE"
  
  # Handle context ID comments
  sed -i '' 's/\/\/ 评论所属的上下文ID (课程ID, 帖子ID等)/\/\/ Context ID where the comment belongs (course ID, post ID, etc.)/g' "$FILE"
  sed -i '' 's/\/\/ 评论的上下文类型/\/\/ Comment context type/g' "$FILE"
  
  echo "Completed processing $FILE"
}

# Process each file
for FILE in $CHINESE_FILES; do
  if [ -f "$FILE" ]; then
    process_file "$FILE"
  else
    echo "File not found: $FILE"
  fi
done

echo "Manual replacement completed. Backups saved to: $BACKUP_DIR" 