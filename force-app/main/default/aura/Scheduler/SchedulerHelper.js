({
    COLUMNS: [
        { label: 'Submitted Date', fieldName: 'Submitted Date' ,sortable: true, },
        {
            label: 'Job Type',
            fieldName: 'Job Type',
            sortable: true,
        },
        { label: 'Status', fieldName: 'Status'},
        { label: 'Status Detail', fieldName: 'Status Detail'},
        { label: 'Total Batches', fieldName: 'Total Batches'},
        { label: 'Batches Processed', fieldName: 'Batches Processed'},
        { label: 'Failures', fieldName: 'Failures'},
        { label: 'Submitted By', fieldName: 'Submitted By'},
        { label: 'Apex Class', fieldName: 'Completion Date'},
        { label: 'Apex Method', fieldName: 'Completion Date'},
         { label: 'Apex Job ID', fieldName: 'Completion Date'},
         { label: 'Pasue', fieldName: 'Completion Date'},
         { label: 'Resume', fieldName: 'Completion Date'},
        { label: 'Delete', fieldName: 'Completion Date'},
    ],
    			
    
    
    setColumns: function(cmp) {
        cmp.set('v.columns', this.COLUMNS);
    },


    // Used to sort the 'Age' column
    sortBy: function(field, reverse, primer) {
        var key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    },

    handleSort: function(cmp, event) {
        var sortedBy = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');

        var cloneData = this.DATA.slice(0);
        cloneData.sort((this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1)));
        
        cmp.set('v.data', cloneData);
        cmp.set('v.sortDirection', sortDirection);
        cmp.set('v.sortedBy', sortedBy);
    }
})