/* codes implementing functions */

$('#open_image').on('click', function(){    
    if($('#src_canvas').length > 0) {
	return;
    }
    
    var imgURL = 'http://img.blog.csdn.net/20160713111856694?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center'; // 'http://fj.ikafan.com/attachment/forum/201510/16/150108pf2fgjw7i33bq22w.jpg.thumb.jpg';
    var img = new Image();
    // Below is very important. See: 'https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image'
    img.crossOrigin = 'Anonymous'; 
    img.src = imgURL;

    // $('body').append($('<canvas/>').attr({id:'src_canvas', width:img.width, height:img.height}));
    $('body').append($('<canvas/>').attr({id:'src_canvas'})); // , width:img.width, height:img.height}));
    var canvas = document.getElementById('src_canvas');
	// console.log($('#src_canvas'));
    var ctx = canvas.getContext('2d');
    img.onload = function() {
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
    }
    
});

$('#gray_scale').on('click', function() {
    if($('#src_canvas').length == 0) {
	return;
    }

    var canvas = document.getElementById('src_canvas');
    var ctx = canvas.getContext('2d');
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height); // canvas.width, canvas.height);    
    // console.log('canvas.width: ' + canvas.width);
    // console.log('canvas.height: ' + canvas.height);
    var img_width = canvas.width;
    var img_height = canvas.height;
    var post_data = '';

    /*
    function concat_image_data(image_data) {
	var img_data = [];
    }
    */

    // _temp_data = img_data.data
    post_data += 'IMG_PROC_OP=gray_scale\r\n';
    post_data += 'IMG_DATA=' + img_data.data + '\r\n';
    post_data += 'IMG_SIZE=(' + img_width + ',' + img_height + ')\r\n';
    post_data += 'IMG_PROC_ARGS=\r\n';
    post_data += '\r\n\r\n\r\n\r\n'; // very important. self defined. end of stream.

    var xml_http = new XMLHttpRequest();
    var uri = 'general_process';
    xml_http.open('POST', uri, true);
    xml_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xml_http.onreadystatechange = function() {
	if (xml_http.readyState == 4 && xml_http.status == 200) {
	    // alert(xml_http.responseText);
	    
	}
    };
    xml_http.send(post_data);
    
});
