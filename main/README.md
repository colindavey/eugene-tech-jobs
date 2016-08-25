# Building & Testing
## Prerequisites
- Vagrant
- VirtualBox

After cloning the repository, run the `build_project.sh` script. This script will use the latest version of OxForMongo and the current code in the `/main-web-app` directory to construct a project build under a new `/project-build` directory. `cd` to `/project-build/main-web-app/Vagrant` and use the command `vagrant up` to create a virtual machine to run your server environment.

On successful setup, you may visit most paths using either `http://localhost:8080` or `https://localhost:8443` (http vs. https matters). Database entries may be viewed through RockMongo at `http://localhost:8080/rock` (it **must** be http only).

###### Notes
- The site root will provide an index page, displaying data for Eugene, OR using a front-end based on the pilot version and utilizing the API.
- /rock requires authentication. Default username and password are both "admin".
- Any API calls requiring authentication have the default username and password both "admin".
- Obviously the above username/password combinations should be changed for live servers.

# API Calls
##/jobs
Desc: Retrieves jobs data for displaying on webpage.

Method: GET

Auth: None.

Accepts:
- locations - A zero-indexed array of locations from which to retrieve jobs data. Each entry must be indexed and requires at least a state and optionally a city.
- minopenings - A minimum number of job openings which filters jobs data with openings below the minimum.

Returns: A JSON object containing...
- name - The name of the company.
- link - A link to the company's careers page.
- state - The state the company is located in.
- city - The city the company is located in.
- openjobcount - The number of open positions at the company.

Behavior:
- If no valid parameters are sent to the server, then the server will send back all jobs data by default.
- If any invalid data is passed to the server, this data will simply be ignored.
- Invalid location data will be ignored and any subsequent locations will still be processed as long as there are no gaps between the indices of the entries.

Example which will receive data from only the cities Eugene and Portland in Oregon, and all of the data from California with no minimum openings restriction...
 
###### Via ajax:
```
$.ajax({
    url: 'https://localhost:8443/jobs/',
    type: 'GET',
    data: {
        locations: {
            0:{
                state: "oregon",
                city: "eugene"
            },
            1:{
                state: "oregon",
                city: "portland"
            },
            2:{
                state: "california"
            }
        }
    }
});
```
 
###### Via query string:
```
https://localhost:8443/jobs?locations[0][state]=oregon&locations[0][city]=eugene&locations[1][state]=oregon&locations[1][city]=portland&locations[2][state]=california
```
 
## /jobs/edit
Desc: Accesses the editing UI.

Method: GET

Auth: admin.

Accepts: Nothing.

Behavior:
- Sends back the editing UI which will take care of any further API calls.
 
## /jobs/getVerboseJobList
Desc: Almost completely identical to /jobs, but includes additional data fields filtered out of /jobs results and maintains the same formatting of data as it exists in the database.

Method: GET

Auth: admin.

Accepts:
- locations - A zero-indexed array of locations from which to retrieve jobs data. Each entry must be indexed and requires at least a state and optionally a city.
- minopenings - A minimum number of job openings which filters jobs data with openings below the minimum.

Returns: A JSON object containing...
- _id - The id of the company's document in the database, used for updating or deleting the entry.
- name - The name of the company.
- link - A link to the company's careers page.
- state - The state the company is located in.
- city - The city the company is located in.
- openjobcount - The number of open positions at the company.

Behavior:
- If no valid parameters are sent to the server, then the server will send back all jobs data by default.
- If any invalid data is passed to the server, this data will simply be ignored.
- Invalid location data will be ignored and any subsequent locations will still be processed as long as there are no gaps between the indices of the entries.

Example which will receive data from only the cities Eugene and Portland in Oregon, and all of the data from California with no minimum openings restriction...
 
###### Via ajax:
```
$.ajax({
    url: 'https://localhost:8443/jobs/getVerboseJobList',
    type: 'GET',
    data: {
        locations: {
            0:{
                state: "oregon",
                city: "eugene"
            },
            1:{
                state: "oregon",
                city: "portland"
            },
            2:{
                state: "california"
            }
        }
    }
});
```
 
###### Via query string:
```
https://localhost:8443/jobs/getVerboseJobList?locations[0][state]=oregon&locations[0][city]=eugene&locations[1][state]=oregon&locations[1][city]=portland&locations[2][state]=california
```
 
## /jobs/addCompany
Desc: Takes a set of company data and generates a new document in the database.

Method: POST

Auth: admin.

Accepts:

`  [Required]`
- name - The name of the company.
- state - The state the company is located in.
- city - The city the company is located in.

`  [Optional]`
- link - A link to the company's careers page.
- openjobcount - The number of open positions at the company.

Returns: A JSON object containing...
- res - A message with value "OK" indicating success, or "NO" indicating failure.
- _id.$id - The id of the newly generated document if the API call succeeded.

Behavior:
- Will fail only if name, state, or city fields are empty.
- No location validation occurs.
- No mapping occurs between full state names and abbreviations.
- State and city names are lower-case converted when received, allowing for case-insensitive input.
 
###### Example ajax:
```
$.ajax({
    url: 'https://localhost:8443/jobs/addCompany',
    type: 'POST',
    data: {
        name: "Example Company",
        link: "http://www.examplecompany.com/careers/",
        state: "oregon",
        city: "eugene",
        openjobcount: "3"
    }
});
```
 
## /jobs/updateCompany
Desc: Takes a set of company data and updates its document in the database.

Method: POST

Auth: admin.

Accepts:

`  [Required]`
- name - The name of the company.
- state - The state the company is located in.
- city - The city the company is located in.

`  [Optional]`
- link - A link to the company's careers page.
- openjobcount - The number of open positions at the company.

Returns: A JSON object containing...
- res - A message with value "OK" indicating success, or "NO" indicating failure.

Behavior:
- Will fail only if name, state, or city fields are empty.
 
###### Example ajax:
```
$.ajax({
    url: 'https://localhost:8443/jobs/updateCompany',
    type: 'POST',
    data: {
        name: "Example Company",
        link: "http://www.examplecompany.com/careers/",
        state: "oregon",
        city: "eugene",
        openjobcount: "2"
    }
});
```
 
## /jobs/removeCompany
Desc: Takes a set of company data and updates its document in the database.

Method: POST

Auth: admin.

Accepts:

`  [Required]`
- _id - The id of the company's document in the database.

Returns: A JSON object containing...
- res - A message with value "OK" indicating success, or "NO" indicating failure.

Behavior:
- Will fail only if _id not sent or is invalid.
 
###### Example ajax:
```
$.ajax({
    url: 'https://localhost:8443/jobs/removeCompany',
    type: 'POST',
    data: {
        _id: "57a168dcfa46349d030001a0"
    }
});
```

## /jobs/populateDatabase
Desc: Populates the database with an initial set of data.

Method: GET

Auth: admin.

Accepts: Nothing.

Returns: A JSON object containing...
- res - A message with value "OK" indicating success, or "NO" indicating failure.

Behavior:
- Uses a statically defined spreadsheet URL to populate the database with a base set of data.
- All data in the database is naively assumed to be located in Eugene, OR.