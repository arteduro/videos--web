import Swiper from "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs";

const swiperPython = document.getElementById("swiper__python");

// Recuperar los videos guardados en el almacenamiento local o usar un array vacío si no existen
let videosPython = JSON.parse(localStorage.getItem("videosPython")) || [];

let swiper = null;

function renderizarSlider() {
  const arrayPythonSlider = videosPython.map((objetoVideo) => {
    return `<h1 class="swiper__titulo">${objetoVideo.titulo}</h1>
    <a href='${objetoVideo.urlVideo}' target='_blank'>
  <img class="swiper__imagen" src='${objetoVideo.url}' title='${objetoVideo.titulo}'/></a>`;
  });

  for (let swiperHTML of arrayPythonSlider) {
    const nuevoDiv = document.createElement("div");
    nuevoDiv.classList.add("swiper-slide");
    nuevoDiv.classList.add("swiper-slide__python");
    nuevoDiv.innerHTML = swiperHTML;
    swiperPython.appendChild(nuevoDiv);
  }

  swiper = new Swiper(".mySwiperPython", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 10,
    breakpoints: {
      550: { slidesPerView: 2, spaceBetween: 10 },
      850: { slidesPerView: 3, spaceBetween: 10 },
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

renderizarSlider();

function guardarVideosEnLocalStorage() {
  localStorage.setItem("videosPython", JSON.stringify(videosPython));
}

function addNewVideo(video) {
  swiper.destroy(true, true);
  document.getElementById("swiper__python").innerHTML = "";
  videosPython.push(video);
  guardarVideosEnLocalStorage();
  renderizarSlider();
}

const formularioAgregar = document.getElementById("formularioAgregar");
const imagen = document.getElementById("ImagenVideo");
let imagenURL = "";
imagen.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    const file = e.target.files[0];
    const mimetipeAdmitido = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (mimetipeAdmitido.includes(file.type)) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = function () {
        const imageUrl = fileReader.result;
        imagenURL = imageUrl;

        document.getElementById("contenedor__formulario__imagenpreview").src =
          imageUrl;
      };
    } else {
      Swal.fire({
        icon: "error",
        title: "Archivo no es imagen",
        text: "Solo se aceptan archivos de imagen del siguiente tipo: jpeg, jpg, png y webp",
      });
    }
  }
});

function validarURLVideo(urlVideo) {
  // Expresión regular para validar una URL de video en la web.
  const videoURLPattern = /^(https?:\/\/)?(www\.)?.+\..{2,}\/*(watch\?v=|embed\/|v\/|e\/|watch\?|.*\?v=)?([^#\&\?]*).*/;

  return videoURLPattern.test(urlVideo);
}

function resetearCampos() {
  document.getElementById("TituloVideo").value = "";
  document.getElementById("URLVideoYoutube").value = "";
  imagenURL = "";
  document.getElementById("contenedor__formulario__imagenpreview").src = "";
  document.getElementById("ImagenVideo").value = "";
}

formularioAgregar.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("TituloVideo");
  const urlVideo = document.getElementById("URLVideoYoutube");

  if (
    titulo.value != "" &&
    !videosPython.map((obj) => obj.titulo).includes(titulo.value) &&
    imagenURL.length > 0 &&
    validarURLVideo(urlVideo.value)
  ) {
    const nuevoIndex = videosPython.length + 1;
    const video = {
      id: nuevoIndex,
      titulo:
        titulo.value.length > 20
          ? titulo.value.substring(0, 17) + "..."
          : titulo.value,
      url: imagenURL,
      urlVideo: urlVideo.value,
    };
    addNewVideo(video);
    resetearCampos();
    Swal.fire({
      title: "¡ Has Agregado un Video !",
      text: `Has agregado un nuevo video de manera exitosa`,
      imageUrl: window.location.href + "/img/minions.gif",
      imageAlt: "Success",
      showCancelButton: false,
      confirmButtonText: "OK",
      confirmButtonColor: "#4CAF50",
    });
  } else {
    if (titulo.value == "") {
      Swal.fire({
        icon: "error",
        title: "Campo Vacío",
        text: "El campo Título esta vacío. Debes ingresar un título",
      });
    } else if (!validarURLVideo(urlVideo.value)) {
      Swal.fire({
        icon: "error",
        title: "URL No Válida",
        text: "La URL que has ingresado no pertenece a un video de youtube",
      });
    } else if (videosPython.map((obj) => obj.titulo).includes(titulo.value)) {
      Swal.fire({
        icon: "error",
        title: "Titulo Existente",
        text: "El titulo que quieres ingresar ya existe. Ingresa uno nuevo",
      });
    } else if (imagenURL.length == 0) {
      Swal.fire({
        icon: "error",
        title: "No has seleccionado una imagen",
        text: "Debes seleccionar una imagen para continuar",
      });
    }
  }
});

function borrarVideo(id) {
  const indexElementoaBorrar = videosPython.map((obj) => obj.id).indexOf(id);
  videosPython.splice(indexElementoaBorrar, 1);
  guardarVideosEnLocalStorage();
}

function renderizaOptions() {
  const selectTag = document.getElementById("seleccionaPeliculaEliminar");
  selectTag.innerHTML = "";
  const optionSelect = document.createElement("option");
  optionSelect.value = "Selecciona un Elemento";
  optionSelect.text = "Selecciona un Elemento";
  optionSelect.hidden = true;
  selectTag.appendChild(optionSelect);
  videosPython.forEach((objetoVideo) => {
    const option = document.createElement("option");
    option.value = objetoVideo.id;
    option.text = objetoVideo.titulo;
    selectTag.appendChild(option);
  });
}

renderizaOptions();

const formularioEliminar = document.getElementById("formularioEliminar");
formularioEliminar.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectTag = document.getElementById("seleccionaPeliculaEliminar");
  const id = +selectTag.value;

  if (isNaN(id)) {
    Swal.fire({
      icon: "error",
      title: "No has seleccionado video a eliminar",
      text: "Debes seleccionar un video para lograr eliminar",
    });
  } else {
    borrarVideo(id);
    renderizaOptions();
    swiper.destroy(true, true);
    document.getElementById("swiper__python").innerHTML = "";
    renderizarSlider();
    Swal.fire({
      title: "¡ Has Eliminado un Video !",
      text: `Has eliminado el video seleccionado de manera exitosa`,
      imageUrl: window.location.href + "/img/minions.gif",
      imageAlt: "Success",
      showCancelButton: false,
      confirmButtonText: "OK",
      confirmButtonColor: "#4CAF50",
    });
  }
});
