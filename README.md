## Governance data bot

## Description
This bot collect some governance info and report it to notion tables.

- [x] EasyTrack motions
- [x] Snapshot voting
- [x] Aragon voting
- [x] Research forum posts

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## License

API Template is [MIT licensed](LICENSE).

## Release flow

To create new release:

1. Merge all changes to the `develop` branch
1. Navigate to Repo => Actions
1. Run action "Prepare release" action against `main` branch
1. When action execution is finished, navigate to Repo => Pull requests
1. Find pull request named "chore(release): X.X.X" review and merge it with "Rebase and merge" (or "Squash and merge")
1. After merge release action will be triggered automatically
1. Navigate to Repo => Actions and see last actions logs for further details 