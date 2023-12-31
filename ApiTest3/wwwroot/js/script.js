const compileButton = document.querySelector('#btn_compile');
const inputInput = document.querySelector('#input_input');
const codeInput = document.querySelector('#code_input');
const codeNotesContainer = document.querySelector('#code__container');
const defaultCode = codeInput.textContent;
var id = 0


function clearForm() {
    inputInput.value = '';
    codeInput.value = defaultCode;
}

function displayCodeNoteInForm(codeNote) {
    
    const children = codeNote.children;
    /*
    console.log(`codeNote: ${codeNote}`);
    console.log(`codeNote.textContent: ${codeNote.textContent}`);
    console.log('children: ' + children)
    console.log('children[1]: ' + children[1])
    console.log('children[1].textContent: ' + children[1].textContent)
    */
   const input = children[1].textContent
   const code = children[3].textContent
   inputInput.value = input
   codeInput.value = code

}

function getNodeById(id) {
    fetch(`api/codeNotes/${id}`)
        .then(data => data.json())
        .then(response => displayCodeNoteInForm(response));
}

function populateForm(id) {
    getNodeById(id)
}

function compile(input, code) {

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

function displayCodeNote(codeNote) {

    const isMainLefting = JSON.stringify(codeNote.value).indexOf('Missing Main(string[] args) method') > -1 ? true : false

    if (isMainLefting){
        alert(codeNote.value);
        return;
    }

    let output = (codeNote.value.output != null && codeNote.value.output != '') ? codeNote.value.output : codeNote.value.error;

    let allCodeNotes = codeNotesContainer.innerHTML;



    //depois fazer esse data-id usar o id da codeNote a aver cm aquilo la da database por js
    const codeNoteElement = `
                                <div class="codeNote" data-id="">
                                    <label for="code_input">Input:</label>
                                    <h3 id="code_input">${codeNote.value.input}</h3>
                                    <label for="code_code">Code:</label>
                                    <p id="code_code">${codeNote.value.code}</p>
                                    <label for="code_output">Output:</label>
                                    <h4 id="code_output">${output}</h4>
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
            displayCodeNoteInForm(codeNote);
            //alert('WIP feature.');
        });
    });
}


compileButton.addEventListener('click', function () {
    compile(inputInput.value, codeInput.value);
});