import React from "react";
import Swal from "sweetalert2";
import Outlet from "@/data/outlet/index";
import { useRef, useState, useEffect } from "react";

const ModalEditOutlet = ({ data, test, addToTable }) => {
  const modalCheckbox = useRef(null);

  const [formData, setFormData] = useState({
    name: data?.data?.name || "",
    address: data?.data?.address || "",
    phone: data?.data?.phone || "",
  });

  useEffect(() => {
    setFormData({
      name: data?.data?.name || "",
      address: data?.data?.address || "",
      phone: data?.data?.phone || "",
    });
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name: newName, address: newAddress, phone: newPhone } = formData;

      if (
        data?.data?.name !== newName ||
        data?.data?.address !== newAddress ||
        data?.data?.phone !== newPhone
      ) {
        const res = await Outlet.updateOutlet(data.data.id, {
          name: newName,
          address: newAddress,
          phone: newPhone,
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

          setFormData({ name: "", address: "", phone: "" });
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
                Edit data Outlet
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
                    placeholder="Enter full name"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter address"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Phone
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] text-black dark:text-white  border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                    // max={12}
                    // min={11}
                  />
                </div>

                <input
                  type="submit"
                  value={"edit"}
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

export default ModalEditOutlet;
