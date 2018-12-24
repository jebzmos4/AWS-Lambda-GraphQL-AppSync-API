<<<<<<< HEAD
# IDENTITY MODULE LAMBDA FUNCTION #

A serverless lambda equivalent of the [Identity Mapping Engine](https://bitbucket.org/terragonengineering/identity-mapping-engine)

### About ###

* This project accepts msisdn, deviceId, cookieId as the main params and account, bvn and email as secondary params then returns a unique tap id that can be used to reference the particular user.
* Version - 1.0.0

### Installation ###
Clone this repository and create a .env file in the root folder. Using the contents of the sample.env file as a guide, specify your elasticsearch configurations in the .env file.
Install the dependencies using: 

`npm install`

Initialize the elasticsearch indices with the proper mappings with:

`node config/setup`

Then deploy through serverless using:

`serverless deploy`

### Usage ###

Local Endpoints: 

`http://localhost:3000/record`

method: GET

details: Returns a list of all users saved

`http://localhost:3000/record`

method: POST

details: Saves a user if not yet saved and returns the saved user if the user already exists in the database


### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* [Tolu Fakiyesi: tfakiyesi@terragonltd.com](mailto:tfakiyesi@terragonltd.com)
* [Morifeoluwa Jebutu: mjebutu@terragonltd.com](mailto:mjebutu@terragonltd.com)
* [tech@terragonltd.com](mailto:tech@terragonltd.com)
=======
# AWS-Lambda-GraphQL-AppSync-API
This is repository to demonstrate how to use AWS Lambda with GraphQL and AppSync
>>>>>>> b2cf06ed85799c05d4f3720c44b5076c44611f7e
