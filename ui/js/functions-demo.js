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

	img.onload = function() {

	    src_canvas.width = img.width;
	    src_canvas.height = img.height;
	

            ctx.drawImage(img, 0, 0);
	};

	
    };
}

/* gray_scale */
var gray_scale_div = document.getElementById('gray_scale');
gray_scale_div.onclick = function() {
    // $('#gray_scale').on('click', function() {

    /*
    if($('#src_canvas').length == 0) {
	return;
    }
    */


    /*
    var canvas = document.getElementById('src_canvas');
    var ctx = canvas.getContext('2d');
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height); // canvas.width, canvas.height);    


    var img_width = canvas.width;
    var img_height = canvas.height;
    var img_channel_num = img_data.data.length / (img_width * img_height);
    */


    // image_data_acquire
    var ida = new image_data_acquire();

    var gray_scale_args = '{null:null}';

    var src_ips = ida.get_image_process_info('src_canvas', 'gray_scale', gray_scale_args);


    var ip_strmz = new image_process_streamization();
    
    var post_data = ip_strmz.ips_to_http_content(src_ips);


    /*
    post_data += 'IMG_PROC_OP=gray_scale\r\n';
    post_data += 'IMG_DATA=' + img_data.data + '\r\n';
    post_data += 'IMG_SIZE=(' + img_width + ',' + img_height + ')\r\n';
    post_data += 'IMG_CHANNEL_NUM=' + img_channel_num + '\r\n';
    post_data += 'IMG_PROC_ARGS={' + '"null":"null"'  + '}\r\n';
    post_data += '\r\n\r\n\r\n\r\n'; // very important. self defined. end of stream.
    */


    // TODO: encapsulated the following codes into a function
    var xml_http = new XMLHttpRequest();
    var uri = 'general_process';
    xml_http.open('POST', uri, true);
    xml_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xml_http.onreadystatechange = function() {
	if (xml_http.readyState == 4 && xml_http.status == 200) {
	    // alert(xml_http.responseText);
	    var irs_str = xml_http.responseText;
	    // streamization/destreamization object
	    var img_res_stream = new image_result_streamization();
	    // destreamized
	    var irs = img_res_stream.http_content_to_irs(irs_str);
	    // display the image data
	    var start_left_top_pos = new point(0, 0);
	    var img_disp = new image_display();
	    var canvas_id = "src_canvas";
	    img_disp.put_image_data_on_canvas(irs, canvas_id, start_left_top_pos);
	    
	    // alert(irs_values[1]);
	    // alert(irs_str);
	    
	}
    };
    xml_http.send(post_data);
};

/* revert */

var revert_div = document.getElementById('revert');
revert_div.onclick = function() {
    
    var ida = new image_data_acquire();

    var gray_scale_args = '{null:null}';

    var src_ips = ida.get_image_process_info('src_canvas', 'revert', gray_scale_args);


    var ip_strmz = new image_process_streamization();
    
    var post_data = ip_strmz.ips_to_http_content(src_ips);

    // TODO: encapsulated the following codes into a function
    var xml_http = new XMLHttpRequest();
    var uri = 'general_process';
    xml_http.open('POST', uri, true);
    xml_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xml_http.onreadystatechange = function() {
	if (xml_http.readyState == 4 && xml_http.status == 200) {
	    // alert(xml_http.responseText);
	    var irs_str = xml_http.responseText;
	    // streamization/destreamization object
	    var img_res_stream = new image_result_streamization();
	    // destreamized
	    var irs = img_res_stream.http_content_to_irs(irs_str);
	    // display the image data
	    var start_left_top_pos = new point(0, 0);
	    var img_disp = new image_display();
	    var canvas_id = "src_canvas";
	    img_disp.put_image_data_on_canvas(irs, canvas_id, start_left_top_pos);
	    
	    // alert(irs_values[1]);
	    // alert(irs_str);
	    
	}
    };
    xml_http.send(post_data);

    

}


/* sharpen */
var sharpen_div = document.getElementById('sharpen');
sharpen_div.onclick = function() {
    
    var ida = new image_data_acquire();

    var gray_scale_args = '{null:null}';

    var src_ips = ida.get_image_process_info('src_canvas', 'sharpen', gray_scale_args);


    var ip_strmz = new image_process_streamization();
    
    var post_data = ip_strmz.ips_to_http_content(src_ips);

    // TODO: encapsulated the following codes into a function
    var xml_http = new XMLHttpRequest();
    var uri = 'general_process';
    xml_http.open('POST', uri, true);
    xml_http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xml_http.onreadystatechange = function() {
	if (xml_http.readyState == 4 && xml_http.status == 200) {
	    // alert(xml_http.responseText);
	    var irs_str = xml_http.responseText;
	    // streamization/destreamization object
	    var img_res_stream = new image_result_streamization();
	    // destreamized
	    var irs = img_res_stream.http_content_to_irs(irs_str);
	    // display the image data
	    var start_left_top_pos = new point(0, 0);
	    var img_disp = new image_display();
	    var canvas_id = "src_canvas";
	    img_disp.put_image_data_on_canvas(irs, canvas_id, start_left_top_pos);
	    
	    // alert(irs_values[1]);
	    // alert(irs_str);
	    
	}
    };
    xml_http.send(post_data);

    

}


/////////////////////////////////////////////////////////////////
// useful class and methods

function image_data_acquire() {

};

image_data_acquire.prototype.get_image_process_info = function(canvas_id, img_proc_op, img_proc_args) {
    var canvas = document.getElementById('src_canvas');
    var ctx = canvas.getContext('2d');
    var img_data = ctx.getImageData(0, 0, canvas.width, canvas.height); // canvas.width, canvas.height);    
    // console.log('canvas.width: ' + canvas.width);
    // console.log('canvas.height: ' + canvas.height);
    var img_width = canvas.width;
    var img_height = canvas.height;
    var img_channel_num = img_data.data.length / (img_width * img_height);

    return new image_process_struct(img_proc_op, img_data, img_width, img_height, img_channel_num, img_proc_args);
};

function image_process_struct(img_proc_op, img_data, img_width, img_height, img_channel_num, img_proc_args) {
    this.img_proc_op = img_proc_op;
    this.img_data = img_data;
    this.img_width = img_width;
    this.img_height = img_height;
    this.img_channel_num = img_channel_num;
    this.img_proc_args = img_proc_args;
}

// image process streamized class
function image_process_streamization() {    

}

image_process_streamization.prototype.ips_to_http_content = function(ips) {
    var serialized_data = '';

    serialized_data += 'IMG_PROC_OP=' + ips.img_proc_op + '\r\n';
    serialized_data += 'IMG_DATA=' + ips.img_data.data + '\r\n';
    serialized_data += 'IMG_SIZE=(' + ips.img_width + ',' + ips.img_height + ')\r\n';
    serialized_data += 'IMG_CHANNEL_NUM=' + ips.img_channel_num + '\r\n';
    // serialized_data += 'IMG_PROC_ARGS={' + '"null":"null"'  + '}\r\n';
    serialized_data += 'IMG_PROC_ARGS=' + ips.img_proc_args + '\r\n';
    serialized_data += '\r\n\r\n\r\n\r\n'; // very important. self defined. end of stream.

    return serialized_data;

};


function image_result_struct(img_data, img_size, img_channel_num, err_info) {
    this.img_data = img_data;
    this.img_size = img_size;
    this.img_channel_num = img_channel_num;
    this.err_info = err_info;    
};

// image result streamized class
function image_result_streamization() {
    
};

image_result_streamization.prototype.http_content_to_irs = function(irs_str) {
    // var irs_key_dict = new Array('IMG_DATA', 'IMG_SIZE', 'IMG_CHANNEL_NUM', 'ERR_INFO');
    var irs_key_dict = {irs_img_data: 'IMG_DATA',
			irs_img_size: 'IMG_SIZE',
			irs_img_channel_num: 'IMG_CHANNEL_NUM',
			irs_err_info: 'ERR_INFO'};
    var irs_flags = {};
    var irs_val_strs = {};
    
    if(irs_str == '') {
	var err_info = 'Emtpy image_result_struct string.';	
	return new image_result_struct(null, null, 0, err_info);
    }    

    // do the job
    var irs_lines = irs_str.split('\r\n');
    var i = 0;
    // alert('irs_str.length is ' + irs_lines.length);

    /*
    for(var i = 0; i < irs_lines.length; i++) {
	alert(irs_lines[i]);
    }
    */
    for(key in irs_key_dict) {
	// alert('irs_lines[' + i +'] is' + irs_lines[0]);
	if (irs_lines[i].indexOf(irs_key_dict[key])==0) {
	    // alert('key is ' + key);
	    irs_val_strs[irs_key_dict[key]] = irs_lines[i];
	    irs_flags[irs_key_dict[key]] = true;
	}
	i++;
    }

    // debug    
    // alert(irs_lines[0].length);
    
    // for
    // alert(irs_lines[1]);
    // alert("IMG_SIZE: --" + irs_val_strs["IMG_SIZE"]);

    // check the result
    for(key in irs_key_dict) {
	if (irs_flags[key] == false) {
	    if( key != "ERR_INFO") {
		err_info = 'Incomplete image result information.';
		// directly return the void result struct.
		return new image_result_struct(null, null, 0, err_info);
	    }
	}
    }

    // parse and generate irs.

    // img_data
    var irs_img_data_str = irs_val_strs[irs_key_dict['irs_img_data']].split('=')[1]; // ugly :D
    // var irs_img_data_array_str = irs_img_data_str.replace(/ /g, ',');

    // var irs_img_data_str_decoded = window.atob(irs_img_data_array);
    // var irs_img_data_str_array = new Uint8Array(irs_img_data_str);
    // var irs_img_data_str_array = irs_img_data_str.split(""); // the space cannot be omitted

    // var temp_array_str = '[[1,2], [2,3]]';
    // var temp_array = JSON.parse(temp_array_str);

    // eval('var irs_img_data = ' + irs_img_data_array_str); // got the img_data array    

    var irs_img_data_two_dim = JSON.parse(irs_img_data_str); // got the img_data array

    // convert to one-dimension array
    var irs_img_data = new Array();
    for (var i = 0; i < irs_img_data_two_dim.length; i++) {
	var sub_array_len = irs_img_data_two_dim[i].length; 
	for(var j = 0; j < sub_array_len; j++) {
	    irs_img_data[i * sub_array_len + j] = irs_img_data_two_dim[i][j];
	}
    }


    /* fix me */
    /*
    var array_height = irs_img_data_two_dim[0].length;
    var array_width = irs_img_data_two_dim.length;
    console.log('array_height = ' + array_height);
    console.log('array_width = ' + array_width);

    for (var j = 0; j < array_height; j++) {
	for(var i = 0; i < array_width; i++) {
	    irs_img_data[j * array_width + i] = irs_img_data_two_dim[i][j];	    
	}
	console.log('j = ' + j);
    }
    */

    // end of irs_img_data

    // alert(irs_img_data.length);
    // alert(irs_img_data[331].length);

    
    
    // var irs_img_data_buffer = new ArrayBuffer(irs_img_data_str_decoded);
    // var uint8_view = new Uint8Array(irs_img_data_buffer);
    
    // for (var i = 0; i < irs_img_data_str.length; i++) {
    //      var c = irs_img_data_str.charAt(i);
	// irs_img_data_array[i] = 
    // }
    // var irs_img_data = irs_img_data_str_array.map(function(data_char) {
    //     return uint8(data_char);
    // });
    
    // var irs_img_data = irs_img_data_str;

    // img_size
    var irs_img_size_str = irs_val_strs[irs_key_dict['irs_img_size']].split('=')[1];
    var irs_img_size_str_array = irs_img_size_str.split(', '); // the space cannot be omitted
    var irs_img_height = parseInt(irs_img_size_str_array[0].substr(1));
    var irs_img_width_str_len = irs_img_size_str_array[1].length;
    var irs_img_width = parseInt(irs_img_size_str_array[1].substr(0, irs_img_width_str_len-1));
    var irs_img_size = new Array(irs_img_width, irs_img_height);

    // debug

    // alert(irs_img_size_str);

    // img_channel_num
    var irs_img_channel_num_str = irs_val_strs[irs_key_dict['irs_img_channel_num']].split('=')[1];
    var irs_img_channel_num = parseInt(irs_img_channel_num_str);

    // err_info
    var irs_err_info = irs_val_strs[irs_key_dict['irs_err_info']]; // Success

    return new image_result_struct(irs_img_data, irs_img_size, irs_img_channel_num, irs_err_info);
};



// display the image data
function image_display() {

}

function point(x, y) {
    this.x = x;
    this.y = y;
}

// put image on canvas
// pos is the left top corner
image_display.prototype.put_image_data_on_canvas = function(irs, canvas_id, start_pos) {
    
    var inner_canvas = document.getElementById(canvas_id);

    if (inner_canvas == null) {
	// alert and do nothing
	alert("dest canvas is null.");
	return;
    }

    var ctx = inner_canvas.getContext('2d'); // this is needed to create the ImageData

    // decompose the irs to a real bitmap.
    var js_img_data = this.convert_to_js_ImageData(ctx, irs.img_data, irs.img_size, irs.img_channel_num);
    // debug
    // alert(js_img_data.length);

    // draw the canvas

    if(js_img_data != null){
	// ctx.putImageData(js_img_data, start_pos.x + irs.img_size[0] / 2, start_pos.y, 0, 0, irs.img_size[0] / 2, irs.img_size[1]);
	ctx.putImageData(js_img_data, start_pos.x, start_pos.y, 0, 0, irs.img_size[0], irs.img_size[1]);
    }
};



image_display.prototype.convert_to_js_ImageData = function(ctx, img_data, img_size, img_channel_num) {
    // TODO: make complete argument check with every argument
    if (img_data == null || img_size == null || img_channel_num == null)
	return null;

    // do the job
    
    var js_ImageData = ctx.createImageData(img_size[0], img_size[1]);
    if (img_channel_num == 1) {
	// gray scale image, single channel
	for (var i = 0; i < img_data.length; i++) {
	    js_ImageData.data[4 * i + 0] = img_data[i];
	    js_ImageData.data[4 * i + 1] = img_data[i];
	    js_ImageData.data[4 * i + 2] = img_data[i];
	    js_ImageData.data[4 * i + 3] = 255;
	}
	// return js_img_data;
    }
    else if (img_channel_num == 3) {
	// color image, must append the alpha value
	console.log('img_channel_num = ' + img_channel_num);

	var img_pixel_count = img_data.length; // every pixel is a 3-element array.
	// var i = 0;
	
	for (var i = 0; i < img_pixel_count; i++) {
	    // if (i < img_pixel_count ) {
		// var index = parseInt(i * 2 / 3);
		// console.log(index);
		// var index = i % 3;
		js_ImageData.data[4 * i + 0] = img_data[i][2]; // B//  * 256 / img_pixel_count;
		js_ImageData.data[4 * i + 1] = img_data[i][1]; // G
		js_ImageData.data[4 * i + 2] = img_data[i][0]; // R
		js_ImageData.data[4 * i + 3] = 255;
	    // } else {
	    /*
		js_ImageData.data[4 * i + 0] = 255;
		js_ImageData.data[4 * i + 1] = 255;
		js_ImageData.data[4 * i + 2] = 255;
		js_ImageData.data[4 * i + 3] = 255;
	    }
	    */
		
	}
	
	/*
	for (var i = 0; i < img_size[1]; i++) { // height
	    for (var j = 0; j < img_size[0]; j++) { // width		
		js_ImageData.data[4 * (i * img_size[0] + j) + 0] = img_data[i * img_size[0] + j][0];
		js_ImageData.data[4 * (i * img_size[0] + j) + 1] = img_data[i * img_size[0] + j][1];
		js_ImageData.data[4 * (i * img_size[0] + j) + 2] = img_data[i * img_size[0] + j][2];
		js_ImageData.data[4 * (i * img_size[0] + j) + 3] = 255;
	    }
	}
	*/
	// return js_img_data;
    }
    else {
	// rgba image, keep it as origin
	console.log('img_channel_num = ' + img_channel_num);
	var img_pixel_count = img_data.length; // every pixel is a 4-element array.
	for (var i = 0; i < img_pixel_count; i++) {
	    js_ImageData.data[4 * i + 0] = img_data[i][2]; // B
	    js_ImageData.data[4 * i + 1] = img_data[i][1]; // G
	    js_ImageData.data[4 * i + 2] = img_data[i][0]; // R
	    // js_ImageData.data[4 * i + 3] = img_data[i][3];
	    js_ImageData.data[4 * i + 3] = 255;
	}
	// js_img_data = img_data;
    }


    // image_data.data = js_img_data;
    // image_data.width = img_size[0]; // width
    // image_data.height = img_size[1]; // height
    return js_ImageData;
};


			
