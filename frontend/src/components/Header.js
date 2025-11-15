import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Header() {
  return (
    <header className="bg-blue-900 text-white py-4">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">Jiovanni Go</div>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 transition duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="hover:text-gray-300 transition duration-300"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-gray-300 transition duration-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-gray-300 transition duration-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string,
};

export default Header;
