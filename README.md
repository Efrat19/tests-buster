<img src="tests-buster.png" alt="tests-buster" width="250"/>

# tests-buster

#### clear broken tests from your test files at no time

the tests-buster will crawl in your test files, wisely analyze your tests and cut out every broken one. now your code is ready to take down the pipeline.

## local installation:

`npm i tests-buster`

## global installation:

`npm i -g tests-buster`

## cli options
```
  Usage:  tests-buster [OPTIONS]
      
      A cli tool for broken tests cleaning
      
      Options:
        -p, --path               The project root directory - where your package.json is. Defaults to current location.
        -P, --pattern            The test files search pattern. Accepts a js regex, defaults to ".spec.js$"
        -d, --dry-run            Scan the files without changing them. Run it before the actual slaughter to see how many tests can be busted
        -a  --auto-remove        Automatically remove empty test files
        -v, --version            Print version information and quit.
            --help               Display usage and quit.
```

