const imageInput = document.getElementById('imageInput');
const filterSelect = document.getElementById('filterSelect');
const previewContainer = document.getElementById('previewContainer');

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

imageInput.addEventListener('change', () => {
    previewContainer.innerHTML = '';
    const files = Array.from(imageInput.files);
    const filterValue = filterSelect.value;
    files.forEach(file => applyFilterAndRender(file, filterValue));
});

filterSelect.addEventListener('change', () => {
    if (imageInput.files.length > 0) {
        // Reapply filter to existing images
        const files = Array.from(imageInput.files);
        previewContainer.innerHTML = '';
        const filterValue = filterSelect.value;
        files.forEach(file => applyFilterAndRender(file, filterValue));
    }
});
