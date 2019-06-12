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

// DOMs
const favDoctorsBtns = document.querySelectorAll('.fav-doc-btn');
const uploadSampleBtn = document.querySelector('#upload_sample');
const uploadFromPCBtn = document.querySelector('#upload_from_pc');

// Events
favDoctorsBtns.forEach(btn => {
    if (btn.children[0].classList.contains('fav-btn-load')) {
        btn.children[0].addEventListener('click', function () {
            btn.children[0].classList.remove('fav-btn-load');
            btn.children[0].classList.add('fav-btn');
        });
    };
});


uploadFromPCBtn.addEventListener('click', () => document.getElementById('file_input').click());

// TODO: Change bell on click
// TODO: Add object manipulation