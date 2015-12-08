# gulp-favicons [![Build Status](https://travis-ci.org/haydenbleasel/gulp-favicons.svg?branch=master)](https://travis-ci.org/haydenbleasel/gulp-favicons)

Favicons generator for Gulp. Simple wrapper around [favicons](https://github.com/haydenbleasel/favicons). Installed through NPM with:

```shell
npm install gulp-favicons --save-dev
```

Check out [favicons.io](http://favicons.io/) for all configuration options. Example usage:

```js
var favicons = require("gulp-favicons");

gulp.task("default", function () {
    gulp.src("logo.png").pipe(favicons({
        appName: "My App",
        appDescription: "This is my application",
        developerName: "Hayden Bleasel",
        developerURL: "http://haydenbleasel.com/",
        background: "#020307",
        path: "favicons/",
        url: "http://haydenbleasel.com/",
        display: "standalone",
        orientation: "portrait",
        version: 1.0,
        logging: false,
        online: false,
        html: "index.html"
    })).pipe(gulp.dest("./"));
});
```
