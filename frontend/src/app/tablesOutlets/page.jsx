"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb"
import { useEffect, useState } from "react"
import TableOutlets from "@/components/Tables/TableOutlet"
import SidebarLayout from "../sidebar-layout"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

const TablesPage = () => {
  const router = useRouter()
  const [user, setUser] = useState(null) // Berikan nilai awal pada useState

  useEffect(() => {
    const role = Cookies.get("role")
    setUser(role)

    if (!role) {
      // Ubah kondisi role agar sesuai dengan string '2'
      router.push("/forbidden")
    }
  }, [])

  if (user) {
    return (
      <SidebarLayout>
        <Breadcrumb pageName="Table Outlets" />
        <div className="flex flex-col gap-10">
          <TableOutlets />
        </div>
      </SidebarLayout>
    )
  } else {
    return null
  }
}

export default TablesPage
