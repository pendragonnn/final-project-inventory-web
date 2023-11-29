"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportIsuing from "@/components/Tables/TableReportIssuing"
import React from "react"
import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"
import { getTransactionHeader } from "@/modules/fetch/index"
import Cookies from "js-cookie"

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
    console.log(role)

    if (!role) {
      // Ubah kondisi role agar sesuai dengan string '2'
      router.push("/dashboard")
    }
  }, [])

  const filterData = data.filter((value) => value.outlet_id !== null)

  if (user) {
    return (
      <SidebarLayout>
        <TableReportIsuing filterData={filterData} />
      </SidebarLayout>
    )
  } else {
    return null
  }
}

export default ReportIsuing
