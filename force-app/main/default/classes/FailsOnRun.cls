global class FailsOnRun implements Schedulable{
    global void execute(SchedulableContext sc)
    {
            System.debug('Fails on run.');
            Contact invalidCon = new Contact();
            insert invalidCon;
    }
}