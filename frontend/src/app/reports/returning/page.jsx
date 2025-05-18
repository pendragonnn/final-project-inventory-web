"use client";

import SidebarLayout from "@/app/sidebar-layout";
import TableReportReturning from "@/components/Tables/TableReportReturning";
import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	deleteTransactionHeader,
	getTransactionHeaderReturning,
} from "@/modules/fetch/index";
import Cookies from "js-cookie";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { jwtDecode } from "jwt-decode";
import Loader from "@/components/common/Loader";

const ReportReturning = () => {
	const [user, setUser] = useState(null);
	const [data, setData] = useState([]);
	const [allData, setAllData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [size, setSize] = useState(10);
	const [loading, setLoading] = useState(true);

	const router = useRouter();

	useEffect(() => {
		const fetchData = async () => {
			const minimumLoading = new Promise((resolve) => setTimeout(resolve, 500));
			try {
				const res = await getTransactionHeaderReturning(currentPage, size);
				setData(res.data);
				const allRes = await getTransactionHeaderReturning(1, res.totalItems);
				setAllData(allRes.data);
				setTotalPages(res.totalPages);
				setTotalItems(res.totalItems);

				await minimumLoading;

				setLoading(false);
			} catch (error) {
				console.error("Error Fetching data:", error);
			}
		};

		fetchData();
	}, [currentPage, size]); // Sertakan 'size' sebagai dependensi

	const handleSizeChange = (newSize) => {
		setSize(newSize);
		setCurrentPage(1); // Reset ke halaman pertama saat ukuran data berubah
	};

	const paginationHandle = async (currentPage) => {
		setCurrentPage(currentPage);
	};

	const onPaginationNext = async (currentPage) => {
		setCurrentPage(currentPage + 1);
	};

	const onPaginationPrevious = async (currentPage) => {
		setCurrentPage(currentPage - 1);
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);
	};

	function formatDate(isoDate) {
		const date = new Date(isoDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Menambahkan leading zero jika bulan < 10
		const day = String(date.getDate()).padStart(2, "0"); // Menambahkan leading zero jika tanggal < 10
		return `${year}-${month}-${day}`;
	}

	const searchByTransactionDate = (data, searchTerm) => {
		return data.filter((transaction) => {
			const formattedDate = formatDate(transaction.transaction_date);
			const fullName = transaction?.User?.full_name?.toLowerCase();

			return (
				formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
				fullName?.includes(searchTerm.toLowerCase())
			);
		});
	};

	// Contoh penggunaan pada filteredData
	const filteredData = searchTerm
		? searchByTransactionDate(allData, searchTerm)
		: data.sort(
				(a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
		  );

	useEffect(() => {
		try {
			const token = Cookies.get("token");

			if (!token) {
				throw new Error("Token not found");
			}

			const decodedToken = jwtDecode(token);
			const role = decodedToken.role;
			if (role !== "1" && role !== "2" && role !== "3") {
				router.push("/dashboard");
			} else {
				setUser(role);
			}
		} catch (error) {
			console.error("Invalid or expired token:", error.message);
			Cookies.remove("token");
			router.push("/");
		}
	}, [router]);

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
					await deleteTransactionHeader(id);
					setData((prevData) =>
						prevData.filter((transaction) => transaction.id !== id)
					);
					setAllData((prevAllData) =>
						prevAllData.filter((transaction) => transaction.id !== id)
					);

					Swal.fire({
						position: "bottom-end",
						title: "Deleted!",
						text: "Your file has been deleted.",
						icon: "success",
						customClass: "swal-custom-delete",
					});

					// Refresh data dari server untuk memastikan sinkronisasi
					const res = await getTransactionHeaderReturning(currentPage, size);
					setData(res.data);
					setTotalPages(res.totalPages);
					setTotalItems(res.totalItems);

					if (
						res.totalItems % (size * res.totalPages) <= size &&
						currentPage > 1
					) {
						paginationHandle(currentPage - 1);
					} else {
						paginationHandle(res.currentPage);
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
				});
			}
		});
	};

	if (loading) {
		return <Loader />;
	}

	if (user) {
		return (
			<SidebarLayout>
				<Breadcrumb pageName="Report Returning" />
				<TableReportReturning
					reportType="Returning"
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
					setSize={handleSizeChange}
					router={router}
				/>
			</SidebarLayout>
		);
	} else {
		return null;
	}
};

export default ReportReturning;
