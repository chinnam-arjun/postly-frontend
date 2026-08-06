import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getPostById } from '../redux_apis/post.js';
import SharePostButton from '../components/posts/SharePostButton.jsx';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      setLoading(true);
      setError('');

      try {
        const response = await getPostById(postId);
        setPost(response.data?.post || response.data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err.message || 'Failed to load post.');
        toast.error('Unable to load the requested post.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gray-900 p-8 shadow-xl">
          <p className="text-lg text-gray-300">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gray-900 p-8 shadow-xl">
          <p className="text-lg text-red-400">{error}</p>
          <Link to="/feed" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 text-gray-100">
      <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-gray-800 bg-gray-900 shadow-xl">
        <div className="flex flex-col gap-4 border-b border-gray-800 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{post.title || 'Untitled post'}</h1>
            <p className="mt-2 text-sm text-gray-400">By {post.author?.username || 'Unknown author'}</p>
          </div>
          <SharePostButton post={post} />
        </div>

        <div className="space-y-6 p-6">
          {post.images?.length > 0 ? (
            <img src={post.images[0]?.url || post.images[0]} alt={post.title} className="w-full rounded-3xl object-cover" />
          ) : null}
          <p className="text-gray-300 leading-8 whitespace-pre-wrap">{post.caption || post.content || 'No content available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
