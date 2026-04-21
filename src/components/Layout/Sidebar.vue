<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header">
      <button @click="toggleSidebar" class="toggle-btn">
        <n-icon size="24">
          <MenuOutline v-if="isCollapsed" />
          <CloseOutline v-else />
        </n-icon>
      </button>
      <transition name="fade">
        <div v-if="!isCollapsed" class="logo">
          <n-icon size="32" color="#fff">
            <CartOutline />
          </n-icon>
          <span class="logo-text">BlueMart</span>
        </div>
      </transition>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item">
        <n-icon size="22" class="nav-icon">
          <StatsChartOutline />
        </n-icon>
        <transition name="fade">
          <span v-if="!isCollapsed" class="nav-text">Dashboard</span>
        </transition>
      </router-link>

      <router-link to="/products" class="nav-item">
        <n-icon size="22" class="nav-icon">
          <CubeOutline />
        </n-icon>
        <transition name="fade">
          <span v-if="!isCollapsed" class="nav-text">Productos</span>
        </transition>
      </router-link>

      <router-link to="/analytics" class="nav-item">
        <n-icon size="22" class="nav-icon">
          <BarChartOutline />
        </n-icon>
        <transition name="fade">
          <span v-if="!isCollapsed" class="nav-text">Análisis</span>
        </transition>
      </router-link>

      <router-link to="/inventory" class="nav-item">
        <n-icon size="22" class="nav-icon">
          <ClipboardOutline />
        </n-icon>
        <transition name="fade">
          <span v-if="!isCollapsed" class="nav-text">Inventario</span>
        </transition>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="handleLogout" class="nav-item logout">
        <n-icon size="22" class="nav-icon">
          <LogOutOutline />
        </n-icon>
        <transition name="fade">
          <span v-if="!isCollapsed" class="nav-text">Salir</span>
        </transition>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { NIcon } from 'naive-ui';
import {
  MenuOutline,
  CloseOutline,
  CartOutline,
  StatsChartOutline,
  CubeOutline,
  BarChartOutline,
  ClipboardOutline,
  LogOutOutline
} from '@vicons/ionicons5';

const router = useRouter();
const isCollapsed = ref(false);
const emit = defineEmits(['sidebar-toggle']);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  emit('sidebar-toggle', isCollapsed.value);
};

const handleLogout = async () => {
  try {
    await axios.post('http://localhost:5000/api/auth/logout', {}, {
      withCredentials: true
    });
    router.push('/');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.5s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 1.5rem 0.5rem;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
}

.sidebar.collapsed .sidebar-nav {
  padding: 1.5rem 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  background: transparent;
  border: 2px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 1rem 0.5rem;
  gap: 0;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
}

.nav-item:hover::before {
  left: 0;
}

.nav-item:hover {
  transform: translateX(8px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.sidebar.collapsed .nav-item:hover {
  transform: scale(1.1);
}

.nav-item.router-link-active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.nav-icon {
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.nav-item:hover .nav-icon {
  transform: scale(1.2) rotate(5deg);
}

.nav-text {
  white-space: nowrap;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.sidebar.collapsed .sidebar-footer {
  padding: 1rem 0.5rem;
}

.logout {
  background: rgba(255, 59, 59, 0.3);
  border-color: rgba(255, 59, 59, 0.3);
}

.logout:hover {
  background: rgba(255, 59, 59, 0.9);
  border-color: rgba(255, 59, 59, 1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive - Hamburguesa en móviles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }

  .sidebar.collapsed {
    transform: translateX(-100%);
    width: 280px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100%;
  }

  .sidebar.collapsed {
    width: 100%;
  }
}
</style>
