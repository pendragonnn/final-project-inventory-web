"use client";
import ModalAddOutlet from "../Modal/Outlet/ModalAddOutlet";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import Outlet from "@/data/outlet/index";
import ModalEditOutlet from "../Modal/Outlet/ModalEditOutlet";

const TableOutlets = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [allData, setAllData] = useState([]);
  const size = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Outlet.getOutlet(currentPage, size);
        console.log("res", res);

        const allRes = await Outlet.getOutlet(1, res.data.totalItems);
        setAllData(allRes.data.data);
        setTotalPages(res.data.totalPages);
        setTotalItems(res.data.totalItems);
        setData(res.data.data);
      } catch (error) {
        console.log("Error fetching outlets:", error);
      }
    };

    fetchData(currentPage, update);
  }, [currentPage, update]);

  const handleAdd = async () => {
    const res = await Outlet.getOutlet(currentPage, size);
    setData(res.data.data);
    setTotalPages(res.data.totalPages);
    setTotalItems(res.data.totalItems);
    setCurrentPage(res.data.currentPage);
  };

  const handleEditData = async (updatedOutlet) => {
    setData((prevData) =>
      prevData.map((outlet) =>
        outlet.id === updatedOutlet?.id ? updatedOutlet : outlet
      )
    );
    const res = await Outlet.getOutlet();
    setData(res.data.data);
  };

  const handleEdit = async (id) => {
    try {
      const res = await Outlet.getOutletByid(id);
      const result = res.data;
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
          await Outlet.deleteOutlet(id);
          setData((prevData) => prevData.filter((outlet) => outlet.id !== id));
          Swal.fire({
            position: "bottom-end",
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            customClass: "swal-custom-delete",
          });
          const res = await Outlet.getOutlet(currentPage, size);
          setData(res.data.data);

          setTotalPages(res.data.totalPages);
          setTotalItems(res.data.totalItems);
          setCurrentPage(res.data.currentPage);

          if (
            res.data.totalItems % (size * res.data.totalPages) <= size &&
            currentPage > 1
          ) {
            paginationHandle(currentPage - 1);
          } else {
            paginationHandle(res.data.currentPage);
          }
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
    });
  };

  const paginationHandle = async (currentPage) => {
    setCurrentPage(currentPage);
  };

  const onPaginationNext = async (currentPage) => {
    setCurrentPage(currentPage + 1);
  };

  const onPaginationPrevious = async (currentPage) => {
    setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = searchTerm
    ? allData.filter(
        (outlet) =>
          outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          outlet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          outlet.phone.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="p-4 md:p-6 xl:p-9">
        <div className="flex justify-between items-center gap-5 xl:gap-7.5">
          <label
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
            <ModalAddOutlet
              name={"Add Outlet"}
              test={"add"}
              addToTable={handleAdd}
            />
          </label>

          {/* Kotak pencarian */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border dark:text-black bg-white border-dark rounded-md px-3 py-2 focus:outline-none focus:border-primary w-30 md:w-45 xl:w-80"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
          </div>
          {/* Akhir kotak pencarian */}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-bodydark text-left dark:bg-meta-4">
              <th className="min-w-[1px] py-4 px-4 font-medium text-black  dark:text-white xl:pl-11">
                #
              </th>
              <th className="min-w-[150px] py-4 px-4 font-medium text-black  dark:text-white xl:pl-11">
                Name
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Address
              </th>
              <th className="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white">
                Phone
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center text-xl font-bold italic py-4 text-danger"
                >
                  Data not found.
                </td>
              </tr>
            ) : (
              filteredData.map((outlet, key) => (
                <tr
                  key={key}
                  className={
                    key === filteredData.length - 1
                      ? ""
                      : "border-b border-stroke dark:border-strokedark"
                  }
                >
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    {currentPage === 1
                      ? key + 1
                      : (currentPage - 1) * size + key + 1}
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {outlet.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {outlet.address}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="dark:text-meta-3 text-black">
                      {outlet.phone}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <label
                        htmlFor="edit"
                        className="hover:text-primary cursor-pointer"
                        onClick={() => handleEdit(outlet.id)}
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
                        onClick={() => handleDelete(outlet.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="red"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            <ModalEditOutlet
              data={update}
              test={"edit"}
              addToTable={handleEditData}
            />
          </tbody>
        </table>
        <div className="items-center float-right">
          {currentPage !== 1 && !searchTerm && (
            <button
              className="btn btn-outline btn-default"
              onClick={() => onPaginationPrevious(currentPage)}
            >
              &laquo;
            </button>
          )}

          <div className="join m-2 ">
            {!searchTerm && (
              <>
                {currentPage > 1 && (
                  <button
                    key={currentPage - 1}
                    className="join-item btn btn-outline btn-default"
                    onClick={() =>
                      paginationHandle(currentPage - 1, totalPages)
                    }
                  >
                    {currentPage - 1}
                  </button>
                )}
                <button
                  key={currentPage}
                  className="join-item btn btn-outline btn-default btn-active btn-primary"
                  onClick={() => paginationHandle(currentPage, totalPages)}
                >
                  {currentPage}
                </button>
                {currentPage !== totalPages && (
                  <button
                    key={currentPage + 1}
                    className="join-item btn btn-outline btn-default"
                    onClick={() =>
                      paginationHandle(currentPage + 1, totalPages)
                    }
                  >
                    {currentPage + 1}
                  </button>
                )}
              </>
            )}
          </div>

          {currentPage !== totalPages && !searchTerm && (
            <button
              className="join-item btn btn-outline btn-default"
              onClick={() => onPaginationNext(currentPage)}
            >
              &raquo;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default TableOutlets;
