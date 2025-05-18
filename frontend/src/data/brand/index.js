import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");
const headers = {
	"content-type": "application/json; charset=utf=UTF-8",
	Authorization: `Bearer ${token}`,
};

const getBrand = async (page, size) => {
	const result = await axios.get("http://localhost:8000/api/v1/brand", {
		headers: headers,
		params: {
			page: page,
			size: size,
		},
	});
	return result;
};

const getBrandById = async (id) => {
	const result = await axios.get(`http://localhost:8000/api/v1/brand/${id}`, {
		headers: headers,
	});
	return result;
};

const addBrand = async (data) => {
	const result = await axios.post("http://localhost:8000/api/v1/brand", data, {
		headers: headers,
	});
	return result;
};

const updateBrand = async (id, data) => {
	const result = await axios.put(
		`http://localhost:8000/api/v1/brand/${id}`,
		data,
		{
			headers: headers,
		}
	);
	return result;
};

const deleteBrand = async (id) => {
	const result = await axios.delete(
		`http://localhost:8000/api/v1/brand/${id}`,
		{
			headers: headers,
		}
	);
	return result;
};

const uploadBrandPhoto = async (id, formData) => {
	const result = await axios.post(
		`http://localhost:8000/api/v1/brand/upload/${id}`,
		formData,
		{
			headers: {
				...headers,
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return result;
};

const uploadBrand = async (id, formData) => {
	const result = await axios.post(
		`http://localhost:8000/api/v1/brand/upload/${id}`,
		formData,
		{
			headers: {
				...headers,
				"Content-Type": "multipart/form-data",
			},
		}
	);
	return result;
};

function getBrandImageUrl(imageUrl) {
	return {
		src: `http://localhost:8000/api/v1/brand/upload/${imageUrl}`,
		headers: headers,
	};
}

export default {
	getBrand,
	getBrandById,
	addBrand,
	updateBrand,
	deleteBrand,
	uploadBrandPhoto,
	getBrandImageUrl,
	uploadBrand,
};
