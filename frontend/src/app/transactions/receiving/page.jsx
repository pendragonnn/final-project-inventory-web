"use client";

import SidebarLayout from "@/app/sidebar-layout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Swal from "sweetalert2";
import { createTransactionHeader } from "@/modules/fetch/index";
import Supplier from "@/data/supplier/index";
import Item from "@/data/item/index";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import FormTemporaryItem from "@/components/Form/FormTemporaryItem";
import FormAddTransactionReceiving from "@/components/Form/FormAddTransactionReceiving";
import { jwtDecode } from "jwt-decode";

const TransactionHeader = () => {
	const [dataItem, setDataItem] = useState([]);
	const [dataSupplier, setDataSupplier] = useState([]);
	const [user, setUser] = useState(null);
	const [userId, setUserId] = useState(null);
	const [itemTemporary, setItemTemporary] = useState([]);
	const [userName, setUserName] = useState(null);
	const router = useRouter();

	useEffect(() => {
		const token = Cookies.get("token");
		if (!token) {
			router.push("/forbidden");
			return;
		}

		try {
			const decodedToken = jwtDecode(token);
			setUser(decodedToken.role);
			setUserId(decodedToken.id);
			setUserName(decodedToken.full_name);
		} catch (error) {
			console.error("Invalid token:", error.message);
			router.push("/forbidden");
		}
	}, [router]);

	useEffect(() => {
		if (!user) return;

		const fetchData = async () => {
			try {
				const res = await Item.getItem();
				const allRes = await Item.getItem(1, res.data.totalItems);
				setDataItem(allRes.data.data);
			} catch (error) {
				console.error("Error fetching items:", error);
			}
		};

		fetchData();
	}, [user]);

	useEffect(() => {
		if (!user) return;

		const fetchData = async () => {
			try {
				const res = await Supplier.getSupplier();
				const allRes = await Supplier.getSupplier(1, res.data.totalItems);
				setDataSupplier(allRes.data.data);
			} catch (error) {
				console.error("Error fetching suppliers:", error);
			}
		};

		fetchData();
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
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
			});
			if (data) {
				// Update dataItem stocks
				const updatedDataItem = dataItem.map((item) => {
					const matchingItem = itemTemporary.find(
						(tempItem) => tempItem.item_id === item.id
					);

					if (matchingItem) {
						return {
							...item,
							stock: item.stock + matchingItem.quantity, // Tambahkan stok untuk receiving
						};
					}
					return item;
				});

				setDataItem(updatedDataItem);
				setItemTemporary([]);

				Swal.fire({
					position: "bottom-end",
					icon: "success",
					title: data.message,
					showConfirmButton: false,
					timer: 2000,
					customClass: {
						popup: document.body.classList.contains("dark")
							? "swal-custom-dark"
							: "swal-custom-light",
					},
				});
			}
		} catch (err) {
			// const errorMessage = err.message || "Terjadi kesalahan"
			Swal.fire({
				position: "bottom-end",
				icon: "error",
				title: err.message,
				showConfirmButton: false,
				timer: 2000,
				customClass: {
					popup: document.body.classList.contains("dark")
						? "swal-custom-dark"
						: "swal-custom-light",
				},
			});
		}
	};

	const handleAdd = (item) => {
		// Validasi data sebelum ditambahkan ke array
		if (!item.item_id) {
			console.error("Item ID is missing");
			return;
		}

		// Periksa apakah item sudah ada di `itemTemporary`
		const existingItemIndex = itemTemporary.findIndex(
			(tempItem) => tempItem.item_id === item.item_id
		);

		if (existingItemIndex !== -1) {
			// Jika sudah ada, tambahkan jumlahnya
			const updatedItems = [...itemTemporary];
			updatedItems[existingItemIndex].quantity += item.quantity;
			setItemTemporary(updatedItems);
		} else {
			// Jika belum ada, tambahkan sebagai item baru
			setItemTemporary([...itemTemporary, item]);
		}
	};

	const handleDelete = (index) => {
		const newData = [...itemTemporary];
		newData.splice(index, 1);
		setItemTemporary(newData);
	};

	return user ? (
		<>
			<SidebarLayout>
				<Breadcrumb pageName="Transaction Receiving" />
				<div className="">
					<div className=" ">
						<div className="flex flex-col gap-5 lg:flex-row">
							<div className="lg:flex-[0.7]">
								<FormTemporaryItem handleAdd={handleAdd} dataItem={dataItem} />
							</div>
							<div className="lg:flex-[1.3]">
								<FormAddTransactionReceiving
									handleSubmit={handleSubmit}
									userId={userId}
									userName={userName}
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
	) : null;
};
export default TransactionHeader;
