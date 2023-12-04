"use client"

import SidebarLayout from "@/app/sidebar-layout"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import Swal from "sweetalert2"
import { createTransactionHeader } from "@/modules/fetch/index"
import Supplier from "@/data/supplier/index"
import Item from "@/data/item/index"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import FormTemporaryItem from "@/components/Form/FormTemporaryItem"
import FormAddTransactionReceiving from "@/components/Form/FormAddTransactionReceiving"

const TransactionHeader = () => {
  const [dataItem, setDataItem] = useState([])
  const [dataSupplier, setDataSupplier] = useState([])
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [itemTemporary, setItemTemporary] = useState([])
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await createTransactionHeader({
        user_id: e.target.user_id.value,
        supplier_id: e.target.supplier_id.value,
        information: e.target.information.value,
        transaction_date: e.target.transaction_date.value,
        Detail: itemTemporary.map((e) => ({
          item_id: e.item_id,
          quantity: parseInt(e.quantity),
          price_item: parseInt(e.price_item),
        })),
      })

      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      })
      setItemTemporary([])
    } catch (err) {
      // const errorMessage = err.message || "Terjadi kesalahan"
      Swal.fire({
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      })
    }
  }

  const handleAdd = (e) => {
    e.preventDefault()
    const newItem = {
      item_id: dataItem[e.target.a.value].id,
      item_name: dataItem[e.target.a.value].name,
      quantity: parseInt(e.target.b.value),
      price_item: parseInt(e.target.c.value),
    }

    const existingItemIndex = itemTemporary.findIndex(
      (item) => item.item_id === newItem.item_id
    )

    if (existingItemIndex !== -1) {
      const updatedItems = [...itemTemporary]
      updatedItems[existingItemIndex].quantity += newItem.quantity
      setItemTemporary(updatedItems)
    } else {
      setItemTemporary([...itemTemporary, newItem])
    }

    e.target.reset()
  }

  const handleDelete = (index) => {
    const newData = [...itemTemporary]
    newData.splice(index, 1)
    setItemTemporary(newData)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await Item.getItem()
      const allRes = await Item.getItem(1, res.data.totalItems)
      setDataItem(allRes.data.data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Supplier.getSupplier()
        const allRes = await Supplier.getSupplier(1, res.data.totalItems)
        setDataSupplier(allRes.data.data)
        setD
      } catch (error) {
        console.log("Error fetching category", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const role = Cookies.get("role")
    const idUser = Cookies.get("userId")
    setUser(role)
    setUserId(idUser)

    if (!role) {
      // Ubah kondisi role agar sesuai dengan string '2'
      router.push("/dashboard")
    }
  }, [])

  if (user) {
    return (
      <>
        <SidebarLayout>
          <Breadcrumb pageName="Transaction Receiving" />
          <div className="">
            <div className=" ">
              <div className="flex flex-col gap-5 lg:flex-row">
                <div className="lg:flex-[0.7]">
                  <FormTemporaryItem
                    handleAdd={handleAdd}
                    dataItem={dataItem}
                  />
                </div>
                <div className="lg:flex-[1.3]">
                  <FormAddTransactionReceiving
                    handleSubmit={handleSubmit}
                    userId={userId}
                    dataSupplier={dataSupplier}
                    itemTemporary={itemTemporary}
                    handleDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          </div>
        </SidebarLayout>
      </>
    )
  } else {
    return null
  }
}
export default TransactionHeader
