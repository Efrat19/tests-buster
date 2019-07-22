<img src="tests-buster.png" alt="tests-buster" width="200"/>

# tests-buster

#### clear broken tests from your test files at no time

[![Known Vulnerabilities](https://snyk.io/test/github/efrat19/tests-buster/badge.svg)] https://img.shields.io/jsdelivr/npm/hd/tests-buter.svg

the tests-buster will crawl in your test files, wisely analyze your tests and cut out every broken one. now your code is ready to take down the pipeline. :checkered_flag:

## Global installation:
recomended, since its a cli tool:

```
npm i -g tests-buster
```

## Run:

In your root project directory, run:

 ```
 tests-buster bust --dry-run
 ```

 to see how the tests-buster can help you. When you are ready, run 

 ```
 tests-buster bust
 ```

 See the options below for customized configuration.

## Try an Example

`git clone https://github.com/efrat19/tests-buster.git && cd tests-buster/example && npm i`

run `npm run test`. some tests will fail. now run `tests-buster bust` to clean the file, and again `npm run test`
 to observe the change. 

## Cli Options
```
  Usage:  tests-buster bust [OPTIONS]
      
      A cli tool for broken tests cleaning
      
      Options:
        -p, --path               The project root directory - where your package.json is. Defaults to current location.
        -P, --pattern            The test files search pattern. Accepts a js regex, defaults to ".spec.js$"
        -d, --dry-run            Scan the files without changing them. Run it before the actual slaughter to see how many tests can be busted
        -a  --auto-remove        Automatically remove empty test files
        -v, --version            Print version information and quit.
            --help               Display usage and quit.
```

## Buster Ignore

at any level in your project, you can create `.busterignore` files, to omit specific paths from the cleanup process.

:bulb:
> If no `.busterignore`  file found in the root directory, the buster will create there a default `.busterignore` file, to exclude `node_modules` and `.git`.

## Issues & Proposals

can be filed [here](https://github.com/Efrat19/tests-buster/issues). i will do my best to meet the needs.


---
#### Thanks for using the tests-buster :clap:

<a href='https://ko-fi.com/C0C5Y5NJ' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://az743702.vo.msecnd.net/cdn/kofi2.png?v=2' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
