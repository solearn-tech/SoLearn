import React, { useState, useEffect, ReactNode } from 'react';
import { FiMessageSquare, FiHeart, FiAlertCircle, FiEdit2, FiTrash2, FiCornerUpRight } from 'react-icons/fi';
import Image from 'next/image';

// Comment author type
export interface CommentAuthor {
  id: string;
  name: string;
  avatar: string;
  level?: number;
  isInstructor?: boolean;
  isAdmin?: boolean;
}

// Comment reply type
export interface CommentReply {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: Date;
  likes: number;
  isLikedByUser: boolean;
}

// Comment type
export interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: number;
  isLikedByUser: boolean;
  isPinned?: boolean;
  replies?: CommentReply[];
  replyCount: number;
  isUserComment?: boolean;
}

// Comment component props
export interface CommentProps {
  comment: Comment;
  contextId: string; // Context ID where the comment belongs (course ID, post ID, etc.)
  contextType: 'course' | 'forum' | 'lesson' | 'certificate'; // Comment context type
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, content: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string, reason: string) => void;
  showActions?: boolean;
  showReplies?: boolean;
  allowReplies?: boolean;
  maxReplies?: number;
}

// Chinese comment replaced with English comment
const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + ' years ago';
  }
  
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months ago';
  }
  
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days ago';
  }
  
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago';
  }
  
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago';
  }
  
  return Math.floor(seconds) + ' seconds ago';
};

// Chinese comment replaced with English comment
const Comment = ({
  comment,
  contextId,
  contextType,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onReport,
  showActions = true,
  showReplies = true,
  allowReplies = true,
  maxReplies = 3
}: CommentProps) => {
  const [liked, setLiked] = useState(comment.isLikedByUser);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyContent, setReplyContent] = useState('');
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Chinese comment replaced with English comment
  const visibleReplies = showAllReplies 
    ? comment.replies || [] 
    : (comment.replies || []).slice(0, maxReplies);
  
  // Chinese comment replaced with English comment
  const handleLike = () => {
    if (onLike) {
      onLike(comment.id);
      setLiked(!liked);
      setLikeCount((prev: number) => liked ? prev - 1 : prev + 1);
    }
  };
  
  // Chinese comment replaced with English comment
  const handleSubmitReply = () => {
    if (onReply && replyContent.trim()) {
      onReply(comment.id, replyContent);
      setIsReplying(false);
      setReplyContent('');
    }
  };
  
  // Chinese comment replaced with English comment
  const handleSubmitEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };
  
  // Chinese comment replaced with English comment
  const handleDelete = () => {
    if (onDelete) {
      if (confirmDelete) {
        onDelete(comment.id);
      } else {
        setConfirmDelete(true);
        // Chinese comment replaced with English comment
        setTimeout(() => setConfirmDelete(false), 5000);
      }
    }
  };
  
  // Chinese comment replaced with English comment
  const AuthorBadge = () => {
    if (comment.author.isAdmin) {
      return <span className="px-2 py-0.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full ml-2">Admin</span>;
    }
    
    if (comment.author.isInstructor) {
      return <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full ml-2">Instructor</span>;
    }
    
    if (comment.author.level && comment.author.level > 5) {
      return <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full ml-2">Lv.{comment.author.level}</span>;
    }
    
    return null;
  };
  
  return (
    <div className={`p-4 border-b dark:border-gray-700 ${comment.isPinned ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}`}>
      {/* Comment被置顶标记 */}
      {comment.isPinned && (
        <div className="mb-2 text-xs text-yellow-600 dark:text-yellow-400 font-medium flex items-center">
          <svg 
            className="w-3 h-3 mr-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.828 4.172a1 1 0 0 1 1.414 0L16 8.94l-4.758 4.758a1 1 0 0 1-1.414-1.414L13.586 9H4a1 1 0 1 1 0-2h9.586L9.828 3.243a1 1 0 0 1 0-1.414L9.828 4.172z"/>
          </svg>
          Pinned
        </div>
      )}
      
      <div className="flex">
        {/* 头像 */}
        <div className="mr-3 flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {comment.author.avatar ? (
              <Image 
                src={comment.author.avatar} 
                alt={comment.author.name}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                {comment.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* AuthorInformation */}
          <div className="flex items-center mb-1">
            <span className="font-medium text-gray-900 dark:text-white">
              {comment.author.name}
            </span>
            <AuthorBadge />
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
              {getTimeAgo(comment.createdAt)}
              {comment.updatedAt && ' • Edited'}
            </span>
          </div>
          
          {/* CommentContent */}
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e: any) => setEditContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
              <div className="flex space-x-2 mt-2">
                <button
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
                  onClick={handleSubmitEdit}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-700 dark:text-gray-300 break-words whitespace-pre-line">
              {comment.content}
            </div>
          )}
          
          {/* Comment操作 */}
          {showActions && !isEditing && (
            <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
              {/* Like按钮 */}
              <button
                onClick={handleLike}
                className={`flex items-center hover:text-gray-700 dark:hover:text-gray-300 ${
                  liked ? 'text-primary-600 dark:text-primary-400' : ''
                }`}
              >
                <FiHeart className={`mr-1 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount > 0 ? likeCount : ''}</span>
                <span className="ml-1">Like</span>
              </button>
              
              {/* Reply按钮 */}
              {allowReplies && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="ml-4 flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiCornerUpRight className="mr-1" />
                  <span>Reply</span>
                </button>
              )}
              
              {/* Author的Edit和Delete操作 */}
              {comment.isUserComment && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-4 flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <FiEdit2 className="mr-1" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={handleDelete}
                    className={`ml-4 flex items-center ${
                      confirmDelete 
                        ? 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300' 
                        : 'hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiTrash2 className="mr-1" />
                    <span>{confirmDelete ? 'Confirm Delete?' : 'Delete'}</span>
                  </button>
                </>
              )}
              
              {/* Report按钮 */}
              {!comment.isUserComment && onReport && (
                <button
                  onClick={() => onReport(comment.id, 'Violation content')}
                  className="ml-4 flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiAlertCircle className="mr-1" />
                  <span>Report</span>
                </button>
              )}
            </div>
          )}
          
          {/* Reply输入框 */}
          {isReplying && (
            <div className="mt-3">
              <textarea
                value={replyContent}
                onChange={(e: any) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
                rows={2}
              />
              <div className="flex space-x-2 mt-2">
                <button
                  className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm"
                  onClick={handleSubmitReply}
                >
                  Post
                </button>
                <button
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyContent('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {/* CommentReply */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
              {visibleReplies.map((reply) => (
                <div key={reply.id} className="mt-2 pb-2">
                  <div className="flex">
                    <div className="mr-2 flex-shrink-0">
                      <div className="relative w-6 h-6 rounded-full overflow-hidden">
                        {reply.author.avatar ? (
                          <Image 
                            src={reply.author.avatar} 
                            alt={reply.author.name}
                            layout="fill"
                            objectFit="cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                            {reply.author.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {reply.author.name}
                        </span>
                        {reply.author.isInstructor && (
                          <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full ml-1">Instructor</span>
                        )}
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {getTimeAgo(reply.createdAt)}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {reply.content}
                      </div>
                      
                      <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <button
                          className={`flex items-center hover:text-gray-700 dark:hover:text-gray-300 ${
                            reply.isLikedByUser ? 'text-primary-600 dark:text-primary-400' : ''
                          }`}
                        >
                          <FiHeart className={`mr-1 ${reply.isLikedByUser ? 'fill-current' : ''}`} />
                          <span>{reply.likes > 0 ? reply.likes : ''}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* 显示更多Reply按钮 */}
              {comment.replies.length > maxReplies && !showAllReplies && (
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  View all {comment.replies.length} replies
                </button>
              )}
              
              {/* HideReply按钮 */}
              {showAllReplies && comment.replies.length > maxReplies && (
                <button
                  onClick={() => setShowAllReplies(false)}
                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  Hide replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Chinese comment replaced with English comment
export interface CommentSectionProps {
  comments: Comment[];
  contextId: string;
  contextType: 'course' | 'forum' | 'lesson' | 'certificate';
  isLoading?: boolean;
  currentUserCanComment?: boolean;
  onCreateComment?: (content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyToComment?: (commentId: string, content: string) => void;
  onEditComment?: (commentId: string, content: string) => void;
  onDeleteComment?: (commentId: string) => void;
  onReportComment?: (commentId: string, reason: string) => void;
  emptyStateMessage?: string;
  maxRepliesPerComment?: number;
}

// Chinese comment replaced with English comment
const CommentSection = ({
  comments,
  contextId,
  contextType,
  isLoading = false,
  currentUserCanComment = false,
  onCreateComment,
  onLikeComment,
  onReplyToComment,
  onEditComment,
  onDeleteComment,
  onReportComment,
  emptyStateMessage = 'No comments yet, be the first to post a comment!',
  maxRepliesPerComment = 3
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  
  // Chinese comment replaced with English comment
  const handleCreateComment = () => {
    if (onCreateComment && newComment.trim()) {
      onCreateComment(newComment);
      setNewComment('');
    }
  };
  
  // Chinese comment replaced with English comment
  const sortedComments = [...comments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Title */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
        <FiMessageSquare className="text-gray-500 dark:text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Comments</h3>
        <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
          {comments.length}
        </span>
      </div>
      
      {/* 创建Comment */}
      {currentUserCanComment && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <textarea
            value={newComment}
            onChange={(e: any) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCreateComment}
              disabled={!newComment.trim()}
            >
              Post Comment
            </button>
          </div>
        </div>
      )}
      
      {/* CommentList */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-primary-600"></div>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading comments...</p>
        </div>
      ) : sortedComments.length > 0 ? (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="mb-4">
              <Comment
                comment={comment}
                contextId={contextId}
                contextType={contextType}
                onLike={onLikeComment}
                onReply={onReplyToComment}
                onEdit={onEditComment}
                onDelete={onDeleteComment}
                onReport={onReportComment}
                showReplies={true}
                maxReplies={maxRepliesPerComment}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          {emptyStateMessage}
        </div>
      )}
    </div>
  );
};

export default CommentSection; 