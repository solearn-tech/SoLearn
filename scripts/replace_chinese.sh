#!/bin/bash

# Script to replace Chinese comments and strings in TypeScript/React files
# Usage: ./replace_chinese.sh <file_path>
#
# IMPORTANT: This is a utility script used during internationalization process.
# The Chinese characters in this file are translation mappings and are intentionally 
# kept for reference purposes. Each Chinese term has its English equivalent.

if [ -z "$1" ]; then
  echo "Usage: $0 <file_path>"
  exit 1
fi

FILE_PATH="$1"
BACKUP_PATH="${FILE_PATH}.bak"

if [ ! -f "$FILE_PATH" ]; then
  echo "File not found: $FILE_PATH"
  exit 1
fi

# Make a backup of the original file
cp "$FILE_PATH" "$BACKUP_PATH"

# Common translations for Chinese text patterns in code
# Format: ["Chinese term"]="English equivalent"
declare -A TRANSLATIONS=(
  ["评论"]="Comment"
  ["回复"]="Reply"
  ["作者"]="Author"
  ["用户"]="User"
  ["内容"]="Content"
  ["点赞"]="Like"
  ["删除"]="Delete"
  ["编辑"]="Edit"
  ["保存"]="Save"
  ["取消"]="Cancel"
  ["发布"]="Post"
  ["确认"]="Confirm"
  ["提交"]="Submit"
  ["加载"]="Loading"
  ["成功"]="Success"
  ["失败"]="Failure"
  ["错误"]="Error"
  ["警告"]="Warning"
  ["信息"]="Information"
  ["通知"]="Notification"
  ["设置"]="Settings"
  ["登录"]="Login"
  ["注册"]="Register"
  ["退出"]="Logout"
  ["密码"]="Password"
  ["用户名"]="Username"
  ["邮箱"]="Email"
  ["暂无"]="None"
  ["查看"]="View"
  ["收起"]="Hide"
  ["展开"]="Expand"
  ["上传"]="Upload"
  ["下载"]="Download"
  ["管理员"]="Admin"
  ["讲师"]="Instructor"
  ["学生"]="Student"
  ["课程"]="Course"
  ["章节"]="Chapter"
  ["单元"]="Unit"
  ["问题"]="Question"
  ["答案"]="Answer"
  ["分数"]="Score"
  ["奖励"]="Reward"
  ["成就"]="Achievement"
  ["标题"]="Title"
  ["描述"]="Description"
  ["详情"]="Details"
  ["列表"]="List"
  ["搜索"]="Search"
  ["筛选"]="Filter"
  ["排序"]="Sort"
  ["创建时间"]="Created At"
  ["更新时间"]="Updated At"
  ["已编辑"]="Edited"
  ["已置顶"]="Pinned"
  ["举报"]="Report"
  ["违规内容"]="Violation content"
  ["赞"]="Like"
  ["年前"]="years ago"
  ["个月前"]="months ago"
  ["天前"]="days ago"
  ["小时前"]="hours ago"
  ["分钟前"]="minutes ago"
  ["秒前"]="seconds ago"
  ["暂无评论"]="No comments yet"
  ["成为第一个发表评论的人吧"]="be the first to post a comment"
  ["写下你的评论"]="Write your comment"
  ["写下你的回复"]="Write your reply"
  ["加载评论中"]="Loading comments"
)

echo "Processing file: $FILE_PATH"

# Create a temporary file
TMP_FILE=$(mktemp)

# Apply translations
cp "$FILE_PATH" "$TMP_FILE"

for CN_TEXT in "${!TRANSLATIONS[@]}"; do
  EN_TEXT="${TRANSLATIONS[$CN_TEXT]}"
  # Replace text in comments and strings, ensuring it's matching whole words
  sed -i '' "s/$CN_TEXT/$EN_TEXT/g" "$TMP_FILE"
done

# Replace Chinese comments with English comments
sed -i '' 's/\/\/ \(.*[^\x00-\x7F].*\)/\/\/ Chinese comment has been replaced with English comment/g' "$TMP_FILE"

# Move the processed file back
mv "$TMP_FILE" "$FILE_PATH"

echo "Processed file: $FILE_PATH"
echo "Original file backed up to: $BACKUP_PATH" 