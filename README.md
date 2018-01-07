An advanced Gulp workflow for development Wordpress themes and plugins.

## Why WP Gulp Starter is awesome?

* Live reloads browser with BrowserSync
* SASS to CSS conversion, error handles, postcss integrated, auto-prefixing, auto CSS formatting, build source maps, convert LTR to RTL, css minification, merge media queires and correct the line endings of CSS files.
* Babel compiler, concatenates, linting & uglifies specific files and corrects the line endings of JavaScript files.
* Minify all different image types such as PNG, JPEG, SVG etc.
* Inject CSS instead of browser page reload.
* Check PHP code for missing or incorrect text-domain.
* Generate pot file for WP plugins and themes.
* Every task in Gulp file is explained what it does.
* Configuration of gulpfile.js is separated in individual file called `gulpconfig.js`.
* Allow to add more than one destination to the same task.

## Getting Started?

* Put `gulpfile.js`, `gulpconfig.js`, `package.json`, `.babelrc` and  `.stylelintrc.json` to your project root or of you have cURL installed in your machine you can run the following command to download all required files to your project just make sure you are in root folder of your WordPresss theme or plugin.

```
    curl -O https://raw.githubusercontent.com/Customattic/WP-Gulp-Starter/master/gulpfile.js && curl -O https://raw.githubusercontent.com/Customattic/WP-Gulp-Starter/master/gulpconfig.js && curl -O https://raw.githubusercontent.com/Customattic/WP-Gulp-Starter/master/.stylelintrc.json && curl -O https://raw.githubusercontent.com/Customattic/WP-Gulp-Starter/master/package.json && curl -O https://raw.githubusercontent.com/Customattic/WP-Gulp-Starter/master/.babelrc
```

* Now you need to install NodeJS, NPM installed and Gulp globally if they were not installed.
* After install NodeJS, NPM and Gulp need to install all Node depenedecy just run the following command and wait it until finish uploading and installing.

```
    npm install
```

* Configuration this starter is much easier than you thing, it is seprated in indiviual file that called `gulpconfig.js` there you can configue each gulp plugin and add more bundles.
* Now you're ready to run gulp tasks, all tasks are explained in gulp file.

```
    gulp styles
    gulp js
    gulp image
    gulp translate
    gulp compress
```

## License

WP Gulp Starter is released under the MIT license. Have at it.

-------

Made by Ahmed Bouhuolia
