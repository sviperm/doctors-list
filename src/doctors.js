import * as Storage from './storage';
import * as Modal from './modal';

// DOMs
const doctorsBoard = document.querySelector('.doctors-board');
const clearDoctorsBtn = document.querySelector('#clear_doctors');
const toggleSort = document.getElementById('toggle_order');
const toggleFavorite = document.getElementById('toggle_fav');
const orderSelection = document.getElementById('order_by');
const filterSelection = document.getElementById('filter_by');

// Variables
let isReversed = false;
let isFavorites = false;

// Functions
function createElement(customConfig) {
    const config = {
        DOMtype: 'div',
    };
    Object.assign(config, customConfig);
    const element = document.createElement(config.DOMtype);
    for (const key in config) {
        switch (key) {
            case 'attrs':
                config[key].forEach(attr => {
                    element.setAttribute(attr[0], attr[1]);
                });
                break;
            case 'cssList':
                config[key].forEach(css => {
                    element.classList.add(css);
                });
                break;
            case 'event':
                element.addEventListener(config[key].action, config[key].callback);
                break;
            default:
                element[key] = config[key];
                break;
        };
    };
    if (config.hasOwnProperty('parent')) {
        config['parent'].appendChild(element);
    }
    return element;
};

function generateRating(rating) {
    const fieldset = createElement({ DOMtype: 'fieldset', cssList: ['rating'] });
    for (let i = 5; i > 0; i = i - 0.5) {
        const attrs = (rating === i) ? [['disabled', ''], ['checked', '']] : [['disabled', '']];
        createElement({
            DOMtype: 'input',
            type: 'checkbox',
            id: 'star' + i,
            attrs: attrs,
            parent: fieldset,
        });

        const style = (i % 1 === 0) ? ['full'] : ['half'];
        createElement({
            DOMtype: 'label',
            cssList: style,
            arrts: [['for', 'star' + i]],
            parent: fieldset,
        });
    };
    return fieldset;
};

// Upload Doctors
function createDoctorCard(user, doctor) {

    const doctorCard = createElement({ cssList: ['doctor-card'] });
    const doctorInfo = createElement({ cssList: ['doc-info'], parent: doctorCard });
    const doctorFavBtn = createElement({ cssList: ['fav-doc-btn'], parent: doctorInfo });

    const favCheckbox = createElement({
        DOMtype: 'input',
        cssList: doctor.isFavorite ? ['fav-btn-load'] : ['fav-btn'],
        type: 'checkbox',
        id: `doc_id_${doctor.id}`,
        attrs: (doctor.isFavorite) ? [['checked', '']] : [[]],
        parent: doctorFavBtn,
    });
    favCheckbox.addEventListener('click', () => {
        doctor.isFavorite = !doctor.isFavorite;
        Storage.updateDoctorsData(doctor.id, 'isFavorite', doctor.isFavorite);
        favCheckbox.classList.remove('fav-btn-load');
        favCheckbox.classList.add('fav-btn');
    });

    const labelFavBtn = createElement({
        DOMtype: 'label',
        attrs: [['for', `doc_id_${doctor.id}`]],
        innerHTML: `<svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg"><g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)"><path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2" /><circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5" /><g id="grp7" opacity="0" transform="translate(7 6)"><circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2" /><circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2" /></g><g id="grp6" opacity="0" transform="translate(0 28)"><circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2" /><circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2" /></g><g id="grp3" opacity="0" transform="translate(52 28)"><circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2" /><circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2" /></g><g id="grp2" opacity="0" transform="translate(44 6)"><circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2" /><circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2" /></g><g id="grp5" opacity="0" transform="translate(14 50)"><circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2" /><circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2" /></g><g id="grp4" opacity="0" transform="translate(35 50)"><circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2" /><circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2" /></g><g id="grp1" opacity="0" transform="translate(24)"><circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2" /><circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2" /></g></g></svg>`,
        parent: doctorFavBtn,
    });

    const doctorAvatar = createElement({
        DOMtype: 'img',
        cssList: ['doc-pic'],
        src: doctor.avatar,
        parent: doctorInfo,
    });

    const doctorName = createElement({ cssList: ['doc-full-name'], textContent: doctor.name, parent: doctorInfo });

    const doctorRating = createElement({ cssList: ['doc-rating'], parent: doctorInfo });
    doctorRating.appendChild(generateRating(doctor.rating));
    doctorRating.innerHTML += doctor.rating;

    const doctorAddress = createElement({
        cssList: ['doc-address'],
        innerHTML: `<i class="fas fa-map-marker-alt" style="margin-right: 7px"></i>${doctor.address}`,
        parent: doctorInfo,
    });

    const doctorSubInfo = createElement({ cssList: ['doc-sub-info'], parent: doctorCard });

    const doctorSpec = createElement({
        cssList: ['doc-spec'],
        innerHTML: `Специальность<div class="spec-name">${doctor.speciality}</div></div>`,
        parent: doctorSubInfo,
    });

    const dateDoctor = createElement({
        DOMtype: 'button',
        cssList: ['doc-date-btn'],
        innerHTML: `<div class="bell-btn"><i id="bell" class="${doctor.isDated ? 'fas' : 'far'} fa-bell"></i></div><div class="text-btn">Записаться<br>на прием</div>`,
        id: `date_doc_${doctor.id} `,
        parent: doctorSubInfo,
        event: {
            action: 'click',
            callback: () => {
                if (!doctor.isDated) {
                    doctor.isDated = !doctor.isDated;
                    Storage.updateDoctorsData(doctor.id, 'isDated', doctor.isDated);
                    const bell = dateDoctor.querySelector('.far');
                    bell.className = 'fas fa-bell';

                    const text = createElement({
                        innerHTML: `Мы вам перезвоним на номер ${user.phone}, чтобы согласовать запись к врачу ${doctor.name}`,
                        parent: Modal.modalMessage,
                    });
                    Modal.show();
                }
            }
        }
    });

    return doctorCard
};

export function showDoctorsList() {
    let data = Storage.getData();

    // Filter
    (function () {
        if (isFavorites) {
            data.doctors = data.doctors.filter(doctor => (doctor.isFavorite));
        }
        const selection = filterSelection.options[filterSelection.selectedIndex];
        if (selection.value !== 'all') {
            data.doctors = data.doctors.filter(doctor => (doctor[selection.value] === selection.dataset.filter));
        }
    })();

    // Order
    (function () {
        const selection = orderSelection.options[orderSelection.selectedIndex].value;
        if (selection === 'name') {
            data.doctors = data.doctors.sort((a, b) => a[selection] > b[selection] ? 1 : -1);
        } else {
            data.doctors = data.doctors.sort((a, b) => a[selection] < b[selection] ? 1 : -1);
        }
        if (isReversed) {
            data.doctors.reverse();
        }
    })();

    data.doctors.forEach(doctor => {
        const docCard = createDoctorCard(data.user, doctor);
        doctorsBoard.appendChild(docCard);
    });
};

export function clearDoctorsList() {
    while (doctorsBoard.firstChild) {
        doctorsBoard.removeChild(doctorsBoard.firstChild);
    }
}

export function updateDoctorsList() {
    clearDoctorsList();
    showDoctorsList();
};

// Events
clearDoctorsBtn.addEventListener('click', () => {
    Storage.clearData();
    clearDoctorsList();
    Modal.insertUploadButtons();
    Modal.show();
});

toggleSort.addEventListener('click', () => {
    isReversed = !isReversed;
    toggleSort.classList.toggle('toggled');
    updateDoctorsList();
});

toggleFavorite.addEventListener('click', () => {
    isFavorites = !isFavorites;
    toggleFavorite.classList.toggle('toggled');
    updateDoctorsList();
});

[orderSelection, filterSelection].forEach(selection => {
    selection.addEventListener('change', () => {
        updateDoctorsList();
    });
});