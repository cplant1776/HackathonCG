import { LightningElement, wire } from 'lwc';
import getSchedulableClasses from '@salesforce/apex/scheduledJobs.getclasses'

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
    
}