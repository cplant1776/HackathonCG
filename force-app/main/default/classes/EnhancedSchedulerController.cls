public with sharing class EnhancedSchedulerController {
    
    @AuraEnabled
    public static List<Event> fetchAllEvents(){
        List<Event> eventList = new List<Event>();
        eventList = [Select Id, Subject, WhatId, WhoId, 
                    Description, EndDate, EndDateTime, OwnerId,
                    ActivityDate, ActivityDateTime From Event LIMIT 100];
        System.debug('eventList: ' + eventList);
        return eventList;
    }

    @AuraEnabled
    public static List<CronTrigger> fetchAllScheduledJobs(){
        List<CronTrigger> jobList = new List<CronTrigger>();
        jobList = [SELECT Id, CronJobDetail.Name, CronJobDetailId, EndTime, NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered
                    FROM CronTrigger];
        for(CronTrigger eachJob : jobList) {
            System.debug(eachJob);
        }
        return jobList;
    }
}
