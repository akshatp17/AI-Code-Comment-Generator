import axios from "axios";

const API_BASE_URL = "https://ai-code-comment-generator.onrender.com";

export const generateComments = async (code: string, language: string) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/v1/comments/ai-comment`,
			{
				code,
				language,
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error generating comments:", error);
		throw error;
	}
};
