import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

function BlogPostCard({ post }) {
  return (
    <Link to={`/blog/${post.id}`} className="group flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white">
      <div className="relative overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-sm text-gold-600 font-semibold mb-2">{post.category}</p>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
          <span>Por {post.author}</span>
          <span>{post.date}</span>
        </div>
        <div className="mt-4">
          <span className="text-gold-600 font-semibold group-hover:text-darkGold-600 transition-colors duration-300 flex items-center">
            Leer más <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BlogPostCard;
