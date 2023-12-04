"use client"

import SidebarLayout from "@/app/sidebar-layout"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react"
import { getTransactionDetailById } from "@/modules/fetch/index"
import Image from "next/image"

const DetailReportIsuing = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTransactionDetailById(id)
      setData(res.data)
    }

    fetchData()
  }, [id])

  // Fungsi untuk mengonversi harga ke format IDR
  const formatIDR = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price)
  }

  function formatDate(isoDate) {
    const date = new Date(isoDate)
    const options = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("id-ID", options)
  }

  if (!data) {
    return <p>Loading...</p>
  }

  const totalTransaction = data.TransactionDetails.reduce(
    (total, value) => total + value.price_item * value.quantity,
    0
  )

  return (
    <SidebarLayout>
      <div className="relative">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex items-center justify-between">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Report Isuing
          </h4>
          <p className="font-bold">
            Total Transaction : {formatIDR(totalTransaction)}
          </p>
        </div>

        <div className="flex flex-col gap-y-5 rounded-sm divide-y divide-stroke dark:divide-strokedark bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {data.TransactionDetails.map((value) => (
            <div
              className="flex flex-col p-10 gap-20 lg:flex-row"
              key={value.id}
            >
              <div className="flex-1 text-center flex flex-col items-center">
                <div className="w-70 h-70 rounded-xl bg-[#858592] border-2 border-[#858592] shadow-lg overflow-hidden">
                  <Image
                    src={`/uploads/item/${value?.Item?.image_url}`}
                    alt={value.Item.image_url}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full block"
                  />
                </div>
                <div className="w-full flex flex-col mt-10 text-xl">
                  <p className="font-bold text-black dark:text-white">
                    {value.Item.name}
                  </p>
                  <p className="font-medium text-[#858592] dark:text-stroke">
                    {value.Item.description}
                  </p>
                </div>
              </div>
              <div className="flex-1 flex flex-col xl:gap-5 text-sm mt-10 xl:mt-0">
                <div className="flex items-center gap-3 p-2 border-b-2 rounded-lg border-[#858592] xl:w-[70%] dark:border-stroke">
                  <div className="bg-[#858592] p-2 rounded-md ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#858592] dark:text-stroke">
                      Quantity
                    </p>
                    <p className="font-bold text-black dark:text-white">
                      {value.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 border-b-2 rounded-lg border-[#858592] xl:w-[70%] dark:border-stroke">
                  <div className="bg-[#858592] p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#858592] dark:text-stroke">
                      Price
                    </p>
                    <p className="font-bold dark:text-white">
                      {formatIDR(value.price_item)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 border-b-2 rounded-lg border-[#858592] xl:w-[70%] dark:border-stroke">
                  <div className="bg-[#858592] p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#858592] dark:text-stroke">
                      Total Price
                    </p>
                    <p className="font-bold dark:text-white">
                      {formatIDR(value.price_item * value.quantity)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-3 p-2 border-b-2 rounded-lg border-[#858592] dark:border-stroke">
                    <div className="bg-[#858592] p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#858592] dark:text-stroke">
                        User Id
                      </p>
                      <p className="font-bold dark:text-white">
                        {data.user_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 border-b-2 rounded-lg border-[#858592] dark:border-stroke">
                    <div className="bg-[#858592] p-2 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-6 h-6 text-white"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#858592] dark:text-stroke">
                        Outlet Id
                      </p>
                      <p className="font-bold dark:text-white">
                        {data.outlet_id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 border-b-2 rounded-lg border-[#858592] xl:w-[70%] dark:border-stroke">
                  <div className="bg-[#858592] p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#858592] dark:text-stroke">
                      Information
                    </p>
                    <p className="font-bold dark:text-white">
                      {" "}
                      {data.information}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 border-b-2 rounded-lg border-[#858592] xl:w-[70%] dark:border-stroke">
                  <div className="bg-[#858592] p-2 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#858592] dark:text-stroke">
                      Transaction Date
                    </p>
                    <p className="font-bold dark:text-white">
                      {formatDate(data.transaction_date)}
                    </p>
                  </div>
                </div>
                {/* <p>Stock : {value.Item.stock}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  )
}

export default DetailReportIsuing
