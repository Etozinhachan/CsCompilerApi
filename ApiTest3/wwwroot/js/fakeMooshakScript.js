const compileButton = document.querySelector('#btn_compile')
const inputInput = document.querySelector('#input_input');
const codeInput = document.querySelector('#code_input');
const expectedOutputInput = document.querySelector('#expectedOutput_input')

function clearForm() {
    inputInput.value = '';
    codeInput.value = '';
    expectedOutputInput.value = '';
}

function compile(input, code, expectedOutput){

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
        test(response, expectedOutput);
    });

}

function test(response, expectedOutput) {

    console.log(response);

    let output = (response.value.output != null && response.value.output != '') ? response.value.output : response.value.error;

    output = output.replace("\r\n", "");
    expectedOutput = expectedOutput.replace("\r\n", "");
    if (output.indexOf("error CS") > -1) {
        alert("Programa não compilou :c");
        return;
    }

    if (!(output.indexOf(expectedOutput) > -1)) {
        alert("Programa compilou mas o resultado foi errado :c");
        return;
    }

    alert("Programa compilou com o resultado certo : )");
}

compileButton.addEventListener('click', function () {
    compile(inputInput.value, codeInput.value, expectedOutputInput.value);
});