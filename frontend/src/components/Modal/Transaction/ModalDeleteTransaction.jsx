import React from "react"

const ModalDeleteTransaction = ({ open, value, handleDelete }) => {
  // console.log(value)
  return (
    <>
      <label htmlFor={open} className="hover:text-primary cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
          />
        </svg>
      </label>

      <input type="checkbox" id={open} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box text-center">
          <h3 className="font-bold text-lg">Are You Sure delete item</h3>
          <p className="py-4">{value?.item_name}</p>
          <div className="modal-action flex justify-center">
            <label
              htmlFor={open}
              className="btn px-10 hover:bg-danger bg-meta-1 text-white"
              onClick={handleDelete}
            >
              Yes
            </label>
            <label
              htmlFor={open}
              className="btn px-10 hover:bg-body bg-bodydark2 text-white"
            >
              No
            </label>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalDeleteTransaction
