"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportIsuing from "@/components/Tables/TableReportIssuing"
import React from "react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  getTransactionHeader,
  deleteTransactionHeader,
} from "@/modules/fetch/index"
import Cookies from "js-cookie"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"

const ReportIsuing = () => {
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const [allData, setAllData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const size = 10
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTransactionHeader(currentPage, size)
        setData(res.data)

        const allRes = await getTransactionHeader(1, res.totalItems)
        console.log("total items", res.totalItems)
        setAllData(allRes.data)
        setTotalPages(res.totalPages)
        setTotalItems(res.totalItems)
      } catch (error) {
        console.log("Error Fetching data", error)
      }
    }

    fetchData()
  }, [currentPage, size]) // Sertakan dependensi dalam array dependensi

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
          // await deleteTransactionHeader(id)
          // const res = await getTransactionHeader(currentPage, size)
          // setData(res.data)

          // setTotalPages(res.totalPages)
          // setTotalItems(res.totalItems)
          // setCurrentPage(res.currentPage)

          // if (res.totalItems % (size * res.totalPages) <= size) {
          //   paginationHandle(currentPage - 1)
          // } else {
          //   paginationHandle(res.currentPage)
          // }
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

  function formatDate(isoDate) {
    const date = new Date(isoDate)
    const options = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("id-ID", options)
  }

  const paginationHandle = async (currentPage) => {
    setCurrentPage(currentPage)
  }

  const onPaginationNext = async (currentPage) => {
    setCurrentPage(currentPage + 1)
  }

  const onPaginationPrevious = async (currentPage) => {
    setCurrentPage(currentPage - 1)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const withoutSupplier = allData.filter((value) => value.outlet_id !== null)

  const filteredData = searchTerm
    ? withoutSupplier.filter((transaction) => {
        transaction?.User?.full_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      })
    : data
        .filter((value) => value.outlet_id !== null)
        .sort(
          (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
        )

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Report Isuing" />
        <TableReportIsuing
          formatDate={formatDate}
          handleDelete={handleDelete}
          user={user}
          paginationHandle={paginationHandle}
          onPaginationNext={onPaginationNext}
          onPaginationPrevious={onPaginationPrevious}
          currentPage={currentPage}
          totalPages={totalPages}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          // filterData={filterData}
          filteredData={filteredData}
          allData={allData}
          size={size}
        />
      </SidebarLayout>
    )
  } else {
    return null
  }
}

export default ReportIsuing
