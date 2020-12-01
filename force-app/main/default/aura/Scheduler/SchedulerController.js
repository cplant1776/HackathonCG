({

    init: function(cmp, event, helper) {
        helper.setColumns(cmp);
        //helper.setData(cmp);
    },

    handleSort: function(cmp, event, helper) {
        helper.handleSort(cmp, event);
    }
});