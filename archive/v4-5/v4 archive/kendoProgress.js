// TESTING LOADING SPINNER
$(function(){

    kendo.ui.progress.messages = {
        loading: "Refreshing data..."
    };

    function displayLoading(target) {
        var element = $(target);
        kendo.ui.progress(element, true);
        setTimeout(function(){
            kendo.ui.progress(element, false);
        }, 000);        
    }

    // $(".overviewreset").click(function(){
    //     displayLoading(".section-wrapper");
    // });
    $(".overviewreset").click(function(){
        displayLoading("#top20grid");
        displayLoading("#clusterchart");
        displayLoading("#keyindchart");
    });

    $(".fdireset").click(function(){
        displayLoading("#fdiChart");
        displayLoading("#fdiGrid");
        displayLoading("#fdiparentGrid");
        displayLoading("#clusterchartfdi");
        displayLoading("#keyindchartfdi");
    });

});