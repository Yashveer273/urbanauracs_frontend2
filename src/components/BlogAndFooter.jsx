import React from "react";
const featuredPost = {
  title: "7 Quick Cleaning Hacks For Busy Families",
  author: "Hannah Cole",
  date: "March 5, 2035",
  image: "/images/cleaning-hacks.jpg", 
  linkText: "Read More →",
};

const sidePosts = [
  {
    title: "The Benefits of Green Cleaning Products",
    author: "Lucas Wei",
    date: "March 18, 2035",
    image: "/images/green-cleaning.jpg",
    linkText: "Read More →",
  },
  {
    title: "Spring Cleaning Checklist You Can Follow",
    author: "Mia Langston",
    date: "April 1, 2035",
    image: "/images/spring-cleaning.jpg",
    linkText: "Read More →",
  },
  {
    title: "How Often Should You Clean Your Home?",
    author: "Julian Snow",
    date: "April 25, 2035",
    image: "/images/cleaning-frequency.jpg",
    linkText: "Read More →",
  },
];
const BlogSection = () => {
  return (
    <section className="py-16 px-6 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto text-center mb-10">
        <div className="inline-block bg-[#e6f1fb] text-[#2563EB] text-xs font-semibold px-4 py-1 rounded-full mb-2 shadow">
          BLOG
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold">
          From Our Cleaning Experts
        </h2>
        <p className="text-gray-600 mt-1">
          Tips, tricks, and insights to maintain a fresher home.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
          <div className="w-full h-56 md:h-72 overflow-hidden rounded-t-xl">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6 flex flex-col justify-between flex-1">
            <div className="mb-2 text-sm text-gray-500">
              {featuredPost.author} • {featuredPost.date}
            </div>
            <h3 className="text-2xl font-semibold mb-3">
              {featuredPost.title}
            </h3>
            <div className="mt-auto">
              <a
                href="#"
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                {featuredPost.linkText}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {sidePosts.map((post) => (
            <div
              key={post.title}
              className="bg-white rounded-xl shadow-md flex items-center overflow-hidden"
            >
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-l-xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-1">
                <h4 className="text-lg font-semibold mb-1">{post.title}</h4>
                <div className="text-sm text-gray-500 mb-2">
                  {post.author} • {post.date}
                </div>
                <a
                  href="#"
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  {post.linkText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsletterFooter = () => {
  return (
    
    <footer className="bg-[#0f172a] text-white pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#1f64f0] to-[#2668f4] rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h4 className="text-xl font-semibold">
              Stay In The Loop With Qlinest
            </h4>
            <p className="text-sm mt-1">
              Receive cleaning tips, exclusive deals, and seasonal updates right in your inbox.
            </p>
          </div>
          <div className="flex-1 flex items-center">
            <div className="relative w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-full py-3 px-5 pr-32 text-sm outline-none"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-white text-[#1f2d3a] font-semibold px-6 py-2 rounded-full shadow hover:brightness-105 transition text-sm">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="mt-10 border-t border-gray-700 pt-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full" />
              Qlinest
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:underline">
                Home
              </a>
              <a href="#" className="hover:underline">
                About
              </a>
              <a href="#" className="hover:underline">
                Services
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex flex-col md:items-end gap-4 text-sm">
            <div className="flex gap-4">
              <div className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded-full">
                FB
              </div>
              <div className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded-full">
                IN
              </div>
              <div className="w-8 h-8 flex items-center justify-center border border-gray-500 rounded-full">
                G
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>© 2035 Qlinest. All rights reserved.</div>
              <div className="flex gap-4">
                <a href="#" className="hover:underline">
                  Privacy & Policy
                </a>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const BlogAndFooter = () => {
  return (
    <div>
      <BlogSection />
      <NewsletterFooter />
    </div>
  );
};

export default BlogAndFooter;
