import { api, LightningElement } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import { NavigationMixin } from 'lightning/navigation';

import FullCalendarJS from '@salesforce/resourceUrl/FullCalendarJS';

export default class JobCalendar extends LightningElement {
    @api scheduledJobs;

    fullCalendarJsInitialised = false;
    allScheduledJobs = [];
    selectedEvent;
    /**
     * @description Standard lifecyle method 'renderedCallback'
     *              Ensures that the page loads and renders the 
     *              container before doing anything else
     */
    renderedCallback() {
        console.log('START renderedCallback');
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
                jsEvent.preventDefault();
            },
            eventMouseover : function(event, jsEvent, view) {
            }
        });
    }

    setAllScheduledJobs() {
        this.allScheduledJobs = this.scheduledJobs.map(item => {
            return {
                id : item.Id,
                editable : true,
                title : item.CronJobDetail.Name,
                start : item.NextFireTime,
                end : item.NextFireTime,
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
            // Initialise the calendar configuration
            this.initialiseFullCalendarJs();
    }

    closeModal(){
        this.selectedEvent = undefined;
    }
}