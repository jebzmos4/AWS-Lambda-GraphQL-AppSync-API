# IDENTITY MODULE LAMBDA FUNCTION #

A serverless lambda equivalent of the [identity module](https://bitbucket.org/terragonengineering/identity-mapping-engine)

### About ###

* This project accepts msisdn, deviceId, or cookieId and returns a unique id that can be used to reference the particular user.
* Version - 1.0.0

### Installation ###
Clone this repository and create a .env file in the root folder. Using the contents of the sample.env file as a guide, specify your elasticsearch configurations in the .env file.
Install the dependencies using: 

`npm install`

Initialize the elasticsearch indices with the proper mappings with:

`node init_db`

Then deploy through serverless using:

`serverless deploy`

### Usage ###

Endpoints: 

`http://localhost:3000/user`

method: GET

details: Returns a list of all users saved

`http://localhost:3000/user`

method: POST

details: Saves a user if not yet saved and returns the saved user if the user already exists in the database


### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* [Tolu Fakiyesi: tfakiyesi@terragonltd.com](mailto:tfakiyesi@terragonltd.com)
* [tech@terragonltd.com](mailto:tech@terragonltd.com)