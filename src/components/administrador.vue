<template>
    <h1>Administrador</h1>
    <q-btn color="green" icon="add" @click="agregar()" :loading="loading && loadingList === 'agregar'">agregar</q-btn>

 <!-- Tabla -->

 <q-table title="Admin" :rows="rows" :columns="columns" row-key="nombre" class="table">
      <template v-slot:header="props">
        <q-tr :props="props" style="font-size: 30px;" class="table1">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>
      <template v-slot:body-cell-estado="props">
        <q-td :props="props">
          <p :style="{ color: props.row.estado === 1 ? 'green' : 'red' }">
            {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
          </p>
        </q-td>
      </template>
      <template v-slot:body-cell-opciones="props">
        <q-td :props="props">
          <q-btn @click="editar(props.row)">
            <q-tooltip class="bg-accent">Editar</q-tooltip>🖋️
          </q-btn>
          
          <q-btn  v-if="props.row.estado === 1" @click="desactivar(props.row)">❌
            <q-tooltip class="bg-accent">Desactivar</q-tooltip>
            <template>
             
            </template>
          </q-btn>

          <q-btn v-else @click="activar(props.row._id)" >✅
            <q-tooltip class="bg-accent">Activar</q-tooltip>
            <template>
             
            </template>
          </q-btn>
        </q-td>
      </template>
    </q-table>




</template>
<script setup>
import { ref, onMounted } from 'vue';

import { useAdministradorStore } from '../store/administrador.js';
import { useQuasar, Notify } from 'quasar';


const useAdmin =useAdministradorStore()
const rows = ref([]);


const columns = ref([
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'center' },
  { name: 'direccion', label: 'Dirección', field: 'direccion', align: 'center' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'center' },
  { name: 'telefono', label: 'Telefono', field: 'telefono', align: 'center' },
  { name: 'municipio', label: 'Municipio', field: 'municipio', align: 'center' },
  { name: 'rol', label: 'Categoria', field: 'rol', align: 'center' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
  { name: 'opciones', label: 'Opciones', field: 'opciones', align: 'center' }
]);

async function listar()  {

  try {
    const r = await useAdmin.getAdmin();
    rows.value = r.data.administrador;
    console.log(r.data.administrador);
  } catch (error) {
    console.error('Error al listar todos los usuarios:', error);
  }
}


onMounted(()=>{
  listar();
})
</script>