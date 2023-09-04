
var block = document.getElementById("block");
var count = 1;
var target = 300000;
var blockNumber;
var progressLine = document.getElementById("filled");

function createBlock(text) {
    var newBlock = block.cloneNode(true)
    newBlock.children[1].textContent = text
    var name = "block" + count++
    window[name] = newBlock
    document.body.append(window[name])
};

function run(text) {

    if (window["block" + (count - 1)]) {
        window["block" + (count - 1)].classList.add("right");
    }

    createBlock(text)

    setTimeout(function () {
        window["block" + (count - 1)].classList.add("center");
        window["block" + (count - 1)].children[0].classList.add("swinging")
    }, 10)

    if (window["block" + (count - 3)]) {
        document.body.removeChild(window["block" + (count - 3)])
    }
};

function formateNumber(number) {
    var text = number.toString()
    if (text.length > 3) {
        text = text.split("");
        text.splice(-3, 0, " ");
        text = text.join("");
    }
    return text
};

setInterval(function () {
    // Виклик віддаленого методу за допомогою JSON-RPC
    function callRemoteMethod(methodName, params) {
        const url = 'https://rpc-0.gemini-3f.subspace.network/ws'; // Замініть на відповідний URL
        const requestObject = {
            jsonrpc: '2.0',
            method: methodName,
            params: params,
            id: 1 // Ідентифікатор запиту
        };

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestObject)
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.error.message);
                }
                return data.result;
            });
    }

    // Приклад виклику віддаленого методу
    callRemoteMethod('chain_getHeader')
        .then(result => {
            var blockInfo = parseInt(result.number, 16);

            if (blockNumber != blockInfo) run(formateNumber(target - blockInfo))
            blockNumber = blockInfo
            progress()

        })
        .catch(error => {
            console.error('Помилка:', error);
        });

}, 500)

//=========================================================================================================================================================

function progress() {
    var value = blockNumber / (target / 100);
    progressLine.style.right = (100 - value) + "%";
};



