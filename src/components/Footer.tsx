// Footer component
import { FaEnvelope, FaGithub, FaLinkedin, FaPhone } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto bg-white px-4 py-3 shadow dark:bg-gray-900">
      <div className="container mx-auto flex flex-col items-center justify-between space-y-2 sm:flex-row sm:space-y-0">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          © {currentYear} All Rights Reserved | Ben Katalan
        </div>
        
        <div className="flex space-x-4">
          <a 
            href="#" 
            className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="Email"
            title="Email"
          >
            <FaEnvelope className="text-lg" />
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="GitHub"
            title="GitHub"
          >
            <FaGithub className="text-lg" />
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
            aria-label="LinkedIn"
            title="LinkedIn"
          >
            <FaLinkedin className="text-lg" />
          </a>
          <a 
            href="#" 
            className="text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" 
            aria-label="Phone"
            title="Phone"
          >
            <FaPhone className="text-lg" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
