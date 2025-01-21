export function getFileCoverType(fileType) {
    let coverLink;

    if(fileType === "image/jpeg" || fileType === "image/png" || fileType === "image/.gif" || fileType === "image/.svg" || fileType === "image/.jpeg") {
        return coverLink = `assert/file-covers/image.png`

    } else if (fileType === "application/pdf") {
        return coverLink = `assert/file-covers/pdf.png`
    } else if (fileType === "text/plain") {
       return coverLink = `assert/file-covers/text-file.jpg`
    } else if (fileType === "application/zip" || fileType === "application/application/gzip" || fileType === "application/application/x-tar") {
      return coverLink = `assert/file-covers/zip-file.jpg`
    } else {
       return coverLink = `assert/file-covers/document.jpg`
    }

}