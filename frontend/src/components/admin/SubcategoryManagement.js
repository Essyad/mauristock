import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import api from '../../utils/axios';
import ConfirmationModal from './modals/ConfirmationModal';

export default function GestionDesSousCategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categories_id: '',
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'unset'; // Enable scrolling
    }
  }, [showForm]);

  const fetchSubcategories = async () => {
    try {
      const response = await api.get('/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des sous-catégories');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des catégories');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categories_id: formData.categories_id || null,
      };

      if (editingSubcategory) {
        await api.put(`/subcategories/${editingSubcategory._id}`, payload);
        setModalConfig({
          isOpen: true,
          message: 'Sous-catégorie mise à jour avec succès!',
          onConfirm: () => {
            setModalConfig({ isOpen: false, message: '', onConfirm: null });
            fetchSubcategories();
            resetForm();
          }
        });
      } else {
        await api.post('/subcategories', payload);
        setModalConfig({
          isOpen: true,
          message: 'Sous-catégorie ajoutée avec succès!',
          onConfirm: () => {
            setModalConfig({ isOpen: false, message: '', onConfirm: null });
            fetchSubcategories();
            resetForm();
          }
        });
      }
    } catch (error) {
      setModalConfig({
        isOpen: true,
        message: 'Une erreur est survenue lors de l\'enregistrement de la sous-catégorie.',
        onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
      });
    }
  };

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name || '',
      categories_id: subcategory.categories_id?._id || subcategory.categories_id || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      message: 'Êtes-vous sûr de vouloir supprimer cette sous-catégorie ?',
      onConfirm: async () => {
        try {
          await api.delete(`/subcategories/${id}`);
          setModalConfig({
            isOpen: true,
            message: 'Sous-catégorie supprimée avec succès!',
            onConfirm: () => {
              setModalConfig({ isOpen: false, message: '', onConfirm: null });
              fetchSubcategories();
            }
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            message: 'Une erreur est survenue lors de la suppression de la sous-catégorie',
            onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
          });
        }
      }
    });
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingSubcategory(null);
    setFormData({ name: '', categories_id: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des sous-catégories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          <span>Ajouter une nouvelle sous-catégorie</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingSubcategory
                  ? 'Modifier la sous-catégorie'
                  : 'Ajouter une nouvelle sous-catégorie'}
              </h3>
              <button onClick={resetForm}>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Catégorie principale</label>
                <select
                  value={formData.categories_id}
                  onChange={(e) =>
                    setFormData({ ...formData, categories_id: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
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
                  {editingSubcategory ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 relative">
            <thead className="bg-gray-50 z-10 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                  Nom
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Catégorie principale
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky right-0 bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subcategories.map((subcategory) => (
                <tr key={subcategory._id}>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white z-0">
                    {subcategory.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {subcategory.categories_id?.name || 'Non défini'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white z-0">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(subcategory)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(subcategory._id)}
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
