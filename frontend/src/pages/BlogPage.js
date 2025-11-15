import React, { useState } from 'react';
import BlogPostCard from '../components/BlogPostCard';
import { blogPosts } from '../data/blogPosts'; // Datos de muestra
import { ArrowRightIcon } from '@heroicons/react/20/solid';

function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Filtrado real
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen animate-fadeIn">
      {/* Hero Section for Blog */}
      <section className="bg-white py-20 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
            El Diario de un Aroma
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Un espacio dedicado al arte y la ciencia de la perfumería. Descubre historias, guías y secretos del mundo de las fragancias.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Blog Posts Column */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))} 
            </div>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-1 space-y-10">
            {/* Search Widget */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Buscar</h3>
              <div className="relative">
                <input
  type="text"
  placeholder="Buscar artículos..."
  value={searchTerm}
  onChange={e => setSearchTerm(e.target.value)}
  className="w-full py-2 pl-4 pr-10 rounded-md border-gray-300 focus:border-gold-500 focus:ring-gold-500"
/>
                <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gold-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
              </div>
            </div>

            {/* Categories Widget */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Categorías</h3>
              <ul className="space-y-3">
                {[...new Set(blogPosts.map(p => p.category))].map(category => (
                  <li key={category}>
                    <button
  className={`flex justify-between items-center w-full text-left text-gray-600 hover:text-gold-600 transition-colors ${selectedCategory === category ? 'font-bold' : ''}`}
  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
>
  <span>{category}</span>
  <span className="text-xs font-semibold">({blogPosts.filter(p => p.category === category).length})</span>
</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts Widget */}
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Artículos Recientes</h3>
              <ul className="space-y-4">
                {blogPosts.slice(0, 3).map(post => (
                  <li key={post.id} className="flex flex-col flex-grow">
                    <p className="text-sm text-gold-600 font-semibold mb-2">{post.category}</p>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100 mt-auto">
                      <span>Por {post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-gold-600 font-semibold group-hover:text-darkGold-600 transition-colors duration-300 flex items-center">
                        Leer más <ArrowRightIcon className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

export default BlogPage;
