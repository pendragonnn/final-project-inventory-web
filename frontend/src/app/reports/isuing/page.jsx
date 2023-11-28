"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportIsuing from "@/components/Tables/TableReportIssuing"
import React from "react"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { getTransactionHeader } from "@/modules/fetch/index"
import Cookies from "js-cookie"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"

const ReportIsuing = () => {
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

    if (role && role !== "2") {
      // Ubah kondisi role agar sesuai dengan string '2'
      router.push("/dashboard")
    }
  }, [])

  const filterData = data
    .filter((value) => value.outlet_id !== null)
    .sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date))

  function formatDate(isoDate) {
    const date = new Date(isoDate)
    const options = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("id-ID", options)
  }

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Report Isuing" />
        <TableReportIsuing filterData={filterData} formatDate={formatDate} />
      </SidebarLayout>
    )
  } else {
    return null
  }
}

export default ReportIsuing
