# D Plat Frontend

[![Build Status](https://travis-ci.org/Shirataki2/DPlat.svg?branch=master)](https://travis-ci.org/Shirataki2/DPlat)

https://deep2020.1e9plus7.com

Nuxt + Typescript + Firebase(Auth+Firestore+Functions) + Google App Engine

## Build Setup

### Firebase Setup

move `config/firebase.config.dev.js` to `config/firebase.config.js`
and execute `firebase init`.

Select Firestore, Functions, Storage, and Database.

Write your Firebase config ids

### Javascript Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

### Python Backend Setup

``` bash
$ cd server

$ python -m venv env

$ source ./env/bin/activate # (On Mac, Linux)

$ pip install flask flask_cors numpy

$ python main.py
```

Access to localhost:4000
