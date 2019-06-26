import { clearDoctorsList } from './doctors';
import { updateData, visualizeData } from './storage';

// DOMs
const modalWindow = document.querySelector('.modal');
export const modalMessage = document.querySelector('.modal-message');
const uploadDoctorBtn = document.querySelector('#upload_doctors');

// Variables
let isModalClosed = true;

// Functions
export function show() {
    modalWindow.classList.add('show');
    // Super important, we need to delay to add 'fade' class
    setTimeout(() => { modalWindow.classList.add('fade') }, (10));

    const closeBtn = document.createElement('div');
    closeBtn.classList.add('close-modal');
    closeBtn.addEventListener('click', close);
    modalMessage.appendChild(closeBtn);
};

export function close() {
    modalWindow.classList.remove('fade');
};

export function insertUploadButtons() {
    // First button
    let btn = document.createElement('button');
    btn.classList.add('upload-btn', 'all-round-corners');
    btn.id = 'upload_sample';
    btn.innerHTML = 'Загрузить <kbd>sample.json</kbd>';
    modalMessage.appendChild(btn);
    // Download .json file from GitHub
    btn.addEventListener('click', () => {
        let xobj = new XMLHttpRequest();
        xobj.open('GET', 'https://raw.githubusercontent.com/sviperm/doctors-list/master/data.json', true);
        xobj.onreadystatechange = () => {
            if (xobj.readyState == 4 && xobj.status == "200") {
                clearDoctorsList();
                updateData(JSON.parse(xobj.responseText));
                visualizeData();
            }
        }
        xobj.send();
        close();
    });

    // Second Button
    btn = document.createElement('button');
    btn.classList.add('upload-btn', 'all-round-corners');
    btn.id = 'upload_from_pc';
    btn.innerHTML = 'Загрузить с компьютера<input type="file" id="file_input" style="display: none" accept=".json">';
    modalMessage.appendChild(btn);
    btn.addEventListener('click', () => document.getElementById('file_input').click());
    // Download file from desktop
    document.getElementById('file_input').addEventListener('change', event => {
        // https://stackoverflow.com/questions/23344776/access-data-of-uploaded-json-file-using-javascript
        let reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = (event) => {
            clearDoctorsList();
            updateData(JSON.parse(event.target.result));
            visualizeData();
        }
        close();
    });
}

// Events
modalWindow.addEventListener('transitionend', (e) => {
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

window.addEventListener('click', (e) => {
    if ((!isModalClosed) && (e.target !== modalMessage) && (!modalMessage.contains(e.target))) {
        close();
    };
});

uploadDoctorBtn.addEventListener('click', () => {
    insertUploadButtons();
    show();
});