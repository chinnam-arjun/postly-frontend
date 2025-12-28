// import React, { useState } from 'react';
// import { Search, PenSquare, User, X, ArrowLeft } from 'lucide-react';

// const Header = ({ isSearchOpen, setIsSearchOpen }) => {
//   // const [isSearchOpen, setIsSearchOpen] = useState(false);

//   // Mock navigate function (Replace with your actual useNavigate from react-router-dom)
//   const navigate = (path) => console.log("Navigating to:", path);

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center">
//       <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        
//         {/* --- MOBILE: LEFT (Write Post) / DESKTOP: LEFT (Logo) --- */}
//         <div className="flex items-center">
//           {/* Mobile Write Icon (Hidden on MD+) */}
//           <button 
//             onClick={() => navigate('/create')}
//             className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
//           >
//             <PenSquare size={24} />
//           </button>

//           {/* Desktop Logo (Hidden on Mobile, shown on MD+) */}
//           <div className="hidden md:flex font-bold text-xl items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
//             <span>📝</span>
//             <span className="text-purple-600">POST</span>
//             <span className="text-blue-600">LY</span>
//           </div>
//         </div>

//         {/* --- MOBILE: CENTER (Logo) / DESKTOP: CENTER (Search Bar) --- */}
//         <div className="flex-1 flex justify-center items-center">
//           {/* Mobile Logo (Shown only on small screens) */}
//           <div className="md:hidden font-bold text-lg flex items-center gap-1">
//             <span>📝</span>
//             <span className="text-purple-600">P</span>
//             <span className="text-blue-600">L</span>
//           </div>

//           {/* Desktop Search Bar (Hidden on Mobile) */}
//           <div className="hidden md:block w-full max-w-md lg:max-w-2xl mx-4">
//             <div className="relative group">
//               <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
//               <input
//                 type="text"
//                 onClick={() => setIsSearchOpen(true)}
//                 placeholder="Search articles, topics, or authors..."
//                 className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>

//         {/* --- RIGHT SECTION (Write & Profile) --- */}
//         <div className="flex items-center gap-2 sm:gap-4">
//           {/* Desktop Write Button */}
//           <button 
//             className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium"
//             onClick={() => navigate('/create')}
//           >
//             <PenSquare size={18} />
//             <span>Write Post</span>
//           </button>

//           {/* Profile Icon (Visible on all) */}
//           <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200">
//             <User size={20} className="text-gray-700" />
//           </button>
//         </div>
//       </div>

//       {/* --- FULL SCREEN SEARCH OVERLAY --- */}
//       {/* This activates when isSearchOpen is true */}
//       {isSearchOpen && (
//         <div className="absolute inset-0 bg-white z-[60] flex flex-col animate-in fade-in duration-200">
//           <div className="h-16 flex items-center px-4 sm:px-8 border-b border-gray-100 gap-4">
//             <button 
//               onClick={() => setIsSearchOpen(false)}
//               className="p-2 hover:bg-gray-100 rounded-full text-gray-600"
//             >
//               <ArrowLeft size={24} />
//             </button>
//             <div className="flex-1 relative">
//               <input
//                 autoFocus
//                 type="text"
//                 placeholder="Search articles, topics, or authors..."
//                 className="w-full py-2 text-lg focus:outline-none"
//               />
//             </div>
//             <button 
//               onClick={() => setIsSearchOpen(false)}
//               className="p-2 text-gray-400 hover:text-gray-600"
//             >
//               <X size={24} />
//             </button>
//           </div>
          
//           {/* Results Area - This "closes" the rest of the page view */}
//           <div className="flex-1 bg-gray-50/50 p-8">
//             <div className="max-w-2xl mx-auto text-center">
//               <p className="text-gray-400">Start typing to see results...</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;


import React from 'react';
import { Search, PenSquare, User, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ isSearchOpen, setIsSearchOpen }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm fixed w-full  top-0 z-50 border-b border-gray-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* --- LEFT SECTION --- */}
        <div className="flex items-center min-w-[40px]">
          {/* Mobile: Write Post Icon (Hidden on md+) */}
          <button 
            onClick={() => navigate('/create')}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <PenSquare size={24} />
          </button>

          {/* Desktop: Logo (Hidden on Mobile) */}
          <div 
            className="hidden md:flex font-bold text-xl items-center gap-1 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <span>📝</span>
            <span className="text-purple-600">POST</span>
            <span className="text-blue-600">LY</span>
          </div>
        </div>

        {/* --- CENTER SECTION --- */}
        <div className="flex-1 flex justify-center items-center">
          {/* Mobile: Logo (Hidden on md+) */}
          <div className="md:hidden font-bold text-lg flex items-center gap-1" onClick={() => navigate('/')}>
            <span>📝</span>
            <span className="text-purple-600">P</span>
            <span className="text-blue-600">L</span>
          </div>

          {/* Desktop: Search Bar (Hidden on Mobile) */}
          <div className="hidden md:block w-full max-w-2xl mx-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="text"
                readOnly
                onClick={() => setIsSearchOpen(true)}
                placeholder="Search articles, topics, or authors..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full cursor-pointer hover:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT SECTION --- */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-[40px] justify-end">
          {/* Desktop: Write Button (Hidden on Mobile) */}
          <button 
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all font-medium"
            onClick={() => navigate('/create')}
          >
            <PenSquare size={18} />
            <span>Write Post</span>
          </button>

          {/* Profile Icon (Visible on All) */}
          <button 
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200"
            onClick={() => navigate('/profile')}
          >
            <User size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* --- FULL SCREEN SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col animate-in fade-in duration-200">
          <div className="h-16 flex items-center px-4 sm:px-8 border-b border-gray-100 gap-4">
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            
            <div className="flex-1 relative">
              <input
                autoFocus
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="w-full py-2 text-lg focus:outline-none"
              />
            </div>

            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Overlay Content / Results Area */}
          <div className="flex-1 bg-gray-50/50 p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mt-20">
                <Search size={48} className="mx-auto text-gray-200 mb-4" />
                <h3 className="text-gray-500 text-lg">Search for anything on Postly</h3>
                <p className="text-gray-400 text-sm">Find posts, authors, or topics that interest you.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;