# CriSys-UI
## CriSys UI Development Environment Setup



Angular is a front-end framework which is used to create web applications. It uses typescript by default for creating logics and methods for a class but the browser doesn’t know typescript. Here webpack comes in picture, webpack is used to compile these typescript files to JavaScript. In addition, there are so many configuration files you will need to run an angular project on your computer.
Angular CLI is a tool that does all these things for you in some simple commands. Angular CLI uses webpack behind to do all this process.

###### Note: 
Please make sure you have installed node and npm in your system. You can check your node version and npm version by using the following command


```sh
$ node --version
$ npm --version
```

#### Follow the follwing steps to run the project

```sh
$ cd ~(project_folder)
$ npm install
$ ng serve
```

After successful installation of npm packages the project should start running by ng serve command on ```PORT 4200```. Go to the browser and hit ```www.localhost:4200```. 