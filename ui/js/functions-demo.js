/* this file implement the classes and events. */
function general_process() {

}

var gray_scale_div = document.getElementById('gray_scale');

/*
gray_scale_div.onclick = function() {
    var open_img_file = document.getElementById("img_file");
    open_img_file.click();
    // alert('Success');
}
*/

var open_img_div = document.getElementById('open_image');

open_img_div.onclick = function() {
    var open_img_file = document.getElementById('img_file');
    // var img_src_url =
    // open_img_file.click();
    // var img_src_url = open_img_file.value;
    var img_src_url = 'file:///F:/relaxation/pictures/girl.jpg';
    var img_src_url_2 = 'http://oss.youkouyang.com/1.jpg';

    var imgURL = prompt('请输入图像的url：', 'http://img.blog.csdn.net/20160713111856694?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center');
    

    // var img_div = document.getElementById('img_div');
    // src_canvas.width = img_div.clientWidth;
    // src_canvas.height = img_div.clientHeight;
    
    // Image object
    var img = new Image();


    // image.src = img_src_url;
    img.crossOrigin = 'Anonymous';
    img.src = imgURL;

    var src_canvas = document.getElementById('src_canvas');
    var ctx = src_canvas.getContext('2d');
    
    img.onload = function() {
	src_canvas.width = img.width;
	src_canvas.height = img.height;
	ctx.drawImage(img, 0, 0);

    };

    /*

	console.log('src image loaded.');
    }
    */
    if( img.complete) {
	src_canvas.width = img.width;
	src_canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
    }



    // alert('Success');
};

/* button of input file */
var img_file_btn = document.getElementById('img_file_btn');
img_file_btn.onchange = function () {
    
    var reader = new FileReader();
    reader.readAsDataURL(this.files[0]);

    reader.onload = function() {
	var img = new Image();

	var src_canvas = document.getElementById('src_canvas');
	var ctx = src_canvas.getContext('2d');


	// img.crossOrigin = 'Anonymous';
	img.src = this.result;

        ctx.drawImage(img, 0, 0);

	
    };
}
