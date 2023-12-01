"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportReceiving from "@/components/Tables/TableReportReceiving"
import React from "react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  getTransactionHeader,
  deleteTransactionHeader,
} from "@/modules/fetch/index"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import Cookies from "js-cookie"

const ReportsReceiving = () => {
  const [data, setData] = useState([])
  const router = useRouter()
  const [user, setUser] = useState(null)

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

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          await deleteTransactionHeader(id)
          setData((prevData) =>
            prevData.filter((transaction) => transaction.id !== id)
          )
          Swal.fire({
            position: "bottom-end",
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
            customClass: "swal-custom-delete",
          })
        }
      } catch (e) {
        Swal.fire({
          position: "bottom-end",
          icon: "error",
          title: e.message,
          showConfirmButton: false,
          timer: 2000,
          customClass: "swal-custom",
        })
      }
    })
  }

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
            handleDelete={handleDelete}
            user={user}
          />
        </div>
      </SidebarLayout>
    )
  } else {
    return null
  }
}

export default ReportsReceiving
