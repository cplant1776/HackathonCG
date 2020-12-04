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
       
        System.schedule(jobName, CRON,newObj );
        
    }
     @AuraEnabled
    //Pause a job
     public static void PauseJob(string jobid,DateTime cronTrigCreatedDate,string jobName,datetime NextFireTime, String CRON){
      system.debug('here');
      System.debug('NextFireTime: ' + NextFireTime);
      AsyncApexJob targetJob = [SELECT Id, ApexClass.Name FROM AsyncApexJob WHERE CreatedDate = :cronTrigCreatedDate LIMIT 1];
      
       job__C j = new job__C();
         j.name = jobName;
         j.className__C = targetJob.ApexClass.Name;
         j.Cron__C=CRON;
         j.NextFireTime__C=NextFireTime;
         j.jobid__c=jobid;
         insert j;
        system.debug(j);
       
      System.abortJob(jobid);

     }
    @AuraEnabled
    //Resume Job and delete it from the object records
     public static void ResumeJob(string jobName,string CRON,string jobid,string className){
        

      try {
        job__C j = [SELECT id ,jobid__c FROM job__C WHERE jobid__c LIKE :jobid];
         delete j;
         Type classType = Type.forName(''+className+'');
         schedulable newObj = (schedulable)classType.newInstance();
        string cjobid = System.schedule(jobName, CRON,newObj );
          system.debug(cjobid);
        } catch(Exception e) {
       System.debug('The following exception has occurred: ' + e.getMessage());
          System.abortJob(jobid);
          Type classType = Type.forName(''+className+'');
         schedulable newObj = (schedulable)classType.newInstance();
        string cjobid = System.schedule(jobName, CRON,newObj );
          }   
         
         
     }

    @AuraEnabled
    public static void ResumePausedJob(Id pausedJobId) {
      System.debug('ResumePausedJob: ' + pausedJobId);

      job__c pausedJob = [SELECT Id, Name, ClassName__c, CRON__c
                        FROM job__c WHERE Id = :pausedJobId LIMIT 1];
      Type classType = Type.forName(''+pausedJob.ClassName__c+'');
      schedulable newObj = (schedulable)classType.newInstance();
      string cjobid = System.schedule(pausedJob.Name, pausedJob.CRON__c,newObj );

      delete pausedJob;
    }

    @AuraEnabled
     //delete a job
     public static void deleteJob(string jobid){
         try {
         job__C j = [SELECT id ,jobid__c FROM job__C WHERE jobid__c=:jobid];
          delete j;
         } catch(Exception e) {
        System.debug('The following exception has occurred: ' + e.getMessage());
           }
                
           try {
            System.abortJob(jobid);
            } catch(Exception e) {
           System.debug('The following exception has occurred: ' + e.getMessage());
              }    
    
         
     }
    
}