## Governance data bot

## Description
This bot collects some governance info and reports it to the notion tables.

- [x] EasyTrack motions
- [x] Snapshot voting
- [x] Aragon voting
- [x] Research forum posts


## Snapshot votings status posted to the research forum
- post a message about starting/ending voting to the corresponding research forum topic
- message vibe depends on what exactly has changed in voting
- choices like `yay` or `for` counted as a positive vote result and vice versa.
  Configured via `SNAPSHOT_SUCCESS_CHOICES` and `SNAPSHOT_AGAINST_CHOICES`
- in the other choices message will be neutral
- the bot will NOT send posts for the stale voting
- to avoid possible bot crazy posting, we check for duplicates by the first message line (title like "Voting started")

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

To create a new release:

1. Merge all changes to the `main` branch.
1. After the merge, the `Prepare release draft` action will run automatically. When the action is complete, a release draft is created.
1. When you need to release, go to Repo → Releases.
1. Publish the desired release draft manually by clicking the edit button - this release is now the `Latest Published`.
1. After publication, the action to create a release bump will be triggered automatically.
