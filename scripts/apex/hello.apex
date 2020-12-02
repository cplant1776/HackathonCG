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

//
System.schedule('Monthly Collation', '0 0 4 1 JAN ? 2021', new Miko_Scheduled());
System.schedule('Mass Outreach', '0 0 4 2 JAN ? 2021', new Miko_Scheduled());
System.schedule('Weekend Maintenance', '0 0 3 2 JAN ? 2021', new Miko_Scheduled());
System.schedule('Case Cleanup', '0 30 4 2 JAN ? 2021', new Miko_Scheduled());
System.schedule('Update Case Owners', '0 0 17 5 JAN ? 2021', new Miko_Scheduled());
System.schedule('Unnamed Job', '0 45 1 12 JAN ? 2021', new Miko_Scheduled());
System.schedule('Contact Cleanup', '0 30 6 22 JAN ? 2021', new Miko_Scheduled());
System.schedule('File Purge', '0 45 2 12 JAN ? 2021', new Miko_Scheduled());
System.schedule('Case Cleanup 2', '0 0 5 24 JAN ? 2021', new Miko_Scheduled());
System.schedule('Update Case Owners 2', '0 0 5 24 JAN ? 2021', new Miko_Scheduled());


//
DateTime cutoff = System.now().addDays(30);
CronTrigger[] jobs = [SELECT CronJobDetail.Name, CronJobDetailId FROM CronTrigger WHERE NextFireTime > :cutoff];
for(CronTrigger eachJob : jobs) {
    System.debug(eachJob);
}