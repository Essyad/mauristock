import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, FiBox, FiGrid, FiLogOut, FiMenu, FiX, FiChevronDown, FiFramer, FiList
} from 'react-icons/fi';

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: FiHome, label: 'Tableau de bord' },
    { path: '/admin/products', icon: FiBox, label: 'Produits' },
    { path: '/admin/categories', icon: FiGrid, label: 'Catégories' },
    { path: '/admin/subcategories', icon: FiList, label: 'Sous-catégories' },
    { path: '/admin/companies', icon: FiFramer, label: 'Entreprises' },
    { path: '/admin/discounts', icon: FiBox, label: 'Remises' } // New menu item
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="text-xl font-bold text-white">Tableau de bord</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-all duration-200`}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <div className="mr-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Tableau de bord'}
                </h2>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center">
                  <span className="text-sm font-medium">A</span>
                </div>
                <span className="text-gray-700">Administrateur</span>
                <FiChevronDown className={`transform transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {isProfileOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut />
                    <span>Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
