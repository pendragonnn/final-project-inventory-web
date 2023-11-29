"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportReceiving from "@/components/Tables/TableReportReceiving"
import React from "react"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { getTransactionHeader } from "@/modules/fetch/index"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import Cookies from "js-cookie"

const ReportsReceiving = () => {
  const [data, setData] = useState([])
  const router = useRouter()
  const [user, setUser] = useState(null) // Berikan nilai awal pada useState

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTransactionHeader()
      setData(res.data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const role = Cookies.get("role")
    setUser(role)

    if (!role) {
      // Ubah kondisi role agar sesuai dengan string '2'
      router.push("/dashboard")
    }
  }, [])

  const filterData = data
    .filter((value) => value.supplier_id !== null)
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))

  function formatDate(isoDate) {
    const date = new Date(isoDate)
    const options = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("id-ID", options)
  }

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Tables" />
        <div className="flex flex-col gap-10">
          <TableReportReceiving
            filterData={filterData}
            formatDate={formatDate}
          />
        </div>
      </SidebarLayout>
    )
  } else {
    return null
  }
}

export default ReportsReceiving
