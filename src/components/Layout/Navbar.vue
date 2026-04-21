<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <h2 class="brand-logo">
          <n-icon size="28" class="logo-icon">
            <CartOutline />
          </n-icon>
          BlueMart Analytics
        </h2>
      </div>

      <button class="hamburger" @click="toggleMenu" :class="{ active: isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Menú lateral deslizable -->
    <div class="navbar-menu" :class="{ active: isMenuOpen }">
      <div class="menu-header">
        <h3>Menú</h3>
        <button class="close-btn" @click="closeMenu">
          <n-icon size="24">
            <CloseOutline />
          </n-icon>
        </button>
      </div>
      
      <div class="menu-links">
        <router-link to="/dashboard" class="nav-link" @click="closeMenu">
          <n-icon size="24" class="nav-icon">
            <StatsChartOutline />
          </n-icon>
          Dashboard
        </router-link>
        <router-link to="/products" class="nav-link" @click="closeMenu">
          <n-icon size="24" class="nav-icon">
            <CubeOutline />
          </n-icon>
          Productos
        </router-link>
        <router-link to="/analytics" class="nav-link" @click="closeMenu">
          <n-icon size="24" class="nav-icon">
            <TrendingUpOutline />
          </n-icon>
          Análisis
        </router-link>
        <router-link to="/inventory" class="nav-link" @click="closeMenu">
          <n-icon size="24" class="nav-icon">
            <ClipboardOutline />
          </n-icon>
          Inventario
        </router-link>
        <button @click="handleLogout" class="nav-link logout-btn">
          <n-icon size="24" class="nav-icon">
            <LogOutOutline />
          </n-icon>
          Cerrar Sesión
        </button>
      </div>
    </div>

    <!-- Overlay oscuro -->
    <div class="overlay" :class="{ active: isMenuOpen }" @click="closeMenu"></div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { NIcon } from 'naive-ui';
import {
  CartOutline,
  StatsChartOutline,
  CubeOutline,
  TrendingUpOutline,
  ClipboardOutline,
  LogOutOutline,
  CloseOutline
} from '@vicons/ionicons5';

const router = useRouter();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleLogout = async () => {
  try {
    await axios.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true
    });
    router.push('/');
    closeMenu();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(20px);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.2rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  flex: 1;
}

.brand-logo {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.logo-icon {
  font-size: 2rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.15);
  }
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 10px;
  z-index: 1001;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.hamburger:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.hamburger span {
  width: 26px;
  height: 3px;
  background: white;
  border-radius: 3px;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  transform-origin: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hamburger.active {
  background: rgba(255, 255, 255, 0.3);
}

.hamburger.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.4rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: transparent;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  white-space: nowrap;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.nav-link:hover::before {
  left: 0;
}

.nav-link:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.3);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.nav-icon {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.nav-link:hover .nav-icon {
  transform: scale(1.2) rotate(5deg);
}

.logout-btn {
  background: rgba(255, 59, 59, 0.2);
  margin-left: 0.5rem;
  border-color: rgba(255, 59, 59, 0.3);
}

.logout-btn:hover {
  background: rgba(255, 59, 59, 0.9);
  border-color: rgba(255, 59, 59, 1);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem 1.5rem;
  }

  .hamburger {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 320px;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    padding: 5.5rem 2rem 2rem;
    gap: 1rem;
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.4);
    transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    overflow-y: auto;
  }

  .navbar-menu.active {
    right: 0;
  }

  .navbar-menu::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5rem;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent);
    pointer-events: none;
  }

  .nav-link {
    width: 100%;
    justify-content: flex-start;
    padding: 1.2rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 14px;
    animation: slideInRight 0.3s ease-out backwards;
  }

  .nav-link:nth-child(1) { animation-delay: 0.1s; }
  .nav-link:nth-child(2) { animation-delay: 0.15s; }
  .nav-link:nth-child(3) { animation-delay: 0.2s; }
  .nav-link:nth-child(4) { animation-delay: 0.25s; }
  .nav-link:nth-child(5) { animation-delay: 0.3s; }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .nav-link::before {
    background: rgba(255, 255, 255, 0.2);
  }

  .logout-btn {
    margin-left: 0;
    margin-top: 1rem;
    background: rgba(255, 59, 59, 0.3);
  }

  .brand-logo {
    font-size: 1.4rem;
  }

  .logo-icon {
    font-size: 1.7rem;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0.9rem 1.2rem;
  }

  .brand-logo {
    font-size: 1.2rem;
  }

  .logo-icon {
    font-size: 1.5rem;
  }

  .navbar-menu {
    width: 100%;
    right: -100%;
  }

  .nav-link {
    padding: 1.1rem 1.3rem;
    font-size: 1.05rem;
  }
}
</style>
