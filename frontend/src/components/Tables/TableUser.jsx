"use client";
import ModalUserAdd from "../Modal/user/ModalAddUser";
import ModalEditUser from "../Modal/User/ModalEditUser";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import UserData from "@/data/user/index";

const TableUser = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(null);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await UserData.getUsers();
      setData(res.data.data);
    };

    fetchData();
  }, []);

  const handleAdd = (newUser) => {
    const newData = [...data, newUser];
    setData(newData);
  };

  const handleEditData = (updatedUser) => {
    let updatedData = [...data];

    // Mencari indeks objek yang ingin diperbarui berdasarkan suatu kriteria
    const indexToUpdate = updatedData.findIndex(
      (user) => user.id === updatedUser[0].id
    );

    updatedData[indexToUpdate] = updatedUser[0];

    setData([...updatedData]);
  };

  const handleEdit = async (id) => {
    const res = await UserData.getUserById(id);
    setUpdate(res.data.data);
    console.log(id);
    setEditUserId(id);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await UserData.deleteUser(id);
          setData((prevData) => prevData.filter((user) => user.id !== id));
          Swal.fire({
            position: "bottom-end",
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            customClass: "swal-custom-delete",
            timer: 2000,
          });
        }
      } catch (e) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: e.message,
          showConfirmButton: false,
          timer: 2000,
          customclassName: "swal-custom",
        });
      }
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Top Channels
      </h4>

      <div className="p-4 md:p-6 xl:p-9">
        <div className="flex flex-wrap gap-5 xl:gap-7.5">
          <a
            type="submit"
            className="inline-flex items-center justify-center gap-2.5 cursor-pointer bg-primary py-4 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-6"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <ModalUserAdd
              name={"Add User"}
              test={"add"}
              addToTable={handleAdd}
            />
          </a>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Profile
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Role Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Name
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Action
            </h5>
          </div>
        </div>

        {data.map((user, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === data.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="p-2.5 xl:p-5">
              <img
                // src={UserData.getUserImageUrl(imageUrl)}
                className="w-10 h-10 rounded-full"
              />
            </div>

            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0"></div>
              <p className="hidden text-black dark:text-white sm:block">
                {user?.Role?.name}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{user.full_name}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{user.email}</p>
            </div>

            <div className="flex gap-2 items-center justify-center p-2.5 xl:p-5">
              <label
                htmlFor="edit"
                className="hover:text-primary cursor-pointer"
                onClick={() => handleEdit(user.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </label>

              <button
                className="hover:text-primary"
                onClick={() => handleDelete(user.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
        <ModalEditUser
          data={update}
          test={"edit"}
          addToTable={handleEditData}
        />
      </div>
    </div>
  );
};
export default TableUser;

// TableUser.js
// import ModalUserAdd from "../Modal/User/ModalAddUser";
// import ModalEditUser from "../Modal/User/ModalEditUser";
// import Swal from "sweetalert2";
// import { useEffect, useState } from "react";
// import UserData from "@/data/user";

// const TableUser = () => {
//   const [data, setData] = useState([]);
//   const [update, setUpdate] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await UserData.getUsers();
//       setData(res.data.data);
//     };

//     fetchData();
//   }, []);

//   const handleAdd = async (newUser) => {
//     try {
//       const res = await UserData.addUser(newUser);
//       setData((prevData) => [...prevData, res.data]);
//       // You may also handle errors here
//     } catch (error) {
//       console.error("Error adding user:", error);
//     }
//   };

//   const handleEditData = async (updatedUser) => {
//     try {
//       const res = await UserData.updateUser(updatedUser.id, updatedUser);
//       setData((prevData) =>
//         prevData.map((user) => (user.id === res.data.id ? res.data : user))
//       );
//     } catch (error) {
//       console.error("Error updating user:", error);
//     }
//   };

//   const handleEdit = async (id) => {
//     try {
//       const res = await UserData.getUserById(id);
//       setUpdate(res.data.data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       try {
//         if (result.isConfirmed) {
//           await UserData.deleteUser(id);
//           setData((prevData) => prevData.filter((user) => user.id !== id));
//           Swal.fire({
//             title: "Deleted!",
//             text: "Your file has been deleted.",
//             icon: "success",
//           });
//         }
//       } catch (e) {
//         Swal.fire({
//           position: "bottom-end",
//           icon: "error",
//           title: e.message,
//           showConfirmButton: false,
//           timer: 2000,
//           customclassName: "swal-custom",
//         });
//       }
//     });
//   };

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
//         Top Channels
//       </h4>

//       <div className="p-4 md:p-6 xl:p-9">
//         <div className="flex flex-wrap gap-5 xl:gap-7.5">
//           <a
//             type="submit"
//             className="inline-flex items-center justify-center gap-2.5 cursor-pointer bg-primary py-4 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-6"
//           >
//             <span>
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="w-6 h-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//             </span>
//             <ModalUserAdd
//               name={"Add User"}
//               test={"add"}
//               addToTable={handleAdd}
//             />
//           </a>
//         </div>
//       </div>

//       <div className="flex flex-col">
//         <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
//           <div className="p-2.5 xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Profile
//             </h5>
//           </div>
//           <div className="p-2.5 xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Role Name
//             </h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Name
//             </h5>
//           </div>
//           <div className="p-2.5 text-center xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Email
//             </h5>
//           </div>
//           <div className="hidden p-2.5 text-center sm:block xl:p-5">
//             <h5 className="text-sm font-medium uppercase xsm:text-base">
//               Action
//             </h5>
//           </div>
//         </div>

//         {data.map((user, key) => (
//           <div
//             className={`grid grid-cols-3 sm:grid-cols-5 ${
//               key === data.length - 1
//                 ? ""
//                 : "border-b border-stroke dark:border-strokedark"
//             }`}
//             key={key}
//           >
//             <div className="p-2.5 xl:p-5">
//                 <img
//                   src={`http://localhost:8000/user/upload/${user.image_url}`}

//                   className="w-10 h-10 rounded-full"
//                 />
//               </div>

//             <div className="flex items-center gap-3 p-2.5 xl:p-5">
//               <div className="flex-shrink-0">
//               </div>
//               <p className="hidden text-black dark:text-white sm:block">
//                 {user?.Role?.name}
//               </p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-black dark:text-white">{user.full_name}</p>
//             </div>

//             <div className="flex items-center justify-center p-2.5 xl:p-5">
//               <p className="text-meta-3">{user.email}</p>
//             </div>

//             <div className="flex gap-2 items-center justify-center p-2.5 xl:p-5">
//             <label
//                 htmlFor="edit"
//                 className="hover:text-primary cursor-pointer"
//                 onClick={() => handleEdit(user.id)}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke-width="1.5"
//                   stroke="currentColor"
//                   class="w-6 h-6"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
//                   />
//                 </svg>
//               </label>

//               <button
//                 className="hover:text-primary"
//                 onClick={() => handleDelete(user.id)}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   strokeWidth="1.5"
//                   stroke="currentColor"
//                   className="w-6 h-6"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         ))}
//         <ModalEditUser
//           data={update}
//           test={"edit"}
//           addToTable={handleEditData}
//         />
//       </div>
//     </div>
//   );
// };
// export default TableUser;
