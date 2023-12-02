import Swal from "sweetalert2";
import React from "react";
import { useRef, useEffect, useState } from "react";
import Category from "@/data/category/index";

import Item from "@/data/item/index";

const ModalEditItem = ({ data, test, addToTable }) => {
  const modalCheckbox = useRef(null);
  const [dataItem, setDataItem] = useState([]);
  const [file, setFile] = useState(null);




  const [formData, setFormData] = useState({
    name: data?.data?.name || "",
    description: data?.data?.description || "",
    category_id: data?.data?.category_id || "",
    price: data?.data?.price || "",
    stock: data?.data?.stock || "",
    image_url: data?.data?.image_url || "",
  });

  useEffect(() => {
    setFormData({
      name: data?.data?.name || "",
      description: data?.data?.description || "",
      category_id: data?.data?.category_id || "",
      price: data?.data?.price || "",
      stock: data?.data?.stock || "",
      image_url: data?.data?.image_url || "",
    });
  }, [data]);

  const handleStockChange = (e) => {
  const newStock = e.target.value;
  setFormData((prevData) => ({
    ...prevData,
    stock: newStock,
  }));
};

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
      const {
        name: newName,
        description: newDescription,
        category_id: newcategory_id,
        price: newPrice,
        stock: newStock,
        image_url: newImageUrl,
      } = formData;
      if (
        data?.data?.name !== newName ||
        data?.data?.description !== newDescription ||
        data?.data?.category_id !== newcategory_id ||
        data?.data?.price !== newPrice ||
        data?.data?.stock !== newStock ||
        data?.data?.image_url !== newImageUrl
      ) {
        const itemResponse = await Item.updateItem(data.data.id, {
          name: newName,
          description: newDescription,
          category_id: newcategory_id,
          price: newPrice,
          stock: newStock,
          image_url: newImageUrl,
        });

        console.log(itemResponse);
        console.log(data.data.id);
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: itemResponse.data.message || imageResponse,
          showConfirmButton: false,
          timer: 2000,
          customClass: "swal-custom",
        }).then(() => {
          addToTable(itemResponse.data.data);
          modalCheckbox.current.checked = false;

          setFormData({
            name: "",
            description: "",
            category_id: "",
            price: "",
            stock: "",
            image_url: "",
          });
        });
      }
    } catch (error) {
      console.error("Error:", error.message);

      let errorMessage = "An error occurred. Please try again."; // Default error message

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      });
    }

    // Check if a new file is selected
    if (file) {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", e.target.name.value);
      formData.append("description", e.target.description.value);
      formData.append("category_id", e.target.category_id.value);
      formData.append("price", e.target.price.value);
      formData.append("stock", e.target.stock.value);
      formData.append("image_url", file);

      // Make a POST request to upload image for the user
      const imageResponse = await Item.uploadItem(data?.data?.id, formData);
      console.log(imageResponse);
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: imageResponse.data.message,
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
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
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Category
                  </label>
                  {dataItem.length > 0 && (
                    <select
                      className="mt-3 mb-5 select select-bordered w-full border-stroke bg-transparent py-3 px-5 font-medium outline-none transition disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                      name="category_id"
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                    >
                    
                      {dataItem.map((value) => (
                        <option key={value.id} value={value.id}>
                          {value.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={formData.price}
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
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
                    onChange={handleStockChange}
                    value={formData.stock}
                
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
               
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Image
                  </label>
                  {data?.data?.image_url && (
                    <div className="mb-3">
                      <img
                        src={`/uploads/item/${data.data.image_url}`}
                        alt="Item Image"
                        className="w-200 h-200 mb-2"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        image is already uploaded. To replace it, choose a new
                        image below.
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="image_url"
                    placeholder="Enter Image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required={!data?.data?.image_url}
                  />
                  {!data?.data?.image_url && (
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                      No image uploaded. Please choose a photo.
                    </p>
                  )}
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
