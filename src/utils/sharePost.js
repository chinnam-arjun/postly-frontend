const getFrontendOrigin = () => {
  if (typeof window === 'undefined') return '';
  return (
    import.meta.env.VITE_FRONTEND_URL ||
    import.meta.env.VITE_PUBLIC_URL ||
    import.meta.env.VITE_APP_URL ||
    window.location.origin
  );
};

export const getPostShareUrl = (postId) => {
  if (!postId) return '';
  const origin = getFrontendOrigin();
  if (!origin) return '';

  try {
    return new URL(`/post/${postId}`, origin).toString();
  } catch (err) {
    return `${origin.replace(/\/$/, '')}/post/${postId}`;
  }
};

export const getPostShareText = (post = {}) => {
  const caption = post.caption || post.content || '';
  const title = post.title || '';
  return (caption || title || 'Check out this post on our blog').trim();
};

export const getPostShareData = (post = {}) => {
  const url = getPostShareUrl(post._id || post.id);
  return {
    title: post.title || 'Blog post',
    text: getPostShareText(post),
    url,
  };
};

export const canUseWebShare = () => {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.share === 'function' &&
    typeof window !== 'undefined' &&
    window.isSecureContext
  );
};

export const sharePostUsingNative = async (post = {}) => {
  const shareData = getPostShareData(post);
  if (!shareData.url) {
    throw new Error('Unable to build a shareable link.');
  }
  if (!canUseWebShare()) {
    throw new Error('Native sharing is not supported by this browser.');
  }
  await navigator.share(shareData);
};

export const copyTextToClipboard = async (text) => {
  if (!text) {
    throw new Error('Nothing to copy.');
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const successful = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!successful) {
    throw new Error('Clipboard copy failed.');
  }
};

export const getShareLinks = (post = {}) => {
  const url = getPostShareUrl(post._id || post.id);
  const text = getPostShareText(post);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const message = encodeURIComponent(`${text} ${url}`);

  return {
    whatsapp: `https://wa.me/?text=${message}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(post.title || 'Check out this post')}&body=${encodeURIComponent(`${text}\n\n${url}`)}`,
  };
};
