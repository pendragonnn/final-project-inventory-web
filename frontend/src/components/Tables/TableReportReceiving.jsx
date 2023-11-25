import React from "react"
import Link from "next/link"

const TableReportReceiving = ({ filterData }) => {
  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Report Receiving
          </h4>
        </div>

        <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 md:grid-cols-5 2xl:px-7.5">
          <div className="col-span-1 flex">
            <p className="font-medium">User</p>
          </div>
          <div className="col-span-1 flex">
            <p className="font-medium">Supplier</p>
          </div>
          <div className="col-span-2 flex">
            <p className="font-medium">Information</p>
          </div>
          <div className="col-span-1 flex">
            <p className="font-medium ">Transaction Date</p>
          </div>
        </div>

        {filterData.map((value, key) => (
          <Link
            href={`/reports/receiving/${value.id}`}
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark cursor-pointer md:px-6 md:grid-cols-5 2xl:px-7.5"
            key={key}
          >
            <div className="col-span-1 flex items-center">
              <p className="font-medium">{value.user_id}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium">{value.supplier_id}</p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="font-medium">{value.information}</p>
            </div>
            <div className="col-span-1 flex items-center">
              <p className="font-medium ">{value.transaction_date}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default TableReportReceiving
