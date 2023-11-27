const compileButton = document.querySelector('#btn_compile');
const inputInput = document.querySelector('#input_input');
const codeInput = document.querySelector('#code_input');
const codeNotesContainer = document.querySelector('#code__container');

function clearForm(){
    inputInput.value = '';
    codeInput.value = '';
}

function displayCodeNoteInForm(codeNote) {
    inputInput.value = codeNote.value.input;
    codeInput.value = codeNote.value.code;
}

function getNodeById(id){
    fetch(`api/codeNotes/${id}`)
        .then(data => data.json())
        .then(response => displayCodeNoteInForm(response));
}

function populateForm(id) {
    getNodeById(id)
}

function compile(input, code){

    const body = {
        input: input,
        code: code
    };

    fetch('/api/Test/CompileCode', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            "content-type": "application/json"
        }
    })
    .then(data => data.json())
    .then(response => {
        clearForm();
        displayCodeNote(response);
    });
}

function displayCodeNote(codeNote){
    
    
    let allCodeNotes = codeNotesContainer.innerHTML;

    

    //depois fazer esse data-id usar o id da codeNote a aver cm aquilo la da database por js
    const codeNoteElement = `
                                <div class="codeNote" data-id="">
                                    <h3>Input: ${codeNote.value.input}</h3>
                                    <p>Code: ${codeNote.value.code}</p>
                                    <h4>Output: ${codeNote.value.output}</h4>
                                </div>
                            `;
    if (allCodeNotes.indexOf(codeNoteElement) > -1) {
        alert("That code note already exists, try adding a code note that doesn't exist yet");
        return;
    }
                            
    allCodeNotes += codeNoteElement;
    
    codeNotesContainer.innerHTML = allCodeNotes;

    // add event listeners
    document.querySelectorAll('.codeNote').forEach(codeNote => {
        codeNote.addEventListener('click', function () {
            //populateForm(codeNote.dataset.id)
            // displayCodeNoteInForm(codeNote);
            alert('WIP feature.');
        });
    });
}


compileButton.addEventListener('click', function(){
    compile(inputInput.value, codeInput.value);
});