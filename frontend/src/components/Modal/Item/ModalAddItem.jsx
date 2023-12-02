import React from "react";
import Swal from "sweetalert2";

import { useRef, useState, useEffect } from "react";
import Item from "@/data/item/index";
import Category from "@/data/category/index";

const ModalItemAdd = ({ name, test, addToTable }) => {
  const modalCheckbox = useRef(null);
  const [dataItem, setDataItem] = useState([]);
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await Category.getCategory();
      const allRes = await Category.getCategory(1, res.data.totalItems);
      setDataItem(allRes.data.data);
    };

    fetchData();
  }, []);
  
 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const itemWithoutImage = {
        name: e.target.name.value,
        description: e.target.description.value,
        category_id: e.target.category_id.value,
        price: e.target.price.value,
        stock: e.target.stock.value,
      };

      const responsItem = await Item.addItem(itemWithoutImage);
      console.log(file);
      if (file) {
        // Pemeriksaan file yang dipilih
        const itemId = responsItem.data.data.id;

        const formData = new FormData();

        formData.append("image_url", file);

        const responsGambar = await Item.uploadItem(itemId, formData);

        console.log(responsGambar);
      }

      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: responsItem.data.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      }).then(() => {
        addToTable(responsItem.data.data);
        modalCheckbox.current.checked = false;
        document.getElementById("formId").reset();
      });
    } catch (e) {
      console.error(e.response);
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: e.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      });
    }
  };

  return (
    <>
      <label htmlFor={test} className="cursor-pointer">
        {name}
      </label>
      <input
        type="checkbox"
        id={test}
        ref={modalCheckbox}
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box bg-white dark:bg-boxdark">
          <label
            htmlFor={test}
            className="bg-[#F1F3FB] dark:bg-graydark dark:text-white w-9 h-9 rounded-full flex items-center justify-center float-right cursor-pointer text-xl text-[#6A718A] hover:text-primary"
          >
            x
          </label>
          <div className="rounded-sm bg-white dark:bg-boxdark">
            <div className=" py-4 px-6.5 ">
              <h3 className="font-medium text-black dark:text-white">
                Add new Item
              </h3>
            </div>

            <form id="formId" action="#" onSubmit={handleSubmit}>
              <div className="p-6.5 text-start">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter  name"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    description
                  </label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Enter description"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 text-black">Category</label>
                  <select
                    className="mt-3 mb-5 select select-bordered text-black  w-full border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    name="category_id"
                  >
                    <option value=""></option>
                    {dataItem.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                    // max={12}
                    // min={11}
                  />
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Enter Stock"
                   
                     className= "w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
                      
                   
                    required
                  />

                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Image
                  </label>
                  <input
                    type="file"
                    name="image_url"
                    enctype="multipart/form-data"
                    key={"item-photo"}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <input
                  type="submit"
                  value={"Add"}
                  className="flex w-full justify-center cursor-pointer rounded bg-primary p-3 font-medium text-gray"
                />
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalItemAdd;