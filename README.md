# Alexa Smart Home Skill SDK

## Versioning

After creating the release branch, run the following:

```bash
npm run version semver
```

NOTE: Replace `semver` with a valid parameter, such as `major`, `minor`, or `patch`. See https://docs.npmjs.com/cli/v7/commands/npm-version for additional options.



## Prebuild Output File

The [prebuild output file](/src/prebuild-output.ts) contains build-time data that has been dumped for run-time use. This file is auto-generated. Any changes to the file will be lost on the next build.

If you need to modify this file, modify the `output-prebuild-vars` command. To test your changes, delete the [prebuild output file](/src/prebuild-output.ts), then run `yarn test-check` or `yarn compile`.
