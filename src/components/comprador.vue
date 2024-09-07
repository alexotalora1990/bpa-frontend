<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Comprador</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()">Filtrar</q-btn>
        </div>
        <div>
            <q-dialog v-model="alert" persistent>
                <q-card style="width: 700px">
                    <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                        <div class="text-h6 text-white">
                            {{ accion == 1 ? "Crear Compra" : "Editar Compra" }}
                        </div>
                        <q-space />
                        <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                    </q-card-section>
                    <q-select outlined v-model="idfincas" label="Seleccione una Producción" :options="options"
                        class="q-my-md q-mx-md" @filter="filterFn" hide-bottom-space />
                    <q-input outlined v-model="nombre" label="Nombre del Comprador" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="telefono" label="Telefono" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="cantidad" label="Cantidad" class="q-my-md q-mx-md" type="number" />
                    <q-input outlined v-model="numguiaTransporte" label="#guiaTransporte" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="numloteComercial" label="#loteComercial" class="q-my-md q-mx-md" type="text" />
                    <q-input outlined v-model="valor" label="valor" class="q-my-md q-mx-md" type="number" />
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
            <q-table title="Producción" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useComprador.loading">
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
                        <q-btn @click="desactivar(props.row)" v-if="props.row.estado == 1" :loading="useComprador.loading">
                            <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
                        <q-btn @click="activar(props.row)" v-else :loading="useComprador.loading">
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
import { useCompradorStore } from "../store/comprador.js";
const useComprador = useCompradorStore();
import { useProduccionStore } from "../store/produccion.js";
const useProduccion = useProduccionStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA
let rows = ref([]);
let alert = ref(false);
let accion = ref(1);

let producciones = []
let datos = {}
let options = ref(producciones)

let id = ref("")
let idfincas = ref('');
let numero = ref('');
let ubicacion = ref({
    latitud:"",
    longitud:""
});
let cultivoAnterior = ref('');
let cultivoActual = ref('');
let descripcion = ref('');
let area = ref('');
let asistenteTecnico = ref('');

async function crear() {
    if (!validarCampos()) {return;}
    try {
        await useParcela.postParcelas({
            idfincas: idfincas.value.value,
            numero: numero.value,
            ubicacion:{
                latitud: ubicacion.value.latitud,
                longitud: ubicacion.value.longitud,
            },
            cultivoAnterior: cultivoAnterior.value,
            cultivoActual: cultivoActual.value,
            descripcion: descripcion.value,
            area: area.value,
            asistenteTecnico: asistenteTecnico.value
        });
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear la parcela!',
            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}


function traerDatos(parcela) {
    alert.value = true;
    accion.value = 2;
    id.value = parcela._id;
    idfincas.value = {
    label: parcela.idfincas.nombre,
    value: parcela.idfincas._id
    }
    numero.value = parcela.numero;
    ubicacion.value.latitud=parcela.ubicacion?.latitud;
    ubicacion.value.longitud=parcela.ubicacion?.longitud;
    cultivoAnterior.value = parcela.cultivoAnterior;
    cultivoActual.value = parcela.cultivoActual;
    descripcion.value = parcela.descripcion;
    area.value = parcela.area;
    asistenteTecnico.value = parcela.asistenteTecnico;
}


async function editar() {
    if (!validarCampos()) return;
    try {
        await useParcela.putParcelas(id.value, {
            idfincas: idfincas.value.value,
            numero: numero.value,
            ubicacion: {
                latitud: ubicacion.value.latitud,
                longitud: ubicacion.value.longitud
            },
            cultivoAnterior: cultivoAnterior.value,
            cultivoActual: cultivoActual.value,
            descripcion: descripcion.value,
            area: area.value,
            asistenteTecnico: asistenteTecnico.value
        });

        Notify.create({
            message: 'Parcela actualizada correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar la parcela',
        });
        console.error('Error al modificar la parcela', error);
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


const listar = ref('');
const listados = ['Listar todos', 'Activos', 'Inactivos'];

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
    const r = await useComprador.listarCompradores();
    rows.value = r.data.compradores;
}
async function listarActivos() {
    const r = await useComprador.getCompradoresActivos();
    console.log(r.data.compradores);
    rows.value = r.data.compradores;
}
async function listarInactivos() {
    const r = await useComprador.getCompradoresInactivos();
    console.log(r.data.compradores);
    rows.value = r.data.compradores;
}
async function listarProducciones() {
    const data = await useProduccion.getProduccionesActivos()
    data.data.produccionActiva.forEach(item => {
        datos = {
            label: item.especie,
            value: item._id
        }
        producciones.push(datos)
    })
    console.log(producciones);
}

function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = producciones.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
    })
}
// el r.data.{empleados}, empleado varia segun el rjson de la funcion get en el backend

async function desactivar(producciones) {
    const r = await useComprador.putCompradoresDesactivar(producciones._id)
        .then((response) => {
            Notify.create({
                message: 'Producción Desactivada correctamente!',
                position: "center",
                color: "orange"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(parcelas) {
    const r = await useComprador.putCompradoresActivar(parcelas._id)
        .then((response) => {
            Notify.create({
                message: 'Producción activada correctamente!',
                position: "center",
                color: "green"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de Empleado:', error);
        })
}
//ACTIVAR Y DESACTIVAR EN LA TABLA =========================

const columns = ref([
    {
        name: 'idproduccion',
        required: true,
        label: 'Especie',
        align: 'center',
        field: (row) => row.idproduccion.especie,
        sortable: true
    },
    {
        name: 'Nombre',
        required: true,
        label: 'Comprador',
        align: 'center',
        field: 'nombre',
        sortable: true
    },
    {
        name: 'Telefono',
        required: true,
        label: 'Telefono',
        align: 'center',
        field: 'telefono',
        sortable: true
    },
    {
        name: 'Cantidad',
        required: true,
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad',
        sortable: true
    },
    {
        name: 'numguiaTransporte',
        required: true,
        label: '# Guia transporte',
        align: 'center',
        field: 'numguiaTransporte',
        sortable: true
    },
    {
        name: 'Lote Comercial',
        required: true,
        label: 'Lote Comercial',
        align: 'center',
        field: 'numloteComercial',
        sortable: true
    },
    {
        name: 'Valor',
        required: true,
        label: 'Valor',
        align: 'center',
        field: 'valor',
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
    idfincas.value = '';
    numero.value = '';
    ubicacion.value = {
        latitud:"",
        longitud:""
    }
    cultivoAnterior.value = '';
    cultivoActual.value = '';
    descripcion.value = '';
    area.value = '';
    asistenteTecnico.value = '';
}


function validarCampos() {
    if (!idfincas.value || !numero.value || !ubicacion.value.latitud || !ubicacion.value.longitud ||
        !cultivoAnterior.value || !cultivoActual.value || !descripcion.value || !area.value ||
        !asistenteTecnico.value) {
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
    listarProducciones()
    listarTodo();
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