// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

//
List<String> cronExpr = new List<String> {
    '0 0 0 4 DEC ? 2020',
    '0 0 0 11 DEC ? 2020',
    '0 0 0 18 DEC ? 2020',
    '0 0 0 25 DEC ? 2020'
};
Integer i=0;
for(String eachCron : cronExpr) {
    System.schedule('Recurring Job' + i, eachCron, new Miko_Scheduled());
    i++;
}


//
CronTrigger job = [SELECT Id, CronJobDetail.Name, CronJobDetailId, EndTime, CreatedDate,
                             NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered
                             FROM CronTrigger WHERE CronJobDetail.Name='Job Test Again' LIMIT 1];
AsyncApexJob x = [SELECT Id, ApexClass.Name FROM AsyncApexJob WHERE CreatedDate = :job.CreatedDate];
System.debug(job);
System.debug(x.ApexClass.Name);