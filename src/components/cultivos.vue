<template>
    <div style="height: 100vh; overflow-y: auto;">
        <div style="margin-left: 5%; margin-right: 5%; display: flex; align-items: center;">
            <q-btn color="green" class="q-my-md q-ml-md" @click="abrir()">Crear Cultivo</q-btn>
            <q-select outlined v-model="listar" label="Seleccione" :options="listados"
                class="q-my-md q-mx-md custom-select" />
            <q-btn color="black" class="q-my-md q-ml-md" @click="filtrar()"
                :loading="useCultivo.loading">Filtrar</q-btn>
        </div>
        <div>
            <q-form ref="formulario" @submit.prevent="modify">
                <q-dialog v-model="alert" persistent>
                    <q-card style="width: 700px">
                        <q-card-section style="background-color: #008000; margin-bottom: 20px" class="row items-center">
                            <div class="text-h6 text-white">
                                {{ accion == 1 ? "Crear Cultivo" : "Editar Cultivo" }}
                            </div>
                            <q-space />
                            <q-btn flat dense icon="close" @click="cerrar()" class="text-white" />
                        </q-card-section>

                        <q-select outlined v-model="idparcela" use-input hide-selected fill-input input-debounce="0"
                            class="q-my-md q-mx-md" :options="options" @filter="filterFn" label="Selecciona Parcela"
                            :rules="[val => !!val || 'Debe seleccionar una parcela']" hide-bottom-space>

                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey"> Sin resultados </q-item-section>
                                </q-item>
                            </template>

                        </q-select>

                        <q-input outlined v-model="nombre" label="Nombre de Cultivo" class="q-my-md q-mx-md" type="text"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
                            ]" hide-bottom-space />
                        <q-input outlined v-model="tipo" label="Tipo Cultivo" class="q-my-md q-mx-md" type="text"
                            :rules="[
                                (val) => !!val || 'Este campo es requerido',
                                (val) => !!val.trim() || 'Este campo no puede estar vacío',
                                (val) => val.length >= 3 || 'Debe tener al menos 3 caracteres'
                            ]" hide-bottom-space />

                        <q-card-actions align="right">
                            <q-btn :label="accion === 1 ? 'Agregar' : 'Editar'" type="submit" color="green" class="text-white" @click="modify" :loading="useCultivo.loading" />

                        </q-card-actions>
                    </q-card>
                </q-dialog>
            </q-form>
        </div>
        <div style="display: flex; justify-content: center">
            <q-table title="Cultivos" title-class="text-green text-weight-bolder text-h5"
                table-header-class="text-black" :rows="rows" :filter="filter" :columns="columns" row-key="name"
                style="width: 90%; margin-bottom: 6%;" :loading="useCultivo.loading">
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
                        <q-btn @click="desactivar(props.row)" v-if="props.row.estado == 1"
                            :loading="useCultivo.loading">
                            <q-tooltip>Desactivar</q-tooltip>❌</q-btn>
                        <q-btn @click="activar(props.row)" v-else :loading="useCultivo.loading">
                            <q-tooltip>Activar</q-tooltip>✅</q-btn>
                    </q-td>
                </template>
            </q-table>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Loading, Notify } from "quasar"
import { useCultivoStore } from "../store/cultivos.js";
const useCultivo = useCultivoStore();
import { useParcelaStore } from '../store/parcelas.js';
const useParcela = useParcelaStore();

const filter = ref(''); // ESTO ES PARA EL BUSCADOR DE LA TABLA


let rows = ref([]);

let idparcela = ref('');
let id = ref("")
let nombre = ref('');
let tipo = ref('');

let alert = ref(false);
let accion = ref(1);
const formulario = ref(null);



async function crear() {
    
    try {
        await useCultivo.postCultivos({
            idparcela: idparcela.value.value,
            nombre: nombre.value,
            tipo: tipo.value,

        });
    } catch (error) {
        Notify.create({
            message: '¡Ocurrió un error al crear el cultivo!',
            position: 'center',
            color: 'red'
        });
    } finally {
        listarTodo();
        limpiarCampos();
        cerrar();
    }
}


function traerDatos(cultivo) {
    alert.value = true;
    accion.value = 2;
    id.value = cultivo._id;
    idparcela.value = {
        label: cultivo.idparcela.numero,
        value: cultivo.idparcela._id
    }
    nombre.value = cultivo.nombre;
    tipo.value = cultivo.tipo;

}


async function editar() {
    
    try {
        await useCultivo.putCultivos(id.value, {
            idparcela: idparcela.value.value,
            nombre: nombre.value,
            tipo: tipo.value
        });

        Notify.create({
            message: 'Cultivo actualizado correctamente!',
            position: "center",
            color: "green"
        });
    } catch (error) {
        Notify.create({
            type: 'negative',
            message: error.response?.data?.errors?.[0]?.msg || 'Error al modificar el cultivo',
        });
        console.error('Error al modificar el cultivo', error);
    }
    listarTodo();
    limpiarCampos();
    cerrar();
}
async function modify() {
  try {
    const valid = await formulario.value.validate(); 

    if (!valid) {
      Notify.create({
        type: "negative",
        message: "Por favor, complete correctamente todos los campos",
        icon: "error",
      });
      return;
    }

    if (accion.value === 1) {
      await crear();
    } else {
      await editar();
    }

    Notify.create({
      type: "positive",
      message: "Operación realizada con éxito",
      icon: "check",
    });

  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error en la operación",
      icon: "error",
    });
    console.error("Error en modify:", error);
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
    try {
        const r = await useCultivo.listarCultivos();
        rows.value = r.data.cultivo;
    } catch (error) {
        console.log(error);

    }

}
async function listarActivos() {
    try {
        const r = await useCultivo.getCultivosActivos();
        console.log(r.data.cultivosActivos);
        rows.value = r.data.cultivosActivos;
    } catch (error) {
        console.log(error);

    }

}
async function listarInactivos() {
    try {
        const r = await useCultivo.getCultivosInactivos();
        console.log(r.data.cultivosInactivos);
        rows.value = r.data.cultivosInactivos;
    } catch (error) {
        console.log(error);

    }

}

// PARCELAS .........................................................

let parcelas = []
let datos = {}
let options = ref(parcelas)




async function listarParcelas() {
    try {
        const data = await useParcela.getParcelasActivos();
        console.log(data.data.parcelaActiva);

        data.data.parcelaActiva.forEach(item => {
            datos = {
                label: item.numero,
                value: item._id
            }
            parcelas.push(datos)
        })
        console.log(parcelas);
    } catch (error) {
        console.log(error);

    }

}



//FILTROS
function filterFn(val, update, abort) {
    update(() => {
        const needle = val.toLowerCase();
        options.value = parcelas.filter(v => {

            const label = String(v.label).toLowerCase();
            return label.indexOf(needle) > -1;
        });
    });
}


// ACTIVAR Y DESACTIVAR ......................................................

async function desactivar(cultivos) {
    const r = await useCultivo.putCultivosDesactivar(cultivos._id)
        .then((response) => {
            Notify.create({
                message: 'Cultivo Desactivado correctamente!',
                position: "center",
                color: "orange"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de sede:', error);
        })
}
async function activar(cultivos) {
    const r = await useCultivo.putCultivosActivar(cultivos._id)
        .then((response) => {
            Notify.create({
                message: 'cultivo activado correctamente!',
                position: "center",
                color: "green"
            });
            listarTodo()
        })
        .catch((error) => {
            console.log('Error de cultivo:', error);
        })
}

//ACTIVAR Y DESACTIVAR EN LA TABLA =========================

const columns = ref([
    {
        name: 'idparcela',
        required: true,
        label: 'Parcela',
        align: 'center',
        field: (row) => row.idparcela.numero,
        sortable: true
    },
    {
        name: 'Nombre',
        required: true,
        label: 'Nombre',
        align: 'center',
        field: 'nombre',
        sortable: true
    },

    {
        name: 'tipo',
        required: true,
        label: 'Tipo Cultivo',
        align: 'center',
        field: 'tipo',
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
    idparcela.value = '';
    nombre.value = '';
    tipo.value = '';
}





onMounted(() => {

    listarTodo();
    listarParcelas()
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