import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi';
import api from '../../utils/axios';
import Select from 'react-select';
import ConfirmationModal from './modals/ConfirmationModal';
import { API_URL } from '../../config/config';

export default function GestionDesProduits() {
  const [products, setProducts] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    nom: '',
    description: '',
    picture: null,
    features: '',
    Company_id: '',
    categoriesa_id: [], 
    subcategories_id: [], 
    oldPrice: '' 
  });
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    message: '',
    onConfirm: null
  });

  useEffect(() => {
    fetchProducts();
    fetchCompanies();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des produits');
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des entreprises');
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

  const fetchSubcategories = async () => {
    try {
      const response = await api.get('/subcategories');
      setSubcategories(response.data);
    } catch (error) {
      alert('Une erreur est survenue lors du chargement des sous-catégories');
    }
  };

  const handleCategoryChange = async (selectedOptions) => {
    const selectedCategoryIds = selectedOptions.map(option => option.value); // Extract selected IDs
  
    setFormData({
      ...formData,
      categoriesa_id: selectedCategoryIds,
      subcategories_id: [], // Reset subcategories when categories change
    });
  
    if (selectedCategoryIds.length > 0) {
      try {
        // Fetch subcategories for all selected categories
        const response = await Promise.all(
          selectedCategoryIds.map(id => api.get(`/subcategories/by-category/${id}`))
        );
  
        // Combine all subcategories from the responses
        const combinedSubcategories = response
          .map(res => res.data)
          .flat(); // Flatten the array of subcategory lists
  
        setSubcategories(combinedSubcategories);
      } catch (error) {
        alert('Une erreur est survenue lors du chargement des sous-catégories');
      }
    } else {
      setSubcategories([]); // Clear subcategories if no category is selected
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      nom: '',
      description: '',
      picture: null,
      features: '',
      Company_id: '',
      categoriesa_id: [],
      subcategories_id: [],
      oldPrice: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      if (!formData.nom || !formData.Company_id || !formData.oldPrice) {
        setModalConfig({
          isOpen: true,
          message: 'Veuillez remplir tous les champs obligatoires',
          onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
        });
        return;
      }
  
      const formDataToSend = new FormData();
  
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('features', formData.features || '');
      formDataToSend.append('Company_id', formData.Company_id);
      formDataToSend.append('oldPrice', formData.oldPrice);
  
      // Append arrays properly
      formData.categoriesa_id.forEach((id) => formDataToSend.append('categoriesa_id[]', id));
      formData.subcategories_id.forEach((id) => formDataToSend.append('subcategories_id[]', id));
  
      if (formData.picture) {
        formDataToSend.append('picture', formData.picture);
      }
  
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
  
      let response;
      if (editingProduct) {
        response = await api.put(`/products/${editingProduct._id}`, formDataToSend, config);
      } else {
        response = await api.post('/products', formDataToSend, config);
      }
  
      if (response.status === 200 || response.status === 201) {
        setModalConfig({
          isOpen: true,
          message: response.data?.message || 'Produit enregistré avec succès',
          onConfirm: () => {
            setModalConfig({ isOpen: false, message: '', onConfirm: null });
            fetchProducts();
            resetForm();
          }
        });
      }
    } catch (error) {
      setModalConfig({
        isOpen: true,
        message: error.response?.data?.message || 'Une erreur est survenue lors de l\'enregistrement du produit',
        onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
      });
    }
  };    
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      type: product.type || '',
      nom: product.nom || '',
      description: product.description || '',
      features: product.features || '',
      Company_id: product.Company_id?._id || '',
      categoriesa_id: product.categoriesa_id?.map((cat) => cat._id) || [],
      subcategories_id: product.subcategories_id?.map((sub) => sub._id) || [],
      oldPrice: product.oldPrice || '',
      picture: null, // Allow updating the picture
    });
    setShowForm(true);
  };    

  const handleDelete = (id) => {
    setModalConfig({
      isOpen: true,
      message: 'Êtes-vous sûr de vouloir supprimer ce produit ?',
      onConfirm: async () => {
        try {
          await api.delete(`/products/${id}`);
          setModalConfig({
            isOpen: true,
            message: 'Produit supprimé avec succès!',
            onConfirm: () => {
              setModalConfig({ isOpen: false, message: '', onConfirm: null });
              fetchProducts();
            }
          });
        } catch (error) {
          setModalConfig({
            isOpen: true,
            message: 'Une erreur est survenue lors de la suppression du produit',
            onConfirm: () => setModalConfig({ isOpen: false, message: '', onConfirm: null })
          });
        }
      }
    });
  };

  const handleView = (product) => {
    setViewProduct(product);
  };

  const closeModal = () => {
    setViewProduct(null);
  };

  // Cloudinary URL kontrolü için yardımcı fonksiyon
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    return imagePath.includes('cloudinary.com') ? imagePath : `${API_URL}${imagePath}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestion des produits</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus />
          <span>Ajouter un nouveau produit</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-0 mx-auto p-5 w-full max-w-2xl">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
                </h3>
                <button onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}>
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prix original</label>
                    <input
                      type="number"
                      value={formData.oldPrice}
                      onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      onChange={(e) => setFormData({ ...formData, picture: e.target.files[0] })}
                      className="mt-1 block w-full"
                      accept="image/*"
                    />
                    {formData.picture && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(formData.picture)}
                          alt="Image preview"
                          className="h-20 w-20 object-cover rounded"
                        />
                      </div>
                    )}
                    {editingProduct && editingProduct.picture && !formData.picture && (
                      <div className="mt-2">
                        <img
                          src={`${API_URL}${editingProduct.picture}`}
                          alt="Image actuelle"
                          className="h-20 w-20 object-cover rounded"
                        />
                        <p className="text-sm text-gray-500 mt-1">Image actuelle</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                    <select
                      value={formData.Company_id}
                      onChange={(e) => {
                        setFormData({ ...formData, Company_id: e.target.value });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    >
                      <option value="">Choisir une entreprise</option>
                      {companies.map(company => (
                        <option key={company._id} value={company._id}>
                          {company.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Catégories</label>
                    <Select
                      isMulti
                      value={categories
                        .filter(cat => formData.categoriesa_id.includes(cat._id))
                        .map(cat => ({ value: cat._id, label: cat.name }))} // Map categories to react-select format
                      onChange={handleCategoryChange} // Use updated handleCategoryChange
                      options={categories.map(cat => ({ value: cat._id, label: cat.name }))}
                      className="mt-1 block w-full"
                      classNamePrefix="react-select"
                    />
                    {formData.categoriesa_id.length > 0 && (
                      <p className="mt-2 text-sm text-gray-700">
                        Sélectionné :{' '}
                        {categories
                          .filter(cat => formData.categoriesa_id.includes(cat._id))
                          .map(cat => cat.name)
                          .join(', ')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sous-catégories</label>
                    <Select
                      isMulti
                      value={subcategories
                        .filter(sub => formData.subcategories_id.includes(sub._id))
                        .map(sub => ({ value: sub._id, label: sub.name }))} // Map subcategories to react-select format
                      onChange={(selectedOptions) =>
                        setFormData({
                          ...formData,
                          subcategories_id: selectedOptions.map(option => option.value), // Update selected subcategories
                        })
                      }
                      options={subcategories.map(sub => ({ value: sub._id, label: sub.name }))}
                      className="mt-1 block w-full"
                      classNamePrefix="react-select"
                      isDisabled={formData.categoriesa_id.length === 0} // Disable if no category is selected
                    />
                    {formData.subcategories_id.length > 0 && (
                      <p className="mt-2 text-sm text-gray-700">
                        Sélectionné :{' '}
                        {subcategories
                          .filter(sub => formData.subcategories_id.includes(sub._id))
                          .map(sub => sub.name)
                          .join(', ')}
                      </p>
                    )}
                  </div>

                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingProduct ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{viewProduct.nom}</h3>
              <button onClick={closeModal}>
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <img
                  src={getImageUrl(viewProduct.picture)}
                  alt={viewProduct.nom}
                  className="w-full h-auto object-cover rounded"
                />
              </div>
              <div className="space-y-4">
                <table className="min-w-full">
                  <tbody>
                    <tr>
                      <td className="font-bold py-2">Description:</td>
                      <td>{viewProduct.description || 'Non défini'}</td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2">Prix original:</td>
                      <td>{viewProduct.oldPrice || 'Non défini'} €</td>
                    </tr>
                    {viewProduct.discountedPrice && (
                      <tr>
                        <td className="font-bold py-2">Prix réduit:</td>
                        <td>{viewProduct.discountedPrice} €</td>
                      </tr>
                    )}
                    <tr>
                      <td className="font-bold py-2">Entreprise:</td>
                      <td>{viewProduct.Company_id?.nom || 'Non défini'}</td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2">Catégories:</td>
                      <td>
                        {viewProduct.categoriesa_id?.map((category) => (
                          <span key={category._id} className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded">
                            {category.name}
                          </span>
                        )) || 'Non défini'}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-bold py-2">Sous-catégories:</td>
                      <td>
                        {viewProduct.subcategories_id?.map((subcategory) => (
                          <span key={subcategory._id} className="bg-green-100 text-green-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded">
                            {subcategory.name}
                          </span>
                        )) || 'Non défini'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">Image</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Prix original</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Sous-catégorie</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky right-0 bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white">
                    {product.picture && (
                      <img
                        src={getImageUrl(product.picture)}
                        alt={product.nom}
                        className="h-10 w-10 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.oldPrice || 'Non défini'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.Company_id?.nom || 'Non défini'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.categoriesa_id?.map((category) => (
                      <span
                        key={category._id}
                        className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded"
                      >
                        {category.name}
                      </span>
                    )) || 'Non défini'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.subcategories_id?.map((subcategory) => (
                      <span
                        key={subcategory._id}
                        className="bg-green-100 text-green-800 text-xs font-medium mr-1 px-2.5 py-0.5 rounded"
                      >
                        {subcategory.name}
                      </span>
                    )) || 'Non défini'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap sticky right-0 bg-white">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleView(product)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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
