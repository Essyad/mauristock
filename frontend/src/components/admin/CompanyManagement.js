import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import Select from 'react-select';
import api from '../../utils/axios';
import ConfirmationModal from './modals/ConfirmationModal';
import { API_URL } from '../../config/config';

export default function GestionDesEntreprises() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    logo: null,
    categories_id: [],
    subcategories_id: [],
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    fetchCompanies();
    fetchCategories();
  }, []);

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des entreprises');
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des catégories');
    }
  };

  // Fetch Subcategories by Category
  const fetchSubcategories = async (categoryIds) => {
    try {
      const response = await Promise.all(
        categoryIds.map((id) => api.get(`/subcategories/by-category/${id}`))
      );
      const combinedSubcategories = response.map((res) => res.data).flat();
      setSubcategories(combinedSubcategories);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des sous-catégories');
    }
  };

  const handleCategoryChange = (selectedOptions) => {
    const selectedCategoryIds = selectedOptions.map((option) => option.value);
    setFormData({
      ...formData,
      categories_id: selectedCategoryIds,
      subcategories_id: [], // Reset subcategories when categories change
    });
    fetchSubcategories(selectedCategoryIds);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }

      formData.categories_id.forEach((id) =>
        formDataToSend.append('categories_id[]', id)
      );
      formData.subcategories_id.forEach((id) =>
        formDataToSend.append('subcategories_id[]', id)
      );

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingCompany) {
        await api.put(`/companies/${editingCompany._id}`, formDataToSend, config);
        setModalConfig({
          isOpen: true,
          message: 'Entreprise mise à jour avec succès!',
          onConfirm: () => {
            setModalConfig({ isOpen: false, message: '', onConfirm: null });
            fetchCompanies();
            resetForm();
          }
        });
      } else {
        await api.post('/companies', formDataToSend, config);
        setModalConfig({
          isOpen: true,
          message: 'Entreprise ajoutée avec succès!',
          onConfirm: () => {
            setModalConfig({ isOpen: false, message: '', onConfirm: null });
            fetchCompanies();
            resetForm();
          }
        });
      }
    } catch (error) {
      setModalConfig({
        isOpen: true,
        message: "Une erreur est survenue lors de l'enregistrement de l'entreprise",
        onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
      });
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingCompany(null);
    setFormData({
      nom: '',
      logo: null,
      categories_id: [],
      subcategories_id: [],
    });
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      nom: company.nom,
      categories_id: company.categories_id?.map((category) => category._id) || [],
      subcategories_id:
        company.subcategories_id?.map((subcategory) => subcategory._id) || [],
    });
    fetchSubcategories(
      company.categories_id?.map((category) => category._id) || []
    );
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      message: 'Êtes-vous sûr de vouloir supprimer cette entreprise ?',
      onConfirm: async () => {
        try {
          await api.delete(`/companies/${id}`);
          setModalConfig({
            isOpen: true,
            message: 'Entreprise supprimée avec succès!',
            onConfirm: () => {
              setModalConfig({ isOpen: false, message: '', onConfirm: null });
              fetchCompanies();
            }
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            message: 'Une erreur est survenue lors de la suppression de l\'entreprise',
            onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
          });
        }
      }
    });
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
        <h2 className="text-2xl font-bold text-gray-800">Gestion des entreprises</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          <span>Ajouter une nouvelle entreprise</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingCompany
                  ? 'Modifier l\'entreprise'
                  : 'Ajouter une nouvelle entreprise'}
              </h3>
              <button onClick={resetForm}>
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.files[0] })
                  }
                  className="mt-1 block w-full"
                  accept="image/*"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Catégories</label>
                <Select
                  isMulti
                  value={categories
                    .filter((cat) => formData.categories_id.includes(cat._id))
                    .map((cat) => ({ value: cat._id, label: cat.name }))}
                  onChange={handleCategoryChange}
                  options={categories.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  }))}
                  className="mt-1 block w-full"
                  classNamePrefix="react-select"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sous-catégories
                </label>
                <Select
                  isMulti
                  value={subcategories
                    .filter((sub) =>
                      formData.subcategories_id.includes(sub._id)
                    )
                    .map((sub) => ({ value: sub._id, label: sub.name }))}
                  onChange={(selectedOptions) =>
                    setFormData({
                      ...formData,
                      subcategories_id: selectedOptions.map(
                        (option) => option.value
                      ),
                    })
                  }
                  options={subcategories.map((sub) => ({
                    value: sub._id,
                    label: sub.name,
                  }))}
                  className="mt-1 block w-full"
                  classNamePrefix="react-select"
                  isDisabled={formData.categories_id.length === 0}
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
                  {editingCompany ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Companies Table */}
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Catégories
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Sous-catégories
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky right-0 bg-gray-50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company._id}>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                    {company.logo && (
                      <img
                        src={getImageUrl(company.logo)}
                        alt={company.nom}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.categories_id?.map((category) => (
                      <span
                        key={category._id}
                        className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded"
                      >
                        {category.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.subcategories_id?.map((subcategory) => (
                      <span
                        key={subcategory._id}
                        className="bg-green-100 text-green-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded"
                      >
                        {subcategory.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(company)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
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
