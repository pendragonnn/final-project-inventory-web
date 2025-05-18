"use client";

import "@fortawesome/fontawesome-free/css/all.min.css";

import SidebarLayout from "@/app/sidebar-layout";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getTransactionDetailById } from "@/modules/fetch/index";
import Image from "next/image";
import { jsPDF } from "jspdf";
import Loader from "@/components/common/Loader";

const DetailReportIssuing = () => {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const minimumLoading = new Promise((resolve) => setTimeout(resolve, 500));
			const res = await getTransactionDetailById(id);
			setData(res.data);

			await minimumLoading;
			setLoading(false);
		};

		fetchData();
	}, [id]);

	// Fungsi untuk mengonversi harga ke format IDR
	const formatIDR = (price) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(price);
	};

	function formatDate(isoDate) {
		const date = new Date(isoDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Menambahkan leading zero jika bulan < 10
		const day = String(date.getDate()).padStart(2, "0"); // Menambahkan leading zero jika tanggal < 10
		return `${year}-${month}-${day}`;
	}

	if (!data) {
		return <p>Loading...</p>;
	}

	const totalTransaction = data.TransactionDetails.reduce(
		(total, value) => total + value.price_item * value.quantity,
		0
	);

	const handleExportPDF = () => {
		const doc = new jsPDF();
		const margin = 20;
		const pageHeight = doc.internal.pageSize.height;
		const pageWidth = doc.internal.pageSize.width;

		// Function to add simple page number header for subsequent pages
		const addPageNumberHeader = (pageNum) => {
			doc.setFont("helvetica", "normal");
			doc.text(`Page ${pageNum}`, pageWidth - margin - 12, margin + 10);
			doc.setFontSize(12);
			doc.text(`Header ID: ${id}`, pageWidth - margin - 38, margin + 20); // Adjusted position for right alignment

			return margin + 20; // Return starting Y position for content
		};

		// First page header
		doc.setFont("helvetica", "bold");
		doc.setFontSize(16);
		const text = "REPORT ISSUING DETAIL";
		const textWidth = doc.getTextWidth(text); // Menghitung lebar teks
		const xPosition = (pageWidth - textWidth) / 2; // Menempatkan teks di tengah halaman secara horizontal
		doc.text(text, xPosition, margin + 5);

		// Konten lainnya, diturunkan 10 dari judul
		let yPosition = margin + 20;

		// Handle By
		doc.setFont("helvetica", "normal");
		doc.setFontSize(12);
		doc.text(`Handle By: ${data.User.full_name}`, margin, yPosition);
		yPosition += 8;

		// Total Transaction
		doc.setFont("helvetica", "normal");
		doc.setFontSize(12);
		doc.text(
			`Total Transaction: ${formatIDR(totalTransaction)}`,
			margin,
			yPosition
		);
		doc.text(`Outlet: ${data.Outlet.name}`, margin, yPosition + 8);
		yPosition;

		// Add header_id on the right side
		doc.setFont("helvetica", "normal");
		doc.setFontSize(12);
		doc.text(`Transaction ID: ${id}`, pageWidth - margin - 46, yPosition);
		doc.text(
			`Date: ${new Date(data.transaction_date).toLocaleDateString()}`,
			pageWidth - margin - 30,
			yPosition + 8
		);

		yPosition += 15;

		// Add line after header
		doc.setLineWidth(0.5);
		doc.line(margin, yPosition, pageWidth - margin, yPosition);
		yPosition += 20;

		let currentPage = 1;

		data.TransactionDetails.forEach((item, index) => {
			// Calculate required height for current item
			const itemHeight = 40; // Approximate height needed for each item (adjusted for image + text)

			// Check if there's enough space on the current page
			if (yPosition + itemHeight > pageHeight - margin) {
				doc.addPage();
				currentPage++;
				yPosition = addPageNumberHeader(currentPage);
			}

			// Item header with number
			doc.setFont("helvetica", "bold");
			doc.setFontSize(12);
			doc.text(`Item ${index + 1}: ${item.item_id}`, margin, yPosition);
			yPosition += 10;

			// Try to add image and text side by side
			try {
				const imageWidth = 40; // Width of the image
				const imageHeight = 30; // Height of the image
				const textStartX = margin + imageWidth + 5; // Text starts to the right of the image
				const columnGap = 70; // Space between columns
				const additionalOffset = 5;

				if (item?.Item?.Brand?.image_url) {
					const imgUrl = `/uploads/brand/${item?.Item?.Brand?.image_url} `;
					doc.addImage(
						imgUrl,
						"JPEG",
						margin,
						yPosition,
						imageWidth,
						imageHeight
					);
				}

				// Align text next to the image
				doc.setFont("helvetica", "normal");
				doc.setFontSize(11);

				const details = [
					`Name: ${item.Item.Brand.name}`,
					`Type: ${item.Item.Brand.type}`,
					`Size: ${item.Item?.size}`,
					`Category: ${item.Item?.Brand.Category.name}`,
					`Quantity: ${item.quantity}`,
					`Price per item: ${formatIDR(item.price_item)}`,
					`Total: ${formatIDR(item.price_item * item.quantity)}`,
				];

				// Split details into two columns
				const half = Math.ceil(details.length / 2);
				const column1 = details.slice(0, half);
				const column2 = details.slice(half);

				// Render the first column
				column1.forEach((detail, detailIndex) => {
					const textY = yPosition + additionalOffset + detailIndex * 7; // Line height for column 1
					doc.text(detail, textStartX, textY);
				});

				// Render the second column
				column2.forEach((detail, detailIndex) => {
					const textY = yPosition + additionalOffset + detailIndex * 7; // Line height for column 2
					doc.text(detail, textStartX + columnGap, textY);
				});

				// Increment yPosition based on the image height
				yPosition += Math.max(
					imageHeight + additionalOffset,
					column1.length * 7
				);
			} catch (error) {
				console.error("Error adding image or details:", error);
				yPosition += 40; // Fallback height if image fails
			}

			// Add separator line
			if (yPosition > pageHeight - margin - 10) {
				doc.addPage();
				currentPage++;
				yPosition = addPageNumberHeader(currentPage);
			}
			doc.setLineWidth(0.2);
			doc.line(margin, yPosition, pageWidth - margin, yPosition);
			yPosition += 15;
		});

		// Add footer on last page
		doc.setFont("helvetica", "italic");
		doc.setFontSize(10);
		const footerText = "Generated on: " + new Date().toLocaleString();

		// Check if we need a new page for footer
		if (yPosition > pageHeight - margin - 10) {
			doc.addPage();
			currentPage++;
			yPosition = addPageNumberHeader(currentPage);
		}
		doc.text(footerText, margin, yPosition);

		// Add page number to first page
		doc.setPage(1);
		doc.setFont("helvetica", "normal");
		doc.setFontSize(10);
		doc.text(`Page 1`, pageWidth - margin - 12, margin + margin + 0);

		doc.save("report_issuing_detail.pdf");
	};

	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<SidebarLayout>
					<div id="pdf-container" className="space-y-6">
						<div className="bg-white dark:bg-boxdark rounded-lg shadow-md">
							<div className="flex flex-row items-center justify-between p-6">
								<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
									Report Issuing Detail :&nbsp;{data.id}
								</h1>

								<div className="flex items-center ml-auto space-x-4">
									<div className="bg-blue-50 dark:bg-meta-4  text-blue-600 dark:text-blue-300 rounded-lg px-4 py-2">
										<span className="font-semibold">Total Transaction: </span>
										<span className="font-bold">
											{formatIDR(totalTransaction)}
										</span>
									</div>
									{/* Export Button */}
									<button
										onClick={handleExportPDF}
										className="bg-primary text-white py-2 px-2 rounded hover:bg-dark text-xs text-center inline-flex items-center"
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
												d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
											/>
										</svg>
										Export PDF
									</button>
								</div>
							</div>
						</div>

						{data.TransactionDetails.map((item) => (
							<div
								key={item.id}
								className="bg-white dark:bg-boxdark rounded-xl shadow-lg overflow-hidden transform transition-all"
							>
								<div className="p-4">
									<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
										{/* Product Image and Info */}
										<div className="lg:col-span-4 flex flex-col items-center text-center justify-center">
											<div className="relative w-48 h-36 rounded-lg overflow-hidden shadow-md">
												<Image
													src={`/uploads/brand/${item?.Item?.Brand?.image_url}`}
													alt={item.Item.Brand.name}
													fill
													sizes="100%"
													className="object-cover"
													priority
												/>
											</div>
											<div className="mt-4">
												<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
													{`${item.Item.Brand.name} ${item.Item.Brand.type}`}
												</h3>
												<p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-h-24 overflow-y-auto">
													{item.Item.description}
												</p>
											</div>
										</div>

										{/* Transaction Details */}
										<div className="lg:col-span-8 space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{/* Reusable Card */}
												{[
													{
														title: "Quantity",
														value: item.quantity,
														icon: "shopping-cart",
													},
													{
														title: "Stock Before",
														value: item.stock_before,
														icon: "archive",
													},
													{
														title: "Stock After",
														value: item.stock_after,
														icon: "check-circle",
													},
													{
														title: "Price",
														value: formatIDR(item.price_item),
														icon: "dollar",
													},
													{
														title: "Total Price",
														value: formatIDR(item.price_item * item.quantity),
														icon: "dollar",
													},
													{
														title: "Handled By",
														value: data.User.full_name,
														icon: "user",
													},
													{
														title: "Size",
														value: item.Item.size || "-",
														icon: "ruler",
													},
													{
														title: "Category",
														value: item.Item.Brand.Category.name,
														icon: "tag",
													},
													{
														title: "Date",
														value: formatDate(data.transaction_date),
														icon: "calendar",
													},
													{
														title: "Outlet",
														icon: "store",
														children: [
															{
																label: "Name",
																value: data.Outlet.name || "-",
															},
															{
																label: "Phone",
																value: data.Outlet.phone || "-",
															},
															{
																label: "Address",
																value: data.Outlet.address || "-",
															},
														],
													},
												].map(({ title, value, icon, children }, idx) => (
													<div
														key={idx} // Gunakan idx sebagai fallback (kurang optimal)
														className="flex items-center p-4 bg-gray-100 dark:bg-strokedark rounded-lg shadow-md transition-all hover:bg-gray-200 dark:hover:bg-black"
													>
														<div className="bg-blue-500 p-2 rounded-md mr-4 text-white">
															<i className={`fas fa-${icon} text-xl`}></i>
														</div>
														<div>
															<p className="text-sm text-gray-500 dark:text-gray-400">
																{title}
															</p>
															<p className="text-lg font-semibold text-gray-900 dark:text-white">
																{value}
															</p>
															{children && (
																<div className="mt-2">
																	{children.map(
																		({ label, value }, childIdx) => (
																			<div
																				key={childIdx}
																				className="flex items-center"
																			>
																				<p className="text-sm text-gray-500 dark:text-gray-400">
																					{label}:
																				</p>
																				<p className="text-sm text-gray-900 dark:text-white ml-2">
																					{value}
																				</p>
																			</div>
																		)
																	)}
																</div>
															)}
														</div>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</SidebarLayout>
			)}
		</>
	);
};

export default DetailReportIssuing;
