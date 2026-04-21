<template>
  <div class="app-layout">
    <div class="layout-body">
      <Sidebar @sidebar-toggle="handleSidebarToggle" />
      <main class="main-content" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';

const isSidebarCollapsed = ref(false);

const handleSidebarToggle = (collapsed) => {
  isSidebarCollapsed.value = collapsed;
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-body {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  min-height: 100vh;
  background: #f5f7fa;
  padding: 2rem;
}

.main-content.sidebar-collapsed {
  margin-left: 80px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }

  .main-content.sidebar-collapsed {
    margin-left: 0;
  }
}
</style>

