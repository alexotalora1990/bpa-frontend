<!-- prueba -->

<template>
    <div style="height: 100vh; overflow-y: auto;">
  
      <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
        <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Parcela</q-btn>
        <q-select outlined v-model="listar" label="Seleccione" :options="listados"
          class="q-my-md q-mx-md custom-select" />
        <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
  
      </div>
  
      <!-- formulario -->
  
      <div>
        <q-dialog v-model="alert" persistent>
          <q-card class="" style="width: 700px">
            <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
              <div class="text-h6 text-white">
                {{ accion == 1 ? "Crear Cultivo" : "Editar Cultivo" }}
              </div>
            </q-card-section>
            <q-select outlined v-model="idParcela" label="Seleccione una Parcela" :options="options"
                        class="q-my-md q-mx-md"  @filter="filterFn"  :rules="[
              (val) => !!val || 'Parcela no puede estar vacio']" hide-bottom-space />
  
            <q-input outlined v-model="nombre" label="Nombre" class="q-my-md q-mx-md" :rules="[
              (val) => !!val.trim() || 'Nombre no puede estar vacio ']" hide-bottom-space />
  
           
            <q-input outlined v-model="tipo" label="Tipo"  class="q-my-md q-mx-md" :rules="[
              (val) => !!val.trim() || 'Tipo de cultivo no debe estar vacío'
            ]" hide-bottom-space />
            
             
            <q-card-actions align="right">
              <q-btn @click=modify() color="red" class="text-white">
                {{ accion == 1 ? "Agregar" : "Editar" }}
              </q-btn>
              <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
  
  
      <!-- Tabla -->
      <div style="display: flex; justify-content: center">
  
        <q-table title="Cultivo" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
          :rows="rows" :filter="filter" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;">
          <template v-slot:top-right>
            <q-input color="black" v-model="filter" placeholder="Buscar">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
  
  
  
  
  
          <template v-slot:body-cell-fechas="props">
            <q-td :props="props"></q-td>
          </template>
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <p style="color: green;" v-if="props.row.estado == 1">Activo</p>
              <p style="color: red;" v-else>Inactivo</p>
            </q-td>
          </template>
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="traerDatos(props.row)">
                <q-tooltip>Editar</q-tooltip>✏️</q-btn>
              <q-btn @click="desactivar(props.row._id)" v-if="props.row.estado == 1">
                <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
              <q-btn @click="activar(props.row._id)" v-else>
                <q-tooltip>Activar</q-tooltip>✅</q-btn>
            </q-td>
          </template>
        </q-table>
  
  
      </div>
  
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from "vue";
  
  
  import {useCultivosStore} from '../store/cultivos.js'
  import { useParcelaStore } from '../store/parcelas.js';
  const useParcela = useParcelaStore();
  import { useQuasar, Notify } from "quasar";
  
  const useCultivo= useCultivosStore();
  const rows = ref([]);
  const id=ref()
  const nombre = ref();
  const idParcela = ref();
  const idparcela =ref();
  const tipo = ref();
   const filter = ref();
  const listar = ref('');
  const listados = ['Listar todos', 'Activos', 'Inactivos'];
  let parcelas= []
let datos = {}
let options = ref(parcelas)
  let accion = ref(1);
  let alert = ref(false);
  
  // listar tabla
  const columns = ref([
    {
      name: "idparcela",
      label: "Parcela",
      field: (row)=>row.idparcela.numero,
      align: "center"
    },
    {
      name: "nombre",
      label: "Nombre Cultivo",
      field: "nombre",
      align: "center",
    },
    {
      name: "tipo",
      label: "Tipo",
      field: "tipo",
      align: "center"
    },
    {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "center"
  },
  {
    name: "opciones",
    label: "Opciones",
    field: "opciones",
    align: "center"
  },
  ]);
  
  // Funciones Listar
  async function listarCultivos() {
    try {
      const data = await useCultivo.getCultivos();
      rows.value = data.data;
      console.log(data.data);
    } catch (error) {
      console.error("Error al listar todos los cultivos:", error);
    }
  }

  async function listarParcelas() {
    const data = await useParcela.getParcelasActivos()
    console.log(data.data.parcelaActiva);
    
    data.data.parcelaActiva.forEach(item => {
        datos = {
            label: item.nombre,
            value: item._id
        }
        parcelas.push(datos)
    })
    console.log(parcelas);
}
  
  function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = parcelas.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}


  function filtrar() {
    if (listar.value == 'Listar todos') {
      listarCultivos();
    } else if (listar.value == 'Activos') {
      listarCultivosActivos();
    } else if (listar.value == 'Inactivos') {
      listarCultivosInactivos();
    }
  }
  
  async function listarCultivosActivos() {
    const r = await useCultivo.getCultivosActivos();
    console.log(r.data.cultivosActivos);
    rows.value = r.data.cultivosActivos;
  }
  
  async function listarCultivosInactivos() {
    const r = await useCultivo.getCultivosInactivos();
    console.log(r.data.cultivosInactivos);
    rows.value = r.data.cultivosInactivos;
  }
  
  // .................................................
  
  
  // AGREGAR EDITAR 
  
  async function crear() {
    // Validación de campos
    if (!nombre.value || !tipo.value || !idParcela.value ) {
      Notify.create({
        type: "negative",
        message: "Todos los campos son obligatorios",
        icon: "error",
        
      });
      return; // No proceder si los campos están vacíos
    }
  
    try {
      accion.value = 1;
      const r = await useCultivo.postCultivos({
        // idparcela=idParcela.value.value,
        nombre: nombre.value,
        tipo: tipo.value      });
  
      // Notificación de éxito
      Notify.create({
        type: "positive",
        message: "Cultivo creado exitosamente",
        icon: "check_circle",
        position:"top",
      });
  
      // Limpia el formulario y cierra el modal
      listarCultivos();
      limpiarCampos();
      cerrar();
  
      return r; // Retorna la respuesta si es necesario
    } catch (error) {
      console.error("Error al agregar cultivo:", error);
      Notify.create({
        type: "negative",
        message: "Error al agregar cultivo",
        icon: "error",
      });
    }
  }
  
  
  
  async function traerDatos(cultivo) {
  accion.value=2
  alert.value=true
  idParcela.value = {
    label: cultivo.idparcela.nombre,
    value: cultivo.idparcela._id
    }
        id.value=cultivo._id;
         nombre.value= cultivo.nombre,
         tipo.value= cultivo.tipo,
         
  
         console.log("cultivo ID:", cultivo._id);
     
  }
  async function editar() {
    try {
      const r = await useCultivo.putCultivos(id.value, {
        nombre: nombre.value,
        tipo: tipo.value,
        idparcela: idparcela.value,
           });
  
      console.log("Cultivo editado con éxito:", r);
      listarCultivos();  // Refresca la lista de administradores
      limpiarCampos(); // Limpia el formulario
      cerrar(); // Cierra el modal/formulario
    } catch (error) {
      console.error("Error al editar Cultivo:", error);
    }
  }
  async function modify() {
    if (accion.value === 1) {
      await crear();
    } else {
      await editar();
    }
  }
  
  
  
  // FUNCIONES ACTIVAR-DESACTIVAR
  
  async function activar(id) {
    try {
      await useCultivo.putCultivosActivar(id);
      listarCultivos();
      Notify.create({
        type: "positive",
        message: "Cultivo activado exitosamente",
        icon: "check",
        position: "top",
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error al activar Cultivo:", error);
      Notify.create({
        type: "negative",
        message: "Error al activar cultivo",
        icon: "error",
      });
    } finally {
    }
  }
  
  
  async function desactivar(id) {
    try {
      await useCultivo.putCultivosDesactivar(id);
      console.log(id);
      listarCultivos();
      Notify.create({
        color: "orange",
        message: "Cultivo desactivado exitosamente",
        icon: "check",
        position: "top",
        timeout: 3000,
      });
    } catch (error) {
      console.error("Error al desactivar cultivo:", error);
      Notify.create({
        type: "negative",
        message: "Error al desactivar cultivo",
        icon: "error",
      });
    } finally {
    }
  }
  // ......................................................
  // OTRAS FUNCIONES 
  onMounted(() => {
    listarCultivos();
    listarParcelas();
  });
  
  
  function abrir() {
    alert.value = true;
    limpiarCampos();
    accion.value = 1;
  }
  
  function cerrar() {
    alert.value = false;
  }
  function limpiarCampos() {
    idParcela.value = '',
      nombre.value = '',
      tipo.value = ''
  
  }
  
  </script>
  
  <style>
  .custom-select {
    font-size: 14px;
    border-radius: 4px;
    padding: 8px 12px;
    background-color: white;
    color: #333;
    min-width: 200px;
  }
  </style>