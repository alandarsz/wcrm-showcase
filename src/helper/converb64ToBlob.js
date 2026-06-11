export function converBase64toBlob(content, contentType, nameFile) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = window.atob(content); //method which converts base64 to binary
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {
        type: contentType,
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);

    link.setAttribute('download', `${nameFile}.${contentType}`);
    document.body.appendChild(link);
    link.click();
}
