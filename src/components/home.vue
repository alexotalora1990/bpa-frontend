<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title align="center">
          <q-avatar>
            <!-- <img src=""> -->
          </q-avatar>
          BUENAS PRACTICAS AGRICULAS
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="right">
        <q-route-tab to="/home" label="Inicio" />
        <q-route-tab to="/administrador" label="Administrador" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item>
          <q-btn label="Botón 1" color="green" text-color="black" flat class="full-width" />
        </q-item>
        <router-link to="/finca">
          <q-item clickable v-ripple class="my-item">
            <q-item-section avatar>
              <q-icon name="location_city" class="my-icon" />
            </q-item-section>
            <q-item-section>
              Fincas
            </q-item-section>
          </q-item>
        </router-link>
        <q-item>
          <q-btn label="Botón 3" color="green" text-color="black" flat class="full-width" />
        </q-item>
        <q-item>
          <q-btn label="Botón 4" color="green" text-color="black" flat class="full-width" />
        </q-item>
        <q-item>
          <q-btn label="Botón 5" color="green" text-color="black" flat class="full-width" />
        </q-item>
        <q-item>
          <q-btn label="Botón 6" color="green" text-color="black" flat class="full-width" />
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style>
.full-width {
  width: 100%;
  background-color: green;
}
</style>