import axios from "axios";
import { ref, computed } from "vue";

export default function useClima() {
  const clima = ref({});
  const cargando = ref(false);
  const error = ref("");

  const obtenerClima = async ({ ciudad, pais }) => {
    const key = import.meta.env.VITE_API_KEY; // Importar el API key
    const ciudadCodificada = encodeURIComponent(ciudad);
    cargando.value = true;
    clima.value = {};
    error.value = "";

    try {
      // Obtener latitud y longitud
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudadCodificada},${pais}&limit=1&appid=${key}`;

      const { data } = await axios(url);
      const { lat, lon } = data[0];

      const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;
      const { data: resultado } = await axios(urlClima); // Destructuring y renombrado de variable
      clima.value = resultado;
    } catch  {
        error.value = "Ciudad no encontrada";
    } finally {
      cargando.value = false;
    }

    // Obtener clima
  };

  const mostrarClima = computed(() => {
    return Object.values(clima.value).length > 0;
  });

  const formatearTemperatura = (temperatura) => parseInt(temperatura - 273.15);

  return {
    obtenerClima,
    clima,
    mostrarClima,
    formatearTemperatura,
    cargando,
    error
  };
}
