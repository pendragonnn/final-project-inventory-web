import { useEffect, useState } from "react";
import { mostItemIssued } from "@/modules/fetch/index";
import ModalImageItem from "@/components/Modal/Item/ModalImageItem";

const MostIssued = () => {
	const [data, setData] = useState([]);
	const [size, setSize] = useState(5);
	const [imageModal, setImageModalUrl] = useState(false);
	const [isModalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const res = await mostItemIssued(size);
			setData(res.data);
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
				{/* Input Form */}
				<div className="bg-white dark:bg-boxdark px-3 py-3 rounded-lg shadow-lg">
					<h2 className="text-lg font-semibold p-3 mb-2">Most Issued Items</h2>
					<div className="max-w-full overflow-x-auto">
						<table className="w-full table-auto">
							<thead>
								<tr className="dark:bg-form-strokedark bg-bodydark text-left">
									<th className="min-w-[110px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white text-sm">
										{" "}
										{/* text-sm */}
										Total Issued
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
									<th className="min-w-[60px] py-4 px-4 text-center font-semibold text-gray-800 dark:text-white text-sm">
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
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white text-sm">
												{" "}
												{/* text-sm */}
												{value?.total_issued}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white text-sm">
												{" "}
												{/* text-sm */}
												{value?.Item?.Brand?.name}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white text-sm">
												{" "}
												{/* text-sm */}
												{value?.Item?.Brand?.type}
											</p>
										</td>
										<td className="border-b border-[#eee] px-4 py-4 text-center dark:border-strokedark mx-auto">
											<p className="text-black dark:text-white text-sm">
												{" "}
												{/* text-sm */}
												{value?.Item?.size}
											</p>
										</td>
										<td className=" py-2  px-4 dark:border-strokedark flex items-center justify-center">
											<div
												className="w-10 h-10 cursor-pointer"
												onClick={() => openModal(value?.Item?.Brand?.image_url)}
											>
												<img
													src={`uploads/brand/${value?.Item?.Brand?.image_url}`}
													alt={value?.Item?.Brand?.name || "Brand image"}
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

export default MostIssued;
