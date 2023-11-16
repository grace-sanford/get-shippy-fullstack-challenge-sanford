import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const reportService = {
    getAllReports: async () => {
        const response = await axios.get(`${API_BASE_URL}/reports`);
        return response.data;
    },
    getReportById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/reports/${id}`);
        return response.data;
    },
    getReportDataById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/reports/${id}/data`);
        return response.data;
    },
    getDataByDate: async (selectedDay, ticker) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/calendar/${selectedDay}/${ticker}`);
            return response.data;
        } catch (error) {
            if (error.response.length > 0 && error.response.status === 404) {
                // Handle 404 error
                console.error('Data not found:', error.response.data.detail);
                throw new Error('Data not found');
            } else {
                console.error('Error fetching data:', error);
                throw new Error(`Error fetching data: ${error.response.data.detail}`);
            }
        }
    },
    updateReportData: async (id, data) => {
        const response = await axios.put(`${API_BASE_URL}/reports/${id}`, data);
        return response.data;
    },
    createReport: async (id, data) => {
        const response = await axios.post(`${API_BASE_URL}/reports/${id}`, data);
        return response.data;
    },
    deleteReport: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/reports/${id}`);
        return response.data;
    },
};

export default reportService;
