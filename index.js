// Specialties Data
let specialites = [
    { id: "DD", intitule: "Digital Development" },
    { id: "UI", intitule: "UI/UX" },
    { id: "ID", intitule: "Digital Infrastructure" },
    { id: "IA", intitule: "Artificial Intelligence" }
];

// DOM Elements
let sec1 = document.getElementById("s1");
let sec2 = document.getElementById("s2");
let sec3 = document.getElementById("s3");
let categoriesContainer = document.getElementById("categories");
let cardsContainer = document.getElementById("cards");
let stToDelete = document.getElementById("stToDelete");

// Data Initialization
let data = JSON.parse(localStorage.getItem("data")) || [];
let ixdToDelete = null;
let ixdToModify = -1;

// Initial Rendering
renderCategories();
display(data);

// Render Categories
function renderCategories() {
    let categoriesHTML = `
        <div class="col-3 bg-secondary ms-2 text-center" style="width: 12rem; height: 30px;">
            <p onclick="filter('All')">All</p>
        </div>
    `;
    specialites.forEach(specialite => {
        categoriesHTML += `
            <div class="col-3 bg-secondary ms-2 text-center" style="width: 12rem; height: 30px;">
                <p onclick="filter('${specialite.id}')">${specialite.intitule}</p>
            </div>
        `;
    });
    categoriesContainer.innerHTML = categoriesHTML;
}

// Add New Trainee
function Add() {
    toggleSections(sec2);
}

// Add or Update Trainee
function ajouter() {
    let nom = document.getElementById("nom").value.toUpperCase();
    let prenom = document.getElementById("prenom").value.toUpperCase();
    let genre = document.getElementById("genre").value;
    let specialite = document.getElementById("specialite").value;
    let classe = document.getElementById("classe").value;
    let note1 = Number(document.getElementById("n1").value);
    let note2 = Number(document.getElementById("n2").value);
    let note3 = Number(document.getElementById("n3").value);

    let st = {
        identite: { nom, prenom, genre },
        profil: "Trainee",
        specialite,
        classe,
        notes: { M101: note1, M102: note2, M103: note3 },
        moy: (note1 + note2 + note3) / 3
    };

    if (ixdToModify !== -1) {
        data[ixdToModify] = st;
        ixdToModify = -1;
    } else {
        data.push(st);
    }

    localStorage.setItem("data", JSON.stringify(data));
    clearFields();
    toggleSections(sec1);
    display(data);
}

// Display Trainees
function display(list) {
    // Group by Specialty and Class
    let groupedBySpecialite = {};
    list.forEach(st => {
        if (!groupedBySpecialite[st.specialite]) {
            groupedBySpecialite[st.specialite] = {};
        }
        if (!groupedBySpecialite[st.specialite][st.classe]) {
            groupedBySpecialite[st.specialite][st.classe] = [];
        }
        groupedBySpecialite[st.specialite][st.classe].push(st);
    });

    // Assign Ranks
    for (let specialite in groupedBySpecialite) {
        for (let classe in groupedBySpecialite[specialite]) {
            groupedBySpecialite[specialite][classe].sort((a, b) => b.moy - a.moy);
            groupedBySpecialite[specialite][classe].forEach((st, index) => {
                st.rank = index + 1;
            });
        }
    }

    // Create a copy of the original list
    let originalOrderList = [...list];

    let cardsHTML = "";
    originalOrderList.forEach((st, i) => {
        cardsHTML += `
            <div class="card m-3 ${st.identite.genre === "F" ? "bg-danger-subtle" : "bg-success-subtle"}" style="width: 15rem;">
                <div class="card-header">
                    <button onclick="confirmation(${i})"><img src="images/delete.png" alt="..." style="width: 30px;"></button>
                    <button onclick="edit(${i})"><img src="images/edit.png" alt="..." style="width: 35px;"></button>
                </div>
                <img src="${st.identite.genre === "F" ? "images/female.png" : "images/male.png"}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${st.identite.nom} ${st.identite.prenom}</h5>
                    <p class="card-text">Trainee_${st.classe}</p>
                    <div class="bg-light text-dark ps-2">
                        <p class="card-text">#${st.rank} - Average: ${st.moy.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;
    });
    cardsContainer.innerHTML = cardsHTML;
}

// Filter Trainees
function filter(id) {
    if (id === 'All') {
        display(data);
    } else {
        let filteredData = data.filter(st => st.specialite === id);
        display(filteredData);
    }
}

// Confirm Deletion
function confirmation(i) {
    ixdToDelete = i;
    toggleSections(sec3);
    stToDelete.innerHTML = `
        Do you really want to delete the trainee ${data[i].identite.nom} ${data[i].identite.prenom}?
    `;
}

// Cancel Deletion
function cancel() {
    toggleSections(sec1);
}

// Confirm Deletion
function confirm() {
    data.splice(ixdToDelete, 1);
    localStorage.setItem("data", JSON.stringify(data));
    display(data);
    toggleSections(sec1);
}

// Edit Trainee
function edit(i) {
    ixdToModify = i;
    Add();
    let st = data[i];
    document.getElementById("nom").value = st.identite.nom;
    document.getElementById("prenom").value = st.identite.prenom;
    document.getElementById("genre").value = st.identite.genre;
    document.getElementById("specialite").value = st.specialite;
    document.getElementById("classe").value = st.classe;
    document.getElementById("n1").value = st.notes.M101;
    document.getElementById("n2").value = st.notes.M102;
    document.getElementById("n3").value = st.notes.M103;
}

// Clear Input Fields
function clearFields() {
    document.getElementById("nom").value = "";
    document.getElementById("prenom").value = "";
    document.getElementById("genre").value = "";
    document.getElementById("specialite").value = "";
    document.getElementById("classe").value = "";
    document.getElementById("n1").value = "";
    document.getElementById("n2").value = "";
    document.getElementById("n3").value = "";
}

// Toggle Sections
function toggleSections(sectionToShow) {
    sec1.style.display = "none";
    sec2.style.display = "none";
    sec3.style.display = "none";
    sectionToShow.style.display = "block";
}