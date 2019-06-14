// ##############################################
// ################ MODAL WINDOW ################
// ##############################################

// DOMs
const modalWindow = document.querySelector('.modal');
const modalMessage = document.querySelector('.modal-message');

// Variables
let isModalClosed = true;

// Functions
function showModal() {
    modalWindow.classList.add('show');
    // Super important, we need to delay to add 'fade' class
    setTimeout(() => { modalWindow.classList.add('fade') }, (10));

    const closeBtn = document.createElement('div');
    closeBtn.classList.add('close-modal');
    closeBtn.addEventListener('click', closeModal);
    modalMessage.appendChild(closeBtn);
};

function closeModal() {
    modalWindow.classList.remove('fade');
};

// Events
modalWindow.addEventListener('transitionend', function (e) {
    if (e.target === modalWindow) {
        isModalClosed = !isModalClosed;
        if (isModalClosed) {
            modalWindow.classList.remove('show');
            while (modalMessage.firstChild) {
                modalMessage.removeChild(modalMessage.firstChild);
            }
        };
    };
});

window.addEventListener('click', function (e) {
    if ((!isModalClosed) && (e.target !== modalMessage) && (!modalMessage.contains(e.target))) {
        closeModal();
    };
});

// ##############################################
// ############ STORAGE MANIPULATION ############
// ##############################################

function getStorageData() {
    let data = localStorage.getItem('data')
    if (data !== undefined) {
        return JSON.parse(data);
    };
    return null;
};

function updateStorageData(data) {
    localStorage.setItem('data', JSON.stringify(data));
};

function clearStorage() {
    localStorage.clear();
};

function visualizeStorageData() {
    const data = getStorageData();
    if (data) {
        document.querySelector('.profile-area').textContent = data.user.name;
        showDoctorsList();
    } else {
        insertUploadBtnsToModal();
        showModal();
    };
};

function updateDoctorDataInStorage(id, attr, newVal) {
    let data = getStorageData();
    for (let i = 0; i < data.doctors.length; i++) {
        if (data.doctors[i].id === id) {
            data.doctors[i][attr] = newVal;
            updateStorageData(data);
            break;
        }
    }
}

// ##############################################
// ############ DOCTORS MANIPULATION ############
// ##############################################

// DOMs
const doctorsGrid = document.querySelector('.doctors-grid');
const uploadDoctorBtn = document.querySelector('#upload_doctors');
const uploadSampleBtn = document.querySelector('#upload_sample');
const uploadFromPCBtn = document.querySelector('#upload_from_pc');
const clearDoctorsBtn = document.querySelector('#clear_doctors');
const toggleSort = document.getElementById('toggle_order');
const toggleFavorite = document.getElementById('toggle_fav');
const orderSelection = document.getElementById('order_by');
const filterSelection = document.getElementById('filter_by');

// Variables
let reversed = false;
let favorites = false;

// Functions
function insertUploadBtnsToModal() {
    let btn = document.createElement('button');
    btn.classList.add('upload-btn', 'all-round-corners');
    btn.id = 'upload_sample';
    btn.innerHTML = 'Загрузить <kbd>sample.json</kbd>';
    modalMessage.appendChild(btn);
    btn.addEventListener('click', () => alert('Tried upload local file without file input window.\nNot working at all. Security issue.'));
    // 
    // function loadJSON(file, callback) {
    //     var xobj = new XMLHttpRequest();
    //     xobj.overrideMimeType("application/json");
    //     xobj.open('GET', file, true);
    //     xobj.onreadystatechange = function () {
    //         if (xobj.readyState == 4 && xobj.status == "200") {
    //             // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
    //             callback(xobj.responseText);
    //         }
    //     };
    //     xobj.send();
    //     return xobj;
    // }

    btn = document.createElement('button');
    btn.classList.add('upload-btn', 'all-round-corners');
    btn.id = 'upload_from_pc';
    btn.innerHTML = 'Загрузить с компьютера<input type="file" id="file_input" style="display: none" accept=".json">';
    modalMessage.appendChild(btn);

    function loadData(event) {
        // https://stackoverflow.com/questions/23344776/access-data-of-uploaded-json-file-using-javascript
        var reader = new FileReader();
        reader.onload = (event) => {
            const data = JSON.parse(event.target.result);
            clearDoctorsList();
            updateStorageData(data);
            visualizeStorageData();
        }
        reader.readAsText(event.target.files[0]);
        closeModal();
    }


    btn.addEventListener('click', () => document.getElementById('file_input').click());
    document.getElementById('file_input').addEventListener('change', loadData);
}

function createDoctorCard(user, doctor) {

    function createElement(elementType, cssClass, inner) {
        const element = document.createElement(elementType);
        if (cssClass) element.classList.add(cssClass);
        if (inner) element.innerHTML = inner;
        return element;
    }

    function generateRating(rating) {
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('rating');

        for (let i = 5; i > 0; i = i - 0.5) {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = 'star' + i;
            input.setAttribute('disabled', '');
            if (rating === i) input.setAttribute('checked', '');

            const label = document.createElement('label');
            i % 1 === 0 ? label.classList.add('full') : label.classList.add('half');
            label.setAttribute('for', 'star' + i);

            fieldset.appendChild(input);
            fieldset.appendChild(label);
        };
        return fieldset;
    };

    function insertNotificationToModal(phone, doctorName) {
        let text = document.createElement('div');
        text.innerHTML = `Мы вам перезвоним на номер ${phone}, чтобы согласовать запись к врачу ${doctorName}`;
        modalMessage.appendChild(text);
    }

    const doctorCard = createElement('div', 'doctor-card');
    const doctorInfo = createElement('div', 'doc-info');
    const doctorFavBtn = createElement('div', 'fav-doc-btn');

    const favCheckbox = document.createElement('input');
    doctor.isFavorite ?
        favCheckbox.classList.add('fav-btn-load') :
        favCheckbox.classList.add('fav-btn');
    favCheckbox.type = 'checkbox';
    favCheckbox.id = `doc_id_${doctor.id}`;
    if (doctor.isFavorite) favCheckbox.setAttribute('checked', '');
    favCheckbox.addEventListener('click', function () {
        doctor.isFavorite = !doctor.isFavorite;
        updateDoctorDataInStorage(doctor.id, 'isFavorite', doctor.isFavorite);
        favCheckbox.classList.remove('fav-btn-load');
        favCheckbox.classList.add('fav-btn');
    })

    const labelFavBtn = createElement('label', '', `<svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg"><g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)"><path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2" /><circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" /><g id="grp7" opacity="0" transform="translate(7 6)"><circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2" /><circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2" /></g><g id="grp6" opacity="0" transform="translate(0 28)"><circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2" /><circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2" /></g><g id="grp3" opacity="0" transform="translate(52 28)"><circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2" /><circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2" /></g><g id="grp2" opacity="0" transform="translate(44 6)"><circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2" /><circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2" /></g><g id="grp5" opacity="0" transform="translate(14 50)"><circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2" /><circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2" /></g><g id="grp4" opacity="0" transform="translate(35 50)"><circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2" /><circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2" /></g><g id="grp1" opacity="0" transform="translate(24)"><circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2" /><circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2" /></g></g></svg>`);
    labelFavBtn.setAttribute('for', `doc_id_${doctor.id}`);

    const doctorAvatar = createElement('img', 'doc-pic');
    doctorAvatar.src = doctor.avatar;

    const doctorName = createElement('div', 'doc-full-name', doctor.name);

    const doctorRating = createElement('div', 'doc-rating');
    doctorRating.appendChild(generateRating(doctor.rating));
    doctorRating.innerHTML += doctor.rating;

    const doctorAddress = createElement('div', 'doc-address', `<i class="fas fa-map-marker-alt" style="margin-right: 7px"></i>${doctor.address}`);

    const doctorSubInfo = createElement('div', 'doc-sub-info');

    const doctorSpec = createElement('div', 'doc-spec', `Специальность<div class="spec-name">${doctor.speciality}</div></div>`);

    const dateDoctor = createElement('button', 'doc-date-btn', `<div class="bell-btn"><i id="bell" class="${doctor.isDated ? 'fas' : 'far'} fa-bell"></i></div><div class="text-btn">Записаться<br>на прием</div>`);
    dateDoctor.id = `date_doc_${doctor.id} `;
    dateDoctor.addEventListener('click', () => {
        if (!doctor.isDated) {
            doctor.isDated = !doctor.isDated;
            updateDoctorDataInStorage(doctor.id, 'isDated', doctor.isDated);
            const bell = dateDoctor.querySelector('.far');
            bell.className = 'fas fa-bell';
            insertNotificationToModal(user.phone, doctor.name);
            showModal();
        }
    });

    doctorCard.appendChild(doctorInfo);
    doctorInfo.appendChild(doctorFavBtn);
    doctorFavBtn.appendChild(favCheckbox);
    doctorFavBtn.appendChild(labelFavBtn);
    doctorInfo.appendChild(doctorAvatar);
    doctorInfo.appendChild(doctorName);
    doctorInfo.appendChild(doctorRating);
    doctorInfo.appendChild(doctorAddress);
    doctorCard.appendChild(doctorSubInfo);
    doctorSubInfo.appendChild(doctorSpec);
    doctorSubInfo.appendChild(dateDoctor);

    return doctorCard
};

function showDoctorsList() {
    let data = getStorageData();

    function filter() {
        if (favorites) {
            data.doctors = data.doctors.filter(doctor => (doctor.isFavorite));
        }
        const selection = filterSelection.options[filterSelection.selectedIndex];
        if (selection.value !== 'all') {
            data.doctors = data.doctors.filter(doctor => (doctor[selection.value] === selection.dataset.filter));
        }
    };

    function order() {
        const selection = orderSelection.options[orderSelection.selectedIndex].value;
        if (selection === 'name') {
            data.doctors = data.doctors.sort((a, b) => a[selection] > b[selection] ? 1 : -1);
        } else {
            data.doctors = data.doctors.sort((a, b) => a[selection] < b[selection] ? 1 : -1);
        }
        if (reversed) {
            data.doctors.reverse();
        }
    };

    filter();
    order();

    for (let i = 0; i < data.doctors.length; i++) {
        const docCard = createDoctorCard(data.user, data.doctors[i]);
        doctorsGrid.appendChild(docCard);
    };
};

function updateDoctorsList() {
    clearDoctorsList();
    showDoctorsList();
};

function clearDoctorsList() {
    while (doctorsGrid.firstChild) {
        doctorsGrid.removeChild(doctorsGrid.firstChild);
    }
}

// Events
uploadDoctorBtn.addEventListener('click', () => {
    insertUploadBtnsToModal();
    showModal();
});

clearDoctorsBtn.addEventListener('click', () => {
    clearStorage();
    clearDoctorsList();
    insertUploadBtnsToModal();
    showModal();
});

toggleSort.addEventListener('click', () => {
    reversed = !reversed;
    toggleSort.classList.toggle('toggled');
    updateDoctorsList();
});

toggleFavorite.addEventListener('click', () => {
    favorites = !favorites;
    toggleFavorite.classList.toggle('toggled');
    updateDoctorsList();
});

[orderSelection, filterSelection].forEach(selection => {
    selection.addEventListener('change', () => {
        updateDoctorsList();
    });
});

visualizeStorageData();
