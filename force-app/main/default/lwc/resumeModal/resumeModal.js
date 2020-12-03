import { LightningElement, wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import scheduleNewJob from '@salesforce/apex/scheduledJobs.scheduleJob';

export default class ScheduleNewJobModal extends LightningElement {

    @api jobname;
    @api selectedclass;
   

    // Handlers

    handleJobNameChange(event) {
        this.jobname = event.detail.value;
    }

    

    handleCloseModal() {
        console.log('ScheduleNewJobModal :: handleCloseModal');
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    handleSubmitNewJob() {
        console.log('ScheduleNewJobModal :: handleSubmitNewJob');
        let cronString = this.template.querySelector('c-cron-builder').generateCronString();
        let payload = {
            jobName: this.jobname,
            CRON: cronString,
            className: this.selectedclass
        };
        console.log(payload);
        scheduleNewJob(payload)
        .then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Your job has been rescheduled',
                variant: 'success'
            }));
            this.dispatchEvent(new CustomEvent('submitjob'));
        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'An Error Occurred',
                message: 'Error scheduling job: ' + error,
                variant: 'error'
            }));
        })
    }

    
}