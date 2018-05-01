This program allows users to create, request and delete items from a local MongoDB database. 

To create, send a request object with the required parameters.
To request, use the object's unique ID. 

If both the required parameters of the object are not present, the server will return a 400 error. If there is some other, unknown problem, the system will return a 500 error.

Otherwise, if the requests are successsful, 200 will be returned.