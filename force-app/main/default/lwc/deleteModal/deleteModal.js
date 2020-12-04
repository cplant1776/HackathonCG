import { LightningElement } from 'lwc';

export default class DeleteModal extends LightningElement {

    handleCloseModal() {
        console.log('DeleteModal :: handleCloseModal');
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    handleConfirmDelete() {
        console.log('DeleteModal :: handleSubmitNewJob');
        this.dispatchEvent(new CustomEvent('confirm'));
    }
}