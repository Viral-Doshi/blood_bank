function save_doc(file_name){
    var download_able = document.getElementById('download-able');
  domtoimage.toBlob(download_able)
    .then(function(blob,options) {
      window.saveAs(blob, file_name);
    });
}
