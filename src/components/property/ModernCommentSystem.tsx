import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Send, Trash2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MentionTextarea from "./MentionTextarea";
import "@/styles/modern-comments.css";

export interface ModernComment {
  id: string;
  property_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  mentions: Array<{
    username: string;
    user_id: string;
  }>;
  parent_comment_id?: string | null;
  replies?: ModernComment[];
  depth?: number;
}

interface ModernCommentSystemProps {
  propertyId: string;
  propertyOwnerId?: string;
}

const ModernCommentSystem: React.FC<ModernCommentSystemProps> = ({
  propertyId,
  propertyOwnerId,
}) => {
  const [comments, setComments] = useState<ModernComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { user } = useAuth();
  const { t, currentLanguage, isRTL } = useLanguage();
  const { toast } = useToast();

  // Build nested comment structure
  const buildCommentTree = (comments: any[]): ModernComment[] => {
    const commentMap = new Map();
    const rootComments: ModernComment[] = [];

    // First pass: create comment objects and map them
    comments.forEach(comment => {
      const transformedComment: ModernComment = {
        ...comment,
        username: comment.user?.username || 'user',
        full_name: comment.user?.full_name,
        avatar_url: comment.user?.avatar_url,
        mentions: [],
        replies: [],
        depth: 0
      };
      commentMap.set(comment.id, transformedComment);
    });

    // Second pass: build the tree structure
    comments.forEach(comment => {
      const transformedComment = commentMap.get(comment.id);
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id);
        if (parent) {
          transformedComment.depth = Math.min((parent.depth || 0) + 1, 1); // Max depth of 1 (only 2 levels total)
          parent.replies = parent.replies || [];
          parent.replies.push(transformedComment);
        } else {
          // Parent not found, treat as root comment
          rootComments.push(transformedComment);
        }
      } else {
        rootComments.push(transformedComment);
      }
    });

    // Sort replies by creation date
    const sortReplies = (comment: ModernComment) => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        comment.replies.forEach(sortReplies);
      }
    };

    rootComments.forEach(sortReplies);
    return rootComments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  };

  // Load comments with nested structure
  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("property_comments")
        .select(`
          *,
          user:profiles(username, full_name, avatar_url)
        `)
        .eq("property_id", propertyId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const nestedComments = buildCommentTree(data || []);
      setComments(nestedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast({
        title: t("error"),
        description: t("commentsLoadError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [propertyId]);

  // Handle comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    try {
      // Find the comment being replied to
      const replyToComment = replyingTo ? findCommentById(replyingTo) : null;

      // Determine the correct parent_comment_id
      let parentCommentId = null;
      if (replyToComment) {
        // If replying to a main comment (depth 0), use its ID as parent
        // If replying to a reply (depth 1), use the same parent as the reply to keep it at level 1
        parentCommentId = replyToComment.depth === 0
          ? replyToComment.id
          : replyToComment.parent_comment_id;
      }

      const { error } = await supabase.from("property_comments").insert({
        comment: newComment.trim(),
        property_id: propertyId,
        user_id: user.id,
        parent_comment_id: parentCommentId,
      });

      if (error) throw error;

      setNewComment("");
      setReplyingTo(null);
      toast({
        title: t("commentSubmittedTitle"),
        description: t("commentSubmittedDesc"),
      });

      await loadComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: t("error"),
        description: t("commentSubmitError"),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reply
  const handleReply = (comment: ModernComment) => {
    const mention = `@${comment.username} `;
    setNewComment(mention);
    setReplyingTo(comment.id);

    // Focus the textarea after a short delay to ensure it's rendered
    setTimeout(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        // Position cursor after the mention
        textarea.setSelectionRange(mention.length, mention.length);
      }
    }, 100);
  };

  // Handle delete
  const handleDelete = async (commentId: string) => {
    if (!window.confirm(t("confirmDeleteComment"))) return;

    try {
      const { error } = await supabase
        .from("property_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast({
        title: t("commentDeletedTitle"),
        description: t("commentDeletedDesc"),
      });
      
      await loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: t("error"),
        description: t("commentDeleteError"),
        variant: "destructive",
      });
    }
  };

  // Parse mentions in comment text
  const parseCommentText = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={index}
            className="text-brand-accent font-semibold hover:underline cursor-pointer bg-brand-accent/10 px-1 py-0.5 rounded-md transition-colors hover:bg-brand-accent/20"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Find comment by ID in nested structure
  const findCommentById = (commentId: string, commentList: ModernComment[] = comments): ModernComment | null => {
    for (const comment of commentList) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = findCommentById(commentId, comment.replies);
        if (found) return found;
      }
    }
    return null;
  };

  // Render individual comment with replies
  const renderComment = (comment: ModernComment, depth: number = 0) => {
    const maxDepth = 1; // Limit visual nesting to 1 level (2 levels total: 0 and 1)
    const actualDepth = Math.min(depth, maxDepth);

    // Calculate indentation based on depth
    const getIndentationClass = () => {
      if (actualDepth === 0) return '';
      return isRTL ? 'mr-6 md:mr-8' : 'ml-6 md:ml-8';
    };

    // Get border styling for replies
    const getBorderClass = () => {
      if (actualDepth === 0) return 'border-b border-gray-100 dark:border-gray-800';
      return isRTL
        ? 'border-r-2 border-brand-accent/20 pr-4'
        : 'border-l-2 border-brand-accent/20 pl-4';
    };

    return (
      <div key={comment.id} className="relative">
        <div className={`${getIndentationClass()}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex gap-3 group pb-4 ${getBorderClass()} last:border-b-0 last:pb-0`}
          >
            {/* Avatar */}
            <Avatar className={`${actualDepth > 0 ? 'w-8 h-8' : 'w-10 h-10'} flex-shrink-0`}>
              {comment.avatar_url ? (
                <AvatarImage src={comment.avatar_url} alt={comment.full_name || comment.username} />
              ) : (
                <AvatarFallback className="bg-brand-accent text-white font-medium text-xs">
                  {(comment.full_name || comment.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* User Info */}
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900 dark:text-white text-sm">
                  {comment.full_name || comment.username}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  @{comment.username}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-400">
                  {formatTime(comment.created_at)}
                </span>
                {actualDepth > 0 && (
                  <>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-brand-accent font-medium">
                      {t("reply")}
                    </span>
                  </>
                )}
              </div>

              {/* Comment Text */}
              <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed mb-3">
                {parseCommentText(comment.comment)}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReply(comment)}
                  className="text-xs text-gray-500 hover:text-brand-accent px-0 py-1 h-auto font-medium transition-colors"
                >
                  {t("reply")}
                </Button>
                {user?.id === comment.user_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-gray-500 hover:text-red-500 px-0 py-1 h-auto font-medium transition-colors"
                  >
                    {t("delete")}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Render Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return t("justNow");
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}${t("hoursAgo")}`;
    } else {
      return date.toLocaleDateString(
        currentLanguage === "ar" ? "ar-EG" : currentLanguage === "tr" ? "tr-TR" : "en-US"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="bg-white dark:bg-[#111726] border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <MessageCircle className="w-5 h-5 text-brand-accent" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("comments")} ({comments.length})
          </h3>
        </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata?.full_name || "User"} />
                ) : (
                  <AvatarFallback className="bg-brand-accent text-white font-medium">
                    {(user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="relative">
                  <MentionTextarea
                    value={newComment}
                    onChange={setNewComment}
                    placeholder={replyingTo ? t("writeReply") : t("commentPlaceholder")}
                    className="w-full min-h-[44px] max-h-32 resize-none border-0 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/20 focus:bg-white dark:focus:bg-gray-700"
                    disabled={submitting}
                  />
                  {newComment.trim() && (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-full w-8 h-8 p-0 flex items-center justify-center"
                    >
                      {submitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
                {replyingTo && (
                  <div className="flex items-center justify-between bg-brand-accent/10 rounded-lg px-3 py-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-brand-accent rounded-full"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-brand-accent font-medium">
                          {t("replyingTo")} @{findCommentById(replyingTo)?.username || 'user'}
                        </span>
                        {findCommentById(replyingTo)?.depth === 1 && (
                          <span className="text-xs text-gray-500">
                            {t("replyWillAppearAtSameLevel")}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setReplyingTo(null);
                        setNewComment("");
                      }}
                      className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 h-auto"
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                {t("noCommentsYet")}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                {t("beFirstToComment")}
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {comments.map((comment) => renderComment(comment, 0))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};

export default ModernCommentSystem;
