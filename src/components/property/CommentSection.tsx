
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import CommentItem from "./CommentItem";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
// إضافة كارد للستايل
import { Card, CardContent } from "@/components/ui/card";
// استيراد ملف CSS للتحسينات
import "@/styles/comments.css";

export interface PropertyComment {
  id: string;
  property_id: string;
  user_id: string;
  comment: string;
  parent_comment_id: string | null;
  created_at: string;
  user?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
  replies?: PropertyComment[];
}

interface CommentSectionProps {
  propertyId: string;
}

const fetchCommentsWithReplies = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("property_comments")
    .select(
      `*, user:profiles(username, avatar_url, full_name)`
    )
    .eq("property_id", propertyId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  const topLevel = (data as any[]).filter((c) => !c.parent_comment_id);
  const replies = (data as any[]).filter((c) => c.parent_comment_id);

  const nestReplies = (parent: any) => {
    parent.replies = replies
      .filter((r) => r.parent_comment_id === parent.id)
      .map((r) => nestReplies({ ...r, user: r.user }));
    return parent;
  };
  // سجل جلب التعليقات
  console.log("Fetched comments:", data);
  return topLevel.map((c) => nestReplies({ ...c, user: c.user }));
};

const CommentSection: React.FC<CommentSectionProps> = ({ propertyId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<PropertyComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // جلب مالك العقار
  const [propertyOwnerId, setPropertyOwnerId] = useState<string | null>(null);

  const { currentLanguage, t } = useLanguage();

  useEffect(() => {
    loadComments();
    fetchPropertyOwner();
    // eslint-disable-next-line
  }, [propertyId]);

  const fetchPropertyOwner = async () => {
    const { data } = await supabase
      .from("properties")
      .select("created_by")
      .eq("id", propertyId)
      .single();
    setPropertyOwnerId(data?.created_by || null);
  };

  // جلب التعليقات
  const loadComments = async () => {
    try {
      const list = await fetchCommentsWithReplies(propertyId);
      setComments(list as PropertyComment[]);
    } catch (error) {
      toast({
        title: t("error"),
        description: t("commentsLoadError"),
        variant: "destructive",
      });
    }
  };

  // التحقق من وجود أرقام في النص
  const containsNumbers = (text: string) => {
    // تحقق من الأرقام الإنجليزية والعربية
    const numberRegex = /[0-9٠-٩]/;
    return numberRegex.test(text);
  };

  // معالجة تغيير النص مع منع الأرقام
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    if (containsNumbers(value)) {
      // عرض رسالة تحذير
      toast({
        title: t("warning"),
        description: t("numbersNotAllowedInComments"),
        variant: "destructive",
      });
      
      // إزالة الأرقام من النص
      const cleanText = value.replace(/[0-9٠-٩]/g, '');
      setNewComment(cleanText);
    } else {
      setNewComment(value);
    }
  };

  // إرسال تعليق جديد مع إشعار للمالك
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    // التحقق النهائي من عدم وجود أرقام
    if (containsNumbers(newComment)) {
      toast({
        title: t("error"),
        description: t("cannotSendCommentWithNumbers"),
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { error, data } = await supabase.from("property_comments").insert({
      comment: newComment.trim(),
      property_id: propertyId,
      user_id: user.id,
      parent_comment_id: null,
    }).select();

    if (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: t("error"),
        description: t("commentSubmitError"),
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    } else {
      setNewComment("");
      toast({
        title: t("commentSubmittedTitle"),
        description: t("commentSubmittedDesc"),
      });
      // إشعار صاحب العقار
      if (
        propertyOwnerId &&
        user.id !== propertyOwnerId &&
        data &&
        data[0] &&
        data[0].id
      ) {
        // Build notification message manually to avoid passing a second arg to t()
        let slicedContent = newComment.trim().slice(0, 42) + (newComment.trim().length > 42 ? "..." : "");
        let notificationMsg = t("newCommentNotification") + ": " + slicedContent;

        await supabase.from("notifications").insert({
          user_id: propertyOwnerId,
          type: "new_comment",
          message: notificationMsg,
          related_property_id: propertyId,
          related_comment_id: data[0].id
        });
      }
      console.log("Comment submitted successfully");
    }
    setSubmitting(false);
    loadComments();
  };

  // إرسال رد على تعليق
  const handleReply = async (parentId: string, content: string) => {
    if (!user || !content.trim()) return;

    // التحقق من عدم وجود أرقام في الرد
    if (containsNumbers(content)) {
      toast({
        title: t("error"),
        description: t("cannotSendCommentWithNumbers"),
        variant: "destructive",
      });
      throw new Error("Numbers not allowed");
    }

    const { error, data } = await supabase.from("property_comments").insert({
      comment: content.trim(),
      property_id: propertyId,
      user_id: user.id,
      parent_comment_id: parentId,
    }).select();

    if (error) {
      console.error("Error submitting reply:", error);
      toast({
        title: t("error"),
        description: t("commentSubmitError"),
        variant: "destructive",
      });
      throw error;
    } else {
      toast({
        title: t("replySubmittedTitle"),
        description: t("replySubmittedDesc"),
      });
      loadComments();
    }
  };

  // حذف تعليق
  const handleDelete = async (commentId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("property_comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: t("error"),
        description: t("commentDeleteError"),
        variant: "destructive",
      });
      throw error;
    } else {
      toast({
        title: t("commentDeletedTitle"),
        description: t("commentDeletedDesc"),
      });
      loadComments();
    }
  };

  // تحديد اتجاه الزر بناءً على اللغة
  const isRTL = currentLanguage === "ar";

  return (
    <section className="mt-12">
      {/* تغليف كل قسم التعليقات بالكارت الداكن */}
      <Card className="bg-white dark:bg-[#111726] rounded-xl shadow-sm transition-colors border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          {/* واجهة إضافة تعليق جديد استايل مبسط */}
          <form
            onSubmit={handleSubmit}
            className={`flex items-start mb-6 w-full gap-3`}
            aria-label="add-comment"
            style={{
              flexDirection: currentLanguage === "ar" ? 'row-reverse' : 'row'
            }}
          >
            <div className="flex-1">
              <Textarea
                placeholder={t("commentPlaceholder")}
                value={newComment}
                onChange={handleCommentChange}
                className={`
                  min-h-[100px] max-h-40 w-full
                  bg-white dark:bg-[#151826]
                  border border-gray-300 dark:border-gray-600
                  rounded-lg
                  px-4 py-3 text-sm
                  resize-none
                  transition-all duration-200
                  focus:ring-2
                  focus:ring-brand-accent/20
                  focus:border-brand-accent
                  text-gray-800 dark:text-gray-100
                  placeholder:text-gray-400 dark:placeholder:text-gray-400
                `}
                disabled={submitting}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className={`
                  px-6 py-3 font-medium
                  rounded-lg
                  text-white
                  transition-all duration-200
                  bg-brand-accent
                  hover:bg-brand-accent/90
                  disabled:bg-gray-400 disabled:opacity-70
                  text-sm
                `}
              >
                {submitting ? (
                  <span className="animate-pulse">{t("sending")}</span>
                ) : (
                  <span>{t("send")}</span>
                )}
              </Button>
            </div>
          </form>

          {/* قائمة التعليقات */}
          <div className="space-y-4">
            {/* عداد التعليقات */}
            {comments.length > 0 && (
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {comments.length} {t("comments")}
                </span>
              </div>
            )}

            {comments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {t("noCommentsYet")}
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {t("beFirstToComment")}
                </p>
              </div>
            )}

            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReply}
                onDelete={handleDelete}
                currentUserId={user?.id}
                depth={0}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CommentSection;
