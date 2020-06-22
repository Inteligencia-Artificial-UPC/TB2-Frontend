const imageInput = document.getElementById("img-file-input");
const preview = document.getElementById("preview");
const overlay = document.getElementById("overlay");
const reader = new FileReader();

const NO_FILE_SELECTED_EXCEPTION = "ABORT_OPERATION: NO_FILE_SELECTED"

let inProcess = false;

// image stored as base64 string
let image = undefined;

reader.onloadend = () => {
    const dataUrl = reader.result;

    preview.src = dataUrl //añade previsualización de la imagen
    overlay.classList.add("op-0-0"); //hace invisible el overlay

    image = getImageAsBase64(dataUrl);

    // Delete te file from the buffer
    imageInput.value = null
}

imageInput.onchange = () => {
    loadFile();
}

// process the loaded file
function loadFile() {
    const file = imageInput.files[0];

    if (file) {
        reader.readAsDataURL(file);
    } else {
        throw NO_FILE_SELECTED;
    }
}

function getImageAsBase64(dataUrl) {
    return dataUrl.split(",", 2)[1];
}

//function to be called by onclick event, calls imageInput.onchange()
function fileUpload(){
    imageInput.click();
}

function Register() {
    if (inProcess) {
        return;
    }

    if (image == null) {
        throw NO_FILE_SELECTED_EXCEPTION;
    }

    const firstName = document.getElementsByName("first-name").item(0);
    const lastName = document.getElementsByName("last-name").item(0);

    const data = {
        first_name: firstName.value,
        last_name: lastName.value,
        image: image
    }

    let [ url, init ]= requestUtil('register', data);

    startSpinner();
    fetch(url, init).catch(err => {
        console.error(err);
    }).then(res => {
        stopSpinner();

        if (res != null) {
            alert("Se ha registrado con exito");
        } else {
            alert("Ha ocurrido un error");
        }
    });
}

function Login() {
    if (inProcess) {
        return;
    }

    if (image == null) {
        throw NO_FILE_SELECTED_EXCEPTION;
    }

    const data = {
        image: image
    }

    let [ url, init ]= requestUtil('login', data);

    startSpinner();
    fetch(url, init).catch(err => {
        console.error(err);
    }).then(res => {
        stopSpinner();

        if (res != null) {
            if (res.id == 0) {
                alert("No se ha podido autenticar");
            }
            else {
                alert("Se ha autenticado con exito");
            }
        } else {
            alert("Ha ocurrido un error");
        }

    });
}

function requestUtil(endpoint, data) {
    const port = "5000"
    const url = `http://localhost:${port}/${endpoint}`;
    const init = {
        method: 'POST',
        body: JSON.stringify(data),
        headers:{
            'Content-Type': 'application/json'
        }
    }
    return [ url, init ]
}

function startSpinner() {
    inProcess = true;
    const spinner = `<div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                        <p>Espere por favor</p>`;
    const loading = document.getElementsByClassName("loading");
    if (loading.length != 0){;
        for (let i = 0; i < loading.length; i++) {
            loading.item(i).innerHTML = spinner
        }
    }
}

function stopSpinner() {
    const loading = document.getElementsByClassName("loading");
    if (loading.length != 0){
        for (let i = 0; i < loading.length; i++) {
            loading.item(i).innerHTML = ""
        }
    }
    inProcess = false;
}