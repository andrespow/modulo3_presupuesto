let inputPresupuesto = document.getElementById("presupuesto");
let btnCalcularPresupuesto = document.getElementById("cantidadPresupuesto");
let inputNombreGasto = document.getElementById("gasto");
let inputMontoGasto = document.getElementById("cantidad");
let btnAniadirGasto = document.getElementById("cantidadGasto");
let presupuestoTabla = document.getElementById("listaPresupuesto");
let gastoTabla = document.getElementById("listaGasto");
let saldoTabla = document.getElementById("listaRestante");
let bodyTabla = document.getElementById("tabla");
// variables

let presupuesto = 0;
let listaGastos = [];

// funciones 

function Gasto(nombre, monto){
    this.nombre = nombre;
    this.monto = monto;
}

function agregarGastos(nombre, monto){
    let gasto = new Gasto(nombre, monto);
    listaGastos.push(gasto);
    let saldo = actualizarSaldo();
    if(saldo < 0){
        mostrarMsgError('gastoExcede');
        listaGastos.pop();
        actualizarTabla();
        return;
    } else {
        ocultarMsgError('gastoExcede');
        actualizarTabla();
        mostrarGasto();
        return;
    }
}

// vista en app
function mostrarGasto(){
    let gastoActualizado = listaGastos.reduce((acumulador, item) => acumulador + item.monto, 0)
    gastoTabla.innerHTML = String(gastoActualizado).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g,".")
}

function actualizarTabla() {
    let html = "";
    listaGastos.forEach((gasto, index) =>{
        html += `
        <tr>
            <td>${gasto.nombre}</td>
            <td>${gasto.monto}</td>
            <td style="cursor: pointer;"><i class="fa-sharp fa-solid fa-trash" style="color: #da3107;" onclick="eliminarGasto(${index})"></i></td>
        <tr>
        `
    });
    bodyTabla.innerHTML = html;
    actualizarSaldo()
}



function mostrarMsgError(idElemento){
    if (document.getElementById(`${idElemento}`).classList.contains('d-none')){
        document.getElementById(`${idElemento}`).classList.remove('d-none') ;       
    }
}


function ocultarMsgError(idElemento){
    if (!document.getElementById(`${idElemento}`).classList.contains('d-none')){
        document.getElementById(`${idElemento}`).classList.add('d-none') ;
    }
} 



btnCalcularPresupuesto.addEventListener("click", function(){
    presupuestoTabla.innerHTML = inputPresupuesto.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    if (inputPresupuesto.value <= 0 ){
        mostrarMsgError('cantidadIncorrecta');
        return;
    }else{
        ocultarMsgError('cantidadIncorrecta');
        actualizarSaldo();
        return;
    }
})


btnAniadirGasto.addEventListener("click", function(){
    let nombre = inputNombreGasto.value;
    let monto = parseInt(inputMontoGasto.value);
    agregarGastos(nombre, monto)
    inputNombreGasto.value = "";
    inputMontoGasto.value = "";
})

function actualizarSaldo(){
    let resumenPresupuesto = presupuestoTabla.innerHTML.replaceAll(".", "");
    let resumenGasto = listaGastos.reduce((acumulador, item) => acumulador + item.monto, 0);
    let nuevoSaldo = String (resumenPresupuesto - resumenGasto);
    saldoTabla.innerHTML = nuevoSaldo.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    cambiarColorSaldo(resumenPresupuesto,resumenGasto)
    return nuevoSaldo
}


function cambiarColorSaldo(presupuesto, saldo){
    let porcentaje = (saldo*100)/presupuesto 
    const elementSaldoRestante = document.getElementById(`saldoRestante`)
    console.log(presupuesto, saldo, porcentaje)
    listaClases= ['alert-success','alert-warning','alert-danger','alert-secondary']
    for (const value of elementSaldoRestante.classList.entries()) {
        for (const lc of listaClases){
            if (lc == value[1]){
                elementSaldoRestante.classList.remove(lc)
            }
        }
      }
    
    switch (true) {
        case porcentaje >= 75:
            elementSaldoRestante.classList.add('alert-danger')
            break;
        case porcentaje >= 50:
            elementSaldoRestante.classList.add('alert-warning')
        case porcentaje > 0 :
            elementSaldoRestante.classList.add('alert-success')

        default:
            elementSaldoRestante.classList.add('alert-secondary')
            break;
    }
}


function eliminarGasto(index){
    listaGastos = listaGastos.filter((gasto, indice) => indice != index);
    let gastoActualizado = listaGastos.reduce((acumulador, item) => acumulador + parseInt(item.monto), 0);
    gastoTabla.innerHTML = String(gastoActualizado).replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    actualizarTabla()
}

