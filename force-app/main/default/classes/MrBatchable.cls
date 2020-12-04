public with sharing class MrBatchable implements Database.Batchable<sObject>, Database.Stateful {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        System.debug('START MrBatchable');
        return Database.getQueryLocator(
            'SELECT Id, CronJobDetail.Name FROM CronTrigger'
        );
    }

    public void execute(Database.BatchableContext bc, List<CronTrigger> scope){
        for(CronTrigger eachJob : scope) {
            System.debug(eachJob);
        }
    }

    public void finish(Database.BatchableContext bc){
        System.debug('FINISH MrBatchable');
    }
}
