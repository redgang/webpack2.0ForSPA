# webpack2.0 for single page project

## Installation

This this a simple single page project by webpack2.0. 
Help you quickly start to learn webpack2.0.


## How to use
```
$ git clone https://github.com/redgang/webpack2.0ForSPA.git
$ cd webpack2.0ForSPA`
$ npm install
```

* online mode:
`$ npm run build`
* dev mode:
`$ npm run dev`
* dev with HRM mode:
`$ npm run dev-hrm` 

If you use 'dev with HRM mode' ,you should start the node server first(use node server to mock backend server).
```
$ cd mockServer
$ node server.js
```

> What can this project do with webpack

- Extract css

- Loading styles、images...

- Generate html (html contain build bundles that include a hash in the filename which changes every compilation)

- Generate common chunk

- Splitting bundles

- Setting environment variables

- Compress the build

- Add hashes to build bundles

- Auto Refresh Browser

- Hot Module Replacement(HRM)

- Developing with backend server(like java、nodejs、php)

- Distinguish dev and build

- Merge config

- Clean publishing directory 

- show webpack-dashboard in `npm run dev-hrm` start

## Useful links

- [webpack official site](https://webpack.github.io/docs/)
- [webpack official example](https://github.com/webpack/webpack/tree/master/examples)
- [webpack1.0 webpackForSPA](https://huangshuwei.github.io/2016/07/12/webpack%20%E5%8D%95%E9%A1%B5%E9%9D%A2%E5%BA%94%E7%94%A8%E5%AE%9E%E6%88%98/)