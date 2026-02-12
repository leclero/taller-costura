import { defineStore } from 'pinia';
import axios from 'axios';

export const useTallerStore = defineStore('taller', {
    // === ESTADO (La memoria de tu taller) ===
    state: () => ({
        prendas: [],    // El catálogo que viene de la base de datos
        carrito: [],    // <--- ESTO FALTABA: La bolsa de compras
        loading: false
    }),

    // === ACCIONES (Lo que tu taller puede hacer) ===
    actions: {
        // 1. Cargar el catálogo desde el servidor
        async fetchPrendas() {
            this.loading = true;
            try {
                const response = await axios.get('https://api-taller-costura.onrender.com/api/prendas');
                this.prendas = response.data;
            } catch (error) {
                console.error("Error cargando prendas:", error);
            } finally {
                this.loading = false;
            }
        },

        // 2. <--- NUEVA: Agregar prenda al carrito
        agregarAlCarrito(prenda) {
            // Verificamos si la prenda ya está en el carrito para no repetirla
            const existe = this.carrito.find(item => item._id === prenda._id);
            if (!existe) {
                this.carrito.push(prenda);
                console.log("🧵 Prenda agregada:", prenda.nombre);
            }
        },

        // 3. <--- NUEVA: Quitar prenda del carrito
        quitarDelCarrito(id) {
            this.carrito = this.carrito.filter(item => item._id !== id);
        },

        // 4. <--- NUEVA: Vaciar todo
        limpiarCarrito() {
            this.carrito = [];
        }
    },

    // === GETTERS (Cálculos rápidos) ===
    getters: {
        // Para mostrar el numerito rojo sobre el icono del carrito
        totalItems: (state) => state.carrito.length,
        
        // Para saber si el carrito está vacío
        esCarritoVacio: (state) => state.carrito.length === 0
    }
});