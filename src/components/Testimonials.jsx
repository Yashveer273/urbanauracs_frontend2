import React from "react";

const testimonials = [
  {
    name: "Sandra Yerick",
    avatar: "/avatars/sandra.jpg", 
    rating: 5,
    text: `Our apartment has never looked this clean! Urban Aura Services is now a must in our monthly routine. The team is polite, efficient, and always pays attention to the smallest details.`,
  },
  {
    name: "Jerome Freud",
    avatar: "/avatars/jerome.jpg",
    rating: 5,
    text: `Fast, thorough, and friendly. Highly recommend their deep cleaning service! They even managed to clean tough stains I had given up on. My house feels refreshed.`,
  },
  {
    name: "Laila Tassel",
    avatar: "/avatars/laila.jpg",
    rating: 5,
    text: `Love their eco products and how great my house smells after each visit. Urban Aura Services is professional, always on time, and my home has never felt more peaceful and organized.`,
  },
];

const StarRating = ({ count = 5 }) => {
  return (
    <div className="flex space-x-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.84-.197-1.54-1.118l1.286-3.95a1 1 0 00-.364-1.118L2.025 9.377c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.95z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="bg-[#e8f2fc] py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        <div className="inline-block bg-white/60 text-[#2563EB] text-xs font-semibold px-4 py-1 rounded-full mb-1 shadow">
          TESTIMONIALS
        </div>
        <h2 className="text-3xl font-bold text-center">What Our Clients Are Saying</h2>
        <p className="text-gray-600 text-center">Real words from real happy homes.</p>

        <div className="w-full flex flex-col sm:flex-row gap-6 mt-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex-1 bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <StarRating count={t.rating} />
                <p className="text-sm text-gray-700 leading-relaxed">{t.text}</p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div className="text-sm font-medium text-[#0f172a]">{t.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-2 bg-[#2563EB] rounded-full" />
            <div className="w-6 h-2 bg-gray-300 rounded-full" />
            <div className="w-6 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
