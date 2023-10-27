## Items Application Web Interface

This is a web interface written Node JS that provides user friendly interface to manage `Item`s and their ratings.

### How to run the web service

1. Setup `Item`s backend service.
2. Setup `Item`s `Rating`s backend service.
3. Configure web interface by setting the following environment variables:

| Environment variable name       | Example value | Description |
|---------------------------------|---------------|-------------|
| `HOSTNAME`                      | `0.0.0.0`       | Host on which web inteface is listening |
| `PORT`                          | `8080`          | Port on which web inteface is listening |
| `ITEMS_SERVICE_HOSTNAME`        | `items`         | Host where `Item`s service is running |
| `ITEMS_SERVICE_PORT`            | `1234`          | Port on which `Item`s service is running |
| `ITEMS_RATING_SERVICE_HOSTNAME` | `items-ratings` | Host where `Item`s Ratings service is running |
| `ITEMS_RATING_SERVICE_PORT`     | `5678`          | Port on which `Item`s Ratings service is running |
| `USE_BACKEND_PROXY`             | `true`          | Defines whether all API requests to underlying services should be router through web interface backend |

4. Run web interface by executing `node start.js`

### How to run the microservice in debug mode

1. Run the microservice with debug options:
```sh
node --inspect=0.0.0.0:9229 start.js
```
or
```sh
node --inspect-brk=0.0.0.0:9229 start.js
```

2. Connect with your debugger.

#### Debugger configuration for VSCode

```json
{   
    "version": "0.2.0",
    "configurations": [
         {
            "name": "Node: Attach",
            "type": "node",
            "request": "attach",
            "address": "localhost",
            "port": 9229,            
            "localRoot": "${workspaceFolder}",
            "remoteRoot": "/path/in/container",
            "skipFiles": [
                "<node_internals>/**"
            ],
        }
    ]
}
```

### License

GNU GPL v2 or any later version.
