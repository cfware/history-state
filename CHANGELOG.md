# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0](https://github.com/cfware/history-state/compare/v0.5.0...v1.0.0) (2023-10-16)


### ⚠ BREAKING CHANGES

* Upgrade development dependencies

### Bug Fixes

* Upgrade development dependencies ([2b29cba](https://github.com/cfware/history-state/commit/2b29cbaedba4d1b713242960cba968824ed6d570))

## [0.5.0](https://github.com/cfware/history-state/compare/v0.4.4...v0.5.0) (2020-11-06)


### ⚠ BREAKING CHANGES

* Refactor API to improve tersing

### Features

* Refactor API to improve tersing ([ad58038](https://github.com/cfware/history-state/commit/ad58038ff49492bcc59565f8d6cc02835eeb1c4e))

### [0.4.4](https://github.com/cfware/history-state/compare/v0.4.3...v0.4.4) (2020-09-11)


### Bug Fixes

* Avoid spurious updates for links which do not have an href ([b135429](https://github.com/cfware/history-state/commit/b135429245987780c387e81a8e3d4f6b79a1005d))

### [0.4.3](https://github.com/cfware/history-state/compare/v0.4.2...v0.4.3) (2020-08-27)


### Features

* Add navigateTo function ([c7765d6](https://github.com/cfware/history-state/commit/c7765d6c3ddd0c8acf29eeb3e5902fb688a06a31))

### [0.4.2](https://github.com/cfware/history-state/compare/v0.4.1...v0.4.2) (2020-02-10)


### Bug Fixes

* Remove nullish coalescing operator ([982a243](https://github.com/cfware/history-state/commit/982a243c75d4fedc58659b930946d898851d21e1))

### [0.4.1](https://github.com/cfware/history-state/compare/v0.4.0...v0.4.1) (2020-02-07)


### Bug Fixes

* Add test.js to npmignore ([fdeab34](https://github.com/cfware/history-state/commit/fdeab34fef43fb2d68eb9a7fcc60753e92ab14ed))

## [0.4.0](https://github.com/cfware/history-state/compare/v0.3.1...v0.4.0) (2020-02-07)


### ⚠ BREAKING CHANGES

* Use nullish coalescing and optional chaining

### Features

* Expand API to cover all window.history fields ([1665aae](https://github.com/cfware/history-state/commit/1665aae23029348e6aeaf295ae87fcc5a6d2199e))

### [0.3.1](https://github.com/cfware/history-state/compare/v0.3.0...v0.3.1) (2019-06-05)



# [0.3.0](https://github.com/cfware/history-state/compare/v0.2.0...v0.3.0) (2019-03-22)


### Features

* Accept listenerOptions argument on linkInterceptor. ([acda01f](https://github.com/cfware/history-state/commit/acda01f))


### BREAKING CHANGES

* `<a>` click listener no longer uses capture by default.



# [0.2.0](https://github.com/cfware/history-state/compare/v0.1.0...v0.2.0) (2019-03-21)


### Features

* More closely mimic the standard history API. ([eaf00a5](https://github.com/cfware/history-state/commit/eaf00a5))


### BREAKING CHANGES

* `historyState.data` has been replaced by
`historyState.state`.
* `historyState.pushState` requires the same arguments as
`history.pushState`.



# 0.1.0 (2019-03-20)


### Features

* Implement @cfware/history-state. ([c1a6129](https://github.com/cfware/history-state/commit/c1a6129))
