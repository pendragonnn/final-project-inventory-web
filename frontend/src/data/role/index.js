import Cookies from "js-cookie";
import axios from "axios";

const token = Cookies.get("token");
console.log("Token:", token); // Memeriksa apakah token ada dan valid

const headers = {
	"content-type": "application/json; charset=utf=UTF-8",
	Authorization: `Bearer ${token}`,
};

const getRole = async (data) => {
	try {
		const result = await axios.get("http://localhost:8000/api/v1/role", data, {
			headers: headers,
		});

		console.log("Response data:", result.data.data);
		return result;
	} catch (error) {
		console.error("Error:", error.message);
		throw error;
	}
};

export default getRole;
