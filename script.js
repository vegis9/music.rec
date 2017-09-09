// Suraskite H1 DOM elementą pagal klasę ir priskirkime jį kintamąjam
let titleElement = document.getElementsByClassName("main-title")[0];


// Pakeiskime H1 title pavadinima
titleElement.innerHTML = "Muzikos albumai";


// Pridėkime padildomą klasę H1
titleElement.classList.add("header-title");


// Pakeiskime stiliųs
titleElement.style.fontStyle = "italic";


// Surandame formos mygtuką "Pridėti"
// suras pirmą DOM elementą su klase .btn-save-album
let addAlbumButton = document.querySelector(".btn-save-album");

// metodas .querySelectorAll() suranda visus elementus su klase .btn-save-album
// let addAlbumButton = document.querySelectorAll(".btn-save-album");

// Kai paspaudžiamas mygtukas, vykdyk addAlbum funkciją
addAlbumButton.addEventListener("click", addAlbum);


// Gauname albumus iš localStorage ir sukuriame objektą
// let albumsJSON = localStorage.getItem("albums");


// Kai gauname albumus is JSON-server
// Gausime albumus iš json-server
let httpRequest = new XMLHttpRequest();

if (!httpRequest) {
    alert("Naršyklė nepalaiko AJAX");
} else {
    httpRequest.onreadystatechange = processAlbumJson;
    httpRequest.open('GET', 'http://localhost:3000/albums');
    httpRequest.send();
}

// Kai gauname albumus iš json-server
function processAlbumJson() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            let albumsJSON = httpRequest.responseText;
            let albumList = JSON.parse(albumsJSON);
            if (albumList === null) {
                albumList = [];
            }
            renderAlbums(albumList);

        } else {
            alert("Klaida. Negavau duomenų iš serverio");
        }
    }
}


// Formos elementai
let artistElement = document.querySelector("#artist");
let albumElement = document.querySelector("#album");
let releaseDateElement = document.querySelector("#releaseDate");
let imageElement = document.querySelector("#image");


function addAlbum() {
    // nuskaitome laukelių reikšmes
    let artist = artistElement.value;
    let album = albumElement.value;
    let date = releaseDateElement.value;
    let image = imageElement.files[0];

    if (!artist || !album || !date || !image) {
        alert("Neįvesti visi laukeliai");
        return;
    }

    if (!isAlbumYear(date)) {
        alert("Albumo metai įvesti neteisingai");
        return;
    };

    let record = {
        "artist": artist,
        "album": album,
        "date": date,
        "image": image.name
    }

    // Patikrinime ar albumas jau buvo įvestas
    if (checkForDuplicates(record)){
        alert("Toks albumas jau išsaugotas");
        return;
    }

    // Saugome albumą
    albumList.push(record);

    // Išsaugoti duomenis į localStorage
    let albumsJSON = JSON.stringify(albumList);
    localStorage.setItem("albums", albumsJSON);

    // Atnaujinkim albumų sąrašą
    renderAlbums(albumList);

    // Išvalykim formą
    clearForm();
}

function checkForDuplicates(record) {
    let isDuplicate = false;
    albumList.forEach(function(item){
        if (item.artist === record.artist && item.album === record.album && item.date === record.date) {
            isDuplicate = true;
        }
    })
    return isDuplicate;
};

function isAlbumYear(year) {
    let date = new Date();
    let currentYear = date.getFullYear();

    if (isFinite(year) && year <= currentYear && year > 1900) {
        return true
    } else {
        return false;
    }
}

let formElement = document.querySelector(".album-form");
let clearButton = document.querySelector(".btn-clear-form");

clearButton.addEventListener("click", clearForm);

function clearForm() {
    formElement.reset();

    // arba
    // artistElement.value = "";
    // albumElement.value = "";
    // releaseDateElement.value = "";
    // imageElement.value = "";
}


function renderAlbums(albumList) {
    // Patikrinti ar yra išsaugotų albumų
    // Jei nėra - nutraukti funkcijos vykdymą
    if (!albumList) return;

    // Jei yra, kuriame ciklą ir į rezultatą susidedam visų albumų HTML
    let result = "";
    for (let album of albumList) {
        result += `
            <div class="album clearfix">
                <img src="img/${album.image}" alt="${album.artist} - ${album.album}">
                <h2>${album.album}<span>${album.artist}</span></h2>
                <date>${album.date}</date>
            </div>
            <hr>
        `;
    }

    // Spausdinam rezultatą į ".album-list"
    let albumListElement = document.querySelector(".album-list");
    albumListElement.innerHTML = result;
}

