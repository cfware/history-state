# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
