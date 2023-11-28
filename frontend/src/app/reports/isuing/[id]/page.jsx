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

  if (!data) {
    return <p>Loading...</p>
  }

  return (
    <SidebarLayout>
      <div className="">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Report Isuing
          </h4>
        </div>

        <div className="flex flex-col gap-y-5 rounded-sm divide-y divide-stroke dark:divide-strokedark bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          {data.TransactionDetails.map((value) => (
            <div className="flex p-10 gap-20" key={value.id}>
              <div className="flex-1 text-center flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-black overflow-hidden">
                  <Image
                    src={`/${value.Item.image_url}`}
                    alt={value.Item.name}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full block"
                  />
                </div>
                <div className="w-full flex flex-col gap-5 mt-5">
                  <p>{value.Item.name}</p>
                  <p>{value.Item.description}</p>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-5">
                <p>Price : {formatIDR(value.Item.price)}</p>
                <p>Quantity: {value.quantity}</p>
                <p>
                  Total price : {formatIDR(value.Item.price * value.quantity)}
                </p>
                <p>Stock : {value.Item.stock}</p>
                <p>User : {data.user_id}</p>
                <p>Outlet : {data.outlet_id}</p>
                <p>Information : {data.information}</p>
                <p>Transaction Date : {data.transaction_date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SidebarLayout>
  )
}

export default DetailReportIsuing
