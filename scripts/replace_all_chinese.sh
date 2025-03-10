#!/bin/bash

# Script to process all files with Chinese characters and create a batch replacement script
# This approach helps to avoid encoding issues in the shell script

echo "Processing all files with Chinese characters..."

# Find all files containing Chinese characters
CHINESE_FILES=$(./scripts/detect_chinese.sh | grep "Chinese characters found in:" | sed 's/Chinese characters found in: //')

# Create a backup directory
BACKUP_DIR="backups_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

for FILE_PATH in $CHINESE_FILES; do
  if [ -f "$FILE_PATH" ]; then
    echo "Processing: $FILE_PATH"
    
    # Create a backup
    cp "$FILE_PATH" "$BACKUP_DIR/$(basename "$FILE_PATH").bak"
    
    # Replace common Chinese patterns with English text
    sed -i '' 's/评论/Comment/g' "$FILE_PATH"
    sed -i '' 's/回复/Reply/g' "$FILE_PATH"
    sed -i '' 's/作者/Author/g' "$FILE_PATH"
    sed -i '' 's/用户/User/g' "$FILE_PATH"
    sed -i '' 's/内容/Content/g' "$FILE_PATH"
    sed -i '' 's/点赞/Like/g' "$FILE_PATH"
    sed -i '' 's/删除/Delete/g' "$FILE_PATH"
    sed -i '' 's/编辑/Edit/g' "$FILE_PATH"
    sed -i '' 's/保存/Save/g' "$FILE_PATH"
    sed -i '' 's/取消/Cancel/g' "$FILE_PATH"
    sed -i '' 's/发布/Post/g' "$FILE_PATH"
    sed -i '' 's/确认/Confirm/g' "$FILE_PATH"
    sed -i '' 's/提交/Submit/g' "$FILE_PATH"
    sed -i '' 's/加载/Loading/g' "$FILE_PATH"
    sed -i '' 's/成功/Success/g' "$FILE_PATH"
    sed -i '' 's/失败/Failure/g' "$FILE_PATH"
    sed -i '' 's/错误/Error/g' "$FILE_PATH"
    sed -i '' 's/警告/Warning/g' "$FILE_PATH"
    sed -i '' 's/信息/Information/g' "$FILE_PATH"
    sed -i '' 's/通知/Notification/g' "$FILE_PATH"
    sed -i '' 's/设置/Settings/g' "$FILE_PATH"
    sed -i '' 's/登录/Login/g' "$FILE_PATH"
    sed -i '' 's/注册/Register/g' "$FILE_PATH"
    sed -i '' 's/退出/Logout/g' "$FILE_PATH"
    sed -i '' 's/密码/Password/g' "$FILE_PATH"
    sed -i '' 's/用户名/Username/g' "$FILE_PATH"
    sed -i '' 's/邮箱/Email/g' "$FILE_PATH"
    sed -i '' 's/暂无/None/g' "$FILE_PATH"
    sed -i '' 's/查看/View/g' "$FILE_PATH"
    sed -i '' 's/收起/Hide/g' "$FILE_PATH"
    sed -i '' 's/展开/Expand/g' "$FILE_PATH"
    sed -i '' 's/上传/Upload/g' "$FILE_PATH"
    sed -i '' 's/下载/Download/g' "$FILE_PATH"
    sed -i '' 's/管理员/Admin/g' "$FILE_PATH"
    sed -i '' 's/讲师/Instructor/g' "$FILE_PATH"
    sed -i '' 's/学生/Student/g' "$FILE_PATH"
    sed -i '' 's/课程/Course/g' "$FILE_PATH"
    sed -i '' 's/章节/Chapter/g' "$FILE_PATH"
    sed -i '' 's/单元/Unit/g' "$FILE_PATH"
    sed -i '' 's/问题/Question/g' "$FILE_PATH"
    sed -i '' 's/答案/Answer/g' "$FILE_PATH"
    sed -i '' 's/分数/Score/g' "$FILE_PATH"
    sed -i '' 's/奖励/Reward/g' "$FILE_PATH"
    sed -i '' 's/成就/Achievement/g' "$FILE_PATH"
    sed -i '' 's/标题/Title/g' "$FILE_PATH"
    sed -i '' 's/描述/Description/g' "$FILE_PATH"
    sed -i '' 's/详情/Details/g' "$FILE_PATH"
    sed -i '' 's/列表/List/g' "$FILE_PATH"
    sed -i '' 's/搜索/Search/g' "$FILE_PATH"
    sed -i '' 's/筛选/Filter/g' "$FILE_PATH"
    sed -i '' 's/排序/Sort/g' "$FILE_PATH"
    sed -i '' 's/创建时间/Created At/g' "$FILE_PATH"
    sed -i '' 's/更新时间/Updated At/g' "$FILE_PATH"
    sed -i '' 's/已编辑/Edited/g' "$FILE_PATH"
    sed -i '' 's/已置顶/Pinned/g' "$FILE_PATH"
    sed -i '' 's/举报/Report/g' "$FILE_PATH"
    sed -i '' 's/违规内容/Violation content/g' "$FILE_PATH"
    sed -i '' 's/赞/Like/g' "$FILE_PATH"
    sed -i '' 's/年前/years ago/g' "$FILE_PATH"
    sed -i '' 's/个月前/months ago/g' "$FILE_PATH"
    sed -i '' 's/天前/days ago/g' "$FILE_PATH"
    sed -i '' 's/小时前/hours ago/g' "$FILE_PATH"
    sed -i '' 's/分钟前/minutes ago/g' "$FILE_PATH"
    sed -i '' 's/秒前/seconds ago/g' "$FILE_PATH"
    sed -i '' 's/暂无评论，成为第一个发表评论的人吧/No comments yet, be the first to post a comment/g' "$FILE_PATH"
    sed -i '' 's/写下你的评论/Write your comment/g' "$FILE_PATH"
    sed -i '' 's/写下你的回复/Write your reply/g' "$FILE_PATH"
    sed -i '' 's/加载评论中/Loading comments/g' "$FILE_PATH"
    
    # Replace Chinese comments with standard English comment
    LC_ALL=C sed -i '' 's/\/\/ .*[^\x00-\x7F].*/\/\/ Chinese comment replaced with English comment/g' "$FILE_PATH"
    
    echo "Processed: $FILE_PATH"
  else
    echo "File not found: $FILE_PATH"
  fi
done

echo "All files processed. Backups saved to: $BACKUP_DIR" 