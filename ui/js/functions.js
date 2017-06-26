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
    var img_channel_num = img_data.data.length / (img_width * img_height);
    console.log('img_channel_num = ' + img_channel_num);
    var post_data = '';

    // _temp_data = img_data.data
    post_data += 'IMG_PROC_OP=gray_scale\r\n';
    post_data += 'IMG_DATA=' + img_data.data + '\r\n';
    post_data += 'IMG_SIZE=(' + img_width + ',' + img_height + ')\r\n';
    post_data += 'IMG_CHANNEL_NUM=' + img_channel_num + '\r\n';
    post_data += 'IMG_PROC_ARGS={' + '"null":"null"'  + '}\r\n';
    post_data += '\r\n\r\n\r\n\r\n'; // very important. self defined. end of stream.

    var xml_http = new XMLHttpRequest();
    var uri = 'general_process';
    xml_http.open('POST', uri, true);
    xml_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xml_http.onreadystatechange = function() {
	if (xml_http.readyState == 4 && xml_http.status == 200) {
	    // alert(xml_http.responseText);
	    // eval('var irs_str = ' + xml_http.responseText + ';');
	    var irs_str = xml_http.responseText;
	    var irs_values = irs_str.split('\r\n');
	    alert(irs_values[1]);
	    // alert(irs_str);
	    
	}
    };
    xml_http.send(post_data);
    
});

function image_result_struct(img_data, img_size, img_channel_num, err_info) {
    this.img_data = img_data;
    this.img_size = img_size;
    this.img_channel_num = img_channel_num;
    this.err_info = err_info;    
};

// image data streamized class
function image_data_streamization() = {
    
};

image_data_streamization.prototype.http_content_to_irs = function(irs_str) {
    var irs__key_dict = new Array("IMG_DATA", "IMG_SIZE", "IMG_CHANNEL_NUM", "ERR_INFO");
    var irs_flags = new Array(4, false);
    var irs_val_strs = new Array();
    
    if(irs_str == '') {
	var err_info = 'Emtpy image_result_struct string.';	
	return new image_result_struct(null, null, 0, err_info);
    }    

    // do the job
    var irs_lines = irs_str.split('\r\n');
    var i = 0;
    for(key in irs_key_dict) {
	if (irs_lines[i].indexOf(key)==0) {
	    irs_val_strs[key] = irs_lines[i];
	    irs_flags[key] = true;
	}
	i++;
    }

    // check the results
    for(key in irs_key_dict) {
	if (irs_flags[key] == false) {
	    err_info = 'Incomplete image information.';
	    return new image_result_struct(null, null, 0, err_info);
	}
    }

    // parse and generate.
    

};



// display the image data

function putImageDataOnCanvas() {
    
}
