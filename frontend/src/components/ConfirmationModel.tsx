import React from 'react';

interface ConfirmationModelProps {
    isOpen:boolean,
    onClose:() => void;
    onConfirm: () => void;
    title: string;
}


const ConfirmationModal = ({
    isOpen, onClose, onConfirm, title,
}:ConfirmationModelProps) => {

  if(!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div className="flex items-center justify-end">
        <button
          className=" mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
          onClick={onConfirm}
        >
           Delete
        </button>
      </div>
    </div>
  </div>
  )
}

export default ConfirmationModal