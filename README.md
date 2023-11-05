# LDR App - Client Side (in development)
## Troubleshooting
**yarn start - watchman crawl failed**
If you get an error like below:
```shell
Loading dependency graph...jest-haste-map: Watchman crawl failed. Retrying once with node crawler.
  Usually this happens when watchman isn't running. Create an empty `.watchmanconfig` file in your project's root folder or initialize a git or hg repository in your project.
  Error: Watchman error: std::__1::system_error: open: /Users/michaelhsu/Documents/GitHub/LDR-App-client: Operation not permitted. Make sure watchman is running for this project. See https://facebook.github.io/watchman/docs/troubleshooting.html.
 ERROR  std::__1::system_error: open: /Users/michaelhsu/Documents/GitHub/LDR-App-client: Operation not permitted
error Command failed with exit code 11.
```
[Per this link](https://github.com/facebook/watchman/issues/977#issuecomment-1189903929), try running:
```shell
watchman watch-del-all
watchman shutdown-server
```
