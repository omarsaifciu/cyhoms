import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PropertyComment } from "./CommentSection";
import { MessageCircleReply, Trash2, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// تصميم مبسط للردود المتداخلة
const getDepthStyles = (depth: number) => {
  const maxDepth = 6; // تقليل العمق الأقصى
  const normalizedDepth = Math.min(depth, maxDepth);

  return {
    marginLeft: `${normalizedDepth * 20}px`, // مساحة أبسط
    borderLeftWidth: depth > 0 ? '2px' : '0px',
    borderLeftColor: '#57bfc9', // لون العلامة التجارية
    paddingLeft: depth > 0 ? '16px' : '0px',
  };
};

interface CommentItemProps {
  comment: PropertyComment;
  onReply: (parentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  depth?: number;
  currentUserId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onReply,
  onDelete,
  depth = 0,
  currentUserId,
}) => {
  const [replyMode, setReplyMode] = useState(false);
  const [replyValue, setReplyValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t, currentLanguage, isRTL } = useLanguage();

  const depthStyles = getDepthStyles(depth);
  const canDelete = currentUserId === comment.user_id;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyValue.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onReply(comment.id, replyValue.trim());
      setReplyValue("");
      setReplyMode(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(t("confirmDeleteComment"))) {
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error("Error deleting comment:", error);
      }
    }
  };

  return (
    <div
      className={`
        comment-item relative group p-4 transition-all duration-200
        bg-white dark:bg-[#111726]
        border border-gray-100 dark:border-gray-800
        rounded-xl
        hover:shadow-md hover:border-brand-accent/20
        ${depth > 0 ? 'mt-3' : 'mb-4'}
      `}
      style={{
        marginLeft: isRTL ? '0px' : depthStyles.marginLeft,
        marginRight: isRTL ? depthStyles.marginLeft : '0px',
        borderLeftWidth: depthStyles.borderLeftWidth,
        borderLeftColor: depthStyles.borderLeftColor,
        paddingLeft: isRTL ? '16px' : depthStyles.paddingLeft,
        paddingRight: isRTL ? depthStyles.paddingLeft : '16px',
      }}
    >

      <div className="flex items-start gap-3 relative">
        <div>
          <Avatar className={`
            w-10 h-10 ring-2 ring-gray-100 dark:ring-gray-700
            transition-all duration-200 hover:ring-brand-accent/50
            ${depth > 3 ? 'w-8 h-8' : 'w-10 h-10'}
          `}>
            {comment.user?.avatar_url ? (
              <AvatarImage
                src={comment.user.avatar_url}
                alt={comment.user?.full_name || comment.user?.username || t("user")}
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="bg-brand-accent text-white font-medium text-sm">
                {(comment.user?.full_name || comment.user?.username || t("user")).charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {comment.user?.full_name || comment.user?.username || t("user")}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.created_at).toLocaleString(
                currentLanguage === "ar" ? "ar-EG" : currentLanguage === "tr" ? "tr-TR" : "en-US"
              )}
            </span>
          </div>

          <div className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed mb-3">
            {comment.comment}
          </div>

          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              className={`
                text-xs px-3 py-1.5 rounded-lg transition-all duration-200
                hover:bg-brand-accent/10 hover:text-brand-accent
                ${replyMode ? 'bg-brand-accent/10 text-brand-accent' : 'text-gray-500 dark:text-gray-400'}
              `}
              onClick={() => setReplyMode(!replyMode)}
            >
              <MessageCircleReply size={14} className="mr-1" />
              {replyMode ? t("cancelReply") : t("reply")}
            </Button>
            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                onClick={handleDelete}
                title={t("deleteComment")}
              >
                <Trash2 size={14} className="mr-1" />
                {t("delete")}
              </Button>
            )}
          </div>
        </div>
      </div>

      {replyMode && (
        <form
          onSubmit={handleReply}
          className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex gap-3">
            <Textarea
              value={replyValue}
              onChange={(e) => setReplyValue(e.target.value)}
              className="flex-1 min-h-[80px] resize-none rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 bg-white dark:bg-gray-900 text-sm"
              placeholder={t("writeReply")}
              disabled={isSubmitting}
            />
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                disabled={!replyValue.trim() || isSubmitting}
                className="px-4 py-2 rounded-lg bg-brand-accent hover:bg-brand-accent/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Send size={16} />
                )}
              </Button>
            </div>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                depth={depth + 1}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
