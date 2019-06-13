// ##############################################
// ################ MODAL WINDOW ################
// ##############################################

// DOMs
const uploadDoctorBtn = document.querySelector('#upload_doctors');
const modalWindow = document.querySelector('.modal');
const modalMessage = document.querySelector('.modal-message');
const closeModalBtn = document.querySelector('.close-modal');

// Variables
let isModalClosed = true;

// Functions
function showModal() {
    modalWindow.classList.add('show');
    // Super important, we need to delay to add 'fade' class
    setTimeout(() => { modalWindow.classList.add('fade') }, (10));
};

function closeModal() {
    modalWindow.classList.remove('fade');
};

// Events
uploadDoctorBtn.addEventListener('click', showModal);

modalWindow.addEventListener('transitionend', function (e) {
    if (e.target === modalWindow) {
        isModalClosed = !isModalClosed;
        if (isModalClosed) {
            modalWindow.classList.remove('show');
        };
    };
});

closeModalBtn.addEventListener('click', closeModal);
window.addEventListener('click', function (e) {
    if ((!isModalClosed) && (e.target !== modalMessage) && (!modalMessage.contains(e.target))) {
        closeModal();
    };
});

// ##############################################
// ############ OBJECTS MANIPULATION ############
// ##############################################

// Object
let data = {
    user: {
        name: 'Сафоничев Владислав',
        phone: '+79991234567',
    },
    doctors: [
        {
            id: 1,
            name: 'Сафоничев Владислав Маркович',
            avatar: 'img/doc-avatar-vlad.png',
            gender: 'm',
            rating: 4.5,
            address: 'ул. Карла Маркса, 74',
            speciality: 'Акушер',
            isFavorite: true,
        },
        {
            id: 2,
            name: 'Тутаров Артур Вячеславович',
            avatar: 'img/doc-avatar-artur.png',
            gender: 'm',
            rating: 4,
            address: 'ул. Карла Маркса, 74',
            speciality: 'Проктолог',
            isFavorite: true,
        },
        {
            id: 3,
            name: 'Шамсутдинова Яна Маратовна',
            avatar: 'img/doc-avatar-yana.png',
            gender: 'f',
            rating: 3,
            address: 'ул. Карла Маркса, 74',
            speciality: 'Анастезиолог',
            isFavorite: false,
        },
    ],
};

// DOMs
const doctorsGrid = document.querySelector('.doctors-grid');
const uploadSampleBtn = document.querySelector('#upload_sample');
const uploadFromPCBtn = document.querySelector('#upload_from_pc');

// Functions
function createDoctorCard(doctor) {

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

    const doctorCard = createElement('div', 'doctor-card');
    const doctorInfo = createElement('div', 'doc-info');
    const doctorFavBtn = createElement('div', 'fav-doc-btn');

    const favCheckbox = document.createElement('input');
    if (doctor.isFavorite) {
        favCheckbox.classList.add('fav-btn-load');
        favCheckbox.addEventListener('click', () => {
            favCheckbox.classList.remove('fav-btn-load');
            favCheckbox.classList.add('fav-btn');
            // TODO: Toggle in object
        });
    } else {
        favCheckbox.classList.add('fav-btn');
    }
    favCheckbox.type = 'checkbox';
    favCheckbox.id = `doc_id_${doctor.id}`;
    if (doctor.isFavorite) favCheckbox.setAttribute('checked', '');

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

    const dateDoctor = createElement('button', 'doc-date-btn', '<div class="bell-btn"><i id="bell" class="far fa-bell"></i></div><div class="text-btn">Записаться<br>на прием</div>');
    dateDoctor.id = `date_doc_${doctor.id}`;
    dateDoctor.addEventListener('click', function () {
        // TODO: Show modal with text
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
}

// Events

uploadFromPCBtn.addEventListener('click', () => document.getElementById('file_input').click());

for (let i = 0; i < data.doctors.length; i++) {
    doctorsGrid.appendChild(createDoctorCard(data.doctors[i]))
}

// TODO: Change bell on click
// TODO: Add object manipulation