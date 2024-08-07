<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="red" class="q-my-md q-ml-md" @click="abrir()">Crear Finca</q-btn>
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
                    <q-select outlined v-model="idadmin" use-input hide-selected fill-input input-debounce="0"
                        class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Seleccione un Admin" :rules="idadminRules" hide-bottom-space></q-select>
                    <q-input outlined v-model="nombre" label="Nombre de la Finca" class="q-my-md q-mx-md" type="text"
                        :rules="nombreRules" hide-bottom-space />
                    <q-input outlined v-model="rut" label="RUT de la Finca" class="q-my-md q-mx-md" type="text"
                        :rules="rutRules" hide-bottom-space />
                    <q-input outlined v-model="direccion" label="Dirección de la Finca" class="q-my-md q-mx-md"
                        type="text" :rules="direccionRules" hide-bottom-space />
                    <q-input outlined v-model="ubicacion" label="Ubicación de la Finca" class="q-my-md q-mx-md"
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
                        <q-btn @click="crear()" color="red" class="text-white">
                            {{ accion == 1 ? "Agregar" : "Editar" }}
                        </q-btn>
                        <q-btn label="Cerrar" color="black" outline @click="cerrar()" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
        </div>
        <div style="display: flex; justify-content: center">
            <q-table title="Fincas" title-class="text-green text-weight-bolder text-h5" table-header-class="text-black"
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
                        <q-btn @click="traerFinca(props.row)">
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
const useAdmin = useAdministradorStore();
import { useFincaStore } from '../store/fincas.js';
const useFinca = useFincaStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA

let idadmin = ref('');
let admins = []
let datos = {}
let options = ref(admins)

let rows = ref([]);
let nombre = ref('');
let rut = ref('');
let direccion = ref('');
let ubicacion = ref('');
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


//CREACION DE UNA NUEVA FINCA 
const departamentosColombia = ['Amazonas', 'Antioquia', 'Arauca', 'Archipiélago de San Andrés, Providencia y Santa Catalina','Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó','Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Guajira', 'Huila', 'La Guajira', 'Magdalena','Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'San Andrés y Providencia','Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'];

const idadminRules = [
    val => !!val || 'El administrador es requerido',
];


const nombreRules = [
    val => val.trim().length > 0 || 'El nombre es requerido',
    val => val.trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres'
];
const rutRules = [
    val => val.trim().length > 0 || 'El RUT es requerido'
];
const direccionRules = [
    val => val.trim().length >= 5 || 'La dirección debe tener al menos 5 caracteres',
    val => val.trim().length > 0 || 'La dirección es requerida'
];
const departamentoRules = [
    val => !!val || 'El departamento es requerido'
];

const ubicacionRules = [
    val => val.trim().length >= 3 || 'La ubicación debe tener al menos 3 caracteres',
    val => val.trim().length > 0 || 'La ubicación es requerida'
];
const areaRules = [
    val => val.trim().length >= 3 || 'El área debe tener al menos 3 caracteres',
    val => val.trim().length > 0 || 'El área es requerida'
];
const limitesRules = {
    norte: [
        val => val.trim().length >= 3 || 'El límite norte debe tener al menos 3 caracteres',
        val => val.trim().length > 0 || 'El límite norte es requerido'
    ],
    sur: [
        val => val.trim().length >= 3 || 'El límite sur debe tener al menos 3 caracteres',
        val => val.trim().length > 0 || 'El límite sur es requerido'
    ],
    este: [
        val => val.trim().length >= 3 || 'El límite este debe tener al menos 3 caracteres',
        val => val.trim().length > 0 || 'El límite este es requerido'
    ],
    oeste: [
        val => val.trim().length >= 3 || 'El límite oeste debe tener al menos 3 caracteres',
        val => val.trim().length > 0 || 'El límite oeste es requerido'
    ]
};
const departamentoOptions = departamentosColombia;

//ENVIO DE LOS DATOS DE LA FINCA 

//FILTROS

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = admins.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  })
}
//

async function crear() {
    const r = await useFinca.postFincas({
        idadministrador: idadmin.value.value,
        nombre: nombre.value,
        rut: rut.value,
        direccion: direccion.value,
        ubicacion: ubicacion.value,
        area: area.value,
        departamento: departamento.value,
        ciudad: ciudad.value,
        limites: {
            norte: limites.value.norte,
            sur: limites.value.sur,
            este: limites.value.este,
            oeste: limites.value.oeste
        }
    });
    console.log(r);
    listarFincas();
    limpiarCampos();
    cerrar();
}
//ENVIO DE LOS DATOS DE LA FINCA 

//CREACION DE UNA NUEVA FINCA 


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
            console.log(response);
            listarFincas()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(fincas) {
    const r = await useFinca.putFincasActivar(fincas._id)
        .then((response) => {
            console.log(response);
            listarFincas()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
//ACTIVAR Y DESACTIVAR EN LA TABLA =========================

const columns = ref([
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
        name: 'ubicacion',
        required: true,
        label: 'Ubicación',
        align: 'center',
        field: 'ubicacion',
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
    idadmin.value= ""
    nombre.value = '';
    rut.value = '';
    direccion.value = '';
    ubicacion.value = '';
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
