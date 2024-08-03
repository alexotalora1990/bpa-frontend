<template>
  <h1>Administrador</h1>
  <q-btn color="green" icon="add" @click="agregar()">agregar</q-btn>

  <!-- Formulario -->
  <q-form class="q-gutter-md" @submit.prevent="procesarFormulario">
    <div>
      <q-input
        v-model="nombre"
        label="Nombre"
        :rules="[(val) => !!val.trim() || 'Nombre no puede estar vacio']"
      />
    </div>
    <div>
      <q-input
        v-model="direccion"
        label="Dirección"
        :rules="[(val) => !!val.trim() || 'Dirección no puede estar vacio ']"
      />
    </div>
    <div>
      <q-input
        v-model="telefono"
        label="Teléfono"
        type="number"
        :rules="[
          (val) => !!val || 'Teléfono no puede estar vacío',
          (val) =>
            /^[0-9]{8,12}$/.test(val) ||
            'Teléfono debe tener entre 8 y 12 dígitos',
          (val) =>
            !/\s/.test(val) || 'Telefono no puede contener espacios vacíos',
        ]"
      />
    </div>

    <div>
      <q-input
        filled
        v-model="correo"
        label="Correo"
        type="email"
        :rules="[(val) => !!val || 'Email no debe estar vacío']"
      />
    </div>

    <div>
      <q-input
        v-model="rol"
        label="Rol"
        :rules="[(val) => !!val.trim() || 'Rol no puede estar vacio ']"
      />
    </div>

    <div>
      <q-input
        v-model="municipio"
        label="Rol"
        :rules="[(val) => !!val.trim() || 'Municipio no puede estar vacio ']"
      />
    </div>
    <div class="q-mt-md q-flex q-justify-end">
      <q-btn label="Guardar" color="green" type="submit" class="q-mr-sm" />
    </div>
  </q-form>
  <!-- Tabla -->

  <q-table
    title="Admin"
    :rows="rows"
    :columns="columns"
    row-key="nombre"
    class="table"
  >
    <template v-slot:header="props">
      <q-tr :props="props" style="font-size: 30px" class="table1">
        <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
          col.label
        }}</q-th>
      </q-tr>
    </template>
    <template v-slot:body-cell-estado="props">
      <q-td :props="props">
        <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
          {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
        </p>
      </q-td>
    </template>
    <template v-slot:body-cell-opciones="props">
      <q-td :props="props">
        <q-btn @click="editar(props.row)">
          <q-tooltip class="bg-accent">Editar</q-tooltip>🖋️
        </q-btn>

        <q-btn v-if="props.row.estado === 1" @click="desactivar(props.row._id)"
          >❌
          <q-tooltip class="bg-accent">Desactivar</q-tooltip>
          <template> </template>
        </q-btn>

        <q-btn v-else @click="activar(props.row._id)"
          >✅
          <q-tooltip class="bg-accent">Activar</q-tooltip>
          <template> </template>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>
<script setup>
import { ref, onMounted } from "vue";

import { useAdministradorStore } from "../store/administrador.js";
import { useQuasar, Notify } from "quasar";

const useAdmin = useAdministradorStore();
const rows = ref([]);

const nombre = ref();
const direccion = ref();
const correo = ref();
const telefono = ref();
const municipio = ref();
const rol = ref();

const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  {
    name: "direccion",
    label: "Dirección",
    field: "direccion",
    align: "center",
  },
  { name: "correo", label: "Correo", field: "correo", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  {
    name: "municipio",
    label: "Municipio",
    field: "municipio",
    align: "center",
  },
  { name: "rol", label: "Categoria", field: "rol", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

async function listar() {
  try {
    const r = await useAdmin.getAdmin();
    rows.value = r.data.administrador;
    console.log(r.data.administrador);
  } catch (error) {
    console.error("Error al listar todos los usuarios:", error);
  }
}

onMounted(() => {
  listar();
});
async function agregar() {
  console.log("agregar");
}

async function editar() {
  console.log("editar");
}

const procesarFormulario = async () => {};

async function activar(id) {
  try {
    await useAdmin.putAdminActivar(id);
    listar();
    Notify.create({
      type: "positive",
      message: "Administrador activado exitosamente",
      icon: "check",
      position: "top",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al activar administrador:", error);
    Notify.create({
      type: "negative",
      message: "Error al activar administrador",
      icon: "error",
    });
  } finally {
  }
}
async function desactivar(id) {
  try {
    await useAdmin.putAdminDesactivar(id);
    console.log(id);
    listar();
    Notify.create({
      color: "orange",
      message: "Administrador desactivado exitosamente",
      icon: "check",
      position: "top",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al desactivar administrador:", error);
    Notify.create({
      type: "negative",
      message: "Error al desactivar administrador",
      icon: "error",
    });
  } finally {
  }
}
</script>