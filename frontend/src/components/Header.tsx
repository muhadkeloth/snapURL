import { Link2, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const Header = () => {
    const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate('/login');
  };


  return (
    <header className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Link2 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">SnapURL</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </header>
  )
}

export default Header