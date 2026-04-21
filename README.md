<div align="center">

# 🛒 BlueMart Analytics System

### Sistema de Análisis de Datos Empresariales

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4.x-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)

**Sistema completo de análisis de datos empresariales con visualización interactiva, gestión de inventario y análisis de ventas en tiempo real.**

[📊 Demo](#-características-principales) • [🚀 Instalación](#-instalación) • [📖 Documentación](#-documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Datos del Sistema](#-datos-del-sistema)
- [Endpoints API](#-endpoints-api)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)

---

## ✨ Características Principales

### 🎯 Dashboard Interactivo
- **6 KPIs principales** con datos en tiempo real
- **Gráficas interactivas** de ventas mensuales, categorías y productos
- **Visualización de stock bajo** con alertas automáticas
- **Diseño responsive** adaptado a todos los dispositivos

### 📦 Gestión de Productos
- **Catálogo completo** de 200 productos únicos
- **Filtros avanzados** por categoría, subcategoría, marca y precio
- **Sistema de búsqueda** en tiempo real
- **Paginación eficiente** para grandes volúmenes de datos

### 📊 Análisis de Ventas
- **Ventas por canal** (Tienda, Website, App Móvil, Amazon, Noon)
- **Análisis por tienda** con ranking de rendimiento
- **Gráficas visuales** con Chart.js
- **Estadísticas detalladas** de más de 641K transacciones

### 📋 Control de Inventario
- **8,735 ubicaciones de inventario** monitoreadas
- **Sistema de reorden automático** con puntos críticos
- **Visualización por tienda** con stock en tiempo real
- **Filtros de stock bajo** para gestión proactiva

---

## 🛠 Tecnologías Utilizadas

### Frontend
```
Vue.js 3.x          - Framework JavaScript progresivo
Vite 6.x            - Build tool de siguiente generación
Vue Router 4.x      - Enrutamiento SPA
Axios               - Cliente HTTP
Chart.js 4.x        - Visualización de datos
Naive UI            - Librería de componentes UI
@vicons/ionicons5   - Iconos vectoriales
```

### Backend
```
Node.js 20.x        - Entorno de ejecución JavaScript
Express 4.x         - Framework web minimalista
PapaCSV             - Parser de archivos CSV
JWT                 - Autenticación con tokens
Cookie-Parser       - Manejo de cookies
CORS                - Control de acceso entre orígenes
```

### Datos
```
CSV Files           - Base de datos plana (6 archivos)
641,843 ventas      - Transacciones históricas
5,000 clientes      - Base de datos de clientes
200 productos       - Catálogo de SKUs
50 tiendas          - Ubicaciones físicas
8,735 inventarios   - Registros de stock
33 promociones      - Campañas activas
```

---

## 🏗 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Vue.js)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │Dashboard │  │Productos │  │Análisis  │  │Inventario│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘ │
└───────┼─────────────┼─────────────┼──────────────┼──────┘
        │             │             │              │
        └─────────────┴─────────────┴──────────────┘
                      │ HTTP/REST
        ┌─────────────┴─────────────────────────────┐
        │         SERVIDOR (Express)                 │
        │  ┌────────────┐  ┌──────────────────┐     │
        │  │   Auth     │  │   Controllers    │     │
        │  │Middleware  │  │ ┌──────┐┌──────┐ │     │
        │  └────────────┘  │ │Analy.││Prod. │ │     │
        │                  │ └──────┘└──────┘ │     │
        │                  └────────┬─────────┘     │
        │  ┌──────────────────────┬─┴──────────┐   │
        │  │     Services         │            │   │
        │  │ ┌──────────┐┌───────┴──────────┐ │   │
        │  │ │CSVService││AnalyticsService  │ │   │
        │  │ └────┬─────┘└──────────────────┘ │   │
        │  └──────┼─────────────────────────────┘   │
        └─────────┼────────────────────────────────┘
                  │
        ┌─────────┴─────────────────────────────────┐
        │         DATOS (CSV Files)                  │
        │  ┌──────┐┌──────┐┌──────┐┌──────┐┌─────┐ │
        │  │Sales ││Custos││Prods ││Stores││Inv. │ │
        │  └──────┘└──────┘└──────┘└──────┘└─────┘ │
        └────────────────────────────────────────────┘
```

---

## 🚀 Instalación

### Prerequisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Git**

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/Analisis-de-datos.git
cd Analisis-de-datos
```

### Paso 2: Instalar Dependencias del Frontend

```bash
npm install
```

### Paso 3: Instalar Dependencias del Backend

```bash
cd src/backend
npm install
cd ../..
```

### Paso 4: Iniciar el Backend

```bash
cd src/backend
node server.js
```

El servidor estará corriendo en `http://localhost:5000`

### Paso 5: Iniciar el Frontend (en otra terminal)

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## ⚙️ Configuración

### Credenciales de Acceso

```javascript
Usuario: admin
Contraseña: admin123
```

### Puertos por Defecto

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend  | 5000 | http://localhost:5000 |

### Configuración CORS

El backend está configurado para aceptar peticiones desde:
- `http://localhost:5173`
- `http://localhost:5174`

---

## 📊 Datos del Sistema

### Estadísticas Globales

| Métrica | Valor | Descripción |
|---------|-------|-------------|
| 💰 **Ventas Totales** | $73,214,931.30 | Ingresos totales acumulados |
| 📦 **Productos Vendidos** | 1,677,213 | Unidades vendidas |
| 🛒 **Órdenes** | 641,843 | Transacciones procesadas |
| 👥 **Clientes** | 5,000 | Base de clientes activos |
| 🎫 **Ticket Promedio** | $114.07 | Valor promedio por compra |
| 📦 **SKUs** | 200 | Productos únicos |
| 🏪 **Tiendas** | 50 | Ubicaciones físicas |
| 📋 **Inventario** | 8,735 | Registros de stock |

### Canales de Venta

```
🏪 Store (Tienda Física)    $30.2M  (41.3%)
🌐 Website                  $20.3M  (27.7%)
📱 Mobile App               $13.1M  (17.9%)
🛒 Amazon.ae                $6.5M   (8.9%)
🏬 Noon                     $3.1M   (4.2%)
```

### Distribución de Clientes

```
👨 Hombres:        2,849 (57%)
👩 Mujeres:        2,151 (43%)

🏙️ Dubai:         2,531 (50.6%)
🏙️ Abu Dhabi:     1,443 (28.9%)
🏙️ Sharjah:       1,026 (20.5%)

🥈 Silver:         2,915 (58.3%)
🥇 Gold:           1,546 (30.9%)
💎 Platinum:         539 (10.8%)
```

---

## 🔌 Endpoints API

### Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Dashboard

```http
GET /api/analytics/dashboard
Authorization: Bearer <token>

# Retorna: KPIs + gráficas (ventas mensuales, categorías, productos)
```

### Análisis

```http
GET /api/analytics/detailed-stats      # Estadísticas completas
GET /api/analytics/sales-by-channel    # Ventas por canal
GET /api/analytics/sales-by-store      # Ventas por tienda
GET /api/analytics/customers           # Listado de clientes
GET /api/analytics/stores              # Listado de tiendas
GET /api/analytics/promotions          # Promociones activas
```

### Productos

```http
GET /api/products                      # Todos los productos
GET /api/products/filter               # Filtrar productos
  ?category=Electronics
  &minPrice=100
  &maxPrice=1000
  &search=phone

GET /api/products/categories           # Categorías disponibles
GET /api/products/:id                  # Producto específico
```

### Inventario

```http
GET /api/inventory                     # Inventario completo
GET /api/inventory/low-stock           # Productos con stock bajo
```

---

## 📸 Capturas de Pantalla

### 🔐 Login
Sistema de autenticación seguro con JWT y diseño centrado responsive.

### 📊 Dashboard
KPIs principales, gráficas interactivas de ventas mensuales, top categorías y productos más vendidos.

### 📦 Catálogo de Productos
Gestión completa con filtros avanzados, búsqueda en tiempo real y paginación.

### 📈 Análisis de Ventas
Visualización de ventas por canal y tienda con gráficas de pastel y barras.

### 📋 Gestión de Inventario
Control de stock en tiempo real con sistema de alertas y filtros por estado.

---

## 📁 Estructura del Proyecto

```
Analisis-de-datos/
├── src/
│   ├── backend/
│   │   ├── controllers/         # Controladores de rutas
│   │   │   ├── analyticsController.js
│   │   │   ├── authController.js
│   │   │   ├── inventoryController.js
│   │   │   └── productController.js
│   │   ├── middleware/          # Middlewares
│   │   │   ├── authMiddleware.js
│   │   │   └── validateSchema.js
│   │   ├── models/              # Modelos de datos
│   │   │   └── db/              # Archivos CSV
│   │   │       ├── bm_sales.csv
│   │   │       ├── bm_customers.csv
│   │   │       ├── bm_inventory.csv
│   │   │       ├── bm_skus.csv
│   │   │       ├── bm_stores.csv
│   │   │       └── bm_promotions.csv
│   │   ├── routes/              # Rutas de API
│   │   │   ├── analyticsRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── inventoryRoutes.js
│   │   │   └── productRoutes.js
│   │   ├── services/            # Lógica de negocio
│   │   │   ├── analyticsService.js
│   │   │   └── csvService.js
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── components/              # Componentes Vue
│   │   ├── Analytics/
│   │   │   └── AnalyticsComponent.vue
│   │   ├── Dashboard/
│   │   │   └── DashboardComponent.vue
│   │   ├── Inventory/
│   │   │   └── InventoryComponent.vue
│   │   ├── Layout/
│   │   │   ├── MainLayout.vue
│   │   │   ├── Sidebar.vue
│   │   │   └── Navbar.vue
│   │   ├── Login/
│   │   │   └── LoginComponent.vue
│   │   └── Products/
│   │       └── ProductsComponent.vue
│   │
│   ├── views/                   # Vistas principales
│   │   ├── Analytics/
│   │   ├── Dashboard/
│   │   ├── Inventory/
│   │   ├── Login/
│   │   └── Products/
│   │
│   ├── routes/                  # Rutas de Vue Router
│   │   └── index.js
│   │
│   ├── App.vue
│   └── main.js
│
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🎨 Diseño y UX

### Paleta de Colores

```css
--primary: #667eea;          /* Morado principal */
--secondary: #764ba2;        /* Morado oscuro */
--accent: #f093fb;           /* Rosa claro */
--background: #f5f7fa;       /* Fondo gris claro */
--border: #e0e0e0;           /* Bordes sutiles */
--text: #4a5568;             /* Texto principal */
```

### Características de Diseño

- ✅ **Responsive Design**: Adaptado a desktop, tablet y móvil
- ✅ **Dark Mode Ready**: Preparado para tema oscuro
- ✅ **Animaciones Suaves**: Transiciones de 0.3s-0.4s
- ✅ **Accesibilidad**: Contraste WCAG AA compliant
- ✅ **Loading States**: Spinners y estados de carga

---

## 🔒 Seguridad

- 🔐 **Autenticación JWT**: Tokens seguros con expiración
- 🍪 **HttpOnly Cookies**: Protección contra XSS
- 🛡️ **CORS Configurado**: Control de acceso entre orígenes
- 🔑 **Validación de Esquemas**: Joi para validación de datos
- 🚫 **Sanitización**: Prevención de inyecciones

---

## 📈 Rendimiento

- ⚡ **Vite**: Build ultra rápido con HMR
- 💾 **Caché en Backend**: CSVService con caché en memoria
- 📦 **Code Splitting**: Carga lazy de componentes
- 🗜️ **Minificación**: Producción optimizada
- 🎯 **Paginación**: Manejo eficiente de grandes datasets

---

## 🤝 Contribución

¿Quieres contribuir? ¡Genial! Sigue estos pasos:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/LXRDSZN)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/)

---

## 🙏 Agradecimientos

- Vue.js Team por el increíble framework
- Chart.js por las visualizaciones
- Naive UI por los componentes
- Comunidad Open Source

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella ⭐**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

</div>
