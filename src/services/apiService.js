// src/services/apiService.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Verwenden Sie das /api Präfix für den Proxy
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    // Schiffe
    getShips() {
        return apiClient.get('/ships');
    },
    getShip(id) {
        return apiClient.get(`/ships/${id}`);
    },
    createShip(data) {
        return apiClient.post('/ships', data);
    },
    updateShip(id, data) {
        return apiClient.put(`/ships/${id}`, data);
    },
    deleteShip(id) {
        return apiClient.delete(`/ships/${id}`);
    },
    // Container
    getContainers() {
        return apiClient.get('/containers');
    },
    getContainer(id) {
        return apiClient.get(`/containers/${id}`);
    },
    createContainer(data) {
        return apiClient.post('/containers', data);
    },
    updateContainer(id, data) {
        return apiClient.put(`/containers/${id}`, data);
    },
    deleteContainer(id) {
        return apiClient.delete(`/containers/${id}`);
    },
    getContainersByShip(shipId) {
        return apiClient.get(`/containers/ship/${shipId}`);
    },
};
