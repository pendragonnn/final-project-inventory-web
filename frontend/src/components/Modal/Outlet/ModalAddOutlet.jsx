import React from "react";
import Swal from "sweetalert2";
import Outlet from "@/data/outlet/index";
import { useRef, useState } from "react";

const ModalOutletAdd = ({ name, test, addToTable }) => {
  const modalCheckbox = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Outlet.addOutlet({
        name: e.target.name.value,
        address: e.target.address.value,
        phone: e.target.phone.value,
      });
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      }).then(() => {
        addToTable(res.data.data);
        modalCheckbox.current.checked = false;

        document.getElementById("formId").reset();
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
                Add new Outlet
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
                    placeholder="Enter phone number"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                    // max={12}
                    // min={11}
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

export default ModalOutletAdd;
