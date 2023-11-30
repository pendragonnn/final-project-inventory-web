import React from "react";
import Swal from "sweetalert2";
import Category from "@/data/category/index";
import { useRef, useState, useEffect } from "react";

const ModalEditCategory = ({ data, test, addToTable }) => {
  const modalCheckbox = useRef(null);

  const [formData, setFormData] = useState({
    name: data?.data?.name || "",
  });

  useEffect(() => {
    setFormData({
      name: data?.data?.name || "",
    });
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name: newName } = formData;

      if (
        data?.data?.name !== newName
      ) {
        const res = await Category.updateCategory(data.data.id, {
          name: newName,
        });

        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: res.data.message,
          showConfirmButton: false,
          timer: 2000,
          customClass: "swal-custom",
        }).then(() => {
          addToTable(res.data.data[1]);
          modalCheckbox.current.checked = false;

          setFormData({ name: "" });
        });
      }
    } catch (e) {
      Swal.fire({
        position: "bottom-end",
        icon: "error",
        title: "Data is already",
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
                Edit data Category
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
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter Category Name"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <input
                  type="submit"
                  value={"edit"}
                  className="flex w-full justify-center rounded cursor-pointer bg-primary p-3 font-medium text-gray"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEditCategory;
