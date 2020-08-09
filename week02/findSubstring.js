// find 'abcdef' from a string
// without state machine
function findSubstring(str) {
    let step = 0;
    for (let c of str) {
        if (c === 'a') {
            step = 1;
        } else if (step === 1 && c === 'b') {
            step = 2;
        } else if (step === 2 && c === 'c') {
            step = 3;
        } else if (step === 3 && c === 'd') {
            step = 4;
        } else if (step === 4 && c === 'e') {
            step = 5;
        } else if (step === 5 && c === 'f') {
            return true;
        } else {
            step = 0;
        }
    }
    return false;
}

// with state machine
function findSubstringStateMachine(str) {
    let state = start;
    for (let c of str) {
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if (c === 'a')
        return foundA;
    else
        return start;
}

function foundA(c) {
    if (c === 'b')
        return foundB;
    else
        return start(c);
}

function foundB(c) {
    if (c === 'c')
        return foundC;
    else
        return start(c);
}

function foundC(c) {
    if (c === 'd')
        return foundD;
    else
        return start(c);
}

function foundD(c) {
    if (c === 'e')
        return foundE;
    else
        return start(c);
}

function foundE(c) {
    if (c === 'f')
        return end;
    else
        return start(c);
}

function end(c) {
    return end;
}

console.log(findSubstringStateMachine("abccdefg"))