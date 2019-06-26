import * as Doctors from './doctors';
import * as Modal from './modal';

function getData() {
    let data = localStorage.getItem('data')
    // if (data && data !== 'undefined') {
    if (data) {
        return JSON.parse(data);
    };
};

function updateData(data) {
    localStorage.setItem('data', JSON.stringify(data));
};

function clearData() {
    localStorage.clear();
};

function visualizeData() {
    const data = getData();
    if (data) {
        document.querySelector('.profile-area').textContent = data.user.name;
        Doctors.showDoctorsList();
    } else {
        Modal.insertUploadBtnsToModal();
        Modal.showModal();
    };
};

function updateDoctorsData(id, attr, newVal) {
    let data = getData();
    if (data) {
        for (let i = 0; i < data.doctors.length; i++) {
            if (data.doctors[i].id === id) {
                data.doctors[i][attr] = newVal;
                updateData(data);
                break;
            }
        }
    }
}

visualizeData();