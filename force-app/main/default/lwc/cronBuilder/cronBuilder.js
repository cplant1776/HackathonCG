import { api, LightningElement } from 'lwc';

export default class CronBuilder extends LightningElement {

    selectedFrequency = 'weekly';
    selectedDaysOfWeek = ['MON'];
    selectedDayOfMonth = '1';
    startDate = this.setInitialStartDate();
    endDate = this.setInitialEndDate();
    startTime = '04:00:00.000Z';

    @api generateCronString() {
        // sec min hr dayOfMo mon dayOfWk Yr
        // * = all possible values
        // ? = "no specific value" ... usable in day of month and day of week fields
        console.log(this.startTime);
        let [hr, min, sec] = this.startTime.split(":").map(eachPart => {
            return parseInt(eachPart).toString(); // trim leading 0s
        });
        let cronString;
        switch(this.selectedFrequency) {
            case 'weekly':
                console.log('min: ' + min + '   hr: ' + hr);
                let daysOfWeek = this.selectedDaysOfWeek.join(',');
                cronString = `0 ${min} ${hr} ? * ${daysOfWeek} *`;
                console.log('cronString: ' + cronString);
                return cronString;
                break;
            case 'monthly':
                // TODO: Implement
                break;
        }

        // let cronString = `0 ${hr} ${min} ? * * *`;
    }
    

    get frequencyOptions() {
        return [
            {'label': 'Weekly', 'value': 'weekly'},
            {'label': 'Monthly', 'value': 'monthly'},
            {'label': 'Single', 'value': 'single'},
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
            let val = i.toString();
            result.push( {label: val, value: val} );
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
}