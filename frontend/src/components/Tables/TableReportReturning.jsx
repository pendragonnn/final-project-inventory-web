import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import CalendarIcon from "../Calender/icon";

const TableReportReturning = ({
	formatDate,
	handleDelete,
	user,
	paginationHandle,
	onPaginationNext,
	onPaginationPrevious,
	currentPage,
	totalPages,
	searchTerm,
	handleSearchChange,
	filteredData,
	size,
	setSize,
	router,
	reportType,
	allData,
}) => {
	const [sortOrder, setSortOrder] = useState("desc"); // Default sort order
	const [sortField, setSortField] = useState("transaction_date"); // Default sort field
	const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
	const [startDate, setStartDate] = useState(null); // Awal rentang tanggal
	const [endDate, setEndDate] = useState(null); // Akhir rentang tanggal
	const datePickerRef = useRef(null);
	const dropdownRef = useRef(null);

	useEffect(() => {
		// Function to handle clicks outside dropdown
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsFilterMenuOpen(false);
			}
		};

		// Add event listener when menu is open
		if (isFilterMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		// Cleanup event listener
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isFilterMenuOpen]);

	const toggleFilterMenu = () => {
		setIsFilterMenuOpen(!isFilterMenuOpen);
	};

	const handleSortChange = (field, order) => {
		setSortField(field);
		setSortOrder(order);
		setIsFilterMenuOpen(false);
	};

	const filteredByDateAndSearch = allData.filter((transaction) => {
		const transactionDate = new Date(transaction.transaction_date);

		// Adjust endDate to include the entire day
		const adjustedEndDate = endDate
			? new Date(new Date(endDate).setHours(23, 59, 59, 999))
			: null;

		const transactionId = transaction?.id?.toLowerCase() || "";
		const fullName = transaction?.User?.full_name?.toLowerCase() || "";
		const outletName = transaction?.Outlet?.name?.toLowerCase() || "";
		const supplierName = transaction?.Supplier?.name?.toLowerCase() || "";
		const search = searchTerm.toLowerCase();

		// Check date range condition
		const isInDateRange =
			(!startDate || transactionDate >= startDate) &&
			(!adjustedEndDate || transactionDate <= adjustedEndDate);

		// Check search term condition
		const matchesSearchTerm =
			search === "" ||
			transactionId.includes(search) ||
			fullName.includes(search) ||
			outletName.includes(search) ||
			supplierName.includes(search);

		// Return data that matches both conditions
		return isInDateRange && matchesSearchTerm;
	});

	// Sort data after filtering
	const sortedData = filteredByDateAndSearch.sort((a, b) => {
		const extractNumber = (id) => parseInt(id.match(/\d+$/)[0]); // Extract number from ID
		if (sortField === "transaction_date") {
			return sortOrder === "desc"
				? new Date(b.transaction_date) - new Date(a.transaction_date)
				: new Date(a.transaction_date) - new Date(b.transaction_date);
		} else if (sortField === "id") {
			const numA = extractNumber(a.id);
			const numB = extractNumber(b.id);
			return sortOrder === "desc" ? numB - numA : numA - numB;
		}
		return 0;
	});

	totalPages = Math.ceil(filteredByDateAndSearch.length / size);

	filteredData = sortedData.slice((currentPage - 1) * size, currentPage * size);

	const addFormattedText = (
		doc,
		text,
		x,
		y,
		isBold = false,
		isItalic = false,
		fontSize = 12
	) => {
		// Tentukan font
		doc.setFont("helvetica", isBold ? "bold" : isItalic ? "italic" : "normal");
		doc.setFontSize(fontSize);
		doc.text(text, x, y);
	};

	const exportPDF = () => {
		const doc = new jsPDF();

		// Tentukan nama file berdasarkan jenis laporan dan waktu ekspor
		const now = new Date();
		const formattedDate = now.toLocaleDateString("en-GB"); // Format DD/MM/YYYY
		const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }); // Format HH:MM:SS
		const timestamp = `${formattedDate} ${formattedTime}`.replace(/\//g, "-");

		const fileName = `Report_${reportType}_${timestamp}.pdf`;

		// Menggunakan fungsi pembantu untuk menambahkan teks
		addFormattedText(doc, `Report: ${reportType}`, 14, 10, true); // Bold
		addFormattedText(doc, `Date: ${timestamp}`, 14, 16); // Normal

		// Tambahkan informasi range tanggal jika ada
		if (startDate || endDate) {
			const formattedStartDate = startDate
				? new Date(startDate).toLocaleDateString("en-GB")
				: "Not specified";
			const formattedEndDate = endDate
				? new Date(endDate).toLocaleDateString("en-GB")
				: "Not specified";

			addFormattedText(
				doc,
				`Date Range: ${formattedStartDate} to ${formattedEndDate}`,
				14,
				22
			);
		}

		const tableColumn = [
			"No",
			"User",
			"Outlet",
			"Supplier",
			"Information",
			"Transaction Date",
		];
		const tableRows = [];

		// Pastikan menggunakan data yang sesuai dengan size dan currentPage
		filteredData.forEach((item, index) => {
			const rowData = [
				(currentPage - 1) * size + index + 1,
				item?.User?.full_name || "-",
				item?.Outlet?.name || "-",
				item?.Supplier?.name || "-",
				item.information || "-",
				formatDate(item.transaction_date),
			];
			tableRows.push(rowData);
		});

		// Tambahkan tabel ke PDF
		doc.autoTable({
			head: [tableColumn],
			body: tableRows,
			startY: startDate || endDate ? 28 : 22, // Adjust posisi tabel jika ada range tanggal
		});

		// Unduh file PDF dengan nama yang dinamis
		doc.save(fileName);
	};

	const exportExcel = () => {
		// Membuat data dalam format yang sesuai untuk file Excel
		const tableColumn = [
			"No",
			"User",
			"Outlet",
			"Supplier",
			"Information",
			"Transaction Date",
		];
		const tableRows = [];

		// Pastikan hanya data yang sesuai dengan currentPage dan size yang diekspor
		filteredData.forEach((item, index) => {
			const rowData = [
				(currentPage - 1) * size + index + 1, // Nomor urut sesuai halaman
				item?.User?.full_name || "-",
				item?.Outlet?.name || "-",
				item?.Supplier?.name || "-",
				item.information || "-",
				formatDate(item.transaction_date),
			];
			tableRows.push(rowData);
		});

		// Buat worksheet dan workbook untuk Excel
		const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Report Data");

		// Tentukan nama file Excel dengan waktu dan jenis laporan
		const now = new Date();
		const formattedDate = now.toLocaleDateString("en-GB"); // Format DD/MM/YYYY
		const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false }); // Format HH:MM:SS
		const timestamp = `${formattedDate} ${formattedTime}`.replace(/\//g, "-");
		const fileName = `Report_${reportType}_${timestamp}.xlsx`;

		// Simpan dan unduh file Excel
		XLSX.writeFile(wb, fileName);
	};
	const isDataEmpty =
		(!searchTerm && filteredData.length === 0) || filteredData.length === 0;

	return (
		<>
			<div className="rounded-lg border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
				<div className="max-w-full overflow-x-auto">
					<div className="relative flex items-center justify-between mb-5	">
						{/* Search Box (kiri) */}
						<div className="flex items-center">
							<input
								type="text"
								placeholder="Search..."
								className="border dark:text-gray  bg-transparent border-dark rounded-md px-3 py-2 focus:outline-none focus:border-primary w-30 md:w-45 xl:w-80"
								value={searchTerm}
								onChange={handleSearchChange}
							/>
						</div>

						{/* Filter and Select (kanan) */}
						<div className="flex items-center space-x-2">
							<div className="relative">
								<div className="flex justify-between">
									{/* Tombol Ekspor PDF */}
									<button
										onClick={exportPDF}
										className="bg-primary text-white py-2 px-2 rounded hover:bg-dark text-xs text-center inline-flex items-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
											/>
										</svg>
										Export PDF
									</button>
								</div>
							</div>
							<div className="relative">
								<div className="flex justify-between">
									<button
										onClick={exportExcel}
										className="bg-primary text-white py-2 px-2 rounded hover:bg-dark text-xs text-center inline-flex items-center"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-6 h-6"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
											/>
										</svg>
										Export excel
									</button>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="relative">
									<DatePicker
										ref={datePickerRef}
										selected={startDate}
										onChange={(date) => setStartDate(date)}
										selectsStart
										startDate={startDate}
										endDate={endDate}
										placeholderText="Start Date"
										className="border rounded-md px-2 py-1 bg-transparent text-[85%] w-36 pl-10"
										isClearable
										showMonthDropdown
										showYearDropdown
										dropdownMode="select"
										dateFormat="dd/MM/yyyy"
										portalId="root"
									/>
									<span
										className="absolute left-3 top-1/2 transform -translate-y-1/2"
										onClick={() => datePickerRef.current.setFocus()}
									>
										<CalendarIcon />
									</span>
								</div>

								<span className="text-gray-500 dark:text-white">to</span>

								<div className="relative">
									<DatePicker
										ref={datePickerRef}
										selected={endDate}
										onChange={(date) => setEndDate(date)}
										selectsEnd
										startDate={startDate}
										endDate={endDate}
										minDate={startDate}
										placeholderText="End Date"
										className="border rounded-md px-2 py-1 bg-transparent text-[85%]  w-36 pl-10"
										isClearable
										showMonthDropdown
										showYearDropdown
										dropdownMode="select"
										dateFormat="dd/MM/yyyy"
										portalId="root"
									/>
									<span
										className="absolute left-3 top-1/2 transform -translate-y-1/2"
										onClick={() => datePickerRef.current.setFocus()}
									>
										<CalendarIcon />
									</span>
								</div>
							</div>

							<select
								value={size}
								onChange={(e) => setSize(Number(e.target.value))}
								className="border text-gray-500 bg-white dark:bg-meta-4 border-gray-200 rounded-md px-1 py-2 focus:outline-none hover:bg-primary hover:text-white"
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
							{/* Filter Icon */}
							<div className="relative" ref={dropdownRef}>
								<button
									className="border rounded-md p-2 bg-white text-gray-500 dark:bg-meta-4 focus:outline-none hover:bg-primary hover:text-white"
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
										<button
											className="block w-full px-4 py-1 text-left hover:bg-gray dark:hover:bg-bodydark2"
											onClick={() =>
												handleSortChange("transaction_date", "asc")
											}
										>
											Transaction Date Ascending
										</button>
										<button
											className="block w-full px-4 py-1 text-left hover:bg-gray dark:hover:bg-bodydark2"
											onClick={() =>
												handleSortChange("transaction_date", "desc")
											}
										>
											Transaction Date Descending
										</button>
										<button
											className="block w-full px-4 py-1 text-left hover:bg-gray dark:hover:bg-bodydark2"
											onClick={() => handleSortChange("id", "asc")}
										>
											ID Ascending
										</button>
										<button
											className="block w-full px-4 py-1 text-left hover:bg-gray dark:hover:bg-bodydark2 "
											onClick={() => handleSortChange("id", "desc")}
										>
											ID Descending
										</button>
									</div>
								)}
							</div>
						</div>
					</div>

					<table className="w-full table-auto  min-h-[150px]">
						<thead>
							<tr className="text-left dark:bg-meta-4 bg-bodydark">
								<th className="min-w-[120px] py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
									No
								</th>
								<th className="min-w-[120px] py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
									Transaction ID
								</th>
								<th className="min-w-[120px] py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
									User
								</th>
								<th className="min-w-[150px] py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
									Supplier
								</th>
								<th className="min-w-[150px] py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
									Outlet
								</th>
								<th className="min-w-[150px] py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
									Information
								</th>
								<th className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
									Transaction Date
								</th>
								{user !== "2" && (
									<th className="py-4 px-6 text-center font-semibold text-gray-800 dark:text-white border dark:border-strokedark">
										Action
									</th>
								)}
							</tr>
						</thead>
						<tbody>
							{isDataEmpty ? (
								<tr>
									<td
										colSpan="7"
										className="py-4 text-center text-xl font-bold italic text-danger"
									>
										Data not found.
									</td>
								</tr>
							) : (
								filteredData.map((value, idx) => (
									<tr key={idx} className="border-b dark:border-strokedark">
										<td className="py-4 px-6 font-medium text-center">
											{currentPage === 1
												? idx + 1
												: (currentPage - 1) * size + idx + 1}
										</td>
										<td className="py-4 px-6 font-medium text-center">
											{value?.id}
										</td>
										<td className="py-4 px-6 font-medium text-center">
											{value?.User?.full_name}
										</td>
										<td className="py-4 px-6 font-medium text-center">
											{value?.Supplier?.name || "-"}
										</td>
										<td className="py-4 px-6 font-medium text-center">
											{value?.Outlet?.name || "-"}
										</td>
										<td className="py-4 px-6 font-medium text-center">
											{value.information}
										</td>
										<td className="py-4 px-6 font-medium text-center">
											{formatDate(value.transaction_date)}
										</td>
										{user !== "2" && (
											// <>
											<td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
												<div className="flex items-center space-x-3.5">
													<button
														className="hover:text-primary"
														onClick={() =>
															router.push(`/reports/returning/${value.id}`)
														}
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
																d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
															/>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
															/>
														</svg>
													</button>
													<button
														className="hover:text-primary"
														onClick={() => handleDelete(value.id)}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth="1.5"
															stroke="red"
															className="w-6 h-6"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
															/>
														</svg>
													</button>
												</div>
											</td>
										)}
									</tr>
								))
							)}
						</tbody>
					</table>
					<div className="items-center float-right py-4">
						{filteredData.length > 0 && totalPages > 1 && (
							<div className="flex items-center justify-end space-x-1">
								{/* Tombol First */}
								{currentPage > 2 && (
									<button
										className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
										onClick={() => paginationHandle(1, totalPages)}
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
												paginationHandle(currentPage - 1, totalPages)
											}
										>
											{currentPage - 1}
										</button>
									)}
									<button
										key={currentPage}
										className="px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md shadow-sm transition-all duration-100 "
										onClick={() => paginationHandle(currentPage, totalPages)}
									>
										{currentPage}
									</button>
									{currentPage < totalPages && (
										<button
											key={currentPage + 1}
											className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
											onClick={() =>
												paginationHandle(currentPage + 1, totalPages)
											}
										>
											{currentPage + 1}
										</button>
									)}
								</div>

								{/* Tombol Next */}
								{currentPage < totalPages && (
									<button
										className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
										onClick={() => onPaginationNext(currentPage)}
										aria-label="Next"
									>
										Next &raquo;
									</button>
								)}

								{/* Tombol Last */}
								{currentPage < totalPages - 1 && (
									<button
										className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 hover:text-primary transition-all duration-100 dark:text-gray-200 dark:bg-meta-4 dark:border-gray-600 dark:hover:bg-boxdark"
										onClick={() => paginationHandle(totalPages, totalPages)}
										aria-label="Last Page"
									>
										Last
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
export default TableReportReturning;
