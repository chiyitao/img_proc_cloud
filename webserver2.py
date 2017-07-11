import socket
import StringIO
import sys
import os
import array
import re

from imageprocess import ImageProcessModule, IMAGE_PROCESS_URLS

BASE_DIR = os.getcwd()
FRONT_DIR = '/ui'

class WSGIServer(object):
    address_family = socket.AF_INET
    socket_type = socket.SOCK_STREAM
    request_queue_size = 5

    def __init__(self, server_address):
        # Create a listeing socket
        self.listen_socket = listen_socket = socket.socket(
            self.address_family,
            self.socket_type
            )
        # Allow to reuse the same address
        listen_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        # Bind
        listen_socket.bind(server_address)
        # Activate
        listen_socket.listen(self.request_queue_size)
        # Get server host name and port
        host, port = self.listen_socket.getsockname()[:2]
        self.server_name = socket.getfqdn(host)
        self.server_port = port
        # Return headers set by Web framework/Web application
        self.headers = []

        self.application = ImageProcessModule()

    
    def set_app(self, application):
        self.application = application

    def serve_forever(self):
        listen_socket = self.listen_socket
        while True:
            # New client connection
            self.client_connection, client_address = listen_socket.accept()
            # Handle one request and close the client connection. Then
            # loop over to wait for another client connection
            self.handle_one_request()

    def handle_one_request(self):
        # request_buffer = array.array('c')
        request_data = ''
        request_len = 0
        while True:
            cur_pack = self.client_connection.recv(1024)
            # print cur_pack
            request_data += cur_pack
            request_len += len(cur_pack)
            # print 'now cur_pack is %d' % request_len
            # print 'cur_pack is: '
            # print cur_pack
            
            if request_len < 1024:
                break
            else:
                if cur_pack.endswith('\r\n\r\n\r\n\r\n'): # self defined
                    break


        
        self.request_data = request_data
                
        # self.request_data = request_data = self.client_connection.recv(1024 * 1024 * 3)

        # print client request
        # print(''.join(
        #     '< {line}\n'.format(line=line)
        #    for line in request_data.splitlines()
        #    ))

        self.parse_request(request_data)

        # Construct environment dictionary using request data
        env = self.get_environ()

        # It's time to call our application callable and get
        # back a result that will become HTTP response body
        # result = self.application(env, self.start_response)
        status, result = self.handle_request(env)

        # Construct a response and send it to the client
        self.finish_response(status, result)

    # This method is not used
    def parse_request(self, text):
        # request_line = text.splitlines()[0]
        request_line = text.split('\r\n')
        # request_line = text.split()
        # print 'text is :'        
        # print text
        
        # req_line_len = len(request_line)
        # print req_line_len
        

        # request_line is empty
        if len(request_line) == 0:
            print 'request error'
            return -1

        # request_line has data
        req_pattern = re.compile(r'[a-zA-Z]+\s\S+\sHTTP.+')
        req_match = req_pattern.match(request_line[0])
        if req_match:        
            # Break down the request line into components
            (self.request_method, # GET
             self.path, # /hello
             self.request_version # HTTP/1.1
            ) = request_line[0].split()

    def get_environ(self):
        env = {}
        # The following code snippet does not follow PEP8 conventions
        # but it's formatted the way it is for demonstration purposes
        # to emphasize the required variables and their values
        #
        # Required WSGI variables
        env['wsgi.version'] = (1, 0)
        env['wsgi.url_scheme'] = 'http'
        env['wsgi.input'] = self.request_data
        env['wsgi.errors'] = sys.stderr
        env['wsgi.multithreaded'] = False
        env['wsgi.multiprocess'] = False
        env['wsgi.run_once'] = False
        # Required CGI variables
        env['REQUEST_METHOD'] = self.request_method # GET
        env['PATH_INFO'] = self.path # /hello
        env['SERVER_NAME'] = self.server_name # localhost
        env['SERVER_PORT'] = str(self.server_port) # 8888

        return env

    # this method is not used.
    def start_response(self, status, response_headers, exec_info=None):
        # Add necessary server headers
        server_headers = [
            ('Data', 'Tue, 31, Mar 2015 12:54:48 GMT'),
            ('Server', 'WSGIServer 0.2'),
            ]
        self.headers_set = [status, response_headers + server_headers]
        # To adhere to WSGI specification the start_response must return
        # a 'write' callable. We simplicity'sake we'll ignore that detail
        # for now.
        # return self.finish_response

    def finish_response(self, status, result):
        try:
            # status, response_headers = self.headers_set
            # 
            # for header in response_headers:
            #     response += '{0}: {1}\r\n'.format(*header)
            # response = 'HTTP/1.1 200 OK\r\n'
            response = 'HTTP/1.1 {status}\r\n'.format(status=status)
            # add server headers
            server_headers = [
            ('Data', 'Tue, 31, Mar 2015 12:54:48 GMT'),
            ('Server', 'WSGIServer 0.2'),
            ]

            for header in server_headers:
                response += '{key}: {value}\r\n'.format(key=header[0], value=header[1])

            response += '\r\n'

            for data in result:
                response += '{data}\r\n'.format(data=data)
                
            # print response
                
            # Print formatted reponse data a la 'curl -v'            
            # print(''.join(
            #    '> {line}\n'.format(line=line)
            #    for line in response.splitlines()
            #    ))
            
            self.client_connection.sendall(response)
        finally:
            self.client_connection.close()

    def handle_request(self, env):
        # base_dir must be get outside this function        
        
        request_path = env['PATH_INFO']

        

        if request_path not in IMAGE_PROCESS_URLS.values():
            # display the static page
            filename = BASE_DIR + FRONT_DIR + request_path
            if os.path.exists(filename):
                temp_file = open(BASE_DIR + FRONT_DIR + request_path)
                lines = temp_file.readlines()
                return 200, lines            
            else:
                print '{request_path} cannot be acquired.'.format(request_path=request_path)
                return 404, ['NOT_FOUND', ]
        else:
            # do the process job
            client_request_data = env['wsgi.input']
            # debug print
            request_lines = client_request_data.split('\r\n')
            # debug start

            # request_debug_file = open('request_file.txt', 'w')
            # request_debug_file.writelines(request_lines)
            # request_debug_file.close()

            
            # for line in request_lines:
            #      print line

            # print t
            # debug end
            
            (status, result_image) = self.application.handle(request_path, request_lines)            
            return (status, result_image)
            

        

SERVER_ADDRESS = (HOST, PORT) = '', 8888

def make_server(server_address, application=None):
    server = WSGIServer(server_address)
    # server.set_app(application)
    return server

#if __name__ == '__main__':
#    if len(sys.argv) < 2:
#        sys.exit('Provide a WSGI application object as module:callable')
#    app_path = sys.argv[1]
#    module, application = app_path.split(':')
#    module = __import__(module)
#    application = getattr(module, application)
#    httpd = make_server(SERVER_ADDRESS, application)
#    print('WSGIServer: Serving HTTP on port {port} ...\n'.format(port=PORT))
#    httpd.serve_forever()
        
if __name__ == '__main__':
    httpd = make_server(SERVER_ADDRESS)
    print('WSGIServer: Serving HTTP on port {port} ...\n'.format(port=PORT))
    httpd.serve_forever()
