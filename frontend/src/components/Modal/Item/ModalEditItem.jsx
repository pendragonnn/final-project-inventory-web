import Swal from "sweetalert2";
import React from "react";
import { useRef, useEffect, useState } from "react";
import Category from "@/data/category/index";

import Item from "@/data/item/index";

const ModalEditItem = ({ data, test, addToTable }) => {
  const modalCheckbox = useRef(null);
  const [dataItem, setDataItem] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await Category.getCategory();
      setDataItem(res.data.data);
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

      const responsItem = await Item.updateItem(data?.data?.id,itemWithoutImage);
      console.log(responsItem);
      console.log(responsItem);
     
      // Retrieve user ID from the response
      console.log(data.data.id);
      if (file) { 
        const itemId = responsItem.data.data.id;

        const formData = new FormData();

 
        formData.append("image_url", file);

        const responsGambar = await Item.uploadItem(data?.data?.id,formData);

      
      }     Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: responsItem.data.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      }).then(() => {
        addToTable(responsItem.data.data[1]);
        modalCheckbox.current.checked = false;
      });
    } catch (e) {
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
      <input
        type="checkbox"
        ref={modalCheckbox}
        id={test}
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
                Edit data Item
              </h3>
            </div>

            <form action="#" onSubmit={handleSubmit}>
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
                    defaultValue={data?.data?.name}
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
                    defaultValue={data?.data?.description}
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Category
                  </label>
                  <select
                    className="mt-3 mb-5 select select-bordered w-full border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                    name="category_id"
                    defaultValue={data?.data?.Category.name}
                  >
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
                    defaultValue={data?.data?.price}
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
                    defaultValue={data?.data?.stock}
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
                    placeholder="Enter Image"
                    accept="image/*"
                    defaultValue={data?.data?.image_url}
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onChange={handleFileChange}
                    required
                   
                  />
               
                </div>

                <input
                  type="submit"
                  value={"Edit"}
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

export default ModalEditItem; 
