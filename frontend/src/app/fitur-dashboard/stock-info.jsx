import { useEffect, useState } from "react";
import Item from "@/data/item/index";
import ModalImageItem from "@/components/Modal/Item/ModalImageItem";

const StockInfo = () => {
	const [data, setData] = useState([]);
	const [size, setSize] = useState(5);
	const [imageModal, setImageModalUrl] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const res = await Item.getItemStock(size);
			setData(res.data.data);
		};
		fetchData();
	}, [size]);

	const openModal = (imageUrl) => {
		setModalOpen(true);
		setImageModalUrl(imageUrl);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	return (
		<>
			<div className="space-y-6 dark:bg-boxdark dark:text-white">
				<div className="bg-white dark:bg-boxdark px-3 py-3 rounded-lg shadow-lg">
					<h2 className="text-lg font-semibold p-3 mb-2">Low Stock Items</h2>
					<div className="max-w-full overflow-x-auto">
						<table className="w-full table-auto">
							<thead>
								<tr className="dark:bg-form-strokedark bg-bodydark text-left">
									<th className="min-w-[50px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white text-sm">
										{" "}
										{/* text-sm */}
										Stock
									</th>
									<th className="min-w-[150px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white text-sm">
										{" "}
										{/* text-sm */}
										Name
									</th>
									<th className="min-w-[150px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white text-sm">
										{" "}
										{/* text-sm */}
										Type
									</th>
									<th className="min-w-[50px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white text-sm">
										{" "}
										{/* text-sm */}
										Size
									</th>
									<th className="max-w-[10px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white text-sm">
										{" "}
										{/* text-sm */}
										Image
									</th>
								</tr>
							</thead>
							<tbody>
								{data?.map((value, key) => (
									<tr
										key={key}
										className="border-b dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
									>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark">
											<p
												className={
													value.stock < 10
														? "text-warning flex justify-center items-center text-sm" // text-sm
														: "text-black dark:text-white text-sm" // text-sm
												}
											>
												{value.stock < 10 ? `${value.stock} ` : value.stock}
												{value.stock < 10 ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth="1.5"
														stroke="currentColor"
														className="w-6 h-6 ml-1"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
														/>
													</svg>
												) : (
													""
												)}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white text-sm">
												{" "}
												{/* text-sm */}
												{value?.Brand?.name}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white text-sm">
												{" "}
												{/* text-sm */}
												{value?.Brand?.type}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white text-sm">
												{value.size}
											</p>{" "}
											{/* text-sm */}
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
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			{isModalOpen && (
				<ModalImageItem imageUrl={imageModal} closeModal={closeModal} />
			)}
		</>
	);
};

export default StockInfo;
