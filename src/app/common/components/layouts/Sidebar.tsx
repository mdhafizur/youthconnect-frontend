import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className={`fixed top-[8vh] left-0 bottom-0 bg-gray-800 text-white w-60 px-4 py-8 transition-all duration-300 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <h1 className="text-2xl font-bold mb-4">YouthConnect</h1>
      <nav className="space-y-4">
        {isAuthenticated ? (
          <>
            <Link href='/dashboard' onClick={onClose} className='block text-white'>
              Dashboard
            </Link>
            <Link href='/profile' onClick={onClose} className='block text-white'>
              Profile
            </Link>
            <button onClick={handleLogout} className='block text-white'>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href='/login' onClick={onClose} className='block text-white'>
              Login
            </Link>
            <Link href='/register' onClick={onClose} className='block text-white'>
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
