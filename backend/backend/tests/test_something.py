from unittest.mock import patch

from rest_framework import status
from rest_framework.test import APITestCase


class TestCrud(APITestCase):
    @patch('backend.main.get_all_report_configs')
    def test_get_all_report_configs(self, mock_get_all_report_configs):
        
        #TODO: Build out some factories

        expected_data = [...]  # Replace with the expected data

        # Mock the behavior of your data retrieval method
        mock_get_all_report_configs.return_value = expected_data

        # Act
        response = self.client.get('/reports')  # Replace with the actual API endpoint

        # Assert
        mock_get_all_report_configs.assert_called_once()  # Ensure the method is called
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_data)