var ds = new kendo.data.DataSource({
    data: GetDataGroupedByFields(data, ["EmpName", "Cluster"]),
    sort: {
        field: "Employees",
        dir: "desc"
    },
    pageSize: 10
});

$("#top10Grid").kendoGrid({
    dataSource: ds,
    columns: [{
        field: "EmpName",
        title: "Employer Name",
        attributes: {
            style: "text-align:left;"
        }
    }, {
        field: "Cluster",
        attributes: {
            style: "text-align:left;"
        }
    }, {
        field: "Employees",
        attributes: {
            style: "text-align:left;"
        },
        template: "#=kendo.toString(Employees,'n0')#"
    }]
});

$("#barChart").kendoChart({
    seriesDefaults: {
        type: "bar"
    },
    dataSource: GetDataGroupedByFields(data, ["Cluster"]),
    series: [{
        field: "Employees",
        categoryField: "Cluster"
    }],
    seriesClick: function (e) {
        //create new filter object
        var filter = {
            field: "Cluster",
            operator: "eq",
            value: e.category
        };
        //apply the filters
        ds.filter(filter);
    },
    tooltip: {
        visible: true,
        template: "#=category #<br>#=kendo.toString(value,'n0')#"
    }
});

$("#top20gridbycluster").kendoGrid({
    dataSource: {
        data: GetDataGroupedByFields(data, ["EmpName", "Cluster"]),
        pageSize: 20,
        sort: {
            field: "Employees",
            dir: "desc"
        }
        // filter: {
        //     logic: "and",
        //     filters:[
        //     {field:"County", operator:"eq",value:"Maricopa"}, //filters "default" first view to Maricopa County
        //     ]
        // }
    },
    columns: [{
        field: "EmpName",
        title: "Employer Name",
        width: "40%",
        attributes: {
            style: "text-align:left;"
        },
        headerAttributes: {
            style: "font-weight:bold;"
        }
    }, {
        field: "Cluster",
        width: "40%",
        attributes: {
            style: "text-align:left;"
        },
        headerAttributes: {
            style: "font-weight:bold;"
        }
    }, {
        field: "Employees",
        width: "20%",
        template: "#=kendo.toString(Employees,'n0')#",
        attributes: {
            style: "text-align:left;"
        },
        headerAttributes: {
            style: "font-weight:bold;"
        }
    }]
});

$("#top20gridbykeyind").kendoGrid({
    dataSource: {
        data: GetDataGroupedByFields(data, ["EmpName", "Aerospace", "Finance", "HealthCare",
            "InfoTech", "Manufacturing", "WhseDistr"
        ]),
        pageSize: 20,
        sort: {
            field: "Employees",
            dir: "desc"
        }
        // filter: {
        //     logic: "and",
        //     filters:[
        //     {field:"County", operator:"eq",value:"Maricopa"}, //filters "default" first view to Maricopa County
        //     ]
        // }
    },
    columns: [{
        field: "EmpName",
        title: "Employer Name",
        width: "75%",
        attributes: {
            style: "text-align:left;"
        },
        headerAttributes: {
            style: "font-weight:bold;"
        }
    }, {
        field: "Employees",
        width: "25%",
        template: "#=kendo.toString(Employees,'n0')#",
        attributes: {
            style: "text-align:left;"
        },
        headerAttributes: {
            style: "font-weight:bold;"
        }
    }]
});

//go back to Temp Drive Archive for FDI Cluster and other things that were in original draft.

//old way of summing jobs - back when data was MC only - unnecessary group by function
    var MC = GetDataGroupedByFields(data, ["County"]); //console.log(MC);
    var MCtotals = MC.pop(); //console.log(MCtotals.Employees);
    $("#totaljobs").html(kendo.toString(MCtotals.Employees, 'n0'));

//long-winded reset fdi chart colors (copy paste old chart)
$(".fdireset").click(function () {
    dsfdi.filter({});
    dsfdiparent.filter({});
    $(".FDIcountry").html("");
    
    //reset chart
    var chartOptions = {
        theme:"Office365",
        seriesDefaults: {
            type: "bar"
        },
        dataSource: {
            data: GetDataGroupedByFields(data, ["ParentCountry"]),
            sort: {
                field: "Employees",
                dir: "desc"
            }
        },
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
            field:"ParentCountry"
        },
        valueAxis: {
            title: {
                text: "Jobs",
                font: "13px Arial"
            }
        },
        seriesClick: function (e) {
            //create new filter object
            var filter = {
                field: "ParentCountry",
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
            var item = e.dataItem.ParentCountry;
            $(".FDIcountry").html(" (" + item+")");
        },
        axisLabelClick: function (e) {
            //create new filter object
            console.log(e.category);
            var filter = {
                field: "ParentCountry",
                operator: "eq",
                value: e.dataItem.ParentCountry
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
            var item = e.dataItem.ParentCountry;
            $(".FDIcountry").html(" (" + item+")");
        },
        tooltip: {
            visible: true,
            template: "<strong>#=category #</strong><br>#=kendo.toString(value,'n0')# Jobs"
    }};
    //Get the chart
    $("#fdiChart").kendoChart(chartOptions);
});

//rip separate clear filter buttons
$(".clusterreset").click(function () {
    $(".filtered").html("");
    $("#top20grid").data("kendoGrid").setDataSource(datagrid20all); //$("#top20grid").refresh; //Resets top 20 grid
    $("#clustergrid").data("kendoGrid").dataSource.filter({});
    $("#clustergrid").data("kendoGrid").setDataSource(dataclusters);
    $("#clusterchart").data("kendoChart").setDataSource(dataclusters);
    //$("#clusterchart").data("kendoChart").setDataSource(GetDataGroupedByFields(data, ["Cluster"])); //RESET CHART COLORS
});
$(".keyindreset").click(function () {
    $(".filtered").html("");
    //reset top 20grid
    $("#top20grid").data("kendoGrid").setDataSource(datagrid20all);//$("#top20grid").refresh; //Resets top 20 grid
    $("#keyindgrid").data("kendoGrid").dataSource.filter({});
    $("#keyindchart").data("kendoChart").setDataSource(keyindustries); //RESET CHART COLORS

    //RESET CLUSTER FILTER
    $("#clustergrid").data("kendoGrid").setDataSource(dataclusters);
});

//rip clusterchart resets in keyindchart select event
                //This resets cluster - one filter at a time (old - delete this section)
                //$("#clustergrid").data("kendoGrid").dataSource.filter({});
                //$("#clusterchart").data("kendoChart").setDataSource(dataclusters);
                //$("#clusterchart").data("kendoChart").setDataSource(GetDataGroupedByFields(data, ["Cluster"])); //RESET CHART COLORS

// $("#totallocations").html(kendo.toString(data.length, 'n0'));