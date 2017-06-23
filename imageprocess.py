# from PIL import *

import numpy
import cv2

import string
import array

IMAGE_PROCESS_URLS = {'1':'/general_process', '2':'/special_process', }

IMAGE_PROCESS_GENERAL_OP = {'1':'gray_scale', '2': 'sharpen', '3': 'blur', }

class image_process_struct:
    img_proc_op = ''    
    img_data = []
    img_size = ()
    img_channel_num = 0
    img_proc_args = {}

    def __init__(self, img_proc_op, img_data, img_size, img_channel_num, img_proc_args):
        pass

class image_result_struct:
    img_data = []
    img_size = ()
    img_channel_num = 0
    error_info = ''
    def __init__(self, img_data, img_size, img_channel_num, error_info):
        self.img_data = img_data
        self.img_size = img_size
        self.img_channel_num = img_channel_num
        self.error_info = error_info    

class ImageProcessModule():
    def __init__(self):
        pass

    def _req_data_2_img_proc_struct(self, req_data):
        img_proc_op_line = ''
        img_data_line = array.array('c')
        img_size_line = ''
        img_channel_num_line = ''
        img_proc_args_line = ''

        for line in req_data:
            if line.startwith('IMG_PROC_OP'):
                img_proc_op_line = line
            elif line.startwith('IMG_DATA'):
                img_data_line = line
            elif line.startwith('IMG_SIZE'):
                img_size_line = line
            elif line.startwith('IMG_CHANNEL'):
                img_channel_num_line = line
            elif line.startwith('IMG_PROC_ARGS'):
                img_proc_args_line = line

        # process the corresoponding data

        # img_proc_op
        img_proc_op = img_proc_op_line.split('=')[1]

        # img_data
        
        # convert to raw rgb data
        # version 0.1
        # split image data according to comma char
        img_data_value_str = img_data_line.split('=')[1]
        img_data_array_str = numpy.array(img_data.split(','))
        # print 'length of img_data_str is %d' % len(img_data_str)
        img_data = img_data_values.astype(numpy.uint8)

        # img_size        
        img_size_tuple_str = img_size_line.split('=')[1]
        img_size_str = img_size_tuple_str[1:-1].split(',')
        img_width = int(img_size_str[0])
        img_height = int(img_size_info[1])
        img_size = (img_width, img_height)

        # img_channel_num
        img_channel_num_str = img_channel_num_line.split('=')[1]
        img_channel_num = int(img_channel_num_str)
        
        # img_proc_args
        img_proc_args_dict_str = img_proc_args_line.split('=')[1]
        img_proc_args = ''
        if img_proc_args_dict_str != '':
            img_proc_args = img_proc_args_dict_str
            
        return image_process_struct(
            img_data, img_size, img_channel_num, img_proc_args            
            )

    def _process_image(self, proc_op, src_img, proc_args):
        # don't check. Arguments were already checked in _image_operation

        


    def _get_image(self, img_data, img_size):
        img_width = img_size[0]
        img_height = img_size[1]
        img_data_len = img_data.size

        src_img = numpy.array()
        if img_width * img_height == img_data_len:
            # grayscale image
            src_img = img_data.reshape(img_width, img_height)
        elif img_width * img_height * 3 == img_data_len:
            # RGB image
            src_img = img_data.reshape(img_width, img_height, 3)
        elif img_width * img_height * 4 == img_data_len:
            # RGBA image
            src_img = img_data.reshape(img_width, img_height, 4)            
        else:
            print 'acquired img_data error!'
            src_img = []
        return src_img        
        
    def _convert_to_image(self, data_line, size_line):
        # convert to image that can be processed by opencv
        # TODO: using multiprocessing

        
        # debug_data_file = open('img_data_file.txt', 'w')
        # debug_data_file.write(data_line)
        # debug_data_file.close()
        
        # debug_size_file = open('img_size_file.txt', 'w')
        # debug_size_file.write(size_line)
        # debug_size_file.close()

        # print data_line
        # print '\n'
        # print size_line
        # seperate the data and the size

        # print 'len(data_line): %s' % len(data_line)
        # print size_line
        
        img_data_key_str, img_data_value_str = data_line.split('=')
        img_size_key_str, img_size_value_str = size_line.split('=')
            
        # convert to raw rgb data
        # version 0.1
        # split image data according to comma char
        img_data_str = numpy.array(img_data_value_str.split(','))
        print 'length of img_data_str is %d' % len(img_data_str)
        img_data = img_data_str.astype(numpy.uint8)
        #for i in range(40001):
        #    print '%u' % img_data[i]
        


        # debug
        # print img_data

        img_data_len = img_data.size

        print 'img_data_len: %d' % img_data_len

        # print str(img_width) + '\n'
        # print str(img_height) + '\n'
        # print str(img_width * img_height * 4) + '\n'
        
        dst_img = []
        if img_width * img_height == img_data_len:
            # grayscale image
            img_data = img_data.reshape(img_width, img_height)
        elif img_width * img_height * 3 == img_data_len:
            # RGB image
            img_data = img_data.reshape(img_width, img_height, 3)
        elif img_width * img_height * 4 == img_data_len:
            # RGBA image
            img_data = img_data.reshape(img_width, img_height, 4)            
        else:
            print 'acquired img_data error!'
            img_data = []
        return img_data
    
    def handle(self, req_path, req_data):
        if req_path == IMAGE_PROCESS_URLS['1']:
            # general_process
            # print 'general_process!'
            # req_data, must be in an ImageProcessStruct Structure
            # rstrip_post_data = 
            # split_post_data = req_data.readlines(); # rstrip_post_data.splitlines('\r\n')

            # print 'post_data is:\n'
            # test split_post_data

            # for line in req_data:
            #     print line

            # debug
            temp_image_file = open('temp_image.txt', 'w')
            temp_image_file.writelines(req_data)
            temp_image_file.close()
            
            #for line in req_data:
            #     temp_image_file.write(line)

            src_img_proc_struct = self._req_data_2_img_proc_struct(req_data)
            
            
            

            img_data_pair = array.array('c')
            img_size_pair = ''
            for line in req_data:
                if line.find('IMG_DATA') == 0:
                    img_data_pair = line
                if line.find('IMG_SIZE') == 0:
                    img_size_pair = line

            # image_process_struct
            
            
            # src_img is an array of numpy
            src_img = self._convert_to_image(img_data_pair, img_size_pair)
            if src_img == []:
                return 200, ['Image data error', ]

            # do the job
            gray_scale_img = cv2.cvtColor(src_img, cv2.COLOR_BGR2GRAY)
            

            ips = image_process_struct()
            ips.img_data = gray_scale_image.data
            ips.img_size = gray_scale_image.shape[:2]
            ips.img_channel_num = grayscale_image[2]
            return 200, [gray_scale_img.data, ]
        elif req_path == IMAGE_PROCESS_URLS['2']:
            return 404, ['Not implemented!', ]
        else:
            return 404, ['The page requested is not found.', ]


    def _image_operation(ips):
        # ips is defined as image process struct

        # irs is defined as image result struct
        irs = image_result_struct([], (), 0, '')
        if ips.img_proc_op not in IMAGE_PROCESS_GENERAL_OP.values():
            irs.err_ips = 'operation is not defined.'            
            return irs
        if ips.

        # get the image from ips
        src_img = self._get_image(ips.img_data, ips.img_size)
        # process the image
        irs = self._process_image(ips.img_proc_op, src_img, ips.img_proc_args)
        return irs
