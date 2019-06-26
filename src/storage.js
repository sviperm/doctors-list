import * as Doctors from './doctors';
import * as Modal from './modal';

export function getData() {
    let data = localStorage.getItem('data')
    // if (data && data !== 'undefined') {
    if (data) {
        return JSON.parse(data);
    };
};

export function updateData(data) {
    localStorage.setItem('data', JSON.stringify(data));
};

export function clearData() {
    localStorage.clear();
};

export function visualizeData() {
    const data = getData();
    if (data) {
        document.querySelector('.profile-area').textContent = data.user.name;
        Doctors.showDoctorsList();
    } else {
        Modal.insertUploadButtons();
        Modal.show();
    };
};

export function updateDoctorsData(id, attr, newVal) {
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