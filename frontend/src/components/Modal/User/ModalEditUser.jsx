import Swal from "sweetalert2";
import React from "react";
import { useRef, useEffect, useState } from "react";
import user from "@/data/user/index";

const ModalEditItem = ({ data, test, addToTable }) => {
  const modalCheckbox = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    role_id: data?.data?.role_id || "",
    full_name: data?.data?.full_name || "",
    email: data?.data?.email || "",
    password: data?.data?.password || "",
    image_url: data?.data?.image_url || "",
  });

  useEffect(() => {
    setFormData({
      role_id: data?.data?.role_id || "",
      full_name: data?.data?.full_name || "",
      email: data?.data?.email || "",
      password: data?.data?.password || "",
      image_url: data?.data?.image_url || "",
    });
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        role_id: newRole,
        full_name: newFullName,
        email: newEmail,
        password: newPassword,
        image_url: newImageUrl,
      } = formData;
      if (
        data?.data?.role_id !== newRole ||
        data?.data?.full_name !== newFullName ||
        data?.data?.email !== newEmail ||
        data?.data?.password !== newPassword ||
        data?.data?.image_url !== newImageUrl
      ) {
        const res = await user.updateUser(data.id, {
          role_id: newRole,
          full_name: newFullName,
          email: newEmail,
          password: newPassword,
          image_url: newImageUrl,
        });
        console.log(res);

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

          setFormData({
            role_id: "",
            full_name: "",
            email: "",
            password: "",
            image_url: "",
          });
        });
      }
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

  useEffect(() => {
    if (user.image_url) {
      const file = new File([], user.image_url, { type: "image/*" });
      setSelectedImage(URL.createObjectURL(file));
      fileInputRef.current.value = "";
    }
  }, [user]);

  function handleImageUpload(event) {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  }

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
                  <label className="block text-black dark:text-white">
                    Role
                  </label>

                  <label
                    htmlFor="countries"
                    className="block  text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select an option
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    name="role_id"
                    value={formData.role_id}
                    onChange={(e) =>
                      setFormData({ ...formData, role_id: e.target.value })
                    }
                  >
                    <option value="1">Admin</option>
                    <option value="2">Staff</option>
                    <option value="3">Manager</option>
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter Email"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter password"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                    minLength={8}
                    hidden
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
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    // max={12}
                    // min={11}
                  />
                  {selectedImage && (
                    <img src={selectedImage} alt="Selected Image" />
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
