// Declaracion de variables
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");
// Opciones de edicion
let editElement;
let editFlag = false;
let editID = "";
// ****** Eventos de las listas **********

// Boton submit
form.addEventListener("submit", addItem);
// Boton limpiar lista
clearBtn.addEventListener("click", clearItems);
// Mostrar lista (actualizacion de lista en ventana)
window.addEventListener("DOMContentLoaded", setupItems);

// ****** Funciones **********

// Agregar item
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
//If para evitar cadena vacia o que este en modificaccion la funcion
  if (value !== "" && !editFlag) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery-item");
    //Actualizacion de HTML para agregar a la lista (Agrega boton de edicion y borrado)
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
    //Agrga las funciones de los botones de borrar y modificar en cada item;
    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    // Añadir child (elemento)
    list.appendChild(element);
    // Alerta de agregado item
    displayAlert("item added to the list", "success");
    // Muestra de la lista en pantalla
    container.classList.add("show-container");
    // Para el guardado de los item en la lista dentro de la memoria local (cache)
    addToLocalStorage(id, value);
    // Volver al valor predeterminado (con los textfield limpios para agregar otro item)
    setBackToDefault();
  } 
    //Para cuando se modifica el item ya guardado
    else if (value !== "" && editFlag) {
        //Modificacion en HTML de la lista
    editElement.innerHTML = value;
    //Cambio de valores para la alerta 
    displayAlert("value changed", "success");

    // Cambio de valor para el guardado en la memoria local
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
      //Alerta de no ingreso de cadena
    displayAlert("please enter value", "danger");
  }
}
// Display de la alerta
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // REmover alerta
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// Eliminar todos los items de la lista
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  //Eliminar de la memoria local
  localStorage.removeItem("list");
}

// Eliminar item especifico
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");

  setBackToDefault();
  //Eliminar de la memoria local
  removeFromLocalStorage(id);
}

// Modificar item
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  // Enviar info de item modificado
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // Actualizar en HTML
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  //Cambiar el texto del boton
  submitBtn.textContent = "edit";
}
// Reiniciar la lista
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// ****** Memoria local **********

// Agregar la memoria local al sitio
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}
//Guardar lista en memoria
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
//Eliminar en la memoria local (items)
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}
//Edicion dentro de la memoria local (Items)
function editLocalStorage(id, value) {
  let items = getLocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// ****** Configuracion items **********
function setupItems() {
  let items = getLocalStorage();
//Crear lista de items
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}
//Crear lista de item
function createListItem(id, value) {
  const element = document.createElement("article");
  let attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.classList.add("grocery-item");
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <!-- edit btn -->
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <!-- delete btn -->
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          `;
  // Agregar eventos de borrado y modificacion a los botones de cada item
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  // agrefar item
  list.appendChild(element);
}
/*Temas vistos
DOMContentLoaded:  El navegador HTML está completamente cargado y el árbol DOM está construido, pero es posible que los recursos externos como <img> y hojas de estilo aún no se hayan cargado.
new Date(): Representan en JavaScript un momento fijo en el tiempo en un formato independiente.
createAttribute(): Crea un nuevo nodo de tipo atributo (attr), y lo retorna. El objeto crea un nodo implementando la interfaz Attr. El DOM no impone que tipo de atributos pueden ser
                     agregados a un particular elemento de esta forma.
setAttributeNode(): Agrega un nuevo Attrnodo al elemento especificado.
appendChild(): Agrega un nuevo nodo al final de la lista de un elemento hijo de un elemento padre especificado.
filter(): Crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.
map(): Crea un nuevo array con los resultados de la llamada a la función indicada aplicados a cada uno de sus elementos.
 */