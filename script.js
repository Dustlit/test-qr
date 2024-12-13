document.getElementById('scanButton').addEventListener('click', scanQRCode);

function scanQRCode() {
    const qrInput = document.getElementById('qrInput').files[0];
    if (!qrInput) {
        alert("Please select an image containing a QR code.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const image = new Image();
        image.src = event.target.result;
        image.onload = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            // Decode the QR code using jsQR
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

            if (qrCode) {
                document.getElementById('output').textContent = `Decoded QR Code: ${qrCode.data}`;

                // Redirect to GPay if the QR code is a UPI payment link
                if (qrCode.data.startsWith('upi://pay')) {
                    window.location.href = qrCode.data;
                } else {
                    alert("This QR code is not a valid UPI link.");
                }
            } else {
                alert("No QR code detected in the image.");
            }
        };
    };

    reader.readAsDataURL(qrInput);
}
