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
    updateReportData: async (id, data) => {
        console.log('data -- updateReportData', data);

        const response = await axios.put(`${API_BASE_URL}/reports/${id}`, data);
        console.log('response -- reportService', response);
        return response.data;
    },
    createReport: async (id, data) => {
        console.log('data', data);

        const response = await axios.post(`${API_BASE_URL}/reports/${id}`, data);
        console.log('response -- reportService', response);
        return response.data;
    },
    deleteReport: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/reports/${id}`);
        return response.data;
    },
};

export default reportService;
