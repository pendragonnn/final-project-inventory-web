import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import UserData from "@/data/user/index";

const ModalUserAdd = ({ name, test, addToTable }) => {
	const modalCheckbox = useRef(null);
	const [file, setFile] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			return;
		}

		try {
			// Create user without image first
			const userWithoutImage = {
				role_id: e.target.role_id.value,
				full_name: e.target.full_name.value,
				email: e.target.email.value,
				password: e.target.password.value,
			};

			// Make a POST request to create user without image
			const userResponse = await UserData.addUser(userWithoutImage);

			// Retrieve user ID from the response
			const userId = userResponse.data.data.id;
			console.log(userId);
			// Create FormData to handle file upload
			const formData = new FormData();
			formData.append("role_id", e.target.role_id.value);
			formData.append("full_name", e.target.full_name.value);
			formData.append("email", e.target.email.value);
			formData.append("password", e.target.password.value);
			if (file) {
				formData.append("image_url", file);
			} else {
				const defaultImageResponse = await fetch("/uploads/user/default.png");
				const defaultImageBlob = await defaultImageResponse.blob();
				formData.append("image_url", defaultImageBlob, "default.png");
			}

			const imageResponse = await UserData.uploadImage(userId, formData);

			Swal.fire({
				position: "bottom-end",
				icon: "success",
				title: userResponse.data.message,
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

				document.getElementById("formId").reset();
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
						className="bg-[#F1F3FB] dark:bg-graydark dark:text-white w-9 h-9 rounded-full flex items-center justify-center float-right  text-xl text-[#6A718A] hover:text-primary"
					>
						x
					</label>
					<div className="rounded-sm bg-white dark:bg-boxdark">
						<div className=" py-4 px-6.5 ">
							<h3 className="font-medium text-black dark:text-white">
								Add new User
							</h3>
						</div>

						<form id="formId" action="#" onSubmit={handleSubmit}>
							<div className="p-6.5 text-start">
								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Role
									</label>
									<select
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										name="role_id"
									>
										<option value="" disabled>
											Select an role
										</option>
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
										placeholder="Enter Email"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										required
									/>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Password
									</label>
									<input
										type="password"
										name="password"
										placeholder="Enter password"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										onChange={(e) => setPassword(e.target.value)}
										required
										minLength={8}
									/>
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Confirm Password
									</label>
									<input
										type="password"
										name="retypepassword"
										placeholder="Enter password"
										className="w-full rounded border-[1.5px] text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										minLength={8}
									/>
									{password !== confirmPassword && (
										<p className="text-sm pt-1 text-danger">
											Password doesn't match !
										</p>
									)}
								</div>

								<div className="mb-4.5">
									<label className="mb-2.5 block text-black dark:text-white">
										Profile Photo <span className="text-xs">*(Optional)</span>{" "}
									</label>
									<input
										type="file"
										name="image_url"
										key={"user-photo"}
										accept="image/*"
										onChange={handleFileChange}
										className="w-full text-black dark:text-white border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
									/>
									{errorFile && <p className="text-danger mt-2">{errorFile}</p>}
								</div>

								<input
									type="submit"
									value={"Add"}
									className="flex w-full justify-center rounded cursor-pointer bg-primary p-3 font-medium text-gray"
								/>
							</div>
						</form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ModalUserAdd;
