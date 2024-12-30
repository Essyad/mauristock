import React from 'react';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message, title = 'Confirmation' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-lg">{message}</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 