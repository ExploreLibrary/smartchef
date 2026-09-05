import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth-context";
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from "../../services/api-service";

function Comments({ mealId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const currentUserId = user?.id ?? user?._id;

  useEffect(() => {
    let isCurrent = true;

    async function loadComments() {
      if (!mealId) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await listComments(mealId);

        if (isCurrent) {
          setComments(Array.isArray(response) ? response : []);
        }
      } catch (commentsError) {
        if (isCurrent) {
          console.error("Error loading comments:", commentsError);
          setError("Unable to load comments.");
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadComments();

    return () => {
      isCurrent = false;
    };
  }, [mealId]);

  const handleCreate = async (event) => {
    event.preventDefault();
    const normalizedComment = commentText.trim();

    if (!normalizedComment || !mealId || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const savedComment = await createComment({
        mealId,
        comment: normalizedComment,
      });

      setComments((currentComments) => [savedComment, ...currentComments]);
      setCommentText("");
    } catch (commentsError) {
      console.error("Error creating comment:", commentsError);
      setError("Unable to save your comment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (commentId) => {
    const normalizedComment = editingText.trim();

    if (!normalizedComment || isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const updatedComment = await updateComment(commentId, {
        comment: normalizedComment,
      });

      setComments((currentComments) =>
        currentComments.map((item) =>
          item.id === commentId ? updatedComment : item
        )
      );
      setEditingId(null);
      setEditingText("");
    } catch (commentsError) {
      console.error("Error updating comment:", commentsError);
      setError("Unable to update your comment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await deleteComment(commentId);
      setComments((currentComments) =>
        currentComments.filter((item) => item.id !== commentId)
      );
    } catch (commentsError) {
      console.error("Error deleting comment:", commentsError);
      setError("Unable to delete your comment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title" className="comments__title">Comments</h2>

      <form className="comments__form" onSubmit={handleCreate}>
        <label htmlFor="new-comment">Add a comment</label>
        <textarea
          id="new-comment"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Write your comment"
          rows="3"
          maxLength="500"
          disabled={isSaving}
        />
        <button type="submit" disabled={!commentText.trim() || isSaving}>
          {isSaving ? "Saving..." : "Publish comment"}
        </button>
      </form>

      {error && <p className="comments__error" role="alert">{error}</p>}

      {isLoading ? (
        <p>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <div className="comments__list">
          {comments.map((item) => {
            const commentUser = item.user ?? {};
            const commentUserId = commentUser.id ?? commentUser._id ?? commentUser;
            const userName = commentUser.name || commentUser.username || "User";
            const isOwnComment = String(commentUserId) === String(currentUserId);

            return (
              <article className="comments__item" key={item.id}>
                <div className="comments__item-header">
                  <strong>{userName}</strong>
                  {isOwnComment && <span>Your comment</span>}
                </div>

                {editingId === item.id ? (
                  <div className="comments__edit">
                    <textarea
                      value={editingText}
                      onChange={(event) => setEditingText(event.target.value)}
                      rows="3"
                      maxLength="500"
                      disabled={isSaving}
                    />
                    <div className="comments__actions">
                      <button
                        type="button"
                        onClick={() => handleUpdate(item.id)}
                        disabled={!editingText.trim() || isSaving}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comments__text">{item.comment}</p>
                )}

                {isOwnComment && editingId !== item.id && (
                  <div className="comments__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(item.id);
                        setEditingText(item.comment);
                      }}
                      disabled={isSaving}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isSaving}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Comments;