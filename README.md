# CriSys-UI
## CriSys UI Development Environment Setup



Angular is a front-end framework which is used to create web applications. It uses typescript by default for creating logics and methods for a class but the browser doesn’t know typescript. Here webpack comes in picture, webpack is used to compile these typescript files to JavaScript. In addition, there are so many configuration files you will need to run an angular project on your computer.
Angular CLI is a tool that does all these things for you in some simple commands. Angular CLI uses webpack behind to do all this process.

## Get started
###### Note: 
Please make sure you have installed node and npm in your system. You can check your node version and npm version by using the following command


```sh
$ node --version
$ npm --version
```
#### Clone the repo


```sh
#HTTPS
$ git clone https://NEE-devops@dev.azure.com/NEE-devops/Timeline/_git/Crisys-UI
#or SSH
$ git clone git@ssh.dev.azure.com:v3/NEE-devops/Timeline/Crisys-UI
```
#### Follow the following steps to run the project

```sh
$ cd ~(Crisys-UI)
#install the npm packages described in the package.json and verify that it works:
$ npm install
$ ng serve
```

After successful installation of npm packages the project should start running by ng serve command on ```PORT 4200```. Go to the browser and hit ```www.localhost:4200```. 

#### env variables in the environment.ts

```sh
production: false,
pathToAPI: 'http://localhost:5001',
apiUrl: 'http://localhost:4200',
```
#### log in details

```sh
user name :  admin
password : admin
```