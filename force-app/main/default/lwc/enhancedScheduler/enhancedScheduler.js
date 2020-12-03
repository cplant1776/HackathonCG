import { LightningElement, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import fetchAllScheduledJobs from '@salesforce/apex/EnhancedSchedulerController.fetchAllScheduledJobs';

export default class EnhancedScheduler extends LightningElement {

    scheduledJobs;
    showCreateModal = false;

    _jobResponse;
    
    @wire(fetchAllScheduledJobs)
    getScheduledJobs(response) {
        this._jobResponse = response;

        if(response.data) {
            console.log('Response from server: ');
            console.log(response.data);
            this.scheduledJobs = [...response.data.jobs];
        }
        if(response.error) {
            console.log('Error fetching scheduled jobs!');
            console.log(response.error);
        }
    }

    // Handlers

    handleShowCreateModal() {
        console.log('EnhancedScheduler :: handleShowCreateModal');
        this.showCreateModal = true;
    }

    handleCloseCreateModal() {
        console.log('EnhancedScheduler :: handleCloseCreateModal');
        this.showCreateModal = false;
    }

    handleSubmitNewJob() {
        console.log('EnhancedScheduler :: handleSubmitNewJob');
        this.showCreateModal = false;
        return refreshApex(this._jobResponse);
    }
    handleRefreshJobs(event) {
        console.log('EnhancedScheduler :: handleRefreshJobs');
        // this.scheduledJobs = undefined;
        refreshApex(this._jobResponse);
        console.log('end');
    }
}