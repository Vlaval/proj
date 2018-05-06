$(document).ready(function () {
    if($('.cls-1').length) {
        var path = document.querySelector('.cls-1');
        path.getTotalLength();
        console.log(path.getTotalLength());
    }
});
