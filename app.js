const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateCarrito = document.getElementById("template-carrito").content;
const templateFooter = document.getElementById("template-footer").content;
const fragment = document.createDocumentFragment();

let carrito = {};

document.addEventListener("DOMContentLoaded", () => {
  getData();
  if (localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'));
    pintarCarrito();
  }
});

document.addEventListener("click",e=>{
    if(e.target.matches("[data-button]")){
        setProducto(e.target.parentElement);
    }
    if(e.target.matches("#agregar")){
        action(e.target.dataset.id,"s");
    }
    if(e.target.matches("#disminuir")){
        action(e.target.dataset.id,"d");
    }

})

const getData = async () => {
  try {
    const res = await fetch("api.json");
    const json = await res.json();
    pintarCards(json);
} catch (err) {
    console.error(err);
  }
};

const pintarCards = data =>{

    data.forEach(item => {
        templateCard.querySelector("img").src = item.thumbnailUrl;
        templateCard.querySelector("h5").textContent = item.title;
        templateCard.querySelector("p").textContent = item.precio;
        templateCard.querySelector("button").dataset.id = item.id;
        const clone = document.importNode(templateCard, true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}
const setProducto = obj => {
    const producto = {
        id : obj.querySelector("button").dataset.id,
        title : obj.querySelector("h5").textContent,
        precio : obj.querySelector("p").textContent,
        cantidad : 1,    
    }
    if (carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1;
    } 
    carrito[producto.id] = {...producto};
    pintarCarrito();
};
const pintarCarrito = () => {
    items.innerHTML = "";
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id;
        templateCarrito.querySelector("#name").textContent = producto.title;
        templateCarrito.querySelector("#cant").textContent = producto.cantidad;
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio;
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;

        const clone = document.importNode(templateCarrito, true);
        fragment.appendChild(clone);
    });
    items.appendChild(fragment);
    pintarFooter();
    
    localStorage.setItem("carrito",JSON.stringify(carrito));  
}
const pintarFooter  = () => {
    footer.innerHTML = "";
    if(Object.values(carrito).length === 0){
        return footer.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`;
    }
    const nCantidad = Object.values(carrito).reduce((acu, prev) => acu + prev.cantidad, 0);
    const nPrecio = Object.values(carrito).reduce((acu,prev) =>  acu + prev.cantidad * prev.precio,0);
    
    templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
    templateFooter.querySelector("span").textContent = nPrecio;

    const clone = document.importNode(templateFooter, true);
    fragment.appendChild(clone)
    footer.appendChild(fragment);

    const vaciarCarrito = document.getElementById("vaciar-carrito");
    vaciarCarrito.addEventListener("click",() => {
        carrito = {};
        pintarCarrito();
    });
}
const action = (id,action) => {
    if (action === "s") {
        // Aquí no mutamos el objeto
        const producto = carrito[id];
        producto.cantidad = carrito[id].cantidad + 1;
        carrito[id] = {...producto};
    }
    else if(action === "d"){
        // Aquí sí
        carrito[id].cantidad = carrito[id].cantidad - 1;
    }
    pintarCarrito();
    
}


