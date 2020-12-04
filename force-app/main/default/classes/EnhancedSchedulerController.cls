public with sharing class EnhancedSchedulerController {
    
    @AuraEnabled(cacheable=true)
    public static List<Event> fetchAllEvents(){
        List<Event> eventList = new List<Event>();
        eventList = [Select Id, Subject, WhatId, WhoId, 
                    Description, EndDate, EndDateTime, OwnerId,
                    ActivityDate, ActivityDateTime From Event LIMIT 100];
        System.debug('eventList: ' + eventList);
        return eventList;
    }

    @AuraEnabled(cacheable=true)
    public static ScheduledJobsResponse fetchAllScheduledJobs(){
        List<CronTrigger> jobList = [SELECT Id, CronJobDetail.Name, CronJobDetailId, EndTime, CreatedDate, CreatedBy.Name,
                                            NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered
                                    FROM CronTrigger];
        List<job__c> pausedJobList = [SELECT Id, name ,jobid__c, className__C, Cron__C, NextFireTime__C, CreatedDate, Owner.Name FROM job__C ];
        // for(CronTrigger eachJob : jobList) {
        //     System.debug(eachJob);
        // }
        ScheduledJobsResponse response = new ScheduledJobsResponse();
        response.setScheduledJobs(jobList);
        response.setPausedJobs(pausedJobList);
        return response;
    }

    @AuraEnabled(cacheable=true)
    // public static String getApexClassName(DateTime cronTrigCreatedDate) {
    public static String getApexClassName(DateTime cronTrigCreatedDate) {
       System.debug('START getApexClassName');
       System.debug(cronTrigCreatedDate);
       if(cronTrigCreatedDate != null) {
           try {
                AsyncApexJob targetJob = [SELECT Id, ApexClass.Name FROM AsyncApexJob WHERE CreatedDate = :cronTrigCreatedDate LIMIT 1];
                System.debug(targetJob.ApexClass.Name);
                return targetJob.ApexClass.Name;
           } catch (Exception e) {
               return null;
           }
       }
       return null;
    }

    public class ScheduledJobsResponse {
        @AuraEnabled
        public List<ScheduledJob> jobs = new List<ScheduledJob>();

        public ScheduledJobsResponse() {
            
        }

        // public List<ScheduledJob> wrapJobs(List<CronTrigger> passedJobs, List<job__c> passedPausedJobs) {
        //     List<ScheduledJob> result = new List<ScheduledJob>();

        //     for(CronTrigger eachJob : passedJobs) {
        //         result.add(new ScheduledJob(eachJob));
        //     }
        //     for(job__c eachPausedJob : passedPausedJobs) {
        //         result.add(new ScheduledJob(eachPausedJob));
        //     }
        //     return result;
        // }

        public void setScheduledJobs(List<CronTrigger> passedJobs) {
            for(CronTrigger eachJob : passedJobs) {
                jobs.add(new ScheduledJob(eachJob));
            }
        }

        public void setPausedJobs(List<job__c> passedPausedJobs) {
            for(job__c eachPausedJob : passedPausedJobs) {
                jobs.add(new ScheduledJob(eachPausedJob));
            }
        }
    }

    public class ScheduledJob {
        @AuraEnabled
        public Id Id;
        @AuraEnabled
        public String Name;
        @AuraEnabled
        public DateTime NextFireTime;
        @AuraEnabled
        public DateTime EndTime;
        @AuraEnabled
        public DateTime CreatedDate;
        @AuraEnabled
        public String ApexClassName;
        @AuraEnabled
        public Boolean isPaused=false;
        @AuraEnabled
        public String CreatedBy;
        @AuraEnabled
        public String State;
        @AuraEnabled
        public List<DateTime> runtimes;

        public ScheduledJob(CronTrigger passedJob) {
            Id = passedJob.Id;
            Name = passedJob.CronJobDetail.Name;
            NextFireTime = passedJob.NextFireTime;
            EndTime = passedJob.EndTime;
            CreatedDate = passedJob.CreatedDate;
            CreatedBy = passedJob.CreatedBy.Name;
            State = 'WAITING';
            // runTimes = calculateRunTimes();
        }

        public ScheduledJob(job__c passedPausedJob) {
            Id = passedPausedJob.jobid__c;
            Name = passedPausedJob.name;
            NextFireTime = passedPausedJob.NextFireTime__c;
            // EndTime = passedPausedJob.EndTime;
            CreatedDate = passedPausedJob.CreatedDate;
            CreatedBy = passedPausedJob.Owner.Name;
            ApexClassName = passedPausedJob.className__C;
            isPaused = True;
            State = 'PAUSED';
            // runTimes = calculateRunTimes();
        }

        private List<DateTime> calculateRunTimes() {
            List<DateTime> result = new List<DateTime>();

            // TODO: calculate run times here
            result.add(NextFireTime);

            return result;
        }
    }
}