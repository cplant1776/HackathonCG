public class scheduledJobs {
    
    @AuraEnabled(cacheable=true)
    //get list of all jobs
    public static List<CronTrigger> getjobs ()
    {  // List<CronTrigger> fullList = new List<CronTrigger>();
        List<CronTrigger> cl = [SELECT ID,CronExpression,CronJobDetail.Name, CronJobDetailId, EndTime, NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered FROM CronTrigger];
      /*  for(CronTrigger c : cl)
        {
           String strTest =c.CronExpression;
            system.debug(strTest);
           String[] cron = strTest.split(' ');
           string minutes = cron[0];
           string hours = cron[1];
           string dayOfMonth = cron[2];
           string month = cron[3];
           string dayOfWeek = cron[4];
            system.debug(cron);
        }
        return fullList;*/
        return cl;
    }
    @AuraEnabled(cacheable=true)
    //get list of all Schedulable classes
    public static List<ApexClass> getclasses(){
        
      ApexClass[] schedulableClasses = (ApexClass[])[FIND 'implements schedulable' IN ALL FIELDS RETURNING ApexClass(NamespacePrefix, Name)][0];
      ApexClass[] realSchedulables = new ApexClass[0];
      for(ApexClass klass: schedulableClasses) {
        try {
        Object t = JSON.deserialize('{}', 
         klass.NamespacePrefix == null? 
        Type.forName(klass.Name):
        Type.forName(klass.NamespacePrefix, klass.Name));
         if(t instanceOf Schedulable) {
           realSchedulables.add(klass);
                                     }
               } catch(TypeException e) {
                        // Ignore
                         }
                                           }
        return realSchedulables;
     }
    
     @AuraEnabled
    //Sched a job
    public static void scheduleJob(string jobName, string CRON, ApexClass className ){
        
        Type classType = Type.forName(''+className+'');
         schedulable newObj = (schedulable)classType.newInstance();
       
        System.schedule(jobName, CRON,newObj );
        
    }
     @AuraEnabled
    //Pause a job
     public static void PasueJob(string jobid){
    System.abortJob(jobid);
         
     }
     //delete a job
     public static void deleteJob(string jobid){
    System.abortJob(jobid);
         
     }
    
}