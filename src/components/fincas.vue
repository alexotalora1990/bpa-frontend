<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Finca</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card class="" style="width: 700px">
                    <q-card-section style="background-color: #a1312d; margin-bottom: 20px">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Finca" : "Editar Finca" }}
                        </div>
                    </q-card-section>
                    <q-select outlined v-model="idadministrador" label="Seleccione un Admin" :options="options"
                        class="q-my-md q-mx-md"  @filter="filterFn"  hide-bottom-space/>
                    <q-input outlined v-model="nombre" label="Nombre de la Finca" class="q-my-md q-mx-md" type="text"
                        :rules="nombreRules" hide-bottom-space />
                    <q-input outlined v-model="rut" label="RUT de la Finca" class="q-my-md q-mx-md" type="text"
                        :rules="rutRules" hide-bottom-space />
                    <q-input outlined v-model="direccion" label="Dirección de la Finca" class="q-my-md q-mx-md"
                        type="text" :rules="direccionRules" hide-bottom-space />
                    <q-input outlined v-model="ubicacion.latitud" label="Ubicación de latitud" class="q-my-md q-mx-md"
                        type="text" :rules="ubicacionRules" hide-bottom-space />
                    <q-input outlined v-model="ubicacion.longitud" label="Ubicación de longitud" class="q-my-md q-mx-md"
                        type="text" :rules="ubicacionRules" hide-bottom-space />
                    <q-input outlined v-model="area" label="Área de la Finca" class="q-my-md q-mx-md" type="text"
                        :rules="areaRules" hide-bottom-space />
                    <q-select outlined v-model="departamento" label="Departamento" :options="departamentoOptions"
                                class="q-my-md q-mx-md" :rules="departamentoRules" hide-bottom-space />
                    <q-input outlined v-model="ciudad" label="Ciudad" class="q-my-md q-mx-md" type="text"
                        :rules="limitesRules.ciudad" hide-bottom-space />
                    <q-input outlined v-model="limites.norte" label="Límite Norte" class="q-my-md q-mx-md" type="text"
                        :rules="limitesRules.norte" hide-bottom-space />
                    <q-input outlined v-model="limites.sur" label="Límite Sur" class="q-my-md q-mx-md" type="text"
                        :rules="limitesRules.sur" hide-bottom-space />
                    <q-input outlined v-model="limites.este" label="Límite Este" class="q-my-md q-mx-md" type="text"
                        :rules="limitesRules.este" hide-bottom-space />
                    <q-input outlined v-model="limites.oeste" label="Límite Oeste" class="q-my-md q-mx-md" type="text"
                        :rules="limitesRules.oeste" hide-bottom-space />

                    <q-card-actions align="right">
                        <q-btn @click="modify()" color="red" class="text-white">
                            {{ accion == 1 ? "Agregar" : "Editar" }}
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div style="display: flex; justify-content: center">
            <q-table title="Fincas" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
                :rows="rows" :filter="filter" :columns="columns" row-key="name" style="width: 90%; margin-bottom: 6%;" :loading="useFinca.loading">
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
                        <q-btn @click="desactivar(props.row)" v-if="props.row.estado == 1">
                            <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
                        <q-btn @click="activar(props.row)" v-else>
                            <q-tooltip>Activar</q-tooltip>✅</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useAdministradorStore } from "../store/administrador.js";
import { Notify } from "quasar"
const useAdmin = useAdministradorStore();
import { useFincaStore } from '../store/fincas.js';
const useFinca = useFincaStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA


let admins = []
let datos = {}
let options = ref(admins)

let rows = ref([]);
let nombre = ref('');
let idadministrador = ref('');
let id = ref("")
let rut = ref('');
let direccion = ref('');
let ubicacion = ref({
    latitud:"",
    longitud:""
});
let area = ref('');
let departamento = ref('');
let ciudad = ref('');
let limites = ref({
    norte: '',
    sur: '',
    este: '',
    oeste: ''
});

let alert = ref(false);
let accion = ref(1);

// REGLAS PARA LOS INPUTS =========================================================================================================
const departamentosColombia = [
    'Amazonas', 'Antioquia', 'Arauca', 'Archipiélago de San Andrés, Providencia y Santa Catalina',
    'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó',
    'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Guajira', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia',
    'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'
];
const isRequired = msg => val => !!val.trim().length || msg;
const minLength = (min, msg) => val => val.trim().length >= min || msg;
const nombreRules = [isRequired('El nombre es requerido'), minLength(3, 'El nombre debe tener al menos 3 caracteres')];
const rutRules = [isRequired('El RUT es requerido')];
const direccionRules = [isRequired('La dirección es requerida'), minLength(5, 'La dirección debe tener al menos 5 caracteres')];
const departamentoRules = [isRequired('El departamento es requerido')];
const ubicacionRules = [isRequired('La ubicación es requerida'), minLength(3, 'La ubicación debe tener al menos 3 caracteres')];
const areaRules = [isRequired('El área es requerida'), minLength(3, 'El área debe tener al menos 3 caracteres')];

const limitesRules = ['norte', 'sur', 'este', 'oeste'].reduce((acc, dir) => {
    acc[dir] = [isRequired(`El límite ${dir} es requerido`), minLength(3, `El límite ${dir} debe tener al menos 3 caracteres`)];
    return acc;
}, {});
const departamentoOptions = departamentosColombia;
// REGLAS PARA LOS INPUTS =========================================================================================================




//ENVIO DE LOS DATOS DE LA FINCA=================================== 

//FILTROS
function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = admins.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
//FILTROS

function modify(){
    if(accion.value===1){
        crear()
    } else{
        editar()
    }
}

async function crear() {
    if (!validarCampos()) {
    return;
    }
    try {
        const r = await useFinca.postFincas({
            idadministrador: idadministrador.value.value,
            nombre: nombre.value,
            rut: rut.value,
            direccion: direccion.value,
            ubicacion:{
                latitud: ubicacion.value.latitud,
                longitud: ubicacion.value.longitud,
            },
            area: area.value,
            departamento: departamento.value,
            ciudad: ciudad.value,
            limites: {
                norte: limites.value.norte,
                sur: limites.value.sur,
                este: limites.value.este,
                oeste: limites.value.oeste
            }
        })
    }
        catch (error) {
            Notify.create({
            message: 'Esta mal!', 
            position: "center",
            color: "red"
        });}
        listarFincas();
        limpiarCampos();
        cerrar()
}

//ENVIO DE LOS DATOS DE LA FINCA =====================================================

//EDITAR LA FINCA =====================================================
function traerDatos(fincas) {
    alert.value = true;
    accion.value = 2;
    idadministrador.value = {
    label: fincas.idadministrador.nombre,
    value: fincas.idadministrador._id
    }
    id.value = fincas._id;  
    nombre.value = fincas.nombre;  
    rut.value = fincas.rut;
    direccion.value = fincas.direccion;
    ubicacion.value.latitud=fincas.ubicacion?.latitud;
    ubicacion.value.longitud=fincas.ubicacion?.longitud;
    area.value = fincas.area;
    departamento.value = fincas.departamento;
    ciudad.value = fincas.ciudad;
    limites.value.norte= fincas.limites?.norte || '';
    limites.value.sur = fincas.limites?.sur || '';
    limites.value.este = fincas.limites?.este || '';
    limites.value.oeste = fincas.limites?.oeste || '';
}
async function editar() {
    try {
        await useFinca.putFincas(id.value, { 
            idadministrador: idadministrador.value.value,
            nombre: nombre.value,
            rut: rut.value,
            direccion: direccion.value,
            ubicacion: {
                latitud: ubicacion.value.latitud,
                longitud: ubicacion.value.longitud
            },
            area: area.value,
            departamento: departamento.value,
            ciudad: ciudad.value,
            limites: {
                norte: limites.value.norte,
                sur: limites.value.sur,
                este: limites.value.este,
                oeste: limites.value.oeste
            },
        });
        Notify.create({
            message: 'Finca actualizada correctamente!', 
            position: "center",
            color: "green"
        });
        
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar la finca',
        });
        console.log('Error al modificar la finca', error);  
    }
    
    
    listarFincas(); 
    limpiarCampos();
    cerrar();
}

//EDITAR LA FINCA =====================================================


//APARTADO DE TRAER LOS DATOS =============================
const listar = ref('');
const listados = ['Listar todos', 'Activos', 'Inactivos'];

function filtrar() {
    if (listar.value == 'Listar todos') {
        listarFincas();
    } else if (listar.value == 'Activos') {
        listarFincasActivos();
    } else if (listar.value == 'Inactivos') {
        listarFincasInactivos();
    }
}

async function listarFincas() {
    const r = await useFinca.listarFincas();
    rows.value = r.data.fincas;
}
async function listarFincasActivos() {
    const r = await useFinca.getFincasActivos();
    console.log(r.data.fincaActiva);
    rows.value = r.data.fincaActiva;
}
async function listarFincasInactivos() {
    const r = await useFinca.getFincasInactivos();
    console.log(r.data.fincaDesactivada);
    rows.value = r.data.fincaDesactivada;
}

async function listarAdmin() {
    const data = await useAdmin.getAdminActivos() 
    data.data.Administradores.forEach(item => {
        datos = {
            label: item.nombre,
            value: item._id
        }
        admins.push(datos)
    })
    console.log(admins);
}
//APARTADO DE TRAER LOS DATOS =============================


//ACTIVAR Y DESACTIVAR EN LA TABLA =========================
async function desactivar(fincas) {
    const r = await useFinca.putFincasDesactivar(fincas._id)
        .then((response) => {
            Notify.create({
            message: 'Finca Desactivada correctamente!', 
            position: "center",
            color: "orange"
        });
            listarFincas()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(fincas) {
    const r = await useFinca.putFincasActivar(fincas._id)
        .then((response) => {
            Notify.create({
            message: 'Finca activada correctamente!', 
            position: "center",
            color: "green"
        });
            listarFincas()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
//ACTIVAR Y DESACTIVAR EN LA TABLA =========================

const columns = ref([
    {
        name: 'Admin',
        required: true,
        label: 'Admin',
        align: 'center',
        field: (row) => row.idadministrador.nombre,
        sortable: true
    },
    {
        name: 'nombre',
        required: true,
        label: 'Nombre',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'rut',
        required: true,
        label: 'RUT',
        align: 'center',
        field: 'rut',
        sortable: true
    },
    {
        name: 'direccion',
        required: true,
        label: 'Dirección',
        align: 'center',
        field: 'direccion',
        sortable: true
    },
    {
        name: 'latitud',
        required: true,
        label: 'Latitud',
        align: 'center',
        field: (row) => row.ubicacion?.latitud || '',
        sortable: true
    },
    {
        name: 'longitud',
        required: true,
        label: 'Longitud',
        align: 'center',
        field: (row) => row.ubicacion?.longitud || '',
        sortable: true
    },
    {
        name: 'area',
        required: true,
        label: 'Área',
        align: 'center',
        field: 'area',
        sortable: true
    },
    {
        name: 'departamento',
        required: true,
        label: 'Departamento',
        align: 'center',
        field: 'departamento',
        sortable: true
    },
    {
        name: 'ciudad',
        required: true,
        label: 'Ciudad',
        align: 'center',
        field: 'ciudad',
        sortable: true
    },
    {
        name: 'limiteNorte',
        required: true,
        label: 'Límite Norte',
        align: 'center',
        field: (row) => row.limites?.norte || '',
        sortable: true
    },
    {
        name: 'limiteSur',
        required: true,
        label: 'Límite Sur',
        align: 'center',
        field: (row) => row.limites?.sur || '',
        sortable: true
    },
    {
        name: 'limiteEste',
        required: true,
        label: 'Límite Este',
        align: 'center',
        field: (row) => row.limites?.este || '',
        sortable: true
    },
    {
        name: 'limiteOeste',
        required: true,
        label: 'Límite Oeste',
        align: 'center',
        field: (row) => row.limites?.oeste || '',
        sortable: true
    },
    {
        name: 'estado',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'estado',
        sortable: true
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
    idadministrador.value= ""
    nombre.value = '';
    rut.value = '';
    ubicacion.value = {
        latitud:"",
        longitud:""
    }
    direccion.value = '';
    area.value = '';
    departamento.value = '';
    ciudad.value = '';
    limites.value = {
        norte: '',
        sur: '',
        este: '',
        oeste: ''
    };
}

function validarCampos() {
  if (!idadministrador.value || !nombre.value || !rut.value || !direccion.value || 
      !ubicacion.value.latitud || !ubicacion.value.longitud || !area.value || !departamento.value || 
      !ciudad.value || !limites.value.norte || !limites.value.sur || 
      !limites.value.este || !limites.value.oeste) {
    Notify.create({
      message: 'Por favor, completa todos los campos requeridos.',
      color: 'negative',
      position: 'top',
    });
    return false;
  }
  return true;
}

onMounted(() => {
    listarFincas();
    listarAdmin();
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