<img src="tests-buster.png" alt="tests-buster" width="250"/>

# tests-buster

#### clear broken tests from your test files at no time

the tests-buster will crawl in your test files, wisely analyze your tests and cut out every broken one. now your code is ready to take down the pipeline. :crossed_flags:

## Local installation:

```npm i tests-buster```

## Global installation:

```npm i -g tests-buster```

## Run:

in your root project directory, run:

 ```tests-buster```

 and i will take care of everything else.

## Cli Options
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

## Buster Ignore

at any level in your project, you can create `.busterignore` files, to omit specific paths from the cleanup process.

:bulb:
> If no `.busterignore`  file found in the root directory, the buster will create there a default `.busterignore` file, containing `node_modules` and `.git`.
