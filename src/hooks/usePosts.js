// usePosts.js
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/AxiosInstance';

// 1. Move the fetcher outside the hook
const fetchPosts = async ({ pageParam = 1, queryKey }) => {
  const [_, type] = queryKey; // Extract 'for-you' or 'following' from key
  const response = await axiosInstance.get(`/feed/${type}?page=${pageParam}&limit=10`);
  return response.data;
};

// Hook for fetching user's own posts
const fetchUserPosts = async () => {
  const response = await axiosInstance.get('/posts/my', {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.data.posts || [];
};

export const useUserPosts = () => {
  return useQuery({
    queryKey: ['userPosts'],
    queryFn: fetchUserPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePosts = (type) => {
  return useInfiniteQuery({
    // 2. Include 'type' in the key so React Query caches them separately
    queryKey: ['posts', type], 
    queryFn: fetchPosts,
    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      // Assuming your backend returns { posts: [...] }
      const posts = lastPage.posts || [];
      
      // If we got fewer than 10 posts, we are at the end
      if (posts.length < 10) return undefined;
      
      // Otherwise, next page is current length + 1
      return allPages.length + 1;
    },
    
    // Keep data fresh to avoid refetching on simple navigation
    staleTime: 1000 * 60 * 5, 
  });
};

export const useCommentMutation = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, parentCommentId }) => {
      const url = parentCommentId 
        ? `/posts/${postId}/comment/${parentCommentId}/reply`
        : `/posts/${postId}/comment`;

      const response = await axiosInstance.post(url, { content });
      return response.data;
    },
    // When the mutation succeeds, refresh the post data for all feed types
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'], exact: false });
    },
  });
};

export const useDeleteCommentMutation = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId) => {
      await axiosInstance.delete(`/posts/${postId}/comment/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'], exact: false });
    },
  });
};