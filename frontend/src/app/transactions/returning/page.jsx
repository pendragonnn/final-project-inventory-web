"use client";

import SidebarLayout from "@/app/sidebar-layout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Swal from "sweetalert2";
import { createTransactionHeader } from "@/modules/fetch/index";
import Outlet from "@/data/outlet/index";
import Supplier from "@/data/supplier/index";
import Item from "@/data/item/index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import FormTemporaryReturning from "@/components/Form/FormTemporaryReturning";
import FormAddTransactionReturning from "@/components/Form/FormAddTransactionReturning";

const TransactionHeader = () => {
	const [dataItem, setDataItem] = useState([]);
	const [dataOutlet, setDataOutlet] = useState([]);
	const [dataSupplier, setDataSupplier] = useState([]);
	const [user, setUser] = useState(null);
	const [userId, setUserId] = useState(null);
	const [itemTemporary, setItemTemporary] = useState([]);
	const [userName, setUserName] = useState(null);
	const [formKey, setFormKey] = useState(Date.now()); // Untuk memaksa re-render form

	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (itemTemporary.length === 0) {
			Swal.fire({
				position: "bottom-end",
				icon: "error",
				title: "Must add item",
				showConfirmButton: false,
				timer: 2000,
			});
			return;
		}

		const outletId = e.target.outlet_id ? e.target.outlet_id.value : null;
		const supplierId = e.target.supplier_id ? e.target.supplier_id.value : null;

		if (!outletId && !supplierId) {
			Swal.fire({
				position: "bottom-end",
				icon: "error",
				title: "Please select either Outlet or Supplier",
				showConfirmButton: false,
				timer: 2000,
			});
			return;
		}

		try {
			const data = await createTransactionHeader({
				user_id: e.target.user_id.value,
				outlet_id: outletId,
				supplier_id: supplierId,
				information: e.target.information.value,
				transaction_date: e.target.transaction_date.value,
				Detail: itemTemporary.map((e) => ({
					item_id: e.item_id,
					quantity: parseInt(e.quantity),
					price_item: parseInt(e.price_item),
					reason: e.reason,
				})),
			});

			if (data) {
				const updatedDataItem = dataItem.map((item) => {
					const matchingItem = itemTemporary.find(
						(tempItem) => tempItem.item_id === item.id
					);

					if (matchingItem) {
						return {
							...item,
							stock: supplierId
								? item.stock - matchingItem.quantity
								: item.stock + matchingItem.quantity,
						};
					}
					return item;
				});

				setDataItem(updatedDataItem);
				setItemTemporary([]); // Reset daftar item sementara
				setFormKey(Date.now()); // Reset form dengan key baru
				e.target.reset(); // Reset input form

				Swal.fire({
					position: "bottom-end",
					icon: "success",
					title: "Transaction Successful",
					showConfirmButton: false,
					timer: 2000,
				});
			}
		} catch (err) {
			Swal.fire({
				position: "bottom-end",
				icon: "error",
				title: err.message,
				showConfirmButton: false,
				timer: 2000,
			});
		}
	};

	const handleAdd = (item) => {
		const existingItemIndex = itemTemporary.findIndex(
			(tempItem) => tempItem.item_id === item.item_id
		);

		if (existingItemIndex !== -1) {
			const updatedItems = [...itemTemporary];
			updatedItems[existingItemIndex].quantity += item.quantity;
			setItemTemporary(updatedItems);
		} else {
			setItemTemporary([...itemTemporary, item]);
		}
	};

	const handleDelete = (index) => {
		const newData = [...itemTemporary];
		newData.splice(index, 1);
		setItemTemporary(newData);
	};

	useEffect(() => {
		const fetchData = async () => {
			const res = await Item.getItem();
			const allRes = await Item.getItem(1, res.data.totalItems);
			setDataItem(allRes.data.data);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await Outlet.getOutlet();
				const allRes = await Outlet.getOutlet(1, res.data.totalItems);
				setDataOutlet(allRes.data.data);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await Supplier.getSupplier();
				const allRes = await Supplier.getSupplier(1, res.data.totalItems);
				setDataSupplier(allRes.data.data);
			} catch (error) {
				console.log("Error fetching category", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const role = jwtDecode(Cookies.get("token")).role;
		const idUser = jwtDecode(Cookies.get("token")).id;
		const nameUser = jwtDecode(Cookies.get("token")).full_name;
		setUserName(nameUser);
		setUser(role);
		setUserId(idUser);

		if (!role) {
			router.push("/dashboard");
		}
	}, []);

	if (user) {
		return (
			<>
				<SidebarLayout>
					<Breadcrumb pageName="Transaction Returning" />
					<div className="">
						<div className="flex flex-col gap-5 lg:flex-row">
							<div className="lg:flex-[0.7]">
								<FormTemporaryReturning
									handleAdd={handleAdd}
									dataItem={dataItem}
								/>
							</div>
							<div className="lg:flex-[1.3]">
								<FormAddTransactionReturning
									key={formKey} // Memaksa form reset setelah submit
									handleSubmit={handleSubmit}
									userId={userId}
									userName={userName}
									dataOutlet={dataOutlet}
									dataItem={dataItem}
									dataSupplier={dataSupplier}
									itemTemporary={itemTemporary}
									handleDelete={handleDelete}
								/>
							</div>
						</div>
					</div>
				</SidebarLayout>
			</>
		);
	} else {
		return null;
	}
};

export default TransactionHeader;
