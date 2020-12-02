global class CleanOldContacts implements Schedulable{
    global void execute(SchedulableContext sc)
        {
            System.debug('clean old contacts');
        }
}
