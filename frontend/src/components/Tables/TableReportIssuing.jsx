import { useRouter } from "next/navigation"

const TableReportIsuing = ({ filterData, formatDate }) => {
  const router = useRouter()
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <p></p>
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left dark:bg-meta-4 bg-bodydark">
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
              </tr>
            </thead>
            <tbody>
              {filterData.map((value, key) => (
                <tr
                  onClick={() => router.push(`/reports/isuing/${value.id}`)}
                  className="cursor-pointer hover:bg-bodydark1"
                  key={key}
                >
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
export default TableReportIsuing
