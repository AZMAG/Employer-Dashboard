//hide ExcelExport on IE
$(".fa-file-excel").show();
hidedownloadicon();
function hidedownloadicon(){
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
        // console.log(isIE);
        // console.log(isEdge);
        if (isIE===true||isEdge===true){
            $(".fa-file-excel").hide();
        }
        else {}
};