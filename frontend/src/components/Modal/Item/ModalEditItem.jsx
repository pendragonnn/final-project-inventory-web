import Swal from "sweetalert2";
import React, { useRef, useEffect, useState } from "react";
import Item from "@/data/item/index";
import Brand from "@/data/brand/index"; // Import untuk mengambil data brand

const ModalEditItem = ({ data, test, addToTable }) => {
	const modalCheckbox = useRef(null);
	const [brands, setBrands] = useState([]); // State untuk menyimpan data brands
	const [filteredTypes, setFilteredTypes] = useState([]); // State untuk dropdown Type
	const [formData, setFormData] = useState({
		description: data?.data?.description || "",
		price: data?.data?.price || "",
		size: data?.data?.size || "",
		stock: data?.data?.stock || "",
		brand_id: data?.data?.brand_id || "",
		brand_name: "",
		brand_type: "",
	});

	useEffect(() => {
		const fetchData = async () => {
			const res = await Brand.getBrand();
			const allRes = await Brand.getBrand(1, res.data.totalItems);
			setBrands(allRes.data.data);
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (data?.data) {
			console.log("Brand ID from data:", data.data.brand_id);

			// Find the current brand by brand_id
			const currentBrand = brands.find(
				(brand) => brand.id === data.data.brand_id
			);

			setFormData({
				description: data.data.description || "",
				price: data.data.price || "",
				size: data.data.size || "",
				stock: data.data.stock || "",
				brand_id: data.data.brand_id || "",
				brand_name: currentBrand?.name || "Unknown Brand",
				brand_type: currentBrand?.type || "Unknown Type",
			});

			setFilteredTypes(
				currentBrand
					? brands
							.filter((brand) => brand.name === currentBrand.name)
							.map((b) => b.type)
					: []
			);
		}
	}, [data, brands]);

	const handleNameChange = (e) => {
		const selectedName = e.target.value;
		setFormData((prevData) => ({
			...prevData,
			brand_name: selectedName,
			brand_type: "",
		}));

		const types = brands
			.filter((brand) => brand.name === selectedName)
			.map((brand) => brand.type);
		setFilteredTypes(types);
	};

	const handleTypeChange = (e) => {
		const selectedType = e.target.value;
		setFormData((prevData) => ({
			...prevData,
			brand_type: selectedType,
		}));

		const selectedBrand = brands.find(
			(brand) =>
				brand.name === formData.brand_name && brand.type === selectedType
		);

		if (selectedBrand) {
			setFormData((prevData) => ({
				...prevData,
				brand_id: selectedBrand.id,
			}));
		}
	};

	const handleStockChange = (e) => {
		const newStock = e.target.value;
		setFormData((prevData) => ({
			...prevData,
			stock: newStock,
		}));
	};

	const handleSizeChange = (e) => {
		const newSize = e.target.value;
		setFormData((prevData) => ({
			...prevData,
			size: newSize,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const { description, price, stock, size, brand_id } = formData;
			const itemResponse = await Item.updateItem(data.data.id, {
				description,
				price,
				stock,
				size,
				brand_id,
			});

			Swal.fire({
				position: "bottom-end",
				icon: "success",
				title: itemResponse.data.message,
				showConfirmButton: false,
				timer: 2000,
				customClass: {
					popup: document.body.classList.contains("dark")
						? "swal-custom-dark"
						: "swal-custom-light",
				},
			}).then(() => {
				addToTable(itemResponse.data.data);
				modalCheckbox.current.checked = false;
			});
		} catch (error) {
			const errorMessage =
				error?.response?.data?.message || "Something went wrong"; // Menambahkan fallback error message

			console.error("Error:", errorMessage);
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
	};

	return (
		<>
			<input
				type="checkbox"
				ref={modalCheckbox}
				id={test}
				className="modal-toggle"
			/>
			<div className="modal" role="dialog">
				<div
					className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
					onClick={() => (modalCheckbox.current.checked = false)}
				></div>

				<div className="modal-box bg-white dark:bg-boxdark relative z-50">
					<label
						htmlFor={test}
						className="bg-[#F1F3FB] dark:bg-graydark dark:text-white w-9 h-9 rounded-full flex items-center justify-center float-right cursor-pointer text-xl text-[#6A718A] hover:text-primary"
					>
						x
					</label>
					<div className="rounded-sm bg-white dark:bg-boxdark">
						<div className="py-4 px-6.5">
							<h3 className="font-medium text-center text-black dark:text-white">
								Edit Item
							</h3>
						</div>

						<form action="#" onSubmit={handleSubmit}>
							<div className="p-6.5 text-start">
								{/* Input Fields */}
								{/* ... Field lainnya ... */}

								{/* Dropdown Name */}
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Brand Name
									</label>
									<select
										value={formData.brand_name}
										onChange={handleNameChange}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
									>
										<option value="" disabled>
											Select Brand Name
										</option>
										{[...new Set(brands.map((brand) => brand.name))].map(
											(name) => (
												<option key={name} value={name}>
													{name}
												</option>
											)
										)}
									</select>
								</div>

								{/* Dropdown Type */}
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Brand Type
									</label>
									<select
										value={formData.brand_type}
										onChange={handleTypeChange}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										disabled={!formData.brand_name}
									>
										<option value="">Select Brand Type</option>
										{filteredTypes.map((type) => (
											<option key={type} value={type}>
												{type}
											</option>
										))}
									</select>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										description
									</label>
									<input
										type="text"
										name="description"
										placeholder="Enter description"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										value={formData.description}
										onChange={(e) =>
											setFormData({ ...formData, description: e.target.value })
										}
										required
									/>
								</div>
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Size
									</label>
									<input
										type="number"
										name="size"
										placeholder="Enter Size"
										onChange={handleSizeChange}
										value={formData.size}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									/>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Price
									</label>
									<input
										type="number"
										name="price"
										placeholder="Enter price"
										value={formData.price}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										onChange={(e) =>
											setFormData({ ...formData, price: e.target.value })
										}
										required
									/>
								</div>
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Stock
									</label>
									<input
										type="number"
										name="stock"
										placeholder="Enter Stock"
										onChange={handleStockChange}
										value={formData.stock}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									/>
								</div>
								<input
									type="submit"
									value="Edit"
									className="flex w-full justify-center cursor-pointer rounded bg-primary p-3 font-medium text-white"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModalEditItem;
