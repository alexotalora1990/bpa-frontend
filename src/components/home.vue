<template>

  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title align="center">
          <q-avatar>
            <!-- <img src=""> -->
          </q-avatar>
          BUENAS PRACTICAS AGRICOLAS
        </q-toolbar-title>
        <!-- he aqui el boton de log out -->
        <q-btn dense flat round icon="logout" @click="logout" />
      </q-toolbar>

    </q-header>

    <q-drawer show-if v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable @click="toggleSubmenu('usuarios')">
          <q-item-section>
            <q-btn
              label="Usuarios"
              color="green"
              text-color="black"
              flat
              class="full-width"
            />
          </q-item-section>
          <q-item-section avatar>
            <q-icon :name="submenu.usuarios ? 'expand_less' : 'expand_more'" />
          </q-item-section>
        </q-item>

        <div v-if="submenu.usuarios" class="subitem">
        <q-item  v-for="item in usuariosItems" :key="item.label">
          <router-link :to="item.to">
            <q-item clickable v-ripple class="my-item">
              <q-item-section avatar>
                <q-icon :name="item.icon" class="my-icon" />
              </q-item-section>
              <q-item-section>
                {{ item.label }}
              </q-item-section>

            </q-item>
          </div>

          <q-item clickable @click="toggleSubmenu('agro')">
            <q-item-section>
              <q-btn
                label="Agro"
                color="green"
                text-color="black"
                flat
                class="full-width"
              />
            </q-item-section>
            <q-item-section avatar>
              <q-icon :name="submenu.agro ? 'expand_less' : 'expand_more'" />
            </q-item-section>
          </q-item>

          <div v-if="submenu.agro" class="subitem">
            <q-item v-for="item in agroItems" :key="item.label">
              <router-link :to="item.to">
                <q-item clickable v-ripple class="my-item">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" class="my-icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ item.label }}
                  </q-item-section>
                </q-item>
              </router-link>
            </q-item>
          </div>

          <q-item clickable @click="toggleSubmenu('gestion')">
            <q-item-section>
              <q-btn
                label="Gestion"
                color="green"
                text-color="black"
                flat
                class="full-width"
              />
            </q-item-section>
            <q-item-section avatar>
              <q-icon :name="submenu.gestion ? 'expand_less' : 'expand_more'" />
            </q-item-section>
          </q-item>

          <div v-if="submenu.gestion" class="subitem">
            <q-item v-for="item in gestionItems" :key="item.label">
              <router-link :to="item.to">
                <q-item clickable v-ripple class="my-item">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" class="my-icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ item.label }}
                  </q-item-section>
                </q-item>
              </router-link>
            </q-item>
          </div>

          <q-item clickable @click="toggleSubmenu('inventario')">
            <q-item-section>
              <q-btn
                label="Inventario"
                color="green"
                text-color="black"
                flat
                class="full-width"
              />
            </q-item-section>
            <q-item-section avatar>
              <q-icon
                :name="submenu.inventario ? 'expand_less' : 'expand_more'"
              />
            </q-item-section>
          </q-item>
          <div v-if="submenu.inventario" class="subitem">
            <q-item v-for="item in inventarioItems" :key="item.label">
              <router-link :to="item.to">
                <q-item clickable v-ripple class="my-item">
                  <q-item-section avatar>
                    <q-icon :name="item.icon" class="my-icon" />
                  </q-item-section>
                  <q-item-section>
                    {{ item.label }}
                  </q-item-section>
                </q-item>
              </router-link>
            </q-item>
          </div>
        </q-list>
      </q-drawer>
      <q-page-container>
        <router-view />
        <div class="q-pa-md">
          <q-page>
            <div class="q-pa-md row items-start q-gutter-md scrollable-container" style="display: flex;">
              <q-card v-for="finca in fincas" :key="finca._id" class="my-card" @click="handleCardClick(finca)">
                <q-img
                  :src="'https://cdn.quasar.dev/img/parallax2.jpg'"
                  class="card-image"
                />
                <div class="card-content">
                  <div class="text-h6">{{ finca.nombre }}</div>
                  <div class="text-caption">{{ finca.departamento }} - {{ finca.ciudad }}</div>
                </div>
                <q-card-actions class="card-actions">
                  <q-btn flat class="edit-button">📂<q-tooltip>Detalles</q-tooltip></q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </q-page>
        </div>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>

import { ref, onMounted } from "vue";
import { useFincaStore } from "../store/fincas";

const fincasStore = useFincaStore();
let fincas = ref([]);


import { useAdministradorStore } from '../store/administrador';
import { routes } from "../routes/routes.js";
import { useRouter } from 'vue-router';
const useAdmin=useAdministradorStore()
const router = useRouter();




onMounted(async () => {
  await fincasStore.getFincasActivos();
  console.log(fincasStore.fincas); // Verifica cuántas fincas se están obteniendo
  fincas.value = fincasStore.fincas;
});

const handleCardClick = (finca) => {
  console.log("Finca seleccionada:", finca);
  // Aquí puedes manejar la navegación o cualquier acción posterior
};

const leftDrawerOpen = ref(false);
const submenu = ref({
  usuarios: false,
  agro: false,
  gestion: false,
  inventario: false,
});

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const toggleSubmenu = (menu) => {

  submenu.value[menu] = !submenu.value[menu]
}
const logout = () => {
  useAdmin.logout();
  localStorage.removeItem('selectedRoute'); 
  router.push('/');

};

const usuariosItems = [
  { label: "Administrador", to: "/administrador", icon: "location_city" },
  { label: "Empleados", to: "/empleados", icon: "people" },
];

const agroItems = [
  { label: "Analisis de suelo", to: "/analisissuelo", icon: "eco" },
  { label: "Clima", to: "/clima", icon: "eco" },
  { label: "Control Plagas", to: "/controlplaga", icon: "eco" },
  { label: "Cultivos", to: "/cultivo", icon: "eco" },
  { label: "Elaboracion Sustrato", to: "/elaboracionSustrato", icon: "eco" },
  { label: "Fertilizacion", to: "/fertilizacion", icon: "eco" },
  { label: "Fincas", to: "/Finca", icon: "eco" },
  { label: "Parcelas", to: "/parcela", icon: "eco" },
  { label: "Preparacion Suelo", to: "/preparacionsuelo", icon: "eco" },
  { label: "Procesos", to: "/procesos", icon: "eco" },
  { label: "Produccion", to: "/produccion", icon: "eco" },
  { label: "Riego", to: "/riegos", icon: "eco" },
  { label: "Siembra", to: "/Siembra", icon: "eco" },
];

const gestionItems = [
  { label: "Comprador", to: "/comprador", icon: "business" },
  { label: "Factura", to: "/factura", icon: "business" },
  { label: "Gastos", to: "/gastos", icon: "business" },
  { label: "Mantenimientos", to: "/mantenimiento", icon: "business" },
  { label: "Nomina", to: "/nomina", icon: "business" },
  { label: "Proveedores", to: "/proveedores", icon: "business" },
];

const inventarioItems = [
  { label: "Principal", to: "/inventario1", icon: "inventory" },
  { label: "Semillas", to: "/semilla", icon: "inventory" },
  { label: "Insumos", to: "/insumo", icon: "inventory" },
  { label: "Maquinaria & Herramientas", to: "/maquinaria", icon: "inventory" },
];
</script>

<style>
.full-width {
  width: 100%;
  background-color: green;
}

.subitem {
  padding-left: 20px;
  width: 90%;
}

.my-item {
  display: flex;
  align-items: center;
}

.my-icon {
  margin-right: 10px;
}

.my-card {
  width: 250px;
  margin: 10px;
  cursor: pointer;
}

.card-image {
  height: 200px;
  width: 100%;
}

.card-content {
  padding: 10px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
}
</style>
