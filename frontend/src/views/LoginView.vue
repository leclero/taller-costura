<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const user = ref('');
const pass = ref('');
const error = ref(false);
const loading = ref(false);
const showPass = ref(false);
const router = useRouter();

const handleLogin = async () => {
  error.value = false;
  loading.value = true;

  try {
    const res = await axios.post('https://api-taller-costura.onrender.com/api/auth/login-db', {
      user: user.value,
      pass: pass.value
    });

    if (res.data.success) {
      // GUARDAMOS TODO EN EL NAVEGADOR
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('userId', res.data.id); // <--- IMPORTANTE
      localStorage.setItem('userRol', res.data.rol);
      localStorage.setItem('userName', res.data.username);
      
      router.push('/admin');
    }
  } catch (err) {
    error.value = true;
    pass.value = '';
  } finally {
    loading.value = false;
  }
};
</script>