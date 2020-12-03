public class scheduledJobs {
    
    @AuraEnabled(cacheable=true)
    //get list of all jobs
    public static List<CronTrigger> getjobs ()
    {  
        List<CronTrigger> cl = [SELECT ID,CronExpression,CronJobDetail.Name, CronJobDetailId, EndTime, NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered FROM CronTrigger];
     
        return cl;
    }
    @AuraEnabled(cacheable=true)
    //get list of all Schedulable classes
    public static List<ApexClass> getclasses(){
        
      ApexClass[] schedulableClasses = (ApexClass[])[FIND 'Schedulable' IN ALL FIELDS RETURNING ApexClass(NamespacePrefix, Name ORDER BY Name ASC)][0];
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
    public static void scheduleJob(string jobName, string CRON, String className ){
      
        System.debug('jobName: ' + jobName);
        System.debug('CRON: ' + CRON);
        System.debug('className: ' + className);

        Type classType = Type.forName(''+className+'');
         schedulable newObj = (schedulable)classType.newInstance();
       
        String ScheduledJobID=System.schedule(jobName, CRON,newObj );
        CronTrigger job =  [SELECT ID,CronExpression,CronJobDetail.Name, CronJobDetailId, EndTime, NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered FROM CronTrigger where Id = :ScheduledJobID];
         job__C j = new job__C();
         j.name = jobName;
         j.className__C = className;
         j.Cron__C=CRON;
         j.NextFireTime__C=''+job.NextFireTime;
         j.status__c='Running';
         j.jobid__c=job.ID;
         insert j;
        system.debug(job);
        
    }
     @AuraEnabled
    //Pause a job
     public static void PauseJob(string jobids){
      system.debug(jobids);
      job__C j=[Select id,jobid__c,status__c from job__C where jobid__c=:jobids ];
         j.status__c='paused';
         system.debug(j);
         update j;
      System.abortJob(jobids);
     }
    @AuraEnabled
    //Resume Job and delete it from the object records
     public static void ResumeJob(string jobName,string CRON){
         
        job__C j = [SELECT id,Name,className__C from job__C WHERE Name=:jobName];
         
          Type classType = Type.forName(''+j.className__C+'');
         schedulable newObj = (schedulable)classType.newInstance();
       
        System.schedule(jobName, CRON,newObj );
         delete j;
     }
    @AuraEnabled
     //delete a job
     public static void deleteJob(string jobid){
    System.abortJob(jobid);
         
     }
    
}