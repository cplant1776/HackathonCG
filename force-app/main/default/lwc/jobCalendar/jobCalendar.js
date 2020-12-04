import { api, LightningElement, wire } from 'lwc';
import { loadScript, loadStyle} from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import DeleteCurrentJob from '@salesforce/apex/scheduledJobs.deleteJob';
import PauseJob from '@salesforce/apex/scheduledJobs.PauseJob';
import ResumePausedJob from '@salesforce/apex/scheduledJobs.ResumePausedJob';
import getApexClassName from '@salesforce/apex/EnhancedSchedulerController.getApexClassName';

export default class JobCalendar extends LightningElement {
    @api
    get scheduledJobs() {
        return this._scheduledJobs;
    }
    set scheduledJobs(value) {
        let oldJobs = this._scheduledJobs;
        this.setAttribute('scheduledJobs', value);
        this._scheduledJobs = value;
        if(this.isRendered){
            this.setAllScheduledJobs();
        }
    }

    fullCalendarJsInitialised = false;
    allScheduledJobs = [];
    selectedEvent;
    isRendered = false;
    showResumeModel = false;
    eventjobName;
    eventclassName;
    eventjobID;
    
    @wire(getApexClassName, {cronTrigCreatedDate: '$selectedEvent.extendedProps.createdDate'})
    getClassName(response) {
        if(response.data) {
            console.log('Name from server:');
            console.log(response.data);
            this.eventclassName = response.data;
            this.selectedEvent.extendedProps['apexClass'] = response.data;
        }
        if(response.error) {
            console.log('Error fetching name:');
            console.log(response.error);
        }
    }

    // private
    _scheduledJobs;

    // get createDate() {
    //     return String(this.selectedEvent.extendedProps.CreatedDate).replace('.000',''); //placeholder
    // }

    get runDate() {
        return String(this.selectedEvent.start).replace('.000',''); //placeholder
    }

    get showResumeButton() {
        console.log('showPauseButton');
        console.log(JSON.parse(JSON.stringify(this.selectedEvent.extendedProps)));
        return this.selectedEvent.extendedProps.isPaused;
    }
    

    /**
     * @description Standard lifecyle method 'renderedCallback'
     *              Ensures that the page loads and renders the 
     *              container before doing anything else
     */
    renderedCallback() {
        console.log('jobCalendar :: renderedCallback');
        console.log(JSON.parse(JSON.stringify(this.scheduledJobs)));
        // Performs this operation only on first render
        if (this.fullCalendarJsInitialised) {
        return;
        }
        this.fullCalendarJsInitialised = true;

        // Executes all loadScript and loadStyle promises
        // and only resolves them once all promises are done
        Promise.all([
            loadScript(this, FullCalendarJS + '/jquery.min.js'),
            loadScript(this, FullCalendarJS + '/moment.min.js'),
            loadScript(this, FullCalendarJS + '/theme.js'),
            loadScript(this, FullCalendarJS + '/fullcalendar.min.js'),
            loadStyle(this, FullCalendarJS + '/fullcalendar.min.css'),
            // loadStyle(this, FullCalendarJS + '/fullcalendar.print.min.css')
        ])
        .then(() => {
            // Initialise the calendar configuration
            this.setAllScheduledJobs();
        })
        .catch(error => {
            console.error({
                message: 'Error occured on rendering FullCalendarJS',
                error
            });
        })
    }

    /**
     * @description Initialise the calendar configuration
     *              This is where we configure the available options for the calendar.
     *              This is also where we load the Events data.
     */
    initialiseFullCalendarJs() {
        console.log('jobCalendar :: initialiseFullCalendarJs');
        var that = this; // used to access class variables in our event callback
        const ele = this.template.querySelector('div.fullcalendarjs');
        $(ele).fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,basicWeek,basicDay,listWeek'
            },
            themeSystem : 'standard',
            defaultDate: new Date(), 
            navLinks: true,
            editable: true,
            eventLimit: true,
            events: this.allScheduledJobs,
            dragScroll : true,
            droppable: true,
            weekNumbers : true,
            eventDrop: function(event, delta, revertFunc) {
                alert(event.title + " was dropped on " + event.start.format());
                if (!confirm("Are you sure about this change? ")) {
                revertFunc();
                }
            },
            eventClick: function(event, jsEvent, view) {
                that.selectedEvent =  event;
                console.log(that.selectedEvent.isPaused);
                console.log('END eventClick');
            },
            dayClick :function(date, jsEvent, view) {
                // jsEvent.preventDefault(); // by default, goes to Day view of selected day
            },
            eventMouseover : function(event, jsEvent, view) {
            }
        });
        this.isRendered = true;
    }

    setAllScheduledJobs() {
        console.log('jobCalendar :: setAllScheduledJobs');
        // TODO: instead of mapping: loop through each job, do an inner loop through runtimes and create an event for each one
        //      that will also let us assign the same color to them.
        console.log(JSON.parse(JSON.stringify(this.scheduledJobs)));
        this.allScheduledJobs = this.scheduledJobs.map(item => {

            // let eventTitle = item.isPaused ? `(P) ${item.Name}` : item.Name;
            let eventColor;
            switch(item.State) {
                case 'WAITING':
                    eventColor = 'rgb(0, 153, 255)'; // blue
                    break;
                case 'PAUSED':
                    // eventColor = 'rgb(255, 153, 0)';
                    eventColor = 'rgb(117, 117, 117)'; // grey
                    break;
                default:
                    eventColor = 'rgb(117, 117, 117)'; // grey
                    // eventColor = 'rgb(255, 153, 0)'; // orange

            }
            return {
                    id : item.Id,
                    editable : true,
                    title : item.Name,
                    start : item.NextFireTime,
                    end : item.EndTime,
                    description : 'placeholder description',
                    allDay : false,
                    extendedProps : {
                        CreatedBy : item.CreatedBy,
                        createdDate : item.CreatedDate,
                        apexClass : item.ApexClassName,
                        isPaused: item.isPaused,
                        cronExpression : item.CronExpression
                    },
                    // backgroundColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")",
                    // borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
                    backgroundColor: eventColor,
                    borderColor: 'rgb(0, 0, 0)'
                };
            });

            if(this.isRendered) {
                this.refreshCalendar();
            }
            else {
                this.initialiseFullCalendarJs();
            }
    }

    refreshCalendar() {
        console.log('jobCalendar :: refreshCalendar');
        const ele = this.template.querySelector('div.fullcalendarjs');
        $(ele).fullCalendar('removeEvents');
        $(ele).fullCalendar('addEventSource', this.allScheduledJobs);
        $(ele).fullCalendar('rerenderEvents');
    }

    closeModal(){
        this.selectedEvent = undefined;
    }
    handleDelete() {
    console.log('jobCalendar :: handleDelete');

    console.log("selectedEvent.id");
    console.log(this.selectedEvent.id);
    

    DeleteCurrentJob ({jobid:this.selectedEvent.id})
     .then(result => {
       
        
        const custEvent = new CustomEvent(
            'refresh');
        this.dispatchEvent(custEvent);
        this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Your job has been deleted',
            variant: 'success'
        }));
        console.log("done");
        this.closeModal();
     })
     .catch(error => {})
    }

    handlePause(){
        console.log('jobCalendar :: handlePause');
        console.log(this.selectedEvent);
        console.log(this.selectedEvent.title);
        PauseJob ({jobid :this.selectedEvent.id,
            cronTrigCreatedDate: this.selectedEvent.extendedProps.createdDate,
             jobName: this.selectedEvent.title,
           NextFireTime : this.selectedEvent.start,
           CRON: this.selectedEvent.extendedProps.cronExpression
        })
        .then(result => {

           this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Your job has been Paused',
                variant: 'warning'
            }));
           console.log("here");
           const custEvent = new CustomEvent(
               'refresh');
           this.dispatchEvent(custEvent);
           
        })
        .catch(error => {})
        .finally(() => {
            this.selectedEvent = undefined;
        })
    }

    handleResume() {
        console.log('jobCalendar :: handleResume');
        console.log(this.selectedEvent.id);
        let payload = {
            pausedJobId: this.selectedEvent.id,
            CRON: this.selectedEvent.extendedProps.cronExpression
        }
        ResumePausedJob(payload)
        .then(result => {

            this.dispatchEvent(new ShowToastEvent({
                 title: 'Success',
                 message: 'Your job has been Resumed',
                 variant: 'success'
             }));
            const custEvent = new CustomEvent(
                'refresh');
            this.dispatchEvent(custEvent);
            
         })
         .catch(error => {
             console.log('Error resuming paused job!');
             console.log(error);
         })
         .finally(() => {
             this.selectedEvent = undefined;
         })
    }


    handleShowResumeModel() {
        console.log('EnhancedScheduler :: handleShowCreateModal');
        console.log(this.selectedEvent.extendedProps['apexClass']);
        // console.log(this.selectedEvent.extendedProps);
        console.log(JSON.parse(JSON.stringify(this.selectedEvent.extendedProps)));
        this.eventjobName=this.selectedEvent.title;
        this.eventjobID=this.selectedEvent.id;
     

        this.eventclassName =  this.selectedEvent.extendedProps.apexClass;
        console.log(this.eventjobName);
        console.log(this.eventjobID);
        console.log(this.eventClassName);
        this.showResumeModel = true;
    }

    handleCloseResumeModel() {
        console.log('EnhancedScheduler :: handleCloseCreateModal');
        this.showResumeModel = false;
        this.selectedEvent = undefined;
    }

    handleResumeJob() {

        const custEvent = new CustomEvent(
            'refresh');
        this.dispatchEvent(custEvent);

    }

}