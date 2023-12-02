import React from 'react';

const ImageModal = ({ imageUrl, closeModal }) => {
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black opacity-75"></div>

    {/* Blur effect for the entire page */}
    <div className="absolute inset-0 bg-gray-500 opacity-75 backdrop-blur-lg"></div>
    
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div
        className="fixed inset-0 transition-opacity"
        aria-hidden="true"
        onClick={closeModal}
      >
        {/* Background overlay without blur */}
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span
        className="hidden sm:inline-block sm:align-middle sm:h-screen"
        aria-hidden="true"
      >
        &#8203;
      </span>

      <div className="inline-block align-bottom   dark:bg-boxdark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white  dark:bg-boxdark px-8 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-center sm:justify-center">
            <div className="flex-shrink-0 flex items-center justify-center h-100 w-100">
             
              <img
                className="h-full w-full "
                src={`/uploads/item/${imageUrl}`}
                alt="Image Item"
              />
            </div>
          </div>
        </div>
       
      </div>
    </div>
  </div>
  );
};

export default ImageModal;