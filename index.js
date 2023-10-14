let array = [];
let bars = [];
let animationSpeed = 100;
let sorting = false;
let stopSorting = false;

const arrayContainer = document.querySelector('.array__container');
const algorithm = document.querySelector('.sorting-algorithm');
const startButtonElement = document.querySelector('.startButton');
const stopButtonElement = document.querySelector('.stopButton');

startButtonElement.addEventListener('click', async function () {
    stopSorting = false;
    sorting = true;
    startButtonElement.disabled = true;
    stopButtonElement.textContent = 'Стоп';
    stopButtonElement.disabled = false;

    const size = parseInt(document.querySelector('.array__size').value);
    generateArray(size);
    createBars();
    await startSorting(algorithm.value);
});

stopButtonElement.addEventListener('click', async function () {
    if (!stopSorting) {
        stopSorting = true;
        stopButtonElement.textContent = 'Продолжить';
    } else {
        stopSorting = false;
        startButtonElement.disabled = true;
        stopButtonElement.textContent = 'Стоп';
        await startSorting(algorithm.value);
    }

});

async function startSorting(sortName) {
    switch (sortName) {
        case 'bubbleSort':
            await bubbleSort();
            break;
        case 'selectionSort':
            await selectionSort();
            break;
        case 'insertionSort':
            await insertionSort();
            break;
        case 'mergeSort':
            await mergeSort(0, array.length - 1);
            break;
        case 'quickSort':
            await quickSort(0, array.length - 1);
            break;
    }
    startButtonElement.disabled = false;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 100) + 1);
    }
}

function createBars() {
    arrayContainer.innerHTML = '';
    bars = [];
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${array[i] * 3}px`;
        arrayContainer.appendChild(bar);
        bars.push(bar);
    }
}

function updateBars() {
    for (let i = 0; i < array.length; i++) {
        bars[i].style.height = `${array[i] * 3}px`;
    }
}

function swap(index1, index2) {
    const temp = array[index1];
    array[index1] = array[index2];
    array[index2] = temp;
}

async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            if (stopSorting) {
                return;
            }

            bars[j].classList.add('comparing1');
            bars[j + 1].classList.add('comparing1');

            if (array[j] > array[j + 1]) {
                swap(j, j + 1);
                updateBars();
                await sleep(animationSpeed);
            }

            bars[j].classList.remove('comparing1');
            bars[j + 1].classList.remove('comparing1');
        }
    }
}

async function selectionSort() {
    for (let i = 0; i < array.length - 1; i++) {
        let min = i;
        bars[min].classList.add('comparing1');

        for (let j = i + 1; j < array.length; j++) {
            if (stopSorting) {
                return;
            }

            bars[j].classList.add('comparing1');

            if (array[j] < array[min]) {
                if (min !== i) bars[min].classList.remove('comparing1');

                min = j;
            } else bars[j].classList.remove('comparing1');
        }

        if (min !== i) {
            swap(i, min);
            updateBars();
            await sleep(animationSpeed);
        }

        bars[i].classList.remove('comparing1');
    }

    bars[array.length - 1].classList.remove('comparing1');
}

async function insertionSort() {
    const len = array.length;
    for (let i = 1; i < len; i++) {
        let key = array[i];
        let j = i - 1;

        bars[i].classList.add('comparing1');

        while (j >= 0 && array[j] > key) {
            if (stopSorting) {
                return;
            }

            bars[j].classList.add('comparing1');

            array[j + 1] = array[j];
            updateBars();
            await sleep(animationSpeed);

            bars[j + 1].classList.remove('comparing1');
            j = j - 1;
        }

        bars[j + 1].classList.remove('comparing1');

        array[j + 1] = key;
        updateBars();
        await sleep(animationSpeed);
    }
}

function mergeSort(start, end) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        return mergeSort(start, mid)
            .then(() => mergeSort(mid + 1, end))
            .then(() => merge(start, mid, end));
    }
    return Promise.resolve();
}

async function merge(start, mid, end) {
    const leftSize = mid - start + 1;
    const rightSize = end - mid;
    const leftArray = new Array(leftSize);
    const rightArray = new Array(rightSize);

    for (let i = 0; i < leftSize; i++) {
        if (stopSorting) {
            return;
        }

        leftArray[i] = array[start + i];
        bars[start + i].classList.add('comparing1');
    }

    for (let i = 0; i < rightSize; i++) {
        if (stopSorting) {
            return;
        }

        rightArray[i] = array[mid + 1 + i];
        bars[mid + 1 + i].classList.add('comparing2');
    }

    let i = 0,
        j = 0,
        k = start;

    while (i < leftSize && j < rightSize) {
        if (stopSorting) {
            return;
        }

        if (leftArray[i] <= rightArray[j]) {
            array[k++] = leftArray[i++];
        } else {
            array[k++] = rightArray[j++];
        }
        updateBars();
        await sleep(animationSpeed);
    }

    while (i < leftSize) {
        if (stopSorting) {
            return;
        }

        array[k++] = leftArray[i++];
        updateBars();
        await sleep(animationSpeed);
    }

    while (j < rightSize) {
        if (stopSorting) {
            return;
        }

        array[k++] = rightArray[j++];
        updateBars();
        await sleep(animationSpeed);
    }

    for (let i = start; i <= end; i++) {
        bars[i].classList.remove('comparing1', 'comparing2');
    }
}

async function quickSort(start, end) {
    if (start < end) {
        const pivotIndex = await partition(start, end);
        await quickSort(start, pivotIndex - 1);
        await quickSort(pivotIndex + 1, end);
    }
}

async function partition(start, end) {
    for (let i = 0; i < array.length; i++) {
        bars[i].classList.remove('comparing1', 'comparing2');
    }
    const pivotValue = array[end];
    let pivotIndex = start;
    for (let i = start; i < end; i++) {
        if (stopSorting) {
            return;
        }

        bars[pivotIndex].classList.add('comparing1');
        bars[i].classList.add('comparing2');
        updateBars()
        await sleep(animationSpeed);

        if (array[i] < pivotValue) {
            swap(i, pivotIndex);
            bars[pivotIndex].classList.remove('comparing1', 'comparing2');
            pivotIndex++;
            updateBars();
        }
        bars[pivotIndex].classList.remove('comparing1', 'comparing2');
        bars[i].classList.remove('comparing1', 'comparing2');
    }
    swap(pivotIndex, end);
    updateBars();

    return pivotIndex;
}