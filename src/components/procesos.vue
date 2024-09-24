<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Proceso</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
        class="q-my-md q-mx-md custom-select" />
      <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card style="width: 700px">
                    <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Proceso" : "Editar Proceso" }}
                        </div>
                        <q-space />
                        <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                    </q-card-section>

      
                    <q-select outlined v-model="idcultivo" label="Seleccione un cultivo" :options="optionsCultivo"
                        class="q-my-md q-mx-md" @filter="filterCultivo" :rules="[reglas.required, reglas.notEmpty]"hide-bottom-space />
                    <q-select outlined v-model="idempleado" label="Seleccione un empleado" :options="optionsEmpleado"
                        class="q-my-md q-mx-md" @filter="filterEmpleado" :rules="[reglas.required, reglas.notEmpty]"hide-bottom-space />
                    <q-input outlined v-model="tipo" label="Tipo" class="q-my-md q-mx-md" type="text" 
                    :rules="[reglas.required, reglas.notEmpty]"hide-bottom-space/>
                    <q-input outlined v-model="descripcion" label="Descripcion" class="q-my-md q-mx-md" type="text" 
                    :rules="[reglas.required, reglas.notEmpty]"hide-bottom-space/>
                    <q-input outlined v-model="fechaInicio" label="Fecha Inicial" type="date" class="q-my-md q-mx-md"
                    :rules="[reglas.required]"hide-bottom-space />
                    <q-input outlined v-model="fechaFinal" label="Fecha Final" type="date" class="q-my-md q-mx-md" 
                    :rules="[reglas.required]"hide-bottom-space />
                                     <q-card-actions align="right">

                        <q-btn @click="modify()" color="green" class="text-white">
                            {{ accion == 1 ? "Agregar" : "Editar" }}
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div style="display: flex; justify-content: center">
            <q-table title="Procesos" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :filter="filter" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;"
                :loading="useProceso.loading">
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
                        <template v-slot:loading>
                            <q-spinner color="primary" size="100px" style="align-self: center; margin-bottom: 10px;" />
                        </template>
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
import { onMounted, ref } from 'vue';
import { Notify } from "quasar"
import { useEmpleadoStore } from "../store/empleados.js";
const useEmpleado = useEmpleadoStore();
import { useCultivoStore } from "../store/cultivos.js";
const useCultivo = useCultivoStore();
import { useProcesoStore } from "../store/procesos.js";
const useProceso = useProcesoStore();
import { format } from 'date-fns'

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let cultivos = []
let empleados = []
let optionsCultivo = ref(cultivos)
let optionsEmpleado = ref(empleados)


let id = ref("")
let idcultivo = ref('');
let idempleado = ref("");
let tipo = ref("");
let descripcion = ref("");
let fechaInicio = ref("")
let fechaFinal = ref("");


const listar = ref('');
const listados = ['Listar todos', 'Activos', 'Inactivos'];

const reglas = {
  required: val => !!val || 'Este campo es requerido',
  notEmpty: val => !!val.trim() || 'Este campo no puede estar vacío',
  minLength3: val => val.length >= 3 || 'Debe tener al menos 3 caracteres',
  caracteres: val => /^[a-zA-Z\s]*$/.test(val) || 'Solo se permiten letras',
  email: val => /.+@.+\..+/.test(val) || 'El email debe ser válido',
   min8max12: val => val.length >= 8 && val.length <= 12 || 'Debe tener entre 8 y 12 dígitos',
  soloNumeros: val => /^[0-9]+$/.test(val) || 'Solo se permiten números',
}
function validarCampos() {
    if (!idcultivo.value || !idempleado.value || !tipo.value || !fechaInicio.value || 
        !fechaFinal.value || !descripcion.value ) {
        Notify.create({
            message: 'Por favor, completa todos los campos requeridos.',
            color: 'negative',
            position: 'top',
        });
        return false;
    }
    return true;
}

async function crear() {
    if (!validarCampos()) {return;}
    try {
        await useProceso.postProcesos({
            idcultivo: idcultivo.value.value,
            idempleado: idempleado.value.value,
            tipo: tipo.value,
            descripcion:descripcion.value,
            fechaInicio: fechaInicio.value,
            fechaFinal: fechaFinal.value,
            
        });
        
        
    } catch (error) {
        console.log(error);
        
        Notify.create({
            message: '¡Ocurrió un error al crear el Proceso !' ,
            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}
function traerDatos(proceso) {
    alert.value = true;
    accion.value = 2;
    id.value = proceso._id;
    idcultivo.value = {
    label: proceso.idcultivo.nombre,
    value: proceso.idcultivo._id
    }
    idempleado.value = {

    label: proceso.idempleado.nombre,
    value: proceso.idempleado._id
    };
    tipo.value = proceso.tipo;
    descripcion.value = proceso.descripcion;
    fechaInicio.value = proceso.fechaInicio.split('T')[0];
    fechaFinal.value = proceso.fechaFinal.split('T')[0];


}


async function editar() {
    if (!validarCampos()) {return};

    try {

        await useProceso.putProcesos(id.value, {
            idcultivo: idcultivo.value.value,
            idempleado: idempleado.value.value,
            tipo: tipo.value,
            descripcion:descripcion.value,
            fechaInicio: fechaInicio.value,
            fechaFinal: fechaFinal.value,
            
        });

        Notify.create({
            message: 'Proceso actualizado correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el proceso',
        });
        console.error('Error al modificar el Proceso', error);
    }
    listarTodo();
    limpiarCampos();
    cerrar();
}


function modify() {
    if (accion.value === 1) {
        crear()
    } else {
        editar()
    }
}



//APARTADO DE TRAER LOS DATOS =============================
function filtrar() {
  if (listar.value == 'Listar todos') {
    listarTodo();
  } else if (listar.value == 'Activos') {
    listarActivos();
  } else if (listar.value == 'Inactivos') {
    listarInactivos();
  }
}

async function listarTodo() {
    const r = await useProceso.listarProcesos();
    rows.value = r.data.procesos;
console.log(r.data.procesos);
}
async function listarActivos() {
    const r = await useProceso.getProcesosActivos()
    rows.value=r.data.procesoActivo
    console.log(r.data);
    
}
async function listarInactivos() {
  const r = await useProceso.getProcesosInactivos();
  console.log(r.data);
  rows.value = r.data.procesoDesactivado;
}


const listarCultivos = async () => {
    const data = await useCultivo.getCultivosActivos();
    cultivos.value = data.data.cultivosActivos.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    optionsCultivo.value = cultivos.value;
    console.log('Cultivos:', cultivos.value);
};
const listarEmpleados = async () => {
    const data = await useEmpleado.getEmpleadosActivos();
    empleados.value = data.data.empleados.map(item => ({
        label: item.nombre,
        value: item._id
    }));
    optionsEmpleado.value = empleados.value;
    console.log('Empleados:', empleados.value);
};



function filterEmpleado(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        optionsEmpleado.value = empleados.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}
function filterCultivo(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        optionsCultivo.value = cultivos.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}


async function activar(id) {
  try {
    await useProceso.putProcesosActivar(id);
    listarTodo();
    Notify.create({
      type: "positive",
      message: "Proceso activado exitosamente",
      icon: "check",
      position: "top",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al activar proceso:", error);
    Notify.create({
      type: "negative",
      message: "Error al activar Proceso",
      icon: "error",
    });
  } finally {
  }
}
async function desactivar(id) {
  try {
    await useProceso.putProcesosDesactivar(id);
    listarTodo();
    Notify.create({
        color:"orange",
      type: "positive",
      message: "Proceso desactivado exitosamente",
      icon: "check",
      position: "top",
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error al desactivar proceso:", error);
    Notify.create({
      type: "negative",
      message: "Error al desactivar Proceso",
      icon: "error",
    });
  } finally {
  }
}

const columns = ref([
    {
        name: 'idcultivo',
        required: true,
        label: 'Cultivo',
        align: 'center',
        field: (row) => row.idcultivo.nombre,
        sortable: true
    },
    {
        name: 'idempleado',
        required: true,
        label: 'Empleado',
        align: 'center',
        field: (row) => row.idempleado.nombre,
        sortable: true
    },
    {
        name: 'tipo',
        required: true,
        label: 'Clima',
        align: 'center',
        field: 'tipo',
        sortable: true
    },
    {
        name:'descripcion',
        required:true,
        label: 'Descripción',
        align:'center',
        field:'descripcion',
        sortable:true
    },
    {
        name: 'horaInicio',
        required: true,
        label: 'Inicio',
        align: 'center',
        field: 'fechaInicio',
        sortable: true,
        format: (val) => {
        return val.split('T')[0].split('-').reverse().join('/');
        }
    },
    
    {
        name: 'horaFinal',
        required: true,
        label: 'Final',
        align: 'center',
        field: 'fechaFinal',
        sortable: true,
        format: (val) => {
        return val.split('T')[0].split('-').reverse().join('/');
        }
    },
    
    {
    name: "estado",
    label: "Estado",
    field: "estado",
    align: "center"
  },
    {
        name: 'opciones',
        required: true,
        label: 'Opciones',
        align: 'center',
        field: 'opciones',
        sortable: true
    }
]);

// Funciones no tan importantes ======================================
function abrir() {
    alert.value = true;
    limpiarCampos();
    accion.value = 1;
}

function cerrar() {
    alert.value = false;
}

function limpiarCampos() {
    idcultivo.value = '';
    idempleado.value = '';
    tipo.value = '';
    fechaInicio.value = '';
    fechaFinal.value = '';
    descripcion.value = '';
    
}





onMounted(() => {
    listarTodo();
    listarCultivos();
    listarEmpleados();
});
// Funciones no tan importantes ======================================
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