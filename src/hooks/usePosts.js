// usePosts.js
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import axiosInstance from '../utils/AxiosInstance';

// 1. Move the fetcher outside the hook
const fetchPosts = async ({ pageParam = 1, queryKey }) => {
  const [_, type] = queryKey; // Extract 'for-you' or 'following' from key
  
  const token = localStorage.getItem('token');
  
  const response = await axiosInstance.get(`/feed/${type}?page=${pageParam}&limit=10`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });

  // Return the data exactly as your backend sends it
  return response.data; 
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
      // Switch URL based on whether it's a new comment or a reply
      const url = parentCommentId 
        ? `http://localhost:5000/posts/${postId}/comment/${parentCommentId}/reply`
        : `http://localhost:5000/posts/${postId}/comment`;

      const response = await axios.post(url, { content }, {
        withCredentials: true,
        headers: { 
          'Content-Type': 'application/json',
         }
      });
      return response.data;
    },
    // When the mutation succeeds, refresh the post data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useDeleteCommentMutation = (postId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId) => {
      await axios.delete(`http://localhost:5000/posts/${postId}/comment/${commentId}`, {
        withCredentials: true,
        headers: { 'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NGZlMWQyMWNmNWVjOTAzMTg1NzMwZSIsImlhdCI6MTc2NzUzMTgyNiwiZXhwIjoxNzY4MTM2NjI2fQ.DzDuesZZ1JTzFdHAUZ0KXCP5jCeRERMLY9Ngw_y1xg4` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};