"use client";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import ModalAddItem from "../Modal/Item/ModalAddItem";
import ModalEditItem from "../Modal/Item/ModalEditItem";
import Item from "@/data/item/index";
import item from "@/data/item/index";

const TableItems = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(null);
  const [image , setItemImageUrl] = useState(null)
  const [isModalOpen, setModalOpen] = useState(false);
  const [imageModal, setImageModalUrl] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [preventClose, setPreventClose] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      const res = await Item.getItem();
      setData(res.data.data);
      const image = await item.getItemImageUrl(imgUrl);
      setItemImageUrl(image.data.data);
    };

    fetchData();
  }, []);



  const handleAdd = async (newItem) => {
    const newData = await [...data, newItem];
    setData(newData);
    const res = await Item.getItem();
    setData(res.data.data);
  };

  const handleEditData = async (updateItem) => {
    let updatedData = [...data];

    // Mencari indeks objek yang ingin diperbarui berdasarkan suatu kriteria
    const indexToUpdate = await updatedData.findIndex(
      (item) => item.id === updateItem[0].id
    );

    updatedData[indexToUpdate] = updateItem[0];

    setData([...updatedData]);
    const res = await Item.getItem();
    setData(res.data.data);
  };


 

  const handleEdit = async (id) => {
    try {
      const res = await Item.getItemByid(id);
      const result = res.data;
      console.log(result);
      setUpdate(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
          await Item.deleteItem(id);
          setData((prevData) => prevData.filter((item) => item.id !== id));
          Swal.fire({
            position: "bottom-end",
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            customClass: "swal-custom-delete",
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
        console.log(e);
      }
    });
  };



  const openModal = (imageUrl) => {
    setModalOpen(true);
    setImageModalUrl(imageUrl);
   
  };

  const closeModal = () => {
    if (!preventClose) {
      setModalOpen(false);
    }
  };
  const handleImageClick = () => {
    // Prevent the modal from closing when clicking on the image
    setPreventClose(true);
  };
  // const handleZoom = (event) => {
   
  //   const delta = event.deltaY;
  //   const newZoomLevel = zoomLevel + (delta > 0 ? -0.1 : 0.1);

  //   // Limit the zoom level within a reasonable range
  //   if (newZoomLevel >= 0.5 && newZoomLevel <= 2) {
  //     setZoomLevel(newZoomLevel);
  //   }
  // };
  


  return (
    <>
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
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
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              <ModalAddItem
                name={"Add Item"}
                test={"add"}
                addToTable={handleAdd}
              />
            </a>
          </div>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-bodydark text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                name
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                description
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Category
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Price
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Stock
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Image
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white"></h5>
                  <p className="text-sm">{item.name}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item.description}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">
                    {item?.Category?.name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{item.price}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{item.stock}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <div className="p-2.5 xl:p-5"  onClick={() => openModal(item.image_url)}>
                    <img
                      src={`uploads/item/${item.image_url}`}
                      className="w-10 h-10 rounded-full"
                    />
                  </div>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    <label
                      htmlFor="edit"
                      className="hover:text-primary cursor-pointer"
                      onClick={() => handleEdit(item.id)}
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
                      onClick={() => handleDelete(item.id)}
                    >
                      <svg
                        className="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                        <path
                          d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                          fill=""
                        />
                        <path
                          d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                          fill=""
                        />
                        <path
                          d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <ModalEditItem
              data={update}
              test={"edit"}
              addToTable={handleEditData}
            />
          </tbody>
        </table>
      </div>


    </div>

    {isModalOpen && (
        <div className="fixed inset-0 w-full min-w-full md:w-full bg-black bg-opacity-50 flex items-center justify-center "  >
          <div className="fixed bg-white w-[50rem] h-[30rem] rounded shadow-md" 

         
          
         >
          <div className="p-0">
          <button className="absolute z-999 ml-[90%] mt-3 btn border-white px-6 py-2 bg-white border-none text-black2 shadow-8 " onClick={closeModal}>

         <span className="font-bold text-lg">X</span>
          </button>
            
          </div>
          <img  
                      src={`uploads/item/${imageModal}`}
                      className="w-full h-full object-contain "
                      
                    />
          </div>
          
        </div>
      )}
    </>
  );
};
export default TableItems;
