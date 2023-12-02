"use client"

import SidebarLayout from "@/app/sidebar-layout"
import TableReportReceiving from "@/components/Tables/TableReportReceiving"
import React from "react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  deleteTransactionHeader,
  getTransactionHeaderReceiving,
} from "@/modules/fetch/index"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import Cookies from "js-cookie"

const ReportsReceiving = () => {
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
        const res = await getTransactionHeaderReceiving(currentPage, size)
        setData(res.data)

        const allRes = await getTransactionHeaderReceiving(1, res.totalItems)
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
          const res = await getTransactionHeaderReceiving(currentPage, size)
          console.log("res", res.data)
          setData(res.data)

          setTotalPages(res.totalPages)
          setTotalItems(res.totalItems)
          setCurrentPage(res.currentPage)

          if (
            res.totalItems % (size * res.totalPages) <= size &&
            currentPage > 1
          ) {
            paginationHandle(currentPage - 1)
          } else {
            paginationHandle(res.currentPage)
          }
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

  function formatDate(isoDate) {
    const date = new Date(isoDate)
    const options = { day: "numeric", month: "long", year: "numeric" }
    return date.toLocaleDateString("id-ID", options)
  }

  const searchByTransactionDate = (data, searchTerm) => {
    return data.filter((transaction) => {
      const formattedDate = formatDate(transaction.transaction_date)
      const fullName = transaction?.User?.full_name?.toLowerCase()
      const outlet = transaction?.Supplier?.name?.toLowerCase()

      return (
        formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fullName?.includes(searchTerm.toLowerCase()) ||
        outlet?.includes(searchTerm.toLowerCase())
      )
    })
  }

  // Contoh penggunaan pada filteredData
  const filteredData = searchTerm
    ? searchByTransactionDate(allData, searchTerm)
    : data.sort(
        (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
      )

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Tables" />
        <div className="flex flex-col gap-10">
          <TableReportReceiving
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
            filteredData={filteredData}
            allData={allData}
            size={size}
            router={router}
          />
        </div>
      </SidebarLayout>
    )
  } else {
    return null
  }
}

export default ReportsReceiving
