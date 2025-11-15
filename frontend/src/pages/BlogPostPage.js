import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag } from 'react-icons/fa';

function BlogPostPage() {
  const { postId } = useParams();
  const post = blogPosts.find((p) => p.id === parseInt(postId));

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Artículo no encontrado</h1>
        <p className="text-lg text-gray-600 mb-8">Lo sentimos, pero la publicación que buscas no existe o ha sido eliminada.</p>
        <Link to="/blog" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gold-600 hover:bg-darkGold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors">
          <FaArrowLeft className="-ml-1 mr-3 h-5 w-5" />
          Volver al Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      {/* Post Header with Background Image */}
      <header className="relative h-96">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight shadow-text">
            {post.title}
          </h1>
        </div>
      </header>

      {/* Post Content */}
      <article className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center justify-center text-gray-500 text-sm mb-8 gap-x-6 gap-y-2">
          <div className="flex items-center">
            <FaUser className="mr-2 text-gold-600" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gold-600" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center">
            <FaTag className="mr-2 text-gold-600" />
            <span>{post.category}</span>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="prose lg:prose-xl max-w-none text-gray-700 leading-relaxed">
          {/* Aquí iría el contenido real del post, parseado de Markdown si fuera necesario */}
          <p className="text-lg mb-6">{post.excerpt}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Integer vitae justo eget magna fermentum iaculis. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non  mauris vitae erat consequat auctor eu in elit.</p>
        </div>

        {/* Back to Blog Button */}
        <div className="text-center mt-12">
          <Link to="/blog" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gold-600 hover:bg-darkGold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 transition-colors">
            <FaArrowLeft className="-ml-1 mr-3 h-5 w-5" />
            Volver al Blog
          </Link>
        </div>
      </article>
    </div>
  );
}

export default BlogPostPage;
