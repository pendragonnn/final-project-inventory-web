import Swal from "sweetalert2";
import React, { useRef, useEffect, useState } from "react";
import Category from "@/data/category/index";
import Brand from "@/data/brand/index";

const ModalEditBrand = ({ data, test, addToTable, allData }) => {
	const modalCheckbox = useRef(null);
	const [dataCategory, setDataCategory] = useState([]);
	const [file, setFile] = useState(null);
	const [isAddNew, setIsAddNew] = useState(false);
	const [newName, setNewName] = useState("");
	const [errorFile, setErrorFile] = useState("");

	const [formData, setFormData] = useState({
		name: data?.data?.name || "",
		type: data?.data?.type || "",
		category_id: data?.data?.category_id || "",
		image_url: data?.data?.image_url || "",
	});

	useEffect(() => {
		setFormData({
			name: data?.data?.name || "",
			type: data?.data?.type || "",
			category_id: data?.data?.category_id || "",
			image_url: data?.data?.image_url || "",
		});
		setErrorFile("");
		setFile(null);
	}, [data]);

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];

		if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
			setErrorFile("File size exceeds 5 MB!");
			setFile(null);
			e.target.value = null;
		} else {
			setErrorFile("");
			setFile(selectedFile);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const res = await Category.getCategory();
			const allRes = await Category.getCategory(1, res.data.totalItems);
			setDataCategory(allRes.data.data);
		};

		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const updatedData = {
				name: isAddNew ? newName : formData.name, // Gunakan nama baru jika ditambahkan
				type: formData.type,
				category_id: formData.category_id,
				image_url: formData.image_url,
			};

			const itemResponse = await Brand.updateBrand(data.data.id, updatedData);

			if (file) {
				const formDataUpload = new FormData();
				formDataUpload.append("image_url", file);
				await Brand.uploadBrand(data.data.id, formDataUpload);
			}

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

				setFormData({
					name: "",
					type: "",
					category_id: "",
					image_url: "",
				});
				setIsAddNew(false); // Reset form baru
				setNewName(""); // Reset nama baru
			});
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || "Something went wrong";

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
								Edit data Brand
							</h3>
						</div>

						<form action="#" onSubmit={handleSubmit}>
							<div className="p-6.5 text-start">
								{/* Dropdown Name */}
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Name
									</label>
									<select
										name="name"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										value={isAddNew ? "add-new" : formData.name}
										onChange={(e) => {
											const value = e.target.value;
											if (value === "add-new") {
												setIsAddNew(true);
												setNewName(""); // Reset nama baru jika memilih opsi tambah baru
											} else {
												setIsAddNew(false);
												setFormData({ ...formData, name: value });
											}
										}}
										required
									>
										<option value="" disabled>
											Select a brand name
										</option>
										{[...new Set(allData.map((item) => item.name))].map(
											(uniqueName) => (
												<option key={uniqueName} value={uniqueName}>
													{uniqueName}
												</option>
											)
										)}
										<option value="add-new">Add New</option>
									</select>
								</div>

								{/* Input Baru untuk Nama */}
								{isAddNew && (
									<div className="mb-4.5">
										<label className="mb-2.5 block text-black dark:text-white">
											New Name
										</label>
										<input
											type="text"
											value={newName}
											onChange={(e) => setNewName(e.target.value)}
											placeholder="Enter new name"
											className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
											required
										/>
									</div>
								)}

								{/* Input Type */}
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Type
									</label>
									<input
										type="text"
										name="type"
										placeholder="Enter type"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										value={formData.type}
										onChange={(e) =>
											setFormData({ ...formData, type: e.target.value })
										}
										required
									/>
								</div>

								{/* Dropdown Category */}
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Category
									</label>
									{allData.length > 0 && (
										<select
											className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
											name="category_id"
											value={formData.category_id}
											onChange={(e) =>
												setFormData({
													...formData,
													category_id: e.target.value,
												})
											}
											required
										>
											<option value="" disabled>
												Select a category
											</option>
											{dataCategory.map((value) => (
												<option key={value.id} value={value.id}>
													{value.name}
												</option>
											))}
										</select>
									)}
								</div>

								{/* Upload Image */}
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Image
									</label>
									{data?.data?.image_url && (
										<div className="mb-3">
											<img
												src={`/uploads/brand/${data.data.image_url}`}
												alt="Brand Image"
												className="w-200 h-200 mb-2"
											/>
											<p className="text-sm text-gray-500 dark:text-gray-300">
												Image is already uploaded. To replace it, choose a new
												image below.
											</p>
										</div>
									)}
									<input
										type="file"
										name="image_url"
										placeholder="Enter Image"
										accept="image/*"
										onChange={handleFileChange}
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required={!data?.data?.image_url}
									/>
									{errorFile && <p className="text-danger mt-2">{errorFile}</p>}
									{!data?.data?.image_url && (
										<p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
											No image uploaded. Please choose a photo.
										</p>
									)}
								</div>

								{/* Submit Button */}
								<input
									type="submit"
									value={"Edit"}
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

export default ModalEditBrand;
