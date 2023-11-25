"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportReceiving from "@/components/Tables/TableReportReceiving"
import React from "react"

import { useEffect, useState } from "react"
import { getTransactionHeader } from "@/modules/fetch/index"

const ReportsReceiving = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTransactionHeader()
      setData(res.data)
    }

    fetchData()
  }, [])

  const filterData = data.filter((value) => value.supplier_id !== null)

  return (
    <SidebarLayout>
      <TableReportReceiving filterData={filterData} />
    </SidebarLayout>
  )
}

export default ReportsReceiving
