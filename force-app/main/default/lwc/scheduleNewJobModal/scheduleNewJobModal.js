import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getSchedulableClasses from '@salesforce/apex/scheduledJobs.getclasses';
import scheduleNewJob from '@salesforce/apex/scheduledJobs.scheduleJob';

export default class ScheduleNewJobModal extends LightningElement {

    jobName;
    selectedClass;
    schedulableClasses;

    @wire(getSchedulableClasses)
    getClasses(response) {
        if(response.data) {
            console.log('Response from server: ');
            console.log(response.data);
            this.schedulableClasses = response.data;
        }
        if(response.error) {
            console.log('Error fetching schedulable classes!');
            console.log(response.error);
        }
    }

    get schedulableClassOptions() {
        return this.schedulableClasses.map(eachClass => { 
            return {label: eachClass.Name, value: eachClass.Name}
        });
    }

    // Handlers

    handleJobNameChange(event) {
        this.jobName = event.detail.value;
    }

    handleSelectedClassChange(event) {
        this.selectedClass = event.detail.value;
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
            className: this.selectedClass
        };
        console.log(payload);
        scheduleNewJob(payload)
        .then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Your job has been scheduled',
                varient: 'success'
            }));
        })
        .catch(error => {
            console.log(error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'An Error Occurred',
                message: 'Error scheduling job: ' + error,
                varient: 'error'
            }));
        })
    }
    
}