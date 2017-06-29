/* this file implement the classes and events. */
function general_process() {

}

var gray_scale_div = document.getElementById('gray_scale');

gray_scale_div.onclick = function() {
    var open_img_file = document.getElementById("img_file");
    open_img_file.click();
    // alert('Success');
}

var open_img_div = document.getElementById('open_image');

open_img_div.onclick = function() {
    var open_img_file = document.getElementById("img_file");
    open_img_file.click();
    // alert('Success');
}
