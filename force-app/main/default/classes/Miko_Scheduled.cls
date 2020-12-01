global class Miko_Scheduled Implements Schedulable
    {
        global void execute(SchedulableContext sc)
        {
            setToMiko();
        }

        public void setToMiko()
        {
            List<Account> listAccounts = new List<Account>();
            listAccounts = [SELECT ID,Site FROM Account WHERE Site = null];

            for(Account acc : listAccounts)
            {
                acc.Site = 'Miko';
            }

            update listAccounts;
        }
    }