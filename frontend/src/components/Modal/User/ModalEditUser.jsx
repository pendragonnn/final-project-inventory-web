import React, { useRef, useState, useEffect } from "react";
import Swal from "sweetalert2";
import UserData from "@/data/user/index";

const ModalEditUser = ({ data, test, addToTable }) => {
	const modalCheckbox = useRef(null);
	const [file, setFile] = useState(null);
	const [errorFile, setErrorFile] = useState("");

	const [formData, setFormData] = useState({
		role_id: data?.data?.role_id || "",
		full_name: data?.data?.full_name || "",
		email: data?.data?.email || "",
		password: data?.data?.password || "",
		image_url: data?.data?.image_url || "",
	});

	useEffect(() => {
		setFormData({
			role_id: data?.data?.role_id || "",
			full_name: data?.data?.full_name || "",
			email: data?.data?.email || "",
			password: data?.data?.password || "",
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

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const updatedData = {
				role_id: formData.role_id,
				full_name: formData.full_name,
				email: formData.email,
				password: formData.password,
			};

			// Kirim data update
			const userResponse = await UserData.updateUser(data.data.id, updatedData);

			// Upload file jika ada gambar baru
			if (file) {
				const formDataUpload = new FormData();
				formDataUpload.append("image_url", file);
				await UserData.uploadImage(data.data.id, formDataUpload);
			}

			Swal.fire({
				position: "bottom-end",
				icon: "success",
				title: userResponse.data.message || "Update successful.",
				showConfirmButton: false,
				timer: 2000,
				customClass: {
					popup: document.body.classList.contains("dark")
						? "swal-custom-dark"
						: "swal-custom-light",
				},
			}).then(() => {
				addToTable(userResponse.data.data);
				modalCheckbox.current.checked = false;

				setFormData({
					role_id: "",
					full_name: "",
					email: "",
					password: "",
					image_url: "",
				});
				setFile(null);
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
						<div className=" py-4 px-6.5 ">
							<h3 className="font-medium text-center text-black dark:text-white">
								{" "}
								Edit User
							</h3>
						</div>

						<form id="formId" action="#" onSubmit={handleSubmit}>
							<div className="p-6.5 text-start">
								<div className="mb-4.5">
									<label className="block text-black dark:text-white">
										Role
									</label>
									<label
										htmlFor="countries"
										className="block  text-sm font-medium text-gray-900 dark:text-white"
									>
										Select an option
									</label>
									<select
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										name="role_id"
										value={formData.role_id}
										onChange={(e) =>
											setFormData({ ...formData, role_id: e.target.value })
										}
									>
										<option value="1">Admin</option>
										<option value="2">Staff</option>
										<option value="3">Manager</option>
									</select>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Name
									</label>
									<input
										type="text"
										name="full_name"
										value={formData.full_name}
										onChange={(e) =>
											setFormData({ ...formData, full_name: e.target.value })
										}
										placeholder="Enter full name"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									/>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Email
									</label>
									<input
										type="text"
										name="email"
										value={formData.email}
										onChange={(e) =>
											setFormData({ ...formData, email: e.target.value })
										}
										placeholder="Enter Email"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									/>
								</div>

								<div className="mb-4.5">
									<input
										type="password"
										name="password"
										value={formData.password}
										onChange={(e) =>
											setFormData({ ...formData, password: e.target.value })
										}
										placeholder="password"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
										hidden
									/>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Profile Photo <span className="text-xs">*(Optional)</span>
									</label>
									{data?.data?.image_url && (
										<div className="mb-3">
											<img
												src={`/uploads/user/${data.data.image_url}`}
												alt="User Profile"
												className="w-200 h-200 mb-2"
											/>
											<p className="text-sm text-gray-500 dark:text-gray-300">
												Photo is already uploaded. To replace it, choose a new
												photo below.
											</p>
										</div>
									)}
									<input
										type="file"
										name="image_url"
										key={"user-photo"}
										accept="image/*"
										defaultValue={null}
										onChange={handleFileChange}
										className="w-full text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required={!data?.data?.image_url} // Make it required only if no existing image
									/>
									{errorFile && <p className="text-danger mt-2">{errorFile}</p>}

									{!data?.data?.image_url && (
										<p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
											No photo uploaded. Please choose a photo.
										</p>
									)}
								</div>

								<input
									type="submit"
									value={"Update"}
									className="flex w-full justify-center rounded cursor-pointer bg-primary p-3 font-medium text-white"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModalEditUser;
