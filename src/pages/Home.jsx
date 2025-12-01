import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { clearAuth } from '../redux_slices/authSlice'
import { getAllPostsThunk } from '../redux_thunks/postThunk'
// import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Navigation, Pagination } from "swiper/modules";


const Home = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(clearAuth());
    }
    // const handleAddPost = ()=>{
    //   dispatch(addPostThunk())
    // }
    // const {posts, loading, error} = useSelector((state) => state.posts.posts);
    const { posts, isLoading, error } = useSelector((state) => state.posts);

    console.log(posts)

    useEffect(()=>{
      dispatch(getAllPostsThunk())
    },[])
  if(isLoading){
    return <div>Loading...</div>
  }
  if(error){
    return <div className='text-red-500'>{error}</div>
  }
  return (
    <div>
      <div>
          <p>user :{user?.email}</p>
          <button onClick={handleLogout}>logout</button>
      </div>
      <div className='bg-grey min-h-screen w-full flex justify-center items-center flex-col'>
        <div className='bg-white p-6 rounded-lg shadow-lg w-1/2'>
            <h1 className='text-2xl font-bold mb-4'>Add New Post</h1>
            {/* <div>
              <input type="text" placeholder='title' />
              <textarea name="" id=""></textarea>
              <button onClick={handleAddPost}>Add Post</button>
            </div> */}
        </div>
       <div>
  <h1 className="text-3xl font-bold my-6 text-center">Posts</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
    {posts.map((post) => (
      <div
        key={post._id}
        className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-4 border"
      >
        {/* --- Image Carousel --- */}
        <Swiper
          spaceBetween={10}
          navigation={true}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          className="rounded-lg overflow-hidden"
        >
          {post.images?.length > 0 ? (
            post.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-64 bg-black">
                  <img
                    src={img.url}  // change if needed
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Images</span>
              </div>
            </SwiperSlide>
          )}
        </Swiper>

        {/* --- Post Content --- */}
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-gray-700 mt-1 line-clamp-3">{post.caption}</p>

          {post.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  )
}

export default Home;

