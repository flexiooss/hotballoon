export class JobInterface {
  processInline() {
    throw Error('JobInterface:processInline should be override')
  }

  processWorker() {
    throw Error('JobInterface:processWorker should be override')
  }

  finish() {
    throw Error('JobInterface:finish should be override')
  }
}
