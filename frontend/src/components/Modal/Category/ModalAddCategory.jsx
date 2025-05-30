import React from "react";
import Swal from "sweetalert2";
import Category from "@/data/category/index";
import { useRef } from "react";

const ModalAddCategory = ({ name, test, addToTable }) => {
	const modalCheckbox = useRef(null);
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await Category.addCategory({
				name: e.target.name.value,
			});
			Swal.fire({
				position: "bottom-end",
				icon: "success",
				title: res.data.message,
				showConfirmButton: false,
				timer: 2000,
				customClass: {
					popup: document.body.classList.contains("dark")
						? "swal-custom-dark"
						: "swal-custom-light",
				},
			}).then(() => {
				addToTable(res.data.data);
				modalCheckbox.current.checked = false;
				document.getElementById("formId").reset();
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

				<div className="modal-box bg-white dark:bg-boxdark relative z-50">
					<label
						htmlFor={test}
						className="bg-[#F1F3FB] dark:bg-graydark dark:text-white w-9 h-9 rounded-full flex items-center justify-center float-right cursor-pointer text-xl text-[#6A718A] hover:text-primary"
					>
						x
					</label>
					<div className="rounded-sm bg-white dark:bg-boxdark">
						<div className=" py-4 px-6.5 ">
							<h3 className="font-medium text-black dark:text-white">
								Add new Category
							</h3>
						</div>

						<form id="formId" action="#" onSubmit={handleSubmit}>
							<div className="p-6.5 text-start">
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Name
									</label>
									<input
										type="text"
										name="name"
										placeholder="Enter Category Name"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
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

export default ModalAddCategory;
