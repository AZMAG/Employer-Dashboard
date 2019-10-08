var global=this;
var indextest=0;
var GeographyList;
var dataclusters;
var fdiChartHeight=735;
var datagrid20cluster;
var datagrid20all;
var datagrid20ki;
var toggleClick=1;
var toggleClickfdi=1;
var dsfdi;
$(".srcyr").html("2018");

$(document).ready(function () {
    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        },
        scrollable: true,
        tabPosition: "top",
        select: function(e){
            indextest=$("#tabstrip").data("kendoTabStrip").select().index(); //console.log(indextest);
            refreshlist();
        }
    });
    indextest=$("#tabstrip").data("kendoTabStrip").select().index(); //console.log(indextest);

$(window).on("resize", function () {
    kendo.resize($(".container"));
});

var fdiquery="(County='Pinal' OR County='Maricopa') AND International=1";
var overviewquery="(County='Pinal' OR County='Maricopa') AND Employees > 4";
$(".overviewreset").hide();

var GeographyListOverview=[
    {Geography: "Phoenix MSA"},
    {Geography:"Maricopa County"},
    {Geography:"Pinal County"},
    {Geography: "Apache Junction"},
    {Geography: "Avondale"},
    {Geography: "Buckeye"},
    {Geography: "Carefree"},
    {Geography: "Cave Creek"},
    {Geography: "Chandler"},
    {Geography: "El Mirage"},
    {Geography: "Florence"},
    {Geography: "Fountain Hills"},
    {Geography: "Gila Bend"},
    {Geography: "Gilbert"},
    {Geography: "Glendale"},
    {Geography: "Goodyear"},
    {Geography: "Guadalupe"},
    {Geography: "Litchfield Park"},
    {Geography: "Maricopa (City)"},
    {Geography: "Mesa"},
    {Geography: "Paradise Valley"},
    {Geography: "Peoria"},
    {Geography: "Phoenix"},
    {Geography: "Queen Creek"},
    {Geography: "Scottsdale"},
    {Geography: "Surprise"},
    {Geography: "Tempe"},
    {Geography: "Tolleson"},
    {Geography: "Wickenburg"},
    {Geography: "Youngtown"},
];

var GeographyListFDI=[
    {Geography: "Arizona"},
    {Geography: "Phoenix MSA"},
    {Geography:"Maricopa County"},
    {Geography:"Pinal County"},
    {Geography: "Apache Junction"},
    {Geography: "Avondale"},
    {Geography: "Buckeye"},
    {Geography: "Carefree"},
    {Geography: "Cave Creek"},
    {Geography: "Chandler"},
    {Geography: "El Mirage"},
    {Geography: "Florence"},
    {Geography: "Fountain Hills"},
    {Geography: "Gila Bend"},
    {Geography: "Gilbert"},
    {Geography: "Glendale"},
    {Geography: "Goodyear"},
    {Geography: "Guadalupe"},
    {Geography: "Litchfield Park"},
    {Geography: "Maricopa (City)"},
    {Geography: "Mesa"},
    {Geography: "Paradise Valley"},
    {Geography: "Peoria"},
    {Geography: "Phoenix"},
    {Geography: "Queen Creek"},
    {Geography: "Scottsdale"},
    {Geography: "Surprise"},
    {Geography: "Tempe"},
    {Geography: "Tolleson"},
    {Geography: "Wickenburg"},
    {Geography: "Youngtown"},
];

function refreshlist(){
    if (indextest==0){
        //console.log("FDI TAB SELECTED");
        GeographyList=GeographyListFDI;
        dropdown();
    }
    else if (indextest==1){
        //console.log("OVERVIEW TAB SELECTED");
        GeographyList=GeographyListOverview;
        dropdown();
    }
}

GeographyList=GeographyListOverview;
dropdown();

var geoselected="Phoenix MSA";

function dropdown(){
    $("#geography").kendoDropDownList({
        filter:"startswith",
        dataSource: GeographyList,
        dataTextField: "Geography",
        dataValueField: "Geography",
        value: geoselected,
        select: function (e) {
            var item = e.dataItem.Geography;
            $(".selectedgeographyFDI").html(e.dataItem.Geography);
            $(".selectedgeography").html(e.dataItem.Geography);
            geoselected=e.dataItem.Geography;

            //FDI CHART HEIGHT
            if (item=='Maricopa County'||item=='Phoenix MSA'||item=='Arizona'||item=='Phoenix'){fdiChartHeight=735;}
            else if (item =='Carefree'||item=='Cave Creek'||item=='Guadalupe'||item=='Youngtown'){fdiChartHeight=450;}
            else if (item=='Paradise Valley'){fdiChartHeight=250;}
            else if (item=='El Mirage'||item=='Florence'||item=='Gila Bend'||item=='Litchfield Park'){fdiChartHeight=550;}
            else{fdiChartHeight=700;}

            //Geography Filter
            if (item=='Maricopa County'){
                fdiquery="(County='Maricopa') AND International=1";
                overviewquery="(County='Maricopa') AND Employees > 4";
            }
            else if (item=='Arizona'){
                fdiquery="International=1";
                overviewquery="(County='Pinal'or County='Maricopa') AND Employees > 4"; //overview: MSA
                $(".selectedgeography").html("Phoenix MSA");
            }
            else if (item=='Pinal County'){
                fdiquery="(County='Pinal') AND International=1";
                overviewquery="(County='Pinal') AND Employees > 4";
            }
            else if (item=='Phoenix MSA'){
                fdiquery="(County='Pinal' or County='Maricopa') AND International=1";
                overviewquery="(County='Pinal'or County='Maricopa') AND Employees > 4";
            }
            else if (item=='Maricopa (City)'){
                fdiquery="(Jurisdiction='Maricopa') AND International=1";
                overviewquery="(Jurisdiction='Maricopa') AND Employees > 4";
            }
            else{
                fdiquery="Jurisdiction='"+item+"' and International=1";
                overviewquery="Jurisdiction='"+item+"' AND Employees > 4";
            }

            //add "the" for MSA
            if (item=='Phoenix MSA'){
                $(".addthe").html("the ");
            }
            else{
                $(".addthe").html("");
            }

            //actions for all (this used to be in individual geography filters)
            $(".filteredKI").html("");
            $(".filteredCluster").html("");
            $(".filteredsimple").html("");
            $(".overviewreset").hide();
            $(".filternoteCluster").show();
            $(".filternoteKI").show();
            $(".filteredcategoryFDI").html("");
            $(".filteredsimplefdi").html("");
            toggleClick=1;
            toggleClickfdi=1;
            makedashboard();
        }
    });
}
    
    $(".selectedgeography").html("Phoenix MSA");
    $(".selectedgeographyFDI").html("Phoenix MSA"); //default MSA selected
    $(".addthe").html("the ");

    var empUrl="https://geo.azmag.gov/arcgis/rest/services/maps/StateEmploymentDashboard2018/MapServer/0";
    
    function GetDataGroupedByFields(data, flds) {
        var obj = {};
        var templateObj = {};

        flds.forEach(function (fld) {
            templateObj[fld] = "";
        });

        data.forEach(function (row) {

            var fldKey = "";

            flds.forEach(function (fld) {
                fldKey += row[fld];
            });

            var Employees = row['Employees'];

            //Get current data obj. //If blank, fill with a copy of the template
            obj[fldKey] = obj[fldKey] || jQuery.extend({}, templateObj);

            flds.forEach(function (fld) {
                obj[fldKey][fld] = row[fld];
            });

            //Increment Employees
            obj[fldKey].Employees = obj[fldKey].Employees || 0;
            obj[fldKey].Employees += Employees;
        });

        return Object.keys(obj).map(function (key) {
            var rtnObj = {
                Employees: obj[key].Employees
            };

            flds.forEach(function (fld) {
                rtnObj[fld] = obj[key][fld];
            });

            return rtnObj;
        });
    }

function makedashboard(){
    fdifilterquery=fdiquery; //TESTING
    $(".fdireset").hide();
    function FDIcountrysection(){
    $(".FDIcountry").html(""); //reset filter label for FDI
    arcgisRest.queryFeatures({
        url: empUrl,
        where: fdifilterquery, //Maricopa Only
        returnGeometry: false,
        orderByFields: "Employees Desc",
        outFields: [
            "EmpName", "Cluster", "Employees", "County", "UltimateParentCountry", "International",
            "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr",
            "UltimateParentName","Jurisdiction"
        ]
    }).then(function (res) {
        var features = res.features;


        var data = features.map(function(feature) {
            return feature.attributes;
        }); //console.log(data);

        var dsfdi = new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName", "UltimateParentCountry"]),
            pageSize: 10,
            sort: {
                field: "Employees",
                dir: "desc"
            },
        });

        $("#fdiGrid").kendoGrid({
            dataSource: dsfdi,
            columns: [{
                field: "EmpName",
                title: "Employer Name",
                attributes: {
                    style: "text-align:left;"
                },
                width: "45%",
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "UltimateParentCountry",
                title: "Parent Country",
                attributes: {
                    style: "text-align:left;"
                },
                width: "35%",
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "Employees",
                title:"Jobs",
                attributes: {
                    style: "text-align:left;"
                },
                width: "15%",
                template: "#=kendo.toString(Employees,'n0')#",
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }]
        });

        var dsfdiparent = new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["UltimateParentName", "UltimateParentCountry"]),
            pageSize: 5,
            sort: {
                field: "Employees",
                dir: "desc"
            },
        });

        $("#fdiparentGrid").kendoGrid({
            dataSource: dsfdiparent,
            columns: [{
                field: "UltimateParentName",
                title: "Parent Company Name",
                attributes: {
                    style: "text-align:left;"
                },
                width: "45%",
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "UltimateParentCountry",
                title: "Parent Country",
                attributes: {
                    style: "text-align:left;"
                },
                width: "35%",
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "Employees",
                title:"Jobs",
                attributes: {
                    style: "text-align:left;"
                },
                width: "15%",
                template: "#=kendo.toString(Employees,'n0')#",
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }]
        });

        var dsfdichart=GetDataGroupedByFields(data, ["UltimateParentCountry"]);
        dsfdichart.sort(function (a, b) {
            return b.Employees - a.Employees
        });
        //console.log(datafdi);

        // TESTING TOP 20 FDI COUNTRIES
        // var dsfdichart = new kendo.data.DataSource({
        //     data: GetDataGroupedByFields(data, ["UltimateParentCountry"]),
        //     pageSize: 20,
        //     sort: {
        //         field: "Employees",
        //         dir: "desc"
        //     },
        // });
        //ENDTESTING

        function clickFDIcountrybar (e) {
            if (toggleClickfdi==1||toggleClickfdi==3){
                toggleClickfdi=3;
                $(".fdireset").show();
                $(".fdifiltertype").html("Parent Country ")
                //create new filter object
                var filter = {
                    field: "UltimateParentCountry",
                    operator: "eq",
                    value: e.category
                };
                //apply the filters
                dsfdi.filter(filter);
                dsfdiparent.filter(filter);

                var chart = $("#fdiChart").data("kendoChart");
                for(i=0; i<chart.options.series[0].data.length; i++){
                    chart.options.series[0].data[i].userColor = "#3866bf"; //darkorange
                }  
                e.dataItem.userColor = "#2FC4CD"; //#2baab1
                chart.refresh();

                //dynamic text
                var item = e.dataItem.UltimateParentCountry;
                $(".FDIcountry").html("Parent Country: " + item);

                //filter cluster FDI chart - TESTING
                var addand=" AND ";
                var test1=fdiquery +addand +"UltimateParentCountry='"+item+"'";
                fdifilterquery=test1;   
                makeFDIclusterchart(); 
                makeFDIkeyindchart();
                calculateFDItotals();
            }
            else{}
        }
        function clickFDIcountryaxis (e) {
            if (toggleClickfdi==1||toggleClickfdi==3){
                toggleClickfdi=3;
                $(".fdireset").show();
                $(".fdifiltertype").html("Parent Country ")
                //create new filter object
                var filter = {
                    field: "UltimateParentCountry",
                    operator: "eq",
                    value: e.dataItem.UltimateParentCountry //Difference between seriesClick and axisLabelClick
                };
                //apply the filters
                dsfdi.filter(filter);
                dsfdiparent.filter(filter);

                var chart = $("#fdiChart").data("kendoChart");
                for(i=0; i<chart.options.series[0].data.length; i++){
                    chart.options.series[0].data[i].userColor = "#3866bf"; //darkorange
                }  
                e.dataItem.userColor = "#2baab1";
                chart.refresh();

                //dynamic text
                var item = e.dataItem.UltimateParentCountry;
                $(".FDIcountry").html(" (" + item+")");

                //filter cluster FDI chart - TESTING
                var addand=" AND ";
                var test1=fdiquery +addand +"UltimateParentCountry='"+item+"'";
                fdifilterquery=test1;   
                makeFDIclusterchart(); 
                makeFDIkeyindchart();
                calculateFDItotals();
            }
            else{}
        }

        $("#fdiChart").kendoChart({
            theme:"Office365",
            seriesDefaults: {
                type: "bar",
            },
            dataSource: dsfdichart,
            chartArea: {
                //height: 735
                height: fdiChartHeight
            },
            seriesDefaults: {
                type: "bar",
                gap: 0.7,
            },
            series: [{
                field: "Employees",
                color: "#3866bf", //darkorange
                colorField:"userColor"
            }],
            categoryAxis:{
                field:"UltimateParentCountry",
                minorGridLines:{visible: false},
                majorGridLines:{visible: false},
                //labels:{font:"11px Open Sans, sans-serif"}
            },
            valueAxis: {
                title: {
                    text: "Jobs",
                    font: "13px Arial"
                },
                labels: {
                    rotation: "auto",
                    font: "12px Open Sans, sans-serif",
                    format: "#,#",  
                }
            },
            seriesClick: clickFDIcountrybar,
            axisLabelClick: clickFDIcountryaxis,
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br>#=kendo.toString(value,'n0')# Jobs"
            }
        });
    });
} //endmakefdicountrysection
FDIcountrysection();

$(".fdireset").click(function () { //move this outside?
    $(".fdireset").hide();
    // dsfdi.filter({});
    // dsfdiparent.filter({});
    // $("#fdiChart").data("kendoChart").setDataSource(dsfdichart);
    $(".FDIcountry").html("");
    $(".filteredcategoryFDI").html("");
    $(".filteredsimplefdi").html("");
    fdifilterquery=fdiquery;
    makeFDIclusterchart();
    makeFDIkeyindchart();
    calculateFDItotals();
    FDIcountrysection();
    toggleClickfdi=1;
});

    //TESTING ADD CLUSTER TO FDI
    fdifilterquery=fdiquery;

    function calculateFDItotals(){
        arcgisRest.queryFeatures({
            url: empUrl,
            where: fdifilterquery, //Maricopa Only and 5+ Employees
            returnGeometry: false,
            orderByFields: "Employees Desc",
            outFields: [
                "EmpName", "Cluster", "Employees", "County", "International",
                "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction","UltimateParentCountry"
            ]
        }).then(function (res) {
            var features = res.features;
            var data = features.map(function(feature) {
                return feature.attributes;
            });  //console.log(data);
            var groupbyEmpName = GetDataGroupedByFields(data, ["EmpName"]); //console.log(groupbyEmpName);
            var totalBus = groupbyEmpName.length; //console.log(totalBus);
            $("#totalbusinessesfdi").html(kendo.toString(totalBus, 'n0'));
    
            var allemp = GetDataGroupedByFields(data, ["EmpName"]); //console.log(allemp);
            allemp.sort(function (a, b) {
                return b.Employees - a.Employees
            }); //console.log(allemp);
            var sumallemp = allemp.reduce(function (prev, cur) {
                return prev + cur.Employees;
            }, 0); //console.log(sumallemp);
            $("#totaljobsfdi").html(kendo.toString(sumallemp, 'n0'));    
        });//endarcgis
    }   //end make keyindustry
    calculateFDItotals();

    function clickClusterfdi (e) {
        if (toggleClickfdi==1||toggleClickfdi==2){
        // $(".filternoteKI").hide();
        //filter calculate totals - add cluster filter
        $(".fdifiltertype").html("Cluster ")
        toggleClickfdi=2;
        var selectedcluster=e.category;
        var addand=" AND ";
        var test1=fdiquery +addand +"Cluster='"+selectedcluster+"'";
        fdifilterquery=test1;
        console.log("filtered: "+filterquery);
        console.log("overview: "+overviewquery);
        calculateFDItotals(); //filters totals
        makeFDIkeyindchart(); //filters key industries
        FDIcountrysection();
        
        //apply the filters
        $(".filteredcategoryFDI").html("Industry Cluster: "+e.category);
        $(".filteredsimplefdi").html(e.category);
        // $(".within").html("within the ");
        // $(".withinCluster").html(" Cluster");

        var chart = $("#clusterchartfdi").data("kendoChart");
        for(i=0; i<chart.options.series[0].data.length; i++){
            chart.options.series[0].data[i].userColor = "#9bbb59"; //darkorange
        }  
        e.dataItem.userColor = "#2baab1";
        chart.refresh();

        $(".fdireset").show();
        }
        else{}
        }

    function makeFDIclusterchart(){
    arcgisRest.queryFeatures({
        url: empUrl,
        where: fdifilterquery, //Maricopa Only and 5+ Employees
        returnGeometry: false,
        orderByFields: "Employees Desc",
        outFields: [
            "EmpName", "Cluster", "Employees", "County", "International",
            "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction","UltimateParentCountry"
        ]
    }).then(function (res) {
        var features = res.features;
        var data = features.map(function(feature) {
            return feature.attributes;
        });  //console.log(data);


        var dataclustersfdi=GetDataGroupedByFields(data, ["Cluster"]);
        dataclustersfdi.sort(function (a, b) {
            return b.Employees - a.Employees
        });//console.log(dataclustersfdi);

        $("#clusterchartfdi").kendoChart({
            theme:"Office365",
            dataSource: dataclustersfdi,
            seriesDefaults: {
                type: "bar",
                gap: 0.5,
                labels: {visible:false, template:"#=kendo.toString(value,'n0')#",font:"10px Open Sans, sans-serif"}
            },
            chartArea:{
                height:350
            },
            series: [{
                field: "Employees",
                color:"#9bbb59", //darkorange
                colorField: "userColor"
            }],
            valueAxis:{
                labels: {
                    rotation: "auto",
                    font: "12px Open Sans, sans-serif",
                    format: "#,#"       
                },
                title:{
                    text:"Jobs",font:"13px Open Sans, sans-serif"
                }
            },
            categoryAxis:{
                field:"Cluster",
                labels:{visible:true,font:"11px Open Sans, sans-serif",}
            },
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
            },
            seriesClick: clickClusterfdi
        });

        });//endarcgis
    }//end make cluster
    makeFDIclusterchart();

    function makeFDIkeyindchart(){
        arcgisRest.queryFeatures({
            url: empUrl,
            where: fdifilterquery, //Maricopa Only and 5+ Employees
            returnGeometry: false,
            orderByFields: "Employees Desc",
            outFields: [
                "EmpName", "Cluster", "Employees", "County", "International",
                "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction","UltimateParentCountry"
            ]
        }).then(function (res) {
            var features = res.features;
            var data = features.map(function(feature) {
                return feature.attributes;
            });  //console.log(data);
            var keyind1 = GetDataGroupedByFields(data, ["Aerospace"]); //console.log(keyind1);
            var Aerospace = keyind1.pop(); //console.log(Aerospace);
            var AeroJobs=Aerospace.Employees*Aerospace.Aerospace;

            var keyind2 = GetDataGroupedByFields(data, ["Finance"]); //console.log(keyind2);
            var Finance = keyind2.pop(); //console.log(Finance);
            var FinJobs=Finance.Employees*Finance.Finance;

            var keyind3 = GetDataGroupedByFields(data, ["HealthCare"]); //console.log(keyind3);
            var Healthcare = keyind3.pop(); //console.log(Healthcare);
            var HealthJobs = Healthcare.Employees*Healthcare.HealthCare;

            var keyind4 = GetDataGroupedByFields(data, ["InfoTech"]); //console.log(keyind4);
            var Infotech = keyind4.pop(); //console.log(Infotech);
            var InfoJobs=Infotech.Employees*Infotech.InfoTech;

            var keyind5 = GetDataGroupedByFields(data, ["Manufacturing"]); //console.log(keyind5);
            var Manufacturing = keyind5.pop(); //console.log(Manufacturing);
            var ManufJobs=Manufacturing.Employees*Manufacturing.Manufacturing;

            var keyind6 = GetDataGroupedByFields(data, ["WhseDistr"]); //console.log(keyind6);
            var Whsedistr = keyind6.pop(); //console.log(Whsedistr);
            var WDJobs=Whsedistr.Employees*Whsedistr.WhseDistr;

        var keyindustriesfdi = [{
                "name": "Aerospace",
                "Jobs": AeroJobs,
                "field": "Aerospace"
            },
            {
                "name": "Finance",
                "Jobs": FinJobs,
                "field": "Finance"
            },
            {
                "name": "Health Care",
                "Jobs": HealthJobs,
                "field": "HealthCare"
            },
            {
                "name": "Information Technology",
                "Jobs": InfoJobs,
                "field": "InfoTech"
            },
            {
                "name": "Manufacturing",
                "Jobs": ManufJobs,
                "field": "Manufacturing"
            },
            {
                "name": "Warehouse and Distribution",
                "Jobs": WDJobs,
                "field": "WhseDistr"
            }
        ]; //console.log(keyindustries);

        function clickKIfdi (e) {
            if (toggleClickfdi==1||toggleClickfdi==4){
            // $(".filternoteKI").hide();
            //filter calculate totals - add cluster filter
            $(".fdifiltertype").html("Key Industry ")
            toggleClickfdi=4;
            var selectedKI=e.dataItem.field;
            var addand=" AND ";
            var test1=fdiquery +addand +selectedKI+"=1";
            fdifilterquery=test1;
            console.log("filtered: "+filterquery);
            console.log("overview: "+overviewquery);
            calculateFDItotals(); //filters totals
            makeFDIclusterchart(); //filters key industries
            FDIcountrysection();
            
            //apply the filters
            $(".filteredcategoryFDI").html("Key Industry: "+e.category);
            $(".filteredsimplefdi").html(e.category);
            // $(".within").html("within the ");
            // $(".withinCluster").html(" Cluster");
    
            var chart = $("#keyindchartfdi").data("kendoChart");
            for(i=0; i<chart.options.series[0].data.length; i++){
                chart.options.series[0].data[i].userColor = "#f79664"; //darkorange
            }  
            e.dataItem.userColor = "#2baab1";
            chart.refresh();
    
            $(".fdireset").show();
            }
            else{}
            }

        $("#keyindchartfdi").kendoChart({
            theme:"Office365",
            dataSource: keyindustriesfdi,
            chartArea: {
                height: 350
            },
            seriesDefaults: {
                type: "bar",
                gap: 0.5
            },
            series: [{
                field: "Jobs",
                color: "#f79664", //darkorange
                colorField:"userColor"
            }],
            categoryAxis:{
                field:"name",
                labels:{visible:true,font:"13px Open Sans, sans-serif"}
            },
            valueAxis: {
                labels: {
                    rotation: "auto",
                    font: "12px Open Sans, sans-serif",
                    format: "#,#"       
                },
                title:{
                    text:"Jobs",font:"13px Open Sans, sans-serif"
                }
            },
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
            },
            seriesClick: clickKIfdi
        });

        });//endarcgis
}   //end make keyindustry
    makeFDIkeyindchart();
    
    //END TESTING

    var filterquery=overviewquery;
    function calculateTotals(){
    arcgisRest.queryFeatures({
        url: empUrl,
        where: filterquery, //Maricopa Only and 5+ Employees
        returnGeometry: false,
        orderByFields: "Employees Desc",
        outFields: [
            "EmpName", "Cluster", "Employees", "County", "International",
            "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction"
        ]
    }).then(function (res) {
        var features = res.features;
        var data = features.map(function(feature) {
            return feature.attributes;
        });  //console.log(data);

        var groupbyEmpName = GetDataGroupedByFields(data, ["EmpName"]); //console.log(groupbyEmpName);
        var totalBus = groupbyEmpName.length; //console.log(totalBus);
        $("#totalbusinesses").html(kendo.toString(totalBus, 'n0'));

        var allemp = GetDataGroupedByFields(data, ["EmpName"]); //console.log(allemp);
        allemp.sort(function (a, b) {
            return b.Employees - a.Employees
        }); //console.log(allemp);
        var sumallemp = allemp.reduce(function (prev, cur) {
            return prev + cur.Employees;
        }, 0); //console.log(sumallemp);
        $("#totaljobs").html(kendo.toString(sumallemp, 'n0'));

        var top20emp = allemp.slice(0, 20); //console.log(top20emp);
        var sumtop20emp = top20emp.reduce(function (prev, cur) {
            return prev + cur.Employees;
        }, 0); //console.log(sumtop20emp);
        var allotheremp = sumallemp - sumtop20emp; //console.log(allotheremp);
        var top20sharedata = [{
            "name": "All Other Employers",
            "sum": allotheremp,
            "percent": allotheremp / sumallemp,
        },{
            "name": "Top 20 Employers",
            "sum": sumtop20emp,
            "percent": sumtop20emp / sumallemp,
            "explode": true
        }]; //console.log(top20sharedata);

        var top20percent=sumtop20emp/sumallemp;

        $(".top20percent").html(kendo.toString(top20percent*100,'n0')); //TESTING

        $("#top20sharechart").kendoChart({
            theme: "Office365",
            plotArea:{height:900}, //chartArea:{height:500},
            dataSource: {
                data: top20sharedata
            },
            seriesDefaults: {
                padding: 20,
                labels: {
                    visible: true,
                    position: "center",
                    template: "#=kendo.toString(dataItem.percent*100,'n0')#%",
                    font: "bold 14px Open Sans, sans-serif",
                    background: "none",
                }
            },
            legend: {
                visible: true,
                position: "top",
                margin: {
                    bottom: 10,
                }
            },
            series: [{
                type: "pie",
                field: "sum",
                categoryField: "name",
                explodeField: "explode"
            }],
            tooltip: {
                visible: true,
                template: "<strong>#=category#</strong><br>Jobs: #=kendo.toString(value,'n0')#<br>Share of Total Jobs: #=kendo.toString(dataItem.percent*100,'n0')#%"
            }
        });
        }); //endarcgisrest
    };//end function calculate totals
    calculateTotals();

    //KeyIndustries
    function calculateKI(){
        arcgisRest.queryFeatures({
            url: empUrl,
            where: filterquery, //Maricopa Only and 5+ Employees
            returnGeometry: false,
            orderByFields: "Employees Desc",
            outFields: [
                "EmpName", "Cluster", "Employees", "County", "UltimateParentCountry", "International",
                "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction"
            ]
        }).then(function (res) {
            var features = res.features;
            var data = features.map(function(feature) {
                return feature.attributes;
            });  //console.log(data);

            var keyind1 = GetDataGroupedByFields(data, ["Aerospace"]); //console.log(keyind1);
            var Aerospace = keyind1.pop(); //console.log(Aerospace);
            var AeroJobs=Aerospace.Employees*Aerospace.Aerospace;

            var keyind2 = GetDataGroupedByFields(data, ["Finance"]); //console.log(keyind2);
            var Finance = keyind2.pop(); //console.log(Finance);
            var FinJobs=Finance.Employees*Finance.Finance;

            var keyind3 = GetDataGroupedByFields(data, ["HealthCare"]); //console.log(keyind3);
            var Healthcare = keyind3.pop(); //console.log(Healthcare);
            var HealthJobs = Healthcare.Employees*Healthcare.HealthCare;

            var keyind4 = GetDataGroupedByFields(data, ["InfoTech"]); //console.log(keyind4);
            var Infotech = keyind4.pop(); //console.log(Infotech);
            var InfoJobs=Infotech.Employees*Infotech.InfoTech;

            var keyind5 = GetDataGroupedByFields(data, ["Manufacturing"]); //console.log(keyind5);
            var Manufacturing = keyind5.pop(); //console.log(Manufacturing);
            var ManufJobs=Manufacturing.Employees*Manufacturing.Manufacturing;

            var keyind6 = GetDataGroupedByFields(data, ["WhseDistr"]); //console.log(keyind6);
            var Whsedistr = keyind6.pop(); //console.log(Whsedistr);
            var WDJobs=Whsedistr.Employees*Whsedistr.WhseDistr;

        var keyindustries = [{
                "name": "Aerospace",
                "Jobs": AeroJobs,
                "field": "Aerospace"
            },
            {
                "name": "Finance",
                "Jobs": FinJobs,
                "field": "Finance"
            },
            {
                "name": "Health Care",
                "Jobs": HealthJobs,
                "field": "HealthCare"
            },
            {
                "name": "Information Technology",
                "Jobs": InfoJobs,
                "field": "InfoTech"
            },
            {
                "name": "Manufacturing",
                "Jobs": ManufJobs,
                "field": "Manufacturing"
            },
            {
                "name": "Warehouse and Distribution",
                "Jobs": WDJobs,
                "field": "WhseDistr"
            }
        ]; //console.log(keyindustries);

        datagrid20ki=new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName", "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr"]),
                pageSize: 20,
                sort: {
                    field: "Employees",
                    dir: "desc"
                }
        });

        $("#keyindgrid").kendoGrid({
            dataSource: keyindustries,
            columns: [{
                field: "name",
                title: "Key Industries",
                width: "75%",
                attributes: {
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "Jobs",
                width: "25%",
                attributes: {
                    style: "text-align:right;"
                },
                headerAttributes: {
                    style: "font-weight:bold;text-align:center;"
                },
                template: "#=kendo.toString(Jobs,'n0')#"
            }]
        });

        function clickKI (e) {   
            if (toggleClick==1||toggleClick==3){
            $(".filternoteCluster").hide();
            $(".overviewfiltertype").html("Key Industry ")
            toggleClick=3;
            filterquery=overviewquery;
            $("#keyindchart").data("kendoChart").refresh();
            //filter calculate totals - add ki filter
            var selectedKI=e.dataItem.field;
            var addand=" AND ";
            var test1=overviewquery +addand +selectedKI+"=1";
            filterquery=test1;
            console.log("filtered: "+filterquery);
            console.log("overview: "+overviewquery);
            calculateTotals();
            calculateClusters();

            //create new filter object
            var filter2 = {
                field: e.dataItem.field,
                operator: "eq",
                value: 1
            };
            //apply the filters
            $(".filteredKI").html("Key Industry: "+e.category);
            $(".filteredsimple").html(e.category);
            $(".within").html("within ");
            $(".withinCluster").html("");

            var chart = $("#keyindchart").data("kendoChart");
            for(i=0; i<chart.options.series[0].data.length; i++){
                chart.options.series[0].data[i].userColor = "#f79664"; //darkorange
            }  
            e.dataItem.userColor = "#2baab1";
            chart.refresh();

            //clear previous selections
            $("#keyindgrid").data("kendoGrid").clearSelection();
            $("#keyindgrid").data("kendoGrid").refresh();

            //Select KI grid row
            $("#keyindgrid").data("kendoGrid").items().each(function() {
                var data = $("#keyindgrid").data("kendoGrid").dataItem(this);
                //some condition
                if (data.field == selectedKI) {
                $("#keyindgrid").data("kendoGrid").select(this);
                }
            });

            //Filters top 20 employers grid
            $("#top20grid").data("kendoGrid").setDataSource(datagrid20ki);
            $("#top20grid").data("kendoGrid").dataSource.filter(filter2);
            $("#top20grid").refresh;
            
            $(".overviewreset").show();
        }
        else{

        }
        }

        $("#keyindchart").kendoChart({
            theme:"Office365",
            dataSource: keyindustries,
            chartArea: {
                height: 250
            },
            seriesDefaults: {
                type: "bar",
                gap: 0.5
            },
            series: [{
                field: "Jobs",
                color: "#f79664", //darkorange
                colorField:"userColor"
            }],
            categoryAxis:{
                field:"name",
                labels:{visible:true,font:"13px Open Sans, sans-serif"}
            },
            valueAxis: {
                labels: {
                    rotation: "auto",
                    font: "12px Open Sans, sans-serif",
                    format: "#,#"       
                },
                title:{
                    text:"Jobs",font:"13px Open Sans, sans-serif"
                }
            },
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
            },
            seriesClick: clickKI
        });
        }) //end arcgisRest 
    }
    calculateKI();

    //arcgisREST for top 20 grid
    arcgisRest.queryFeatures({
            url: empUrl,
            //where: "1=1", //Entire State, all records
            where: overviewquery, //Maricopa Only and 5+ Employees
            returnGeometry: false,
            //resultRecordCount: 10000,
            orderByFields: "Employees Desc",
            outFields: [
                "EmpName", "Cluster", "Employees", "County", "UltimateParentCountry", "International",
                "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction"
            ]
    }).then(function (res) {
            var features = res.features;
            var data = features.map(function(feature) {
                return feature.attributes;
            });  //console.log(data);


        datagrid20all=new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName"]),
                pageSize: 20,
                sort: {
                    field: "Employees",
                    dir: "desc"
                },
        });
        datagrid20cluster=new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName","Cluster"]),
                pageSize: 20,
                sort: {
                    field: "Employees",
                    dir: "desc"
                }
        });

        $("#top20grid").kendoGrid({
            height:"400", //when less than 10 employers, fixed height creates extra space
            dataSource:datagrid20all,
            columns: [{
                field: "EmpName",
                title: "Employer Name",
                width: "75%",
                attributes: {
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                },
            }, {
                field: "Employees",
                title: "Jobs",
                width: "25%",
                template: "#=kendo.toString(Employees,'n0')#",
                attributes: {
                    style: "text-align:right;"
                },
                headerAttributes: {
                    style: "font-weight:bold;text-align:center;"
                },
            }]
        });
    });//endarcGISrest

    //arcgisRest for Cluster
    function calculateClusters(){
    arcgisRest.queryFeatures({
        url: empUrl,
        //where: "1=1", //Entire State, all records
        where: filterquery, //Maricopa Only and 5+ Employees
        returnGeometry: false,
        //resultRecordCount: 10000,
        orderByFields: "Employees Desc",
        outFields: [
            "EmpName", "Cluster", "Employees", "County", "UltimateParentCountry", "International",
            "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction"
        ]
    }).then(function (res) {
        var features = res.features;
        var data = features.map(function(feature) {
            return feature.attributes;
        });  //console.log(data);

        var dataclusters=GetDataGroupedByFields(data, ["Cluster"]);
        dataclusters.sort(function (a, b) {
            return b.Employees - a.Employees
        });//console.log(dataclusters);

        function clickCluster (e) {
            if (toggleClick==1||toggleClick==2){
            $(".filternoteKI").hide();
            $(".overviewfiltertype").html("Cluster ")
            //filter calculate totals - add cluster filter
            toggleClick=2;
            var selectedcluster=e.category;
            var addand=" AND ";
            var test1=overviewquery +addand +"Cluster='"+selectedcluster+"'";
            filterquery=test1;
            console.log("filtered: "+filterquery);
            console.log("overview: "+overviewquery);
            calculateTotals(); //filters totals
            calculateKI(); //filters key industries
            
            //create new filter object
            var filter = {
                field: "Cluster",
                operator: "eq",
                value: e.category
            };

            //apply the filters
            $(".filteredCluster").html("Industry Cluster: "+e.category);
            $(".filteredsimple").html(e.category);
            $(".within").html("within the ");
            $(".withinCluster").html(" Cluster");

            var chart = $("#clusterchart").data("kendoChart");
            for(i=0; i<chart.options.series[0].data.length; i++){
                chart.options.series[0].data[i].userColor = "#9bbb59"; //darkorange
            }  
            e.dataItem.userColor = "#2baab1";
            chart.refresh();

            //clear previous selections
            $("#clustergrid").data("kendoGrid").clearSelection();
            $("#clustergrid").data("kendoGrid").refresh();

            //Select cluster grid row
            $("#clustergrid").data("kendoGrid").items().each(function() {
                var data = $("#clustergrid").data("kendoGrid").dataItem(this);
                //some condition
                if (data.Cluster == selectedcluster) {
                $("#clustergrid").data("kendoGrid").select(this);
                }
            });

            //Filters Top 20 Grid
            $("#top20grid").data("kendoGrid").setDataSource(datagrid20cluster);
            $("#top20grid").data("kendoGrid").dataSource.filter(filter);
            $("#top20grid").refresh;

            $(".overviewreset").show();
        }
        else{}
        }

        $("#clustergrid").kendoGrid({
            // height:475,
            dataSource: {
                data: GetDataGroupedByFields(data, ["Cluster"]),
                sort: {
                    field: "Cluster",
                    dir: "asc"
                }
            },
            columns: [{
                field: "Cluster",
                width: "75%",
                attributes: {
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "Employees",
                title:"Jobs",
                width: "25%",
                template: "#=kendo.toString(Employees,'n0')#",
                attributes: {
                    style: "text-align:right;"
                },
                headerAttributes: {
                    style: "font-weight:bold;text-align:center;"
                }
            }]
        });
        $("#clusterchart").kendoChart({
            theme:"Office365",
            dataSource: dataclusters,
            seriesDefaults: {
                type: "bar",
                gap: 0.5,
                labels: {visible:false, template:"#=kendo.toString(value,'n0')#",font:"10px Open Sans, sans-serif"}
            },
            chartArea:{
                height:600
            },
            series: [{
                field: "Employees",
                color:"#9bbb59", //darkorange
                colorField: "userColor"
            }],
            valueAxis:{
                labels: {
                    rotation: "auto",
                    font: "12px Open Sans, sans-serif",
                    format: "#,#"       
                },
                title:{
                    text:"Jobs",font:"13px Open Sans, sans-serif"
                }
            },
            categoryAxis:{
                field:"Cluster",
                labels:{visible:true,font:"11px Open Sans, sans-serif"}
            },
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
            },
            seriesClick: clickCluster
        });
    }) //end arcgisrest
} //calculateClusters end
calculateClusters();

$(".overviewreset").click(function () {
    //dynamic text
    $(".filteredKI").html("");
    $(".filteredCluster").html("");
    $(".within").html("");
    $(".withinCluster").html("");
    $(".filteredsimple").html("");

    //reset data
    $("#top20grid").data("kendoGrid").setDataSource(datagrid20all);//$("#top20grid").refresh; //Resets top 20 grid
    filterquery=overviewquery; //console.log("after clear filters: "+overviewquery);
    calculateTotals();
    calculateKI();
    calculateClusters();
    $(".overviewreset").hide();
    toggleClick=1;
    $(".filternoteKI").show();
    $(".filternoteCluster").show();
});
}; //make dashboard end
makedashboard(); //initial page load: Phoenix MSA
});//document ready end