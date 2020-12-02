import { LightningElement } from 'lwc';

export default class CronBuilder extends LightningElement {

    selectedFrequency = 'weekly';
    selectedDaysOfWeek = ['MON'];
    selectedDayOfMonth = 1;
    startDate = this.setInitialStartDate();
    endDate = this.setInitialEndDate();
    startTime = '04:00:00.000Z';
    

    get frequencyOptions() {
        return [
            {'label': 'Weekly', 'value': 'weekly'},
            {'label': 'Monthly', 'value': 'monthly'},
        ];
    }

    get showWeeklySelector() {
        return this.selectedFrequency === 'weekly';
    }

    get showMonthlySelector() {
        return this.selectedFrequency === 'monthly';
    }

    get weeklySelectorOptions() {
        return [
            {label: 'Sunday', value: 'SUN'},
            {label: 'Monday', value: 'MON'},
            {label: 'Tuesday', value: 'TUE'},
            {label: 'Wednesday', value: 'WED'},
            {label: 'Thursday', value: 'THU'},
            {label: 'Friday', value: 'FRI'},
            {label: 'Saturday', value: 'SAT'},
        ];
    }

    get monthlySelectorOptions() {
        let result = [];
        for(let i=1; i <= 31; i++) {
            result.push( {label: i, value: i} );
        }
        return result;
    }

    // Handlers
    handleFrequencyChange(event) {
        this.selectedFrequency = event.detail.value;
        console.log('Selected frequency: ' + event.detail.value);
    }

    handleWeeklySelectorChange(event) {
        this.selectedDaysOfWeek = event.detail.value;
        console.log(event.detail.value);
    }

    handleMonthlySelectorChange(event) {
        this.selectedDayOfMonth = event.detail.value;
    }

    handleStartDateChange(event) {
        this.startDate = event.detail.value;
    }

    handleEndDateChange(event) {
        this.endDate = event.detail.value;
        console.log('end date: ' + event.detail.value);
    }

    handleStartTimeChange(event) {
        this.startTime = event.detail.value;
    }

    // Utils
    
    setInitialStartDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    }

    setInitialEndDate() {
        var today = new Date();
        var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
        var dd = String(lastDayOfMonth.getDate()).padStart(2, '0'); 
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
    }

    generateCronString() {
        // sec min hr dayOfMo mon dayOfWk Yr
        // * = all possible values
        // ? = "no specific value" ... usable in day of month and day of week fields
        let [hr, min, sec] = this.startTime.split(":");
        switch(this.selectedFrequency) {
            case 'weekly':
                let daysOfWeek = this.selectedDaysOfWeek.join(',');
                let cronString = `0 ${hr} ${min} ? * ${daysOfWeek} *`;
                console.log('cronString: ' + cronString);
                break;
        }

        // let cronString = `0 ${hr} ${min} ? * * *`;
    }
}