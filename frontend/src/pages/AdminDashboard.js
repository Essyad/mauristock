import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiShield, FiClock } from 'react-icons/fi';
import api from '../utils/axios';

export default function TableauDeBordAdmin() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    newUsername: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const expiryTime = tokenData.exp * 1000;

      const updateTimeLeft = () => {
        const now = Date.now();
        const remaining = expiryTime - now;

        if (remaining <= 0) {
          setTimeLeft('Session terminée');
          localStorage.removeItem('adminToken');
          window.location.href = '/';
        } else {
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft(`${hours} heures et ${minutes} minutes`);
        }
      };

      updateTimeLeft();
      const timer = setInterval(updateTimeLeft, 60000);
      return () => clearInterval(timer);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
      return;
    }

    try {
      const response = await api.post('/auth/update-admin', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        newUsername: formData.newUsername
      });

      setMessage({ type: 'success', text: 'Les données ont été mises à jour avec succès' });
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        newUsername: ''
      });

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour des données'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <FiClock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-blue-900">Temps de session restant</h3>
          <p className="text-blue-700">{timeLeft || 'Chargement...'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Paramètres de l'administrateur</h2>
        </div>
        
        <div className="p-6">
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <FiUser className="w-5 h-5" />
                  <span>Nouveau nom d'utilisateur</span>
                </label>
                <input
                  type="text"
                  name="newUsername"
                  value={formData.newUsername}
                  onChange={(e) => setFormData({...formData, newUsername: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Laissez vide si vous ne souhaitez pas changer"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <FiShield className="w-5 h-5" />
                  <span>Mot de passe actuel</span>
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <FiLock className="w-5 h-5" />
                  <span>Nouveau mot de passe</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Laissez vide si vous ne souhaitez pas changer"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-1">
                  <FiLock className="w-5 h-5" />
                  <span>Confirmer le nouveau mot de passe</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Laissez vide si vous ne souhaitez pas changer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FiShield className="w-5 h-5" />
              <span>Mettre à jour les données</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
