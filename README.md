# Alexa Smart Home Skill SDK



## Documentation / How To

Until proper documentation is created, refer to the [Message and Property Reference](https://developer.amazon.com/en-US/docs/alexa/device-apis/message-guide.html). The fluent builders are based largely on that documentation, so most concepts should map over.



## Prebuild Output File

The [prebuild output file](/src/prebuild-output.ts) contains build-time data that has been dumped for run-time use. This file is auto-generated. Any changes to the file will be lost on the next build.

If you need to modify this file, modify the `output-prebuild-vars` command. To test your changes, delete the [prebuild output file](/src/prebuild-output.ts), then run `yarn test-check` or `yarn compile`.
