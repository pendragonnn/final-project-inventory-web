import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import UserData from "@/data/user/index";

const ModalEditUser = ({ data, test, addToTable }) => {
  const modalCheckbox = useRef(null);
  const [file, setFile] = useState(null);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData({
      ...formData,
      image_url: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const {
        role_id: newRole,
        full_name: newFullName,
        email: newEmail,
        password: newPassword,
      } = formData;

      const hasChanges =
        data?.data?.role_id !== newRole ||
        data?.data?.full_name !== newFullName ||
        data?.data?.email !== newEmail ||
        data?.data?.password !== newPassword;

      if (hasChanges) {
        const userResponse = await UserData.updateUser(data.data.id, {
          role_id: newRole,
          full_name: newFullName,
          email: newEmail,
          password: newPassword,
        });

        console.log(userResponse);
        console.log(data.data.id);
        Swal.fire({
          position: "bottom-end",
          icon: "success",
          title: userResponse.data.message,
          showConfirmButton: false,
          timer: 2000,
          customClass: "swal-custom",
        }).then(() => {
          addToTable(userResponse.data.data);
          modalCheckbox.current.checked = false;

          setFormData({
            role_id: "",
            full_name: "",
            email: "",
            password: "",
            image_url: null,
          });
          setFile(null);
          setFile(null);

          // Check if a new file is selected
          if (file) {
            // Create FormData to handle file upload
            const formData = new FormData();
            formData.append("role_id", newRole);
            formData.append("full_name", newFullName);
            formData.append("email", newEmail);
            formData.append("password", newPassword);
            formData.append("image_url", file);

            // Make a POST request to upload image for the user
            UserData.uploadImage(data?.data?.id, formData)
              .then(() => {
                addToTable(imageResponse.data.data);
                modalCheckbox.current.checked = false;
                document.getElementById("formId").reset();
                setFile(null);
                e.target.reset();
              })
              .catch((imageError) => {
                console.error("Image Upload Error:", imageError.message);
              });
          }
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
    } // Check if a new file is selected
    if (file) {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("role_id", e.target.role_id.value);
      formData.append("full_name", e.target.full_name.value);
      formData.append("email", e.target.email.value);
      formData.append("password", e.target.password.value);
      formData.append("image_url", file);

      // Make a POST request to upload image for the user
      const imageResponse = await UserData.uploadImage(
        data?.data?.id,
        formData
      );
      console.log(imageResponse);
      Swal.fire({
        position: "bottom-end",
        icon: "success",
        title: imageResponse.data.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      }).then(() => {
        addToTable(imageResponse.data.data);
        modalCheckbox.current.checked = false;
        document.getElementById("formId").reset();
        setFile(null);
        e.target.reset();
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
                Edit User
              </h3>
            </div>

            <form id="formId" action="#" onSubmit={handleSubmit}>
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
                    name="full_name"
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
                    placeholder="password"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                    hidden
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Profile Photo
                  </label>
                  {data?.data?.image_url && (
                    <div className="mb-3">
                      <img
                        src={`/uploads/user/${data.data.image_url}`}
                        alt="User Profile"
                        className="w-200 h-200 mb-2"
                      />
                      <p className="text-sm text-gray-500 dark:text-gray-300">
                        Photo is already uploaded. To replace it, choose a new
                        photo below.
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="image_url"
                    key={"user-photo"}
                    accept="image/*"
                    defaultValue={null}
                    onChange={handleFileChange}
                    className="w-full text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required={!data?.data?.image_url} // Make it required only if no existing image
                  />
                  {!data?.data?.image_url && (
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                      No photo uploaded. Please choose a photo.
                    </p>
                  )}
                </div>

                <input
                  type="submit"
                  value={"Update"}
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

export default ModalEditUser;
