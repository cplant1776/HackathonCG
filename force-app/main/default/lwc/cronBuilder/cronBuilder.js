import { LightningElement } from 'lwc';

export default class CronBuilder extends LightningElement {

    selectedFrequency = 'weekly';
    selectedDaysOfWeek;
    selectedDayOfMonth = 1;

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
            {'label': 'Sunday', 'value': 'sunday'},
            {'label': 'Monday', 'value': 'monday'},
            {'label': 'Tuesday', 'value': 'tuesday'},
            {'label': 'Wednesday', 'value': 'wednesday'},
            {'label': 'Thursday', 'value': 'thursday'},
            {'label': 'Friday', 'value': 'friday'},
            {'label': 'Saturday', 'value': 'saturday'},
        ];
    }

    get monthlySelectorOptions() {
        let result = [];
        for(i=1; i <= 31; i++) {
            result.push( {'label': i, 'value': i} );
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
    }

    handleMonthlySelectorChange(event) {
        this.selectedDayOfMonth = event.detail.value;
    }
}