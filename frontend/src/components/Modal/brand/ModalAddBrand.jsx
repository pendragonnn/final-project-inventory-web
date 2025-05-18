import React from "react";
import Swal from "sweetalert2";

import { useRef, useState, useEffect } from "react";
import Brand from "@/data/brand/index";
import Category from "@/data/category/index";

const ModalAddBrand = ({ name, test, addToTable, data }) => {
	const modalCheckbox = useRef(null);
	const [dataCategory, setDataCategory] = useState([]);
	const [file, setFile] = useState(null);
	const [isAddNew, setIsAddNew] = useState(false);
	const [newName, setNewName] = useState("");
	const [errorFile, setErrorFile] = useState("");

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
			const itemWithoutImage = {
				name: isAddNew ? newName : e.target.name.value,
				type: e.target.type.value,
				category_id: e.target.category_id.value,
			};

			const responsItem = await Brand.addBrand(itemWithoutImage);
			if (file) {
				const brandId = responsItem.data.data.id;

				const formData = new FormData();
				formData.append("image_url", file);

				await Brand.uploadBrand(brandId, formData);
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
				setIsAddNew(false);
				setNewName("");
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
								Add new Brand
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
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
										defaultValue=""
										onChange={(e) => setIsAddNew(e.target.value === "add-new")}
									>
										<option value="" className="dark:text-white" disabled>
											Select a brand name
										</option>
										{[...new Set(data.map((item) => item.name))].map(
											(uniqueName) => (
												<option key={uniqueName} value={uniqueName}>
													{uniqueName}
												</option>
											)
										)}
										<option className="text-primary" value="add-new">
											Add New
										</option>
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

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										type
									</label>
									<input
										type="text"
										name="type"
										placeholder="Enter type"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									/>
								</div>

								<div>
									<label className="mb-2.5 block text-black dark:text-white">
										Category
									</label>
									<select
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										name="category_id"
										required
										defaultValue=""
									>
										<option value="" disabled>
											Select an category
										</option>
										{dataCategory.map((value) => (
											<option key={value.id} value={value.id}>
												{value.name}
											</option>
										))}
									</select>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Image
									</label>
									<input
										type="file"
										name="image_url"
										formEncType="multipart/form-data"
										key={"item-photo"}
										accept="image/*"
										onChange={handleFileChange}
										className="w-full text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									/>
									{errorFile && <p className="text-danger mt-2">{errorFile}</p>}
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

export default ModalAddBrand;
