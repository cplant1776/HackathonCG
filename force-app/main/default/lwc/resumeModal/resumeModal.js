import { LightningElement, wire,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import scheduleNewJob from '@salesforce/apex/scheduledJobs.ResumeJob';

export default class ScheduleNewJobModal extends LightningElement {

    @api jobName;
    @api selectedClass;
    @api jobId

    // Handlers

    handleJobNameChange(event) {
        this.jobName = event.detail.value;
    }

    

    handleCloseModal() {
        console.log('ScheduleNewJobModal :: handleCloseModal');
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    handleSubmitNewJob() {
        console.log('ScheduleNewJobModal :: handleSubmitNewJob');
        let cronString = this.template.querySelector('c-cron-builder').generateCronString();
        let payload = {
            jobName: this.jobName,
            CRON: cronString,
            className: this.selectedClass,
            jobid : this.jobId
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