

export default class ExitMessage {
  constructor(autoRemove, isDry) {
    this.autoRemove = autoRemove;
    this.isDry = isDry;
  }

  print(testsBusted, removeList) {
    const message = this.isDry ? this.getDryExitMessage(testsBusted, removeList)
      : this.getExitMessage(testsBusted, removeList);
    const selfPromotion = '\nThanks for using tests-buster! visit my homepage at https://github.com/efrat19/tests-buster';
    process.stdout(message + selfPromotion);
  }

  getDryExitMessage(testsBusted, removeList) {
    const jobReport = 'Dry run completed.\n';
    const testsReport = `${testsBusted} broken tests can be cut off.\n`;
    const filesReport = removeList.length && `${removeList.length} test files will be emptied. 
    if you want tests-buster to remove them automatically on the wet run, use the --auto-remove flag\n`;
    return jobReport + testsReport + filesReport;
  }

  getExitMessage(testsBusted, removeList) {
    const jobReport = 'process completed!\nDamage report:\n';
    const testsReport = `${testsBusted} broken tests where busted.\n`;
    const filesReport = removeList.length && this.autoRemove
      ? this.getFilesReportForAutoRemove(removeList)
      : this.getFilesReport(removeList);
    return jobReport + testsReport + filesReport;
  }

  getFilesReport(removeList) {
    return `${removeList.length} empty test files should be removed: ${this.getFilesListString(removeList)}`;
  }

  getFilesReportForAutoRemove(removeList) {
    return `${removeList.length} empty test files removed: ${this.getFilesListString(removeList)}`;
  }

  getFilesListString(removeList) {
    return `\n${removeList.join('\n')}\n`;
  }
}
