$(document).ready(function () {
    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        },
        scrollable: true,
        tabPosition: "top",
    });
});

$(window).on("resize", function () {
    kendo.resize($(".container"));
});

var fdiquery="(County='Pinal' OR County='Maricopa') AND International=1";
var overviewquery="(County='Pinal' OR County='Maricopa') AND Employees > 4";
$(".overviewreset").hide();
//makedashboard(); //default MSA

    $("#geography").kendoDropDownList({
        dataSource: [
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
        ],
        dataTextField: "Geography",
        dataValueField: "Geography",
        value: "Phoenix MSA",
        select: function (e) {
            var item = e.dataItem.Geography;
            $(".selectedgeography").html(e.dataItem.Geography);

            if (item=='Maricopa County'){
                fdiquery="(County='Maricopa') AND International=1";
                overviewquery="(County='Maricopa') AND Employees > 4";
                console.log(fdiquery);
                $(".filtered").html("");
                $(".filteredsimple").html("");
                makedashboard();
            }
            else if (item=='Arizona'){
                    fdiquery="International=1";
                    overviewquery="Employees > 4";
                    console.log(fdiquery);
                    $(".filtered").html("");
                    $(".filteredsimple").html("");
                    makedashboard();
            }
            else if (item=='Pinal County'){
                fdiquery="(County='Pinal') AND International=1";
                overviewquery="(County='Pinal') AND Employees > 4";
                console.log(fdiquery);
                $(".filtered").html("");
                $(".filteredsimple").html("");
                makedashboard();
            }
            else if (item=='Phoenix MSA'){
                fdiquery="(County='Pinal' or County='Maricopa') AND International=1";
                overviewquery="(County='Pinal'or County='Maricopa') AND Employees > 4";
                console.log(fdiquery);
                $(".filtered").html("");
                $(".filteredsimple").html("");
                makedashboard();
            }
            else if (item=='Maricopa (City)'){
                fdiquery="(Jurisdiction='Maricopa') AND International=1";
                overviewquery="(Jurisdiction='Maricopa') AND Employees > 4";
                console.log(fdiquery);
                $(".filtered").html("");
                $(".filteredsimple").html("");
                makedashboard();
            }
            else{
                fdiquery="Jurisdiction='"+item+"' and International=1";
                overviewquery="Jurisdiction='"+item+"' AND Employees > 4";
                console.log(fdiquery);
                $(".filtered").html("");
                $(".filteredsimple").html("");
                makedashboard();
            }
            if (item=='Phoenix MSA'){
                $(".addthe").html("the ");
            }
            else{
                $(".addthe").html("");
            }
        }
    });
    
    //$(".selectedgeography").html("Maricopa County"); //default MC selected
    $(".selectedgeography").html("Phoenix MSA"); //default MSA selected
    $(".addthe").html("the ");

    //var empUrl = "https://geo.azmag.gov/arcgis/rest/services/Test/StateEmploymentViewer2018/MapServer/0";
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

            //Get current data obj.
            //If blank, fill with a copy of the template
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
    $(".FDIcountry").html(""); //reset filter label for FDI
    // var fdiquery="(County='Pinal' OR County='Maricopa') AND International=1";
    arcgisRest.queryFeatures({
        url: empUrl,
        //where: "1=1", //Entire State, all records
        where: fdiquery, //Maricopa Only
        returnGeometry: false,
        //resultRecordCount: 10000,
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
                attributes: {
                    style: "text-align:left;"
                },
                width: "25%",
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
                attributes: {
                    style: "text-align:left;"
                },
                width: "25%",
                template: "#=kendo.toString(Employees,'n0')#",
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }]
        });

        var dsfdichart=GetDataGroupedByFields(data, ["UltimateParentCountry"]);
        dsfdichart.sort(function (a, b) {
            return b.Employees - a.Employees
        });//console.log(datafdi);

        $("#fdiChart").kendoChart({ //currently only taking largest employer of each country.
            theme:"Office365",
            seriesDefaults: {
                type: "bar",
            },
            dataSource: dsfdichart,
            chartArea: {
                height: 735
            },
            seriesDefaults: {
                type: "bar",
                gap: 0.7,
            },
            series: [{
                field: "Employees",
                color: "darkorange",
                colorField:"userColor"
                //categoryField: "ParentCountry"
            }],
            categoryAxis:{
                field:"UltimateParentCountry",
                minorGridLines:{visible: false},
                majorGridLines:{visible: false}
            },
            valueAxis: {
                title: {
                    text: "Jobs",
                    font: "13px Arial"
                }
            },
            seriesClick: function (e) {
                $(".fdireset").show();
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
                    chart.options.series[0].data[i].userColor = "darkorange";
                }  
                e.dataItem.userColor = "#2baab1";
                chart.refresh();

                //dynamic text
                var item = e.dataItem.UltimateParentCountry;
                $(".FDIcountry").html(" (" + item+")");
            },
            axisLabelClick: function (e) {
                $(".fdireset").show();
                //create new filter object
                //console.log(e.category);
                var filter = {
                    field: "UltimateParentCountry",
                    operator: "eq",
                    value: e.dataItem.UltimateParentCountry
                };
                //apply the filters
                dsfdi.filter(filter);
                dsfdiparent.filter(filter);

                var chart = $("#fdiChart").data("kendoChart");
                for(i=0; i<chart.options.series[0].data.length; i++){
                    chart.options.series[0].data[i].userColor = "darkorange";
                }  
                e.dataItem.userColor = "#2baab1";
                chart.refresh();

                //dynamic text
                var item = e.dataItem.UltimateParentCountry;
                $(".FDIcountry").html(" (" + item+")");
            },
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br>#=kendo.toString(value,'n0')# Jobs"
            }
        });
        $(".fdireset").hide();
        $(".fdireset").click(function () {
            $(".fdireset").hide();
            dsfdi.filter({});
            dsfdiparent.filter({});
            $(".FDIcountry").html("");
            
            $("#fdiChart").data("kendoChart").setDataSource(dsfdichart);
            //reset chart - NOT WORKING
            //$("#fdiChart").data("kendoChart").setDataSource(GetDataGroupedByFields(data, ["ParentCountry"]));
        });
    });

    // var overviewquery = "(County='Pinal' OR County='Maricopa') AND Employees > 4";
    var filterquery=overviewquery;
    function calculateTotals(){
    arcgisRest.queryFeatures({
        url: empUrl,
        //where: "1=1", //Entire State, all records
        where: filterquery, //Maricopa Only and 5+ Employees
        returnGeometry: false,
        //resultRecordCount: 10000,
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
        }];
        //console.log(top20sharedata);

        $("#top20sharechart").kendoChart({
            theme: "Office365",
            plotArea:{height:900},
            //chartArea:{height:500},
            dataSource: {
                data: top20sharedata
            },
            seriesDefaults: {
                padding: 50,
                labels: {
                    visible: true,
                    position: "center",
                    template: "#=kendo.toString(dataItem.percent*100,'n0')#%",
                    font: "bold 14px Open Sans, sans serif",
                    background: "none",
                }
            },
            legend: {
                visible: true,
                position: "top",
                margin: {
                    bottom: 50,
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

        // //NEWADD TEST for keyIndustries
        // arcgisRest.queryFeatures({
        //     url: empUrl,
        //     //where: "1=1", //Entire State, all records
        //     where: overviewquery, //Maricopa Only and 5+ Employees
        //     returnGeometry: false,
        //     //resultRecordCount: 10000,
        //     orderByFields: "Employees Desc",
        //     outFields: [
        //         "EmpName", "Cluster", "Employees", "County", "UltimateParentCountry", "International",
        //         "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction"
        //     ]
        // }).then(function (res) {
        //     var features = res.features;
        //     var data = features.map(function(feature) {
        //         return feature.attributes;
        //     });  //console.log(data);
        // }) //end arcgisRest

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

        var keyind1 = GetDataGroupedByFields(data, ["Aerospace"]); console.log(keyind1);
        var Aerospace = keyind1.pop(); console.log(Aerospace);
        var AeroJobs=Aerospace.Employees*Aerospace.Aerospace;

        var keyind2 = GetDataGroupedByFields(data, ["Finance"]); console.log(keyind2);
        var Finance = keyind2.pop(); console.log(Finance);
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

        var datagrid20all=new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName"]),
                pageSize: 20,
                sort: {
                    field: "Employees",
                    dir: "desc"
                }
        });
        var datagrid20cluster=new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName","Cluster"]),
                pageSize: 20,
                sort: {
                    field: "Employees",
                    dir: "desc"
                }
        });
        var datagrid20ki=new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName", "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr"]),
                pageSize: 20,
                sort: {
                    field: "Employees",
                    dir: "desc"
                }
        });

        $("#top20grid").kendoGrid({
            //height:500,
            dataSource:datagrid20all,
            columns: [{
                field: "EmpName",
                title: "Employer Name",
                width: "70%",
                attributes: {
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "Employees",
                width: "30%",
                template: "#=kendo.toString(Employees,'n0')#",
                attributes: {
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }]
        });

        var dataclusters=GetDataGroupedByFields(data, ["Cluster"]);
        dataclusters.sort(function (a, b) {
            return b.Employees - a.Employees
        });//console.log(dataclusters);

        $("#clustergrid").kendoGrid({
            //selectable: "row",
            dataSource: {
                data: GetDataGroupedByFields(data, ["Cluster"]),
                sort: {
                    field: "Cluster",
                    dir: "asc"
                }
            },
            columns: [{
                field: "Cluster",
                width: "65%",
                attributes: {
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }, {
                field: "Employees",
                width: "35%",
                template: "#=kendo.toString(Employees,'n0')#",
                attributes: {
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                }
            }]
        });
        $("#clusterchart").kendoChart({
            theme:"Office365",
            dataSource: dataclusters,
            seriesDefaults: {
                type: "bar",
                gap: 0.5,
                labels: {visible:true, template:"#=kendo.toString(value,'n0')#"}
            },
            chartArea:{
                height:650
            },
            series: [{
                field: "Employees",
                color:"darkorange",
                colorField: "userColor"
            }],
            categoryAxis:{
                field:"Cluster"
            },
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
            },
            seriesClick: function (e) {
                //filter calculate totals - add cluster filter
                var selectedcluster=e.category;
                var addand=" AND ";
                var test1=overviewquery +addand +"Cluster='"+selectedcluster+"'";
                filterquery=test1;
                console.log("filtered: "+filterquery);
                console.log("overview: "+overviewquery);
                calculateTotals();

                //reset cluster grid --SELECTED COLOR NOT WORKING
                
                //create new filter object
                var filter = {
                    field: "Cluster",
                    operator: "eq",
                    value: e.category
                };

                //apply the filters
                $("#clustergrid").data("kendoGrid").dataSource.filter(filter); //filters Cluster Grid
                $(".filtered").html("Industry Cluster: "+e.category);
                $(".filteredsimple").html(e.category);

                var chart = $("#clusterchart").data("kendoChart");
                for(i=0; i<chart.options.series[0].data.length; i++){
                    chart.options.series[0].data[i].userColor = "darkorange";
                }  
                e.dataItem.userColor = "#2baab1";
                chart.refresh();

                //Test: select cluster grid row
                $("#clustergrid").data("kendoGrid").select("tr:eq(0)");

                //TEST: this works! Filters top 20 grid
                $("#top20grid").data("kendoGrid").setDataSource(datagrid20cluster);
                $("#top20grid").data("kendoGrid").dataSource.filter(filter);
                $("#top20grid").refresh;

                //THIS resets key industry - one filter at a time
                $("#keyindgrid").data("kendoGrid").dataSource.filter({});
                $("#keyindchart").data("kendoChart").setDataSource(keyindustries); //RESET CHART COLORS

                //add FILTER for key industry...

                $(".overviewreset").show();

            },
            valueAxis: {
                labels: {
                    rotation: "auto"
                }
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
                    style: "text-align:left;"
                },
                headerAttributes: {
                    style: "font-weight:bold;"
                },
                template: "#=kendo.toString(Jobs,'n0')#"
            }]
        });

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
                color: "darkorange",
                colorField:"userColor"
                //categoryField: "name",
            }],
            categoryAxis:{
                field:"name"
            },
            valueAxis: {
                labels: {
                    rotation: "auto"
                }
            },
            tooltip: {
                visible: true,
                template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
            },
            seriesClick: function (e) {
                //filter calculate totals - add ki filter
                var selectedKI=e.dataItem.field;
                var addand=" AND ";
                var test1=overviewquery +addand +selectedKI+"=1";
                filterquery=test1;
                console.log("filtered: "+filterquery);
                console.log("overview: "+overviewquery);
                calculateTotals();

                //create new filter object
                var filter = {
                    field: "name",
                    operator: "eq",
                    value: e.category
                };
                var filter2 = {
                    field: e.dataItem.field,
                    operator: "eq",
                    value: 1
                };
                //apply the filters
                $("#keyindgrid").data("kendoGrid").dataSource.filter(filter); //filters KI Grid
                $(".filtered").html("Key Industry: "+e.category);
                $(".filteredsimple").html(e.category);

                var chart = $("#keyindchart").data("kendoChart");
                for(i=0; i<chart.options.series[0].data.length; i++){
                    chart.options.series[0].data[i].userColor = "darkorange";
                }  
                e.dataItem.userColor = "#2baab1";
                chart.refresh();

                //Test: select cluster grid row
                $("#keyindgrid").data("kendoGrid").select("tr:eq(0)");

                //Filters top 20 employers grid
                $("#top20grid").data("kendoGrid").setDataSource(datagrid20ki);
                $("#top20grid").data("kendoGrid").dataSource.filter(filter2);
                $("#top20grid").refresh;
                
                //added FILTER for cluster...
                var clusterbyKI=new kendo.data.DataSource({
                    data:GetDataGroupedByFields(data,["Cluster",e.dataItem.field]),
                sort:{field:"Cluster", dir: "asc"}
                });
                $("#clustergrid").data("kendoGrid").setDataSource(clusterbyKI); //TEST
                $("#clustergrid").data("kendoGrid").dataSource.filter(filter2); //TEST
                $("#clusterchart").data("kendoChart").setDataSource(clusterbyKI);
                $("#clusterchart").data("kendoChart").dataSource.filter(filter2);
                $(".overviewreset").show();
            }
        });

        $(".overviewreset").click(function () {
            $(".filtered").html("");
            $(".filteredsimple").html("");
            $("#top20grid").data("kendoGrid").setDataSource(datagrid20all);//$("#top20grid").refresh; //Resets top 20 grid
            $("#keyindgrid").data("kendoGrid").dataSource.filter({});
            $("#keyindchart").data("kendoChart").setDataSource(keyindustries); //RESET CHART COLORS
            $("#clustergrid").data("kendoGrid").setDataSource(GetDataGroupedByFields(data, ["Cluster"]));
            $("#clustergrid").data("kendoGrid").dataSource.sort([{field:"Cluster",dir:"asc"}]); //SORT GRID BY CLUSTER NAME
            $("#clusterchart").data("kendoChart").setDataSource(dataclusters); //RESET CHART COLORS
            filterquery=overviewquery;
            console.log("after clear filters: "+overviewquery);
            calculateTotals();
            $(".overviewreset").hide();
        });
    }) //end arcgisrest
}; //make dashboard end
makedashboard(); //initial page load: Phoenix MSA
//});//document ready end