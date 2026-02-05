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
                // CAMBIADO: De localhost a tu URL de Render
                const response = await axios.get('https://api-taller-costura.onrender.com/api/prendas');
                this.prendas = response.data;
            } catch (error) {
                console.error("Error cargando prendas:", error);
            } finally {
                this.loading = false;
            }
        }
    }
});