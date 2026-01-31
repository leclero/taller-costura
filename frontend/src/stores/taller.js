import { defineStore } from 'pinia';
import axios from 'axios';

export const useTallerStore = defineStore('taller', {
state: () => ({
    prendas: [],
    loading: false
}),
actions: {
    async fetchPrendas() {
    this.loading = true;
    try {
        const response = await axios.get('http://localhost:5000/api/prendas');
        this.prendas = response.data;
    } catch (error) {
        console.error("Error cargando prendas:", error);
    } finally {
        this.loading = false;
    }
    }
}
});