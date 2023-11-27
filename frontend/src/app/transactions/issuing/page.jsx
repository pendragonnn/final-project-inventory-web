"use client"

import SidebarLayout from "@/app/sidebar-layout"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import Swal from "sweetalert2"
import { createTransactionHeader, getItem } from "@/modules/fetch/index"
import Outlet from "@/data/outlet/index"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

const TransactionHeader = () => {
  const [dataItem, setDataItem] = useState([])
  const [dataOutlet, setDataOutlet] = useState([])
  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await createTransactionHeader({
        user_id: e.target.user_id.value,
        outlet_id: e.target.outlet_id.value,
        information: e.target.information.value,
        transaction_date: e.target.transaction_date.value,
        Detail: [
          {
            item_id: e.target.item_id.value,
            quantity: e.target.quantity.value,
          },
        ],
      })
      Swal.fire({
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 2000,
        customClass: "swal-custom",
      })
      console.log(data)
    } catch (err) {
      console.log("err", err.response.data.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const res = await getItem()
      setDataItem(res.data)
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
          <Breadcrumb pageName="Transaction Receiving" />
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Transaction Form
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5 mb-4.5 flex flex-col gap-6">
                <div className="">
                  <label className="mb-2.5 block text-black dark:text-white">
                    User Id
                  </label>
                  <input
                    type="text"
                    name="user_id"
                    value={userId}
                    placeholder={userId}
                    disabled
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary dark:disabled:bg-graydark"
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Outlet
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
                    name="outlet_id"
                  >
                    {dataOutlet.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Item
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary cursor-pointer"
                    name="item_id"
                  >
                    {dataItem.map((value) => (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Enter your Quantity"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Information
                  </label>
                  <input
                    type="text"
                    name="information"
                    placeholder="Enter your information"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                {/* <!-- Time and date --> */}
                <div className=" rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                  <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">
                      Time and date
                    </h3>
                  </div>
                  <div className="flex flex-col gap-5.5 p-6.5">
                    <div>
                      <label className="mb-3 block text-black dark:text-white">
                        Date picker
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="transaction_date"
                          className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex  justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </SidebarLayout>
      </>
    )
  } else {
    return null
  }
}
export default TransactionHeader