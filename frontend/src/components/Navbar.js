import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-indigo-600">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-white font-bold text-xl">
            Relationship Register
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/blog" className="text-white hover:text-indigo-200">
              Blog
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-indigo-200">
                  Dashboard
                </Link>
                <Link to="/register-partner" className="text-white hover:text-indigo-200">
                  Register Partner
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:text-indigo-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-indigo-200">
                  Login
                </Link>
                <Link to="/register" className="text-white hover:text-indigo-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 