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
        List<CronTrigger> jobList = [SELECT Id, CronJobDetail.Name, CronJobDetailId, EndTime,
                                            NextFireTime, PreviousFireTime, StartTime, State, TimesTriggered
                                    FROM CronTrigger];
        // for(CronTrigger eachJob : jobList) {
        //     System.debug(eachJob);
        // }
        ScheduledJobsResponse response = new ScheduledJobsResponse(jobList);
        return response;
    }

    public class ScheduledJobsResponse {
        @AuraEnabled
        public List<ScheduledJob> jobs;

        public ScheduledJobsResponse(List<CronTrigger> passedJobs) {
            jobs = wrapJobs(passedJobs);
        }

        public List<ScheduledJob> wrapJobs(List<CronTrigger> passedJobs) {
            List<ScheduledJob> result = new List<ScheduledJob>();
            for(CronTrigger eachJob : passedJobs) {
                result.add(new ScheduledJob(eachJob));
            }
            return result;
        }
    }

    public class ScheduledJob {
        @AuraEnabled
        public CronTrigger details;
        @AuraEnabled
        public List<DateTime> runtimes;

        public ScheduledJob(CronTrigger passedJob) {
            details = passedJob;
            runTimes = calculateRunTimes();
        }

        private List<DateTime> calculateRunTimes() {
            List<DateTime> result = new List<DateTime>();

            // TODO: calculate run times here
            result.add(details.NextFireTime);

            return result;
        }
    }
}
