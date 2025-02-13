"use client";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import ModalAddItem from "../Modal/Item/ModalAddItem";
import ModalEditItem from "../Modal/Item/ModalEditItem";
import Item from "@/data/item/index";
import ModalImageItem from "@/components/Modal/Item/ModalImageItem";
import Loader from "../common/Loader";

const TableItems = () => {
	const [data, setData] = useState([]);
	const [update, setUpdate] = useState(null);
	const [isModalOpen, setModalOpen] = useState(false);
	const [imageModal, setImageModalUrl] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [allData, setAllData] = useState([]);
	const [size, setSize] = useState(10);
	const [sortOrder, setSortOrder] = useState("desc");
	const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
	const [sortField, setSortField] = useState("");

	const [loading, setLoading] = useState(true);

	const dropdownRef = useRef(null);

	useEffect(() => {
		const fetchData = async () => {
			const minimumLoading = new Promise((resolve) => setTimeout(resolve, 500));
			try {
				const res = await Item.getItem(currentPage, size);
				const allRes = await Item.getItem(1, res.data.totalItems);

				setTotalPages(res.data.totalPages);
				setTotalItems(res.data.totalItems);
				setAllData(allRes.data.data);
				setData(res.data.data);
				await minimumLoading;

				setLoading(false);
			} catch (error) {
				console.log("Error fetching items: ", error);
			}
		};

		fetchData();
	}, [currentPage, update, size]);

	useEffect(() => {
		if (currentPage > totalPages && totalPages > 0) {
			setCurrentPage(totalPages);
		}
	}, [size, totalPages, currentPage]);

	const handleAdd = async () => {
		const res = await Item.getItem(currentPage, size);
		setUpdate(res.data.data);
		setTotalPages(res.data.totalPages);
		setTotalItems(res.data.totalItems);
		setCurrentPage(res.data.currentPage);
	};

	const handleEditData = async (updatedItem) => {
		setData((prevData) =>
			prevData.map((item) => (item.id === updatedItem?.id ? updatedItem : item))
		);
		const res = await Item.getItem(currentPage, size);
		setUpdate(res.data.data);
	};

	const handleEdit = async (id) => {
		try {
			const res = await Item.getItemByid(id);
			const result = res.data;
			setUpdate(result);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleDelete = async (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
			customClass: {
				popup: document.body.classList.contains("dark")
					? "swal-custom-dark"
					: "swal-custom-light",
			},
		}).then(async (result) => {
			try {
				if (result.isConfirmed) {
					setData((prevData) => prevData.filter((item) => item.id !== id));
					Swal.fire({
						position: "bottom-end",
						title: "Deleted!",
						text: "Your file has been deleted.",
						icon: "success",
						customClass: {
							popup: document.body.classList.contains("dark")
								? "swal-custom-dark"
								: "swal-custom-light",
						},
						showConfirmButton: false,
						timer: 2000,
					});
					await Item.deleteItem(id);
					const res = await Item.getItem(currentPage, size);
					setUpdate(res.data.data);

					setTotalPages(res.data.totalPages);
					setTotalItems(res.data.totalItems);
					setCurrentPage(res.data.currentPage);

					if (
						res.data.totalItems % (size * res.data.totalPages) <= size &&
						currentPage > 1
					) {
						paginationHandle(currentPage - 1);
					} else {
						paginationHandle(res.data.currentPage);
					}
				}
			} catch (e) {
				const errorMessage =
					e.response?.data?.message || "Something went wrong";

				Swal.fire({
					position: "bottom-end",
					icon: "error",
					title: errorMessage,
					showConfirmButton: false,
					timer: 2000,
					customClass: {
						popup: document.body.classList.contains("dark")
							? "swal-custom-dark"
							: "swal-custom-light",
					},
				});
			}
		});
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsFilterMenuOpen(false);
			}
		};

		if (isFilterMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isFilterMenuOpen]);

	const toggleFilterMenu = () => {
		setIsFilterMenuOpen(!isFilterMenuOpen);
	};

	const openModal = (imageUrl) => {
		setModalOpen(true);
		setImageModalUrl(imageUrl);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	// pagination
	const paginationHandle = async (currentPage) => {
		setCurrentPage(currentPage);
	};

	const onPaginationNext = async (currentPage) => {
		setCurrentPage(currentPage + 1);
	};

	const onPaginationPrevious = async (currentPage) => {
		setCurrentPage(currentPage - 1);
	};

	const formatIDR = (price) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
		}).format(price);
	};

	const handleSearchChange = (event) => {
		setSearchTerm(event.target.value);

		setCurrentPage(1);
	};

	const filteredData = searchTerm
		? allData.filter(
				(item) =>
					item.Brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.Brand.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.Brand.Category.name
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					item.price
						.toString()
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					item.stock.toString().toLowerCase().includes(searchTerm.toLowerCase())
		  )
		: allData;

	// Filter stock < 10 jika dipilih
	const filteredStockData =
		sortField === "lowStock"
			? filteredData.filter((item) => item.stock < 10)
			: filteredData;

	const getNestedValue = (obj, path) => {
		return path.split(".").reduce((acc, part) => acc && acc[part], obj);
	};

	const sortedData = filteredStockData.sort((a, b) => {
		const valueA = getNestedValue(a, sortField)?.toString().toLowerCase() || "";
		const valueB = getNestedValue(b, sortField)?.toString().toLowerCase() || "";

		return sortOrder === "asc"
			? valueA.localeCompare(valueB)
			: valueB.localeCompare(valueA);
	});

	const calculatedTotalPages = Math.ceil(sortedData.length / size);
	const currentPageSafe = Math.min(
		currentPage,
		calculatedTotalPages > 0 ? calculatedTotalPages : 1
	);

	const paginatedData = sortedData.slice(
		(currentPageSafe - 1) * size,
		currentPageSafe * size
	);

	// Menambahkan pengecekan apakah data kosong setelah pencarian
	const isDataEmpty = searchTerm && paginatedData.length === 0;

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
				<div className="p-4 md:p-6 xl:p-5">
					<div className="flex justify-between items-center gap-5 xl:gap-7.5">
						{/* Tombol Add di bagian kiri */}
						<label
							type="submit"
							className="rounded-md inline-flex items-center justify-center gap-2.5 cursor-pointer bg-primary py-4 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-6"
						>
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</span>
							<ModalAddItem
								name={"Add Item"}
								test={"add"}
								addToTable={handleAdd}
								data={data}
							/>
						</label>

						{/* Kolom kanan: Search, Size, dan Sorting */}
						<div className="flex items-center gap-5">
							{/* Search */}
							<div className="relative">
								<input
									type="text"
									placeholder="Search..."
									className="border dark:text-black bg-white border-dark rounded-md px-3 py-2 focus:outline-none focus:border-primary w-30 md:w-45 xl:w-80"
									value={searchTerm}
									onChange={handleSearchChange}
								/>
								<span className="absolute inset-y-0 right-0 flex items-center pr-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
										/>
									</svg>
								</span>
							</div>

							{/* Size */}
							<select
								value={size}
								onChange={(e) => {
									setSize(Number(e.target.value));
									setCurrentPage(1);
								}}
								className="border text-gray-300 bg-white dark:bg-meta-4 border-gray-200 rounded-md px-1 py-2 focus:outline-none hover:bg-primary dark:hover:bg-primary hover:text-white dark:hover:text-white"
							>
								<option
									className="bg-white text-black dark:bg-meta-4 dark:text-white"
									value={10}
								>
									10
								</option>
								<option
									className="bg-white text-black dark:bg-meta-4 dark:text-white"
									value={25}
								>
									25
								</option>
								<option
									className="bg-white text-black dark:bg-meta-4 dark:text-white"
									value={50}
								>
									50
								</option>
								<option
									className="bg-white text-black dark:bg-meta-4 dark:text-white"
									value={100}
								>
									100
								</option>
							</select>

							{/* Sorting */}
							<div className="relative" ref={dropdownRef}>
								<button
									className="border rounded-md p-2 bg-white text-gray-300 dark:bg-meta-4 focus:outline-none hover:bg-primary hover:text-white dark:hover:bg-primary"
									onClick={toggleFilterMenu}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth="1.5"
										stroke="currentColor"
										className="w-6 h-6"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
										/>
									</svg>
								</button>

								{/* Dropdown Menu */}
								{isFilterMenuOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white dark:bg-meta-4 dark:text-white border border-gray-200 rounded-md shadow-lg">
										{[
											{ field: "id", order: "asc", label: "ID Asc" },
											{ field: "id", order: "desc", label: "ID Desc" },
											{
												field: "Brand.name",
												order: "asc",
												label: "Name Asc",
											},
											{
												field: "Brand.name",
												order: "desc",
												label: "Name Desc",
											},
											{ field: "lowStock", order: "asc", label: "Low Stock" },
										].map((option) => (
											<button
												key={`${option.field}-${option.order}`}
												className={`block w-full px-4 py-1 text-left ${
													sortField === option.field &&
													sortOrder === option.order
														? "bg-primary text-white"
														: "hover:bg-gray-100 dark:hover:bg-boxdark"
												}`}
												onClick={() => {
													setSortField(option.field);
													setSortOrder(option.order);
													setIsFilterMenuOpen(false); // Tutup dropdown
												}}
											>
												{option.label}
											</button>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="max-w-full overflow-x-auto">
					<table className="max-w-full overflow-x-auto w-full">
						<thead>
							<tr className="dark:bg-form-strokedark bg-bodydark text-left">
								<th className="min-w-[50px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									#
								</th>
								<th className="max-w-[10px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Image
								</th>
								<th className="min-w-[150px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Name
								</th>
								<th className="min-w-[150px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Type
								</th>
								<th className="min-w-[150px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Category
								</th>
								<th className="min-w-[150px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Price
								</th>
								<th className="min-w-[120px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Size
								</th>
								<th className="min-w-[120px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Stock
								</th>
								<th className="min-w-[150px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									description
								</th>
								<th className="py-4 px-4 text-center font-semibold text-gray-800 dark:text-white">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{isDataEmpty ? (
								<tr>
									<td
										colSpan="4"
										className="text-center text-xl font-bold italic py-4 text-danger"
									>
										Data not found.
									</td>
								</tr>
							) : (
								paginatedData.map((value, key) => (
									<tr
										key={key}
										className="border-b dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
									>
										<td className="border-b border-[#eee] px-4 text-center dark:border-strokedark ">
											{currentPage === 1
												? key + 1
												: (currentPage - 1) * size + key + 1}
										</td>
										<td className=" py-2  px-4 dark:border-strokedark flex items-center justify-center">
											<div
												className="w-10 h-10 cursor-pointer"
												onClick={() => openModal(value?.Brand?.image_url)}
											>
												<img
													src={`uploads/brand/${value?.Brand?.image_url}`}
													alt={value?.Brand?.name || "Brand image"}
													className="object-cover w-full h-full rounded-full"
												/>
											</div>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white">
												{value?.Brand?.name}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white">
												{value?.Brand?.type}
											</p>
										</td>

										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white">
												{value?.Brand?.Category?.name}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white">
												{formatIDR(value.price)}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white">{value.size}</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark">
											<p
												className={
													value.stock < 10
														? "text-warning flex justify-center items-center"
														: "text-black dark:text-white"
												}
											>
												{value.stock < 10
													? `${value.stock} 
`
													: value.stock}

												{value.stock < 10 ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke-width="1.5"
														stroke="currentColor"
														className="w-6 h-6 ml-2"
													>
														<path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
														/>
													</svg>
												) : (
													""
												)}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white">
												{value.description}
											</p>
										</td>

										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark">
											<div className="flex justify-center space-x-3.5">
												<label
													htmlFor="edit"
													className="hover:text-primary cursor-pointer"
													onClick={() => handleEdit(value.id)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="w-6 h-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="1.5"
															d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
														/>
													</svg>
												</label>

												<button
													className="hover:text-primary"
													onClick={() => handleDelete(value.id)}
												>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="w-6 h-6"
														fill="none"
														viewBox="0 0 24 24"
														stroke="red"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="1.5"
															d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
														/>
													</svg>
												</button>
											</div>
										</td>
									</tr>
								))
							)}
							<ModalEditItem
								data={update}
								test={"edit"}
								addToTable={handleEditData}
								setUpdate={setUpdate}
							/>
						</tbody>
					</table>
				</div>
				<div className="items-center float-right py-4">
					{filteredData.length > 0 &&
						calculatedTotalPages > 1 &&
						filteredData.length > size && (
							<div className="flex items-center justify-end space-x-1">
								{/* Tombol First */}
								{currentPage > 2 && (
									<button
										className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
										onClick={() => paginationHandle(1, calculatedTotalPages)}
										aria-label="First Page"
									>
										First
									</button>
								)}

								{/* Tombol Previous */}
								{currentPage > 1 && (
									<button
										className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
										onClick={() => onPaginationPrevious(currentPage)}
										aria-label="Previous"
									>
										&laquo; Previous
									</button>
								)}

								{/* Pagination Numbers */}
								<div className="flex items-center space-x-1">
									{currentPage > 1 && (
										<button
											key={currentPage - 1}
											className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
											onClick={() =>
												paginationHandle(currentPage - 1, calculatedTotalPages)
											}
										>
											{currentPage - 1}
										</button>
									)}
									<button
										key={currentPage}
										className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md shadow-sm transition-all duration-100"
										onClick={() =>
											paginationHandle(currentPage, calculatedTotalPages)
										}
									>
										{currentPage}
									</button>
									{currentPage < calculatedTotalPages && (
										<button
											key={currentPage + 1}
											className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
											onClick={() =>
												paginationHandle(currentPage + 1, calculatedTotalPages)
											}
										>
											{currentPage + 1}
										</button>
									)}
								</div>

								{/* Tombol Next */}
								{currentPage < calculatedTotalPages && (
									<button
										className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
										onClick={() => onPaginationNext(currentPage)}
										aria-label="Next"
									>
										Next &raquo;
									</button>
								)}

								{/* Tombol Last */}
								{currentPage < calculatedTotalPages - 1 && (
									<button
										className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
										onClick={() =>
											paginationHandle(
												calculatedTotalPages,
												calculatedTotalPages
											)
										}
										aria-label="Last Page"
									>
										Last
									</button>
								)}
							</div>
						)}
				</div>
			</div>

			{isModalOpen && (
				<ModalImageItem imageUrl={imageModal} closeModal={closeModal} />
			)}
		</>
	);
};
export default TableItems;
