// https://stackoverflow.com/questions/4880381/check-whether-html-element-has-scrollbars

const favDoctorsBtns = document.querySelectorAll('.fav-doc-btn');

favDoctorsBtns.forEach(btn => {
    if (btn.children[0].classList.contains('fav-btn-load')) {
        btn.children[0].addEventListener('click', function () {
            btn.children[0].classList.remove('fav-btn-load');
            btn.children[0].classList.add('fav-btn');
        });
    };
});

// TODO: Change bell on click
// TODO: 
// TODO: 
// TODO: 