import { LightningElement, wire } from 'lwc';

import fetchAllScheduledJobs from '@salesforce/apex/EnhancedSchedulerController.fetchAllScheduledJobs';

export default class EnhancedScheduler extends LightningElement {

    scheduledJobs;
    
    @wire(fetchAllScheduledJobs)
    getScheduledJobs(response) {
        if(response.data) {
            console.log('Response from server: ');
            console.log(response.data);
            this.scheduledJobs = response.data;
        }
        if(response.error) {
            console.log('Error fetching scheduled jobs!');
            console.log(response.error);
        }
    }

    handleTester() {
        console.log('caught Tester');
    }
}