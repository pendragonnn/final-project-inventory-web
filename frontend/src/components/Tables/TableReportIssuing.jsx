const TableReportIsuing = ({
  formatDate,
  handleDelete,
  user,
  paginationHandle,
  onPaginationNext,
  onPaginationPrevious,
  currentPage,
  totalPages,
  searchTerm,
  handleSearchChange,
  filteredData,
  size,
  router,
}) => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <div className="relative flex items-center justify-end mb-5 mr-5">
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
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left dark:bg-meta-4 bg-bodydark">
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  No
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  User
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Outlet
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Information
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Transaction Date
                </th>
                {user !== "2" && (
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Action
                  </th>
                )}
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
                filteredData.map((value, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx === filteredData.length - 1
                        ? ""
                        : "border-b border-stroke dark:border-strokedark"
                    }
                  >
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11 ">
                      <h5 className="font-medium text-black dark:text-white ">
                        {currentPage === 1
                          ? idx + 1
                          : (currentPage - 1) * size + idx + 1}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark xl:pl-11 ">
                      <h5 className="font-medium text-black dark:text-white ">
                        {value?.User?.full_name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark ">
                      <h5 className="font-medium text-black dark:text-white">
                        {value?.Outlet?.name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {value.information}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {formatDate(value.transaction_date)}
                      </h5>
                    </td>
                    {user !== "2" && (
                      // <>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center space-x-3.5">
                          <button
                            className="hover:text-primary"
                            onClick={() =>
                              router.push(`/reports/isuing/${value.id}`)
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              class="w-6 h-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>
                          <button
                            className="hover:text-primary"
                            onClick={() => handleDelete(value.id)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
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
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="items-center float-right">
            {currentPage !== 1 && (
              <button
                className="btn btn-outline btn-default"
                onClick={() => onPaginationPrevious(currentPage)}
              >
                &laquo;
              </button>
            )}

            <div className="join m-2 border">
              {!searchTerm && (
                <>
                  {currentPage > 1 && (
                    <button
                      key={currentPage - 1}
                      className={`join-item btn btn-outline btn-default`}
                      onClick={() =>
                        paginationHandle(currentPage - 1, totalPages)
                      }
                    >
                      {currentPage - 1}
                    </button>
                  )}
                  <button
                    key={currentPage}
                    className={`join-item btn btn-outline btn-default btn-active btn-primary`}
                    onClick={() => paginationHandle(currentPage, totalPages)}
                  >
                    {currentPage}
                  </button>
                  {currentPage !== totalPages && (
                    <button
                      key={currentPage + 1}
                      className={`join-item btn btn-outline btn-default`}
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

            {currentPage !== totalPages && (
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
    </>
  );
};
export default TableReportIsuing;
