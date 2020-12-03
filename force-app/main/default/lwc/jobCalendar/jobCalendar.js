import { api, LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';

import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';
import DeleteCurrentJob from '@salesforce/apex/scheduledJobs.deleteJob';
import PauseJob from '@salesforce/apex/scheduledJobs.PauseJob';
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

    // private
    _scheduledJobs;

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
                console.log(that.selectedEvent);
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
        this.allScheduledJobs = this.scheduledJobs.map(item => {
            return {
                id : item.details.Id,
                editable : true,
                title : item.details.CronJobDetail.Name,
                start : item.details.NextFireTime,
                end : item.details.EndTime,
                description : 'placeholder description',
                allDay : false,
                extendedProps: {},
                // extendedProps : {
                //   whoId : item.WhoId,
                //   whatId : item.WhatId
                // },
                backgroundColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")",
                borderColor: "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")"
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
       /* this.dispatchEvent(new ShowToastEvent({
            title: 'Success',
            message: 'Your job has been deleted',
            variant: 'success'
        }));*/
        console.log("done");
        this.closeModal();
     })
     .catch(error => {})
    }

    handlePause(){
        console.log('jobCalendar :: handlePause');
        PauseJob ({jobids:this.selectedEvent.id})
        .then(result => {

           /* this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Your job has been Paused',
                variant: 'success'
            }));*/
           console.log("here");
           const custEvent = new CustomEvent(
               'refresh');
           this.dispatchEvent(custEvent);
           
        })
        .catch(error => {})

    }
}