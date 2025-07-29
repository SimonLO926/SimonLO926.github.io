const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const applyButton = document.getElementById('applyButton');

const controls = ['brightness', 'contrast', 'saturate', 'grayscale', 'sepia', 'hue', 'blur'];
const inputs = {};
controls.forEach(id => {
    inputs[id] = document.getElementById(id);
});

function getFilter() {
    return `brightness(${inputs.brightness.value}% ) ` +
           `contrast(${inputs.contrast.value}% ) ` +
           `saturate(${inputs.saturate.value}% ) ` +
           `grayscale(${inputs.grayscale.value}% ) ` +
           `sepia(${inputs.sepia.value}% ) ` +
           `hue-rotate(${inputs.hue.value}deg) ` +
           `blur(${inputs.blur.value}px)`;
}

function applyFilterAndRender(file, filter) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.filter = filter;
            ctx.drawImage(img, 0, 0);

            const preview = document.createElement('div');
            preview.className = 'preview';
            preview.appendChild(canvas);

            const link = document.createElement('a');
            link.textContent = 'Download';
            link.download = file.name;
            link.href = canvas.toDataURL('image/png');
            preview.appendChild(link);

            previewContainer.appendChild(preview);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function applyFilters() {
    previewContainer.innerHTML = '';
    const files = Array.from(imageInput.files);
    const filterValue = getFilter();
    files.forEach(file => applyFilterAndRender(file, filterValue));
}

imageInput.addEventListener('change', applyFilters);
applyButton.addEventListener('click', applyFilters);

controls.forEach(id => {
    inputs[id].addEventListener('input', () => {
        document.getElementById(id + 'Val').textContent = inputs[id].value;
    });
});
