# 4Minitz update check

A small rest service that returns the current stable 4minitz version.

It...
 * queries the current stable master version from github via github.repos.getTags().
 * offers a simple rest route that will deliver this version to clients


## Installation

Install dependencies with `npm` or `yarn`

    $ yarn install

and start the service with

    $ yarn start

to connect to the end2end mongodb server or set the `MONGO_URL` env variable to point to another installation

    $ MONGO_URL=mongodb://user:password@server:port/database yarn start

### Version hints
The version-checker searches for a file called `versionmessage.json` to get extra info for a version, like config changes, cool new features or even security warnings.

## Usage
You may manually check the service like so:

    $ curl localhost:8080/updatecheck/${MYCLIENTUID}/${MYVERSION}
    $ curl localhost:8080/updatecheck/MyClientsUniqueID/v0.10.0

This should return the current officially released master version like so:
 
    {"tag":"1.0.2",
     "message": {"1.0.x":"Our initial release","1.0.2":"Important bugfix. Please upgrade!"}
    }


## License

This software is licensed under the terms of the MIT License.
