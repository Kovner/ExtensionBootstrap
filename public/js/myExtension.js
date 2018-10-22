$(document).ready( () => {
    //Initialize the Extension. 
    // and define a function to be called when user selects 'Configure' from the
    // Extension zone dropdown menu
    tableau.extensions.initializeAsync({configure: configure})
    // This callback function will be called after the Extension renders
    .then( () => {
        console.log("Extension has been initialized");
        
        // Query the settings API and display the saved value
        const mySetting = tableau.extensions.settings.get('mySetting');
        $("#currentSetting > p").remove();
        $("#currentSetting").append(`<p>${mySetting}</p>`);

        // The Dashboard object is the most common entry point into the API
        let dashboard = tableau.extensions.dashboardContent.dashboard;

        // Query the name of each worksheet and append it to the DOM
        for(let worksheet of dashboard.worksheets) {
            $('#worksheetsList').append(`<p>${worksheet.name}</p>`);
        }

        // Asynchronously Query all of the worksheets for all of their filters.
        let filterPromises = [];
        for(let worksheet of dashboard.worksheets) {
            filterPromises.push(worksheet.getFiltersAsync());
        }
        Promise.all(filterPromises).then( (filterArrays) => {
            // Each worksheets's promise will pass an Array of filters, 
            //    so filterArrays is an array of arrays.
            let filters = [].concat(...filterArrays);
            // Add the name of each filter to the DOM
            for(let filter of filters) {
                $('#filterList').append(`<p>${filter.fieldName}</p>`);
            }
        });
    });
});

function configure() {
    tableau.extensions.ui
    .displayDialogAsync(`${window.location.origin}/configure.html`, null, {
        height: 130,
        width: 220
    })
    .then(closePayload => {
        console.log(`New setting: ${closePayload}`);
        // Extensions can persist data in the twb to save configuration settings
        tableau.extensions.settings.set(
            'mySetting',
            closePayload
        );
        tableau.extensions.settings.saveAsync();
        $("#currentSetting > p").remove();
        $("#currentSetting").append(`<p>${closePayload}</p>`);
    })
    .catch(error => {
        switch (error.errorCode) {
        case window.tableau.ErrorCodes.DialogClosedByUser:
            // This error is passed if the user manually closes the dialog
            console.log('Config Dialog was closed by user.');
            break;
        default:
            console.error(error.message);
        }
    });
}