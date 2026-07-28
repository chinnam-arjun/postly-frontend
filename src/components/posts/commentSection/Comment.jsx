import React, { useEffect, useState } from "react";

const getAuthToken = () => {
  return localStorage.getItem("token") || null;
};

const CommentItem = ({
  comment,
  currentUser,
  onReplyClick,
  onSubmitReply,
  onDelete,
  onToggleLike,
  activeReplyId,
  replyText,
  onReplyTextChange,
}) => {
  const author = comment.user || comment.userId;
  const isAuthor = currentUser?.id === author?._id?.toString();
  const hasReplies = comment.replies && comment.replies.length > 0;

  const avatarLetter = author?.username?.charAt(0).toUpperCase() || "A";

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-700 text-center leading-10 text-sm font-bold text-white">
            {author?.profile ? (
              <img
                src={author.profile}
                alt={author.username}
                className="h-full w-full object-cover"
              />
            ) : (
              avatarLetter
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-sm text-white">
                {author?.username || "Unknown"}
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                {comment.parentCommentId ? "reply" : "comment"}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-200">
              {comment.content}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <button
                type="button"
                onClick={() => onToggleLike(comment._id)}
                className={`rounded-full px-2 py-1 transition ${
                  comment.likesCount > 0 ? "text-pink-400" : "text-gray-400"
                }`}
              >
                ♥ {comment.likesCount || 0}
              </button>

              <button
                type="button"
                onClick={() => onReplyClick(comment._id)}
                className="rounded-full px-2 py-1 text-gray-400 transition hover:text-white"
              >
                Reply
              </button>

              {isAuthor && (
                <button
                  type="button"
                  onClick={() => onDelete(comment._id)}
                  className="rounded-full px-2 py-1 text-red-400 transition hover:text-red-200"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {activeReplyId === comment._id && (
          <div className="mt-4 rounded-2xl border border-gray-800 bg-gray-950 p-3">
            <textarea
              value={replyText}
              onChange={(e) => onReplyTextChange(comment._id, e.target.value)}
              placeholder="Write a reply..."
              rows={3}
              className="w-full resize-none rounded-2xl border border-gray-800 bg-transparent px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onReplyTextChange(comment._id, "")}
                className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400 hover:bg-gray-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSubmitReply(comment._id)}
                className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
                disabled={!replyText?.trim()}
              >
                Post Reply
              </button>
            </div>
          </div>
        )}
      </div>

      {hasReplies && (
        <div className="ml-6 border-l border-gray-800/70 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              currentUser={currentUser}
              onReplyClick={onReplyClick}
              onSubmitReply={onSubmitReply}
              onDelete={onDelete}
              onToggleLike={onToggleLike}
              activeReplyId={activeReplyId}
              replyText={replyText}
              onReplyTextChange={onReplyTextChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const token = getAuthToken();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/posts/${postId}/comments`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load comments");
      setComments(data.comments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const postComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ content: newComment }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post comment");

      setNewComment("");
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const postReply = async (parentCommentId) => {
    const content = (replyDrafts[parentCommentId] || "").trim();
    if (!content) return;

    try {
      const res = await fetch(
        `/posts/${postId}/comment/${parentCommentId}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post reply");

      setReplyDrafts((prev) => ({ ...prev, [parentCommentId]: "" }));
      setActiveReplyId(null);
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/posts/${postId}/comment/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete comment");
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleLike = async (commentId) => {
    try {
      const res = await fetch(`/posts/comment/${commentId}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to like comment");
      fetchComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReplyClick = (commentId) => {
    setActiveReplyId((value) => (value === commentId ? null : commentId));
  };

  const handleReplyTextChange = (commentId, text) => {
    setReplyDrafts((prev) => ({ ...prev, [commentId]: text }));
  };

  return (
    <div className="rounded-3xl border border-gray-800/60 bg-gray-950 p-4 text-sm text-gray-100">
      <div className="mb-4 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-white">Comments</h2>
        <div className="grid gap-3 rounded-3xl border border-gray-800 bg-gray-900 p-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full resize-none rounded-3xl border border-gray-800 bg-transparent px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </span>
            <button
              type="button"
              onClick={postComment}
              disabled={!newComment.trim()}
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto pr-1">
        {loading && (
          <div className="py-6 text-center text-gray-400">Loading comments…</div>
        )}

        {error && (
          <div className="mb-3 rounded-2xl border border-red-700/40 bg-red-950/60 p-3 text-xs text-red-200">
            {error}
          </div>
        )}

        {!loading && comments.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            No comments yet. Be the first to reply.
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUser={currentUser}
                onReplyClick={handleReplyClick}
                onSubmitReply={postReply}
                onDelete={deleteComment}
                onToggleLike={toggleLike}
                activeReplyId={activeReplyId}
                replyText={replyDrafts[comment._id] || ""}
                onReplyTextChange={handleReplyTextChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;