const imageInput = document.getElementById('imageInput');
const previewContainer = document.getElementById('previewContainer');
const applyButton = document.getElementById('applyButton');
const presetSelect = document.getElementById('preset');

const controls = [
    'brightness', 'contrast', 'saturate', 'grayscale', 'sepia',
    'hue', 'blur', 'invert', 'opacity', 'temperature'
];
const inputs = {};
controls.forEach(id => {
    inputs[id] = document.getElementById(id);
});

const presets = {
    vintage: {
        brightness: 120, contrast: 110, saturate: 140,
        grayscale: 20, sepia: 30, hue: 0, blur: 0,
        invert: 0, opacity: 100, temperature: 20
    },
    lomo: {
        brightness: 110, contrast: 90, saturate: 130,
        grayscale: 0, sepia: 0, hue: 0, blur: 1,
        invert: 0, opacity: 100, temperature: 0
    },
    clarity: {
        brightness: 105, contrast: 110, saturate: 105,
        grayscale: 0, sepia: 0, hue: 0, blur: 0,
        invert: 0, opacity: 100, temperature: 0
    },
    warm: {
        brightness: 105, contrast: 105, saturate: 120,
        grayscale: 0, sepia: 10, hue: 0, blur: 0,
        invert: 0, opacity: 100, temperature: 40
    },
    cool: {
        brightness: 100, contrast: 110, saturate: 100,
        grayscale: 0, sepia: 0, hue: 0, blur: 0,
        invert: 0, opacity: 100, temperature: -40
    }
};

function getFilter() {
    return `brightness(${inputs.brightness.value}% ) ` +
           `contrast(${inputs.contrast.value}% ) ` +
           `saturate(${inputs.saturate.value}% ) ` +
           `grayscale(${inputs.grayscale.value}% ) ` +
           `sepia(${inputs.sepia.value}% ) ` +
           `hue-rotate(${inputs.hue.value}deg) ` +
           `blur(${inputs.blur.value}px) ` +
           `invert(${inputs.invert.value}% ) ` +
           `opacity(${inputs.opacity.value}% )`;
}

function applyFilterAndRender(file, filter, temperature) {
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

            if (temperature !== 0) {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                const rOff = temperature > 0 ? temperature : 0;
                const bOff = temperature < 0 ? -temperature : 0;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = Math.min(255, Math.max(0, data[i] + rOff));
                    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + bOff));
                }
                ctx.putImageData(imgData, 0, 0);
            }

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
    const tempValue = parseInt(inputs.temperature.value, 10) || 0;
    files.forEach(file => applyFilterAndRender(file, filterValue, tempValue));
}

imageInput.addEventListener('change', applyFilters);
applyButton.addEventListener('click', applyFilters);

controls.forEach(id => {
    inputs[id].addEventListener('input', () => {
        document.getElementById(id + 'Val').textContent = inputs[id].value;
        applyFilters();
    });
});

function loadPreset(name) {
    const preset = presets[name];
    if (!preset) return;
    controls.forEach(id => {
        inputs[id].value = preset[id];
        document.getElementById(id + 'Val').textContent = preset[id];
    });
    applyFilters();
}

presetSelect.addEventListener('change', () => {
    if (presetSelect.value === 'custom') return;
    loadPreset(presetSelect.value);
});

document.addEventListener('DOMContentLoaded', () => {
    if (window.M && M.FormSelect) {
        M.FormSelect.init(presetSelect);
    }
});
