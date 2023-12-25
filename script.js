document.addEventListener('DOMContentLoaded', function() {
    var rangeInput = document.getElementById('volumeSlider');
    var rangeValue = document.getElementById('rangeValue');

    if (rangeInput && rangeValue) {
        rangeInput.addEventListener('input', function() {
            rangeValue.innerText = this.value;
        });
    } else {
        console.error('Elements not found');
    }
});