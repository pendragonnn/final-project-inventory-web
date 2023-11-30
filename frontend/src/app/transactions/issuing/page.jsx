"use client"

import SidebarLayout from "@/app/sidebar-layout"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import Swal from "sweetalert2"
import {
  createTransactionHeader,
  getTransactionHeader,
} from "@/modules/fetch/index"
import Outlet from "@/data/outlet/index"
import Item from "@/data/item/index"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import FormTemporaryItem from "@/components/Form/FormTemporaryItem"
import FormAddTransactionIsuing from "@/components/Form/FormAddTransactionIsuing"

const TransactionHeader = () => {
  const [dataItem, setDataItem] = useState([])
  const [dataOutlet, setDataOutlet] = useState([])
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const router = useRouter()
  const [itemTemporary, setItemTemporary] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await createTransactionHeader({
        user_id: e.target.user_id.value,
        outlet_id: e.target.outlet_id.value,
        information: e.target.information.value,
        transaction_date: e.target.transaction_date.value,
        Detail: itemTemporary.map((e) => ({
          item_id: e.item_id,
          quantity: parseInt(e.quantity),
        })),
      })
      console.log("data submit >>>>>>>>>>>", data)
      setItemTemporary([])
    } catch (err) {
      const errorMessage = err.message || "Terjadi kesalahan"

      Swal.fire({
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      })
    }
  }
  console.log("Detail", itemTemporary)

  const handleAdd = (e) => {
    e.preventDefault()
    const newItem = {
      item_id: dataItem[e.target.a.value].id,
      item_name: dataItem[e.target.a.value].name,
      quantity: parseInt(e.target.b.value),
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

  useEffect(() => {
    const fetchData = async () => {
      const res = await getTransactionHeader()
      console.log("data th >>>>", res)
    }

    fetchData()
  }, [])

  const handleDelete = (index) => {
    const newData = [...itemTemporary]
    newData.splice(index, 1)
    setItemTemporary(newData)
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await Item.getItem()
      setDataItem(res.data.data)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const res = await Outlet.getOutlet()
      setDataOutlet(res.data.data)
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
          <Breadcrumb pageName="Transaction Isuing" />
          <div className="">
            <div className=" ">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 ">
                <FormTemporaryItem handleAdd={handleAdd} dataItem={dataItem} />
                <FormAddTransactionIsuing
                  handleSubmit={handleSubmit}
                  userId={userId}
                  dataOutlet={dataOutlet}
                  itemTemporary={itemTemporary}
                  handleDelete={handleDelete}
                />
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
