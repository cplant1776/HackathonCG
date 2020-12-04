import { LightningElement } from 'lwc';

export default class PauseModal extends LightningElement {

    handleCloseModal() {
        console.log('PauseModal :: handleCloseModal');
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    handleConfirmPause() {
        console.log('PauseModal :: handleSubmitNewJob');
        this.dispatchEvent(new CustomEvent('confirm'));
    }
}