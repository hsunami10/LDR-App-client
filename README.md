# Setup Instructions
[Server code is here](https://github.com/hsunami10/LDR-App-server)

```shell
yarn start
react-native run-ios
```
If you see `-bash: react-native: command not found`, install it globally using `npm install --location=global react-native-cli`.

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

**yarn start - failed to construct transformer**
`Failed to construct transformer:  Error: error:0308010C:digital envelope routines::unsupported`
Try downgrading Node.js to a previous version. The version that works for me is `v12.3.0`.

**xcrun instruments error**
```shell
xcrun: error: unable to find utility "instruments", not a developer tool or in PATH

Command failed: xcrun instruments -s
xcrun: error: sh -c '/Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -sdk /Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk -find instruments 2> /dev/null' failed with exit code 17664: (null) (errno=Invalid argument)
xcrun: error: unable to find utility "instruments", not a developer tool or in PATH
```
Solution: check if XCode command line tools are installed. If yes, then try [upgrading to the latest version of react-native](https://stackoverflow.com/a/70249632) with `yarn upgrade react-native@latest` or at least `v0.64.0`.

_This may cause the error below, please read further._

**react-native run-ios: build failed**
```shell
fatal error: 'React/RCTBridgeModule.h' file not found
#import <React/RCTBridgeModule.h>
        ^~~~~~~~~~~~~~~~~~~~~~~~~
1 error generated.
```
Solution: `cd` into the `/ios` directory and try running `pod install`.


**pod install error: CocoaPods could not find compatible versions**
```shell
[!] CocoaPods could not find compatible versions for pod "React/RCTVibration":
  In snapshot (Podfile.lock):
    React/RCTVibration (from `../node_modules/react-native`)

  In Podfile:
    React/RCTVibration (from `../node_modules/react-native`)

None of your spec sources contain a spec satisfying the dependency: `React/RCTVibration (from `../node_modules/react-native`)`.

You have either:
 * out-of-date source repos which you can update with `pod repo update` or with `pod install --repo-update`.
 * mistyped the name or version.
 * not added the source repo that hosts the Podspec to your Podfile.
```
No viable solution yet...
- https://github.com/facebook/react-native/issues/25553
- https://github.com/facebook/react-native/issues/26665
