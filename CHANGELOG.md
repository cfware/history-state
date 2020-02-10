# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
