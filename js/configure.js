$(document).ready( () => {
    tableau.extensions.initializeDialogAsync().then(payload => {
        console.log(payload);
        // Render the TableauUI React components into our empty divs.
        const textFieldProps = {
            label: 'Setting',
            style: { width: 140 },
            styleType: 'line',
            placeholder: 'Type Anything'
        }
        ReactDOM.render(
            React.createElement(TableauUI.TextField, textFieldProps),
            document.getElementById('configTextBox')
          )
        ReactDOM.render(
            React.createElement(TableauUI.Button, 
                {buttonType: 'filledGreen', onClick: submit}, 
                "Save Setting"
            ), 
            document.getElementById('saveButton')
        );
    });
});

// Get the value of the text box and pass it back to
//    the parent Extension while closing the dialog.
function submit() {
    // Because the React component renders inside the configTextBox div
    //     we use jquery to find the value which is a couple of DOM-levels
    //     deeper
    let configTextBox = $('#configTextBox')[0];
    let inputBox = $(configTextBox).find('input')[0];
    let newSetting = inputBox.value;
    // One option is to save to the settings API here and to query it
    //   from the parent Extension, but instead we pass the string
    //   back to the parent Extension and save it to the settings api there
    tableau.extensions.ui.closeDialog(newSetting);
}