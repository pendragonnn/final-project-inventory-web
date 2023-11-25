"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportIsuing from "@/components/Tables/TableReportIssuing"
import React from "react"

import { useEffect, useState } from "react"
import { getTransactionHeader } from "@/modules/fetch/index"

const ReportIsuing = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTransactionHeader()
      setData(res.data)
      console.log("data report isuing =>>>>>>>>>>>>>>>>>", res.data)
    }

    fetchData()
  }, [])

  const filterData = data.filter((value) => value.outlet_id !== null)

  return (
    <SidebarLayout>
      <TableReportIsuing filterData={filterData} />
    </SidebarLayout>
  )
}

export default ReportIsuing
