<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle">
            <span class="logo-icon">🛒</span>
          </div>
          <h1 class="login-title">BlueMart Analytics</h1>
          <p class="login-subtitle">Sistema de Análisis de Datos</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">
              <span class="label-icon">👤</span>
              Usuario
            </label>
            <input
              id="username"
              v-model="credentials.username"
              type="text"
              placeholder="Ingresa tu usuario"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">
              <span class="label-icon">🔒</span>
              Contraseña
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="Ingresa tu contraseña"
              required
              class="form-input"
            />
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="btn-spinner"></span>
            <span v-else>🚀 Iniciar Sesión</span>
          </button>

          <div v-if="error" class="error-message">
            ⚠️ {{ error }}
          </div>

          <div class="login-footer">
            <p>Usuario: <strong>admin</strong> | Contraseña: <strong>admin123</strong></p>
          </div>
        </form>
      </div>

      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);
const error = ref('');

const credentials = ref({
  username: '',
  password: ''
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', credentials.value, {
      withCredentials: true
    });
    
    console.log('Login exitoso:', response.data);
    router.push('/dashboard');
  } catch (err) {
    console.error('Error de login:', err);
    error.value = err.response?.data?.message || 'Error al iniciar sesión. Verifica el servidor.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-circle {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.logo-icon {
  font-size: 3rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
}

.login-subtitle {
  font-size: 1rem;
  color: #718096;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-icon {
  font-size: 1.2rem;
}

.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  transition: all 0.3s ease;
  background: #f7fafc;
  font-family: inherit;
}

.form-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.form-input::placeholder {
  color: #a0aec0;
}

.btn-login {
  width: 100%;
  padding: 1.1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.5);
}

.btn-login:active:not(:disabled) {
  transform: translateY(-1px);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: 1rem;
  background: #fff5f5;
  border: 2px solid #fc8181;
  border-radius: 12px;
  color: #c53030;
  font-weight: 600;
  text-align: center;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

.login-footer {
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
  text-align: center;
}

.login-footer p {
  font-size: 0.9rem;
  color: #718096;
  line-height: 1.6;
}

.login-footer strong {
  color: #667eea;
  font-weight: 700;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -50px;
  animation: float 8s ease-in-out infinite reverse;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: -75px;
  animation: float 10s ease-in-out infinite;
}

@media (max-width: 600px) {
  .login-card {
    padding: 2.5rem 2rem;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .logo-circle {
    width: 75px;
    height: 75px;
  }

  .logo-icon {
    font-size: 2.5rem;
  }

  .login-subtitle {
    font-size: 0.95rem;
  }

  .form-input {
    padding: 0.9rem 1rem;
  }

  .btn-login {
    padding: 1rem;
    font-size: 1rem;
  }
}

@media (max-width: 400px) {
  .login-card {
    padding: 2rem 1.5rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .logo-circle {
    width: 65px;
    height: 65px;
  }

  .logo-icon {
    font-size: 2rem;
  }
}
</style>
