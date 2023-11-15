import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const reportService = {
    getAllReports: async () => {
        const response = await axios.get(`${API_BASE_URL}/reports`);
        return response.data;
    },
    deleteReport: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/reports/${id}`);
        return response.data;
    },
};

export default reportService;
