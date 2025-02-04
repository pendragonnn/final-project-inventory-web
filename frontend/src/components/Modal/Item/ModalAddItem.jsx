import React from "react";
import Swal from "sweetalert2";
import { useRef, useState, useEffect } from "react";
import Item from "@/data/item/index";
import Brand from "@/data/brand/index"; // Import API Brand

const ModalItemAdd = ({ name, test, addToTable }) => {
	const modalCheckbox = useRef(null);
	const [brands, setBrands] = useState([]); // State untuk data brand
	const [selectedName, setSelectedName] = useState(""); // Nama brand yang dipilih
	const [filteredTypes, setFilteredTypes] = useState([]); // Type berdasarkan brand
	const [selectedType, setSelectedType] = useState(""); // Type yang dipilih
	const [file, setFile] = useState(null);

	// Ambil data brand dari API
	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const response = await Brand.getBrand();
				setBrands(response.data.data);
			} catch (error) {
				console.error("Error fetching brands:", error);
			}
		};
		fetchBrands();
	}, []);

	// Ketika Name dipilih
	const handleNameChange = (e) => {
		const selectedName = e.target.value;
		setSelectedName(selectedName);

		// Filter type berdasarkan name yang dipilih
		const typesForName = brands
			.filter((brand) => brand.name === selectedName)
			.map((brand) => brand.type);
		setFilteredTypes(typesForName);
		setSelectedType(""); // Reset Type yang dipilih
	};

	// Ketika Type dipilih
	const handleTypeChange = (e) => {
		setSelectedType(e.target.value);
	};

	// Fungsi Submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Cari brand_id berdasarkan Name dan Type
			const selectedBrand = brands.find(
				(brand) => brand.name === selectedName && brand.type === selectedType
			);

			if (!selectedBrand) {
				Swal.fire({
					position: "bottom-end",
					icon: "error",
					title: "Brand not found!",
					showConfirmButton: false,
					timer: 2000,
					customClass: {
						popup: document.body.classList.contains("dark")
							? "swal-custom-dark"
							: "swal-custom-light",
					},
				});
				return;
			}

			const itemWithoutImage = {
				brand_id: selectedBrand.id, // Hanya mengirimkan brand_id
				description: e.target.description.value,
				price: e.target.price.value,
				size: e.target.size.value,
				stock: e.target.stock.value,
			};

			const responsItem = await Item.addItem(itemWithoutImage);
			if (file) {
				const itemId = responsItem.data.data.id;

				const formData = new FormData();
				formData.append("image_url", file);

				await Item.uploadItem(itemId, formData);
			}

			Swal.fire({
				position: "bottom-end",
				icon: "success",
				title: responsItem.data.message,
				showConfirmButton: false,
				timer: 2000,
				customClass: {
					popup: document.body.classList.contains("dark")
						? "swal-custom-dark"
						: "swal-custom-light",
				},
			}).then(() => {
				addToTable(responsItem.data.data);
				modalCheckbox.current.checked = false;
				document.getElementById("formId").reset();
				setSelectedName("");
				setFilteredTypes([]);
			});
		} catch (e) {
			const errorMessage = e.response?.data?.message || "Something went wrong";
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
			<label htmlFor={test} className="cursor-pointer">
				{name}
			</label>
			<input
				type="checkbox"
				id={test}
				ref={modalCheckbox}
				className="modal-toggle"
			/>
			<div className="modal" role="dialog">
				<div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"></div>
				<div
					className="modal-box bg-white dark:bg-boxdark relative z-50"
					onClick={(e) => e.stopPropagation()}
				>
					<label
						htmlFor={test}
						className="bg-[#F1F3FB] dark:bg-graydark dark:text-white w-9 h-9 rounded-full flex items-center justify-center float-right cursor-pointer text-xl text-[#6A718A] hover:text-primary"
					>
						x
					</label>
					<div className="rounded-sm bg-white dark:bg-boxdark">
						<div className=" py-4 px-6.5 ">
							<h3 className="font-medium text-black dark:text-white">
								Add new Item
							</h3>
						</div>

						<form id="formId" action="#" onSubmit={handleSubmit}>
							<div className="p-6.5 text-start">
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Name
									</label>
									<select
										name="name"
										onChange={handleNameChange}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									>
										<option value="">Select a name</option>
										{[...new Set(brands.map((brand) => brand.name))].map(
											(name, index) => (
												<option key={index} value={name}>
													{name}
												</option>
											)
										)}
									</select>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Type
									</label>
									<select
										name="type"
										onChange={handleTypeChange}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
										disabled={!filteredTypes.length}
									>
										<option value="">Select a type</option>
										{filteredTypes.map((type, index) => (
											<option key={index} value={type}>
												{type}
											</option>
										))}
									</select>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Description
									</label>
									<input
										type="text"
										name="description"
										placeholder="Enter description"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
										placeholder="Enter size"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary appearance-none"
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
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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
										placeholder="Enter stock"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary "
										required
									/>
								</div>

								<input
									type="submit"
									value={"Add"}
									className="flex w-full justify-center cursor-pointer rounded bg-primary p-3 font-medium text-gray"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModalItemAdd;
