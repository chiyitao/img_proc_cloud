/* codes implementing functions */

$('#open_image').on('click', function(){    
    if($('#src_canvas').length > 0) {
	return;
    }
    
    var imgURL = 'http://img.blog.csdn.net/20160713111856694?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center'; // 'http://fj.ikafan.com/attachment/forum/201510/16/150108pf2fgjw7i33bq22w.jpg.thumb.jpg';
    // var imgURL = 'file:///F:/relaxation/pictures/girl.jpg';
    // var imgURL = 'http://www.jxteacher.com/userfiles/hpqing/images/0117%281%29.JPG';
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
    
});

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
    var irs_img_width = parseInt(irs_img_size_str_array[0].substr(1));
    var irs_img_height_str_len = irs_img_size_str_array[1].length;
    var irs_img_height = parseInt(irs_img_size_str_array[1].substr(0, irs_img_height_str_len-1));
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
	var img_pixel_count = img_data.length / 3;
	for (var i = 0; i < img_pixel_count; i++) {
	    js_ImageData.data[4 * i + 0] = img_data[3 * i + 0];
	    js_ImageData.data[4 * i + 1] = img_data[3 * i + 1];
	    js_ImageData.data[4 * i + 2] = img_data[3 * i + 2];
	    js_ImageData.data[4 * i + 3] = 255;
	}
	// return js_img_data;
    }
    else {
	// rgba image, keep it as origin
	var img_pixel_count = img_data.length / 4;
	for (var i = 0; i < img_pixel_count; i++) {
	    js_ImageData.data[4 * i + 0] = img_data[4 * i + 0];
	    js_ImageData.data[4 * i + 1] = img_data[4 * i + 1];
	    js_ImageData.data[4 * i + 2] = img_data[4 * i + 2];
	    js_ImageData.data[4 * i + 3] = img_data[4 * i + 3];
	}
	// js_img_data = img_data;
    }


    // image_data.data = js_img_data;
    // image_data.width = img_size[0]; // width
    // image_data.height = img_size[1]; // height
    return js_ImageData;
};
