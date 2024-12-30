import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../utils/axios';
import ConfirmationModal from './modals/ConfirmationModal';
import { API_URL } from '../../config/config';

export default function GestionDesCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Disable scrolling when modal is open
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showForm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      alert('Une erreur est survenue lors du chargement des catégories.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formDataToSend, config);
        setModalConfig({
          isOpen: true,
          message: 'Catégorie mise à jour avec succès!',
          onConfirm: () => {
            setModalConfig({ isOpen: false, message: '', onConfirm: null });
            fetchCategories();
            resetForm();
          }
        });
      } else {
        await api.post('/categories', formDataToSend, config);
        setModalConfig({
          isOpen: true,
          message: 'Catégorie ajoutée avec succès!',
          onConfirm: () => {
            setModalConfig({ isOpen: false, message: '', onConfirm: null });
            fetchCategories();
            resetForm();
          }
        });
      }
    } catch (error) {
      setModalConfig({
        isOpen: true,
        message: error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement de la catégorie.",
        onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, logo: null });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      message: 'Êtes-vous sûr de vouloir supprimer cette catégorie ?',
      onConfirm: async () => {
        try {
          await api.delete(`/categories/${id}`);
          setModalConfig({
            isOpen: true,
            message: 'Catégorie supprimée avec succès!',
            onConfirm: () => {
              setModalConfig({ isOpen: false, message: '', onConfirm: null });
              fetchCategories();
            }
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            message: 'Une erreur est survenue lors de la suppression de la catégorie',
            onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
          });
        }
      }
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', logo: null });
    setError('');
  };

  // Cloudinary URL kontrolü için yardımcı fonksiyon
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    return imagePath.includes('cloudinary.com') ? imagePath : `${API_URL}${imagePath}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des catégories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          <span>Ajouter une nouvelle catégorie</span>
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-blue-600">Chargement des catégories...</p>}

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
          style={{ overflow: 'hidden' }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingCategory ? 'Modifier la catégorie' : 'Ajouter une nouvelle catégorie'}
              </h3>
              <button onClick={resetForm}>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  onChange={(e) => setFormData({ ...formData, logo: e.target.files[0] })}
                  className="mt-1 block w-full"
                  accept="image/*"
                />
                {formData.logo && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(formData.logo)}
                      alt="Logo preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                  </div>
                )}
                {editingCategory && editingCategory.logo && !formData.logo && (
                  <div className="mt-2">
                    <img
                      src={`${API_URL}${editingCategory.logo}`}
                      alt="Logo actuel"
                      className="h-20 w-20 object-cover rounded"
                    />
                    <p className="text-sm text-gray-500 mt-1">Logo actuel</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingCategory ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                  Logo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Nom
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky right-0 bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                    {category.logo && (
                      <img
                        src={getImageUrl(category.logo)}
                        alt={category.name}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        message={modalConfig.message}
        onConfirm={() => modalConfig.onConfirm?.()}
        onCancel={() => setModalConfig({ isOpen: false, message: '', onConfirm: null })}
      />
    </div>
  );
}
