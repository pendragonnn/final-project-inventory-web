// import React from "react";
// import Swal from "sweetalert2";
// import axios from "axios";
// import { useRef } from "react";

// const ModalEditUser = ({ data, test, addToTable }) => {
//   const modalCheckbox = useRef(null);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         const res = await axios.put(`http://localhost:8000/user/${data.id}`, {
//           role_id: e.target.role_id.value,
//           full_name: e.target.full_name.value,
//           email: e.target.email.value,
//           password: e.target.password.value,
//         });

//       Swal.fire({
//         position: "bottom-end",
//         icon: "success",
//         title: res.data.message,
//         showConfirmButton: false,
//         timer: 2000,
//         customClass: "swal-custom",
//       }).then(() => {
//         addToTable(res.data.data);
//         modalCheckbox.current.checked = false;
//       });
//     } catch (e) {
//       Swal.fire({
//         position: "bottom-end",
//         icon: "error",
//         title: e.message,
//         showConfirmButton: false,
//         timer: 2000,
//         customClass: "swal-custom",
//       });
//     }
//   };

//   console.log(data);

//   return (
//     <>
//       <input
//         type="checkbox"
//         ref={modalCheckbox}
//         id={test}
//         className="modal-toggle"
//       />
//       <div className="modal" role="dialog">
//         <div className="modal-box bg-white dark:bg-boxdark">
//           <label
//             htmlFor={test}
//             className="bg-[#F1F3FB] dark:bg-graydark dark:text-white w-9 h-9 rounded-full flex items-center justify-center float-right cursor-pointer text-xl text-[#6A718A] hover:text-primary"
//           >
//             x
//           </label>
//           <div className="rounded-sm bg-white dark:bg-boxdark">
//             <div className=" py-4 px-6.5 ">
//               <h3 className="font-medium text-black dark:text-white">
//                 Edit data User
//               </h3>
//             </div>

//             <form action="#" onSubmit={handleSubmit}>
//               <div className="p-6.5 text-start">
//                 <div className="mb-4.5">
//                   <label className="block text-black dark:text-white">
//                     Role
//                   </label>

//                   <label
//                     for="countries"
//                     class="block  text-sm font-medium text-gray-900 dark:text-white"
//                   >
//                     Select an option
//                   </label>
//                   <select
//                     className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                     defaultValue={data?.role_id}
//                     name="role_id"
//                   >
//                     <option selected>Choose a role</option>
//                     <option value="1">Admin</option>
//                     <option value="2">Staff</option>
//                     <option value="3">Manager</option>
//                   </select>
//                 </div>

//                 <div className="mb-4.5">
//                   <label className="mb-2.5 block text-black dark:text-white">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     name="full_name"
//                     defaultValue={data?.full_name}
//                     placeholder="Enter full name"
//                     className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                     required
//                   />
//                 </div>

//                 <div className="mb-4.5">
//                   <label className="mb-2.5 block text-black dark:text-white">
//                     Email
//                   </label>
//                   <input
//                     type="text"
//                     name="email"
//                     defaultValue={data?.email}
//                     placeholder="Enter Email"
//                     className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                     required
//                   />
//                 </div>

//                 <div className="mb-4.5">
//                   <label className="mb-2.5 block text-black dark:text-white">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     defaultValue={data?.password}
//                     placeholder="Enter password"
//                     className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                     disabled
//                   />
//                 </div>

//                 <input
//                   type="file"
//                   name="image_url"
//                   accept="image/*"
//                   className="w-full text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                 />

//                 <input
//                   type="submit"
//                   value={"Add"}
//                   className="flex w-full justify-center rounded cursor-pointer bg-primary p-3 font-medium text-gray"
//                 />
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ModalEditUser;

// import React, { useRef, useState } from "react";
// import Swal from "sweetalert2";
// import axios from "axios";

// const ModalEditUser = ({ data, test, addToTable }) => {
//   const modalCheckbox = useRef(null);
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Create user without image first
//       const userWithoutImage = {
//         role_id: e.target.role_id.value,
//         full_name: e.target.full_name.value,
//         email: e.target.email.value,
//         password: e.target.password.value,
//       };

//       // Make a PUT request to create or update user without image
//       const userResponse = await axios.put(
//         `http://localhost:8000/user/${data?.id}`,
//         userWithoutImage
//       );

//       // Retrieve user ID from the response
//       const userId = userResponse.data.data.id;
//       console.log(userId);
//       console.log(data.id);
//       // Create FormData to handle file upload
//       const formData = new FormData();
//       formData.append("role_id", e.target.role_id.value);
//       formData.append("full_name", e.target.full_name.value);
//       formData.append("email", e.target.email.value);
//       formData.append("password", e.target.password.value);
//       formData.append("image_url", file);

//       // Make a PUT request to upload image for the user
//       const imageResponse = await axios.post(
//         `http://localhost:8000/user/upload/${data.id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       console.log(imageResponse);

//       Swal.fire({
//         position: "bottom-end",
//         icon: "success",
//         title: imageResponse.data.message,
//         showConfirmButton: false,
//         timer: 2000,
//         customClass: "swal-custom",
//       }).then(() => {
//         addToTable(imageResponse.data.data);
//         modalCheckbox.current.checked = false;
//       });
//     } catch (error) {
//       console.error("Error:", error.message);
//       Swal.fire({
//         position: "bottom-end",
//         icon: "error",
//         title: error.message,
//         showConfirmButton: false,
//         timer: 2000,
//         customClass: "swal-custom",
//       });
//     }
//   };

//   return (
//     <>
//      <input
//         type="checkbox"
//         ref={modalCheckbox}
//         id={test}
//         className="modal-toggle"
//       />
//       <div className="modal" role="dialog">
//         <div className="modal-box bg-white dark:bg-boxdark">
//           <label
//             htmlFor={test}
//             className="bg-[#F1F3FB] dark:bg-graydark dark:text-white w-9 h-9 rounded-full flex items-center justify-center float-right cursor-pointer text-xl text-[#6A718A] hover:text-primary"
//           >
//             x
//           </label>
//             <div className="rounded-sm bg-white dark:bg-boxdark">
//               <div className=" py-4 px-6.5 ">
//                 <h3 className="font-medium text-black dark:text-white">
//                   Edit User
//                 </h3>
//               </div>

//               <form action="#" onSubmit={handleSubmit}>
//                 <div className="p-6.5 text-start">
//                   <div className="mb-4.5">
//                     <label className="block text-black dark:text-white">
//                       Role
//                     </label>
//                     <label
//                       htmlFor="countries"
//                       className="block  text-sm font-medium text-gray-900 dark:text-white"
//                     >
//                       Select an option
//                     </label>
//                     <select
//                       className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                       name="role_id"
//                       defaultValue={data?.role_id}
//                     >
//                       <option value="1">Admin</option>
//                       <option value="2">Staff</option>
//                       <option value="3">Manager</option>
//                     </select>
//                   </div>

//                   <div className="mb-4.5">
//                     <label className="mb-2.5 block text-black dark:text-white">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       name="full_name"
//                       defaultValue={data?.full_name}
//                       placeholder="Enter full name"
//                       className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                       required
//                     />
//                   </div>

//                   <div className="mb-4.5">
//                     <label className="mb-2.5 block text-black dark:text-white">
//                       Email
//                     </label>
//                     <input
//                       type="text"
//                       name="email"
//                       defaultValue={data?.email}
//                       placeholder="Enter Email"
//                       className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                       required
//                     />
//                   </div>

//                   <div className="mb-4.5">
//                     <label className="mb-2.5 block text-black dark:text-white">
//                       Password
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       defaultValue={data?.password}
//                       placeholder="Enter password"
//                       className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                       required
//                       disabled
//                     />
//                   </div>

//                   <div className="mb-4.5">
//                     <label className="mb-2.5 block text-black dark:text-white">
//                       Profile Photo
//                     </label>
//                     <input
//                       type="file"
//                       name="image_url"
//                       defaultValue={data?.image_url}
//                       key={"user-photo"}
//                       accept="image/*"
//                       onChange={handleFileChange}
//                       className="w-full text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
//                       required
//                     />
//                   </div>

//                   <input
//                     type="submit"
//                     value={"Update"}
//                     className="flex w-full justify-center rounded cursor-pointer bg-primary p-3 font-medium text-gray"
//                   />
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
      
//     </>
//   );
// };

// export default ModalEditUser;


import Swal from "sweetalert2";
import { React,useRef, useEffect, useState } from "react";
import user from "@/data/user/index";

const ModalEditItem = ({ data, test, addToTable }) => {
  const {modalCheckbox,fileInputRef} = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await user.updateUser(data.id, {
        role_id: e.target.role_id.value,
        full_name: e.target.full_name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        image_url: e.target.image_url.value,
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




  useEffect(() => {
    if (user.image_url) {
      const file = new File([], user.image_url, { type: 'image/*' });
      setSelectedImage(URL.createObjectURL(file));
      fileInputRef.current.value = '';
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
                    defaultValue={data?.full_name}
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
                    defaultValue={data?.email}
                    placeholder="Enter Email"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    defaultValue={data?.password}
                    placeholder="Enter password"
                    className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                    minLength={8}
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
                   {selectedImage && <img src={selectedImage} alt="Selected Image" />}
                </div>

                <input
                  type="submit"
                  value={"Edit"}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalEditItem ;

