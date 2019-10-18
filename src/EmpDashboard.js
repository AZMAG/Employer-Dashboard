var empUrl = "https://geo.azmag.gov/arcgis/rest/services/maps/StateEmploymentDashboard2018/MapServer/0";
var indextest = 0;
var GeographyList, dataclusters, datagrid20all, dsfdi, filenametest, totalBus, keyindnametest, clusternametest, totalCountries;
var fdiChartHeight = 635;
var toggleClick = 1;
var toggleClickfdi = 1;
var overviewfilterapplied = "";
var top20overviewfilterapplied = "";
var fdifiltertext = "";
var filterclicked = 0;
var fdifilterclicked = 0;
var overviewgeography = "Phoenix MSA";
var checkCountriesFilter = 1;

var sourceyear = 2018;
var azsourceyear = "2017/2018";
$(".srcyr").html(sourceyear);
$(".fdisrcyr").html(sourceyear);
$(".filteredKI").html("");
$(".filteredCluster").html("");
$(".FDIcountry").html("");
$(".filteredcategoryFDI").html("");

$(".overhundredpct").hide();

$(document).ready(function () {
    $("#tabstrip").kendoTabStrip({
        animation: {
            open: {
                effects: "fadeIn"
            }
        },
        scrollable: true,
        tabPosition: "top",
        select: function (e) {
            indextest = $(e.item).find("> .k-link").text();
            refreshlist();
        }
    });
    indextest = "Overview"; //default active tab: Overview 

    $(window).on("resize", function () {
        kendo.resize($(".container"));
    });

    var fdiquery = "(County='Pinal' OR County='Maricopa') AND International=1";
    var overviewquery = "(County='Pinal' OR County='Maricopa') AND Employees > 4";
    $(".overviewreset").hide();

    var GeographyListOverview = [{
            Geography: "Phoenix MSA"
        },
        {
            Geography: "Maricopa County"
        },
        {
            Geography: "Pinal County"
        },
        {
            Geography: "Apache Junction"
        },
        {
            Geography: "Avondale"
        },
        {
            Geography: "Buckeye"
        },
        {
            Geography: "Carefree"
        },
        {
            Geography: "Cave Creek"
        },
        {
            Geography: "Chandler"
        },
        {
            Geography: "El Mirage"
        },
        {
            Geography: "Florence"
        },
        {
            Geography: "Fountain Hills"
        },
        {
            Geography: "Gila Bend"
        },
        {
            Geography: "Gilbert"
        },
        {
            Geography: "Glendale"
        },
        {
            Geography: "Goodyear"
        },
        {
            Geography: "Guadalupe"
        },
        {
            Geography: "Litchfield Park"
        },
        {
            Geography: "Maricopa (City)"
        },
        {
            Geography: "Mesa"
        },
        {
            Geography: "Paradise Valley"
        },
        {
            Geography: "Peoria"
        },
        {
            Geography: "Phoenix"
        },
        {
            Geography: "Queen Creek"
        },
        {
            Geography: "Scottsdale"
        },
        {
            Geography: "Surprise"
        },
        {
            Geography: "Tempe"
        },
        {
            Geography: "Tolleson"
        },
        {
            Geography: "Wickenburg"
        },
        {
            Geography: "Youngtown"
        },
    ];

    var GeographyListFDI = [{
            Geography: "Arizona"
        },
        {
            Geography: "Phoenix MSA"
        },
        {
            Geography: "Maricopa County"
        },
        {
            Geography: "Pinal County"
        },
        {
            Geography: "Apache Junction"
        },
        {
            Geography: "Avondale"
        },
        {
            Geography: "Buckeye"
        },
        {
            Geography: "Carefree"
        },
        {
            Geography: "Cave Creek"
        },
        {
            Geography: "Chandler"
        },
        {
            Geography: "El Mirage"
        },
        {
            Geography: "Florence"
        },
        {
            Geography: "Fountain Hills"
        },
        {
            Geography: "Gila Bend"
        },
        {
            Geography: "Gilbert"
        },
        {
            Geography: "Glendale"
        },
        {
            Geography: "Goodyear"
        },
        {
            Geography: "Guadalupe"
        },
        {
            Geography: "Litchfield Park"
        },
        {
            Geography: "Maricopa (City)"
        },
        {
            Geography: "Mesa"
        },
        {
            Geography: "Paradise Valley"
        },
        {
            Geography: "Peoria"
        },
        {
            Geography: "Phoenix"
        },
        {
            Geography: "Queen Creek"
        },
        {
            Geography: "Scottsdale"
        },
        {
            Geography: "Surprise"
        },
        {
            Geography: "Tempe"
        },
        {
            Geography: "Tolleson"
        },
        {
            Geography: "Wickenburg"
        },
        {
            Geography: "Youngtown"
        },
    ];

    var GeographyListMSAOnly = [{
        Geography: "Phoenix MSA"
    }, ];

    function refreshlist() {
        if (indextest == "Overview") {
            GeographyList = GeographyListOverview;
            dropdown();
        } else if (indextest == "Foreign-Owned Businesses") {
            GeographyList = GeographyListFDI;
            dropdown();
        } else if (indextest == "FDI Table") {
            GeographyList = GeographyListMSAOnly;
            dropdown();
        }
    }

    GeographyList = GeographyListOverview;
    dropdown();

    var geoselected = "Phoenix MSA";

    function dropdown() {
        $("#geography").kendoDropDownList({
            filter: "startswith",
            dataSource: GeographyList,
            dataTextField: "Geography",
            dataValueField: "Geography",
            value: geoselected,
            select: function (e) {
                var item = e.dataItem.Geography;
                $(".selectedgeographyFDI").html(e.dataItem.Geography);
                $(".selectedgeography").html(e.dataItem.Geography);
                geoselected = e.dataItem.Geography;
                if (e.dataItem.Geography == "Arizona") {
                    overviewgeography = "Phoenix MSA";
                } else {
                    overviewgeography = geoselected;
                }


                //FDI CHART HEIGHT
                if (item == 'Maricopa County' || item == 'Phoenix MSA' || item == 'Arizona' || item == 'Phoenix') {
                    fdiChartHeight = 635;
                } else if (item == 'Carefree' || item == 'Cave Creek' || item == 'Guadalupe' || item == 'Youngtown') {
                    fdiChartHeight = 450;
                } else if (item == 'Paradise Valley') {
                    fdiChartHeight = 250;
                } else if (item == 'El Mirage' || item == 'Florence' || item == 'Gila Bend' || item == 'Litchfield Park') {
                    fdiChartHeight = 550;
                } else {
                    fdiChartHeight = 635;
                }

                //Geography Filter
                if (item == 'Maricopa County') {
                    fdiquery = "(County='Maricopa') AND International=1";
                    overviewquery = "(County='Maricopa') AND Employees > 4";
                } else if (item == 'Arizona') {
                    fdiquery = "International=1";
                    overviewquery = "(County='Pinal'or County='Maricopa') AND Employees > 4"; //overview: MSA
                    $(".selectedgeography").html("Phoenix MSA");
                } else if (item == 'Pinal County') {
                    fdiquery = "(County='Pinal') AND International=1";
                    overviewquery = "(County='Pinal') AND Employees > 4";
                } else if (item == 'Phoenix MSA') {
                    fdiquery = "(County='Pinal' or County='Maricopa') AND International=1";
                    overviewquery = "(County='Pinal'or County='Maricopa') AND Employees > 4";
                } else if (item == 'Maricopa (City)') {
                    fdiquery = "(Jurisdiction='Maricopa') AND International=1";
                    overviewquery = "(Jurisdiction='Maricopa') AND Employees > 4";
                } else {
                    fdiquery = "Jurisdiction='" + item + "' and International=1";
                    overviewquery = "Jurisdiction='" + item + "' AND Employees > 4";
                }

                //add "the" for MSA
                if (item == 'Phoenix MSA') {
                    $(".addthe").html("the ");
                } else {
                    $(".addthe").html("");
                }

                if (item == 'Arizona') {
                    $(".fdisrcyr").html(azsourceyear);
                } else {
                    $(".fdisrcyr").html(sourceyear);

                }

                //spinner loading
                displayLoading(".totaloverview");
                displayLoading("#top20grid");
                displayLoading(".top20sharesection");
                displayLoading("#clusterchart");
                displayLoading("#keyindchart");
                displayLoading("#fdiChart");
                displayLoading("#fdiGridshow");
                displayLoading("#fdiparentGrid");
                displayLoading("#clusterchartfdi");
                displayLoading("#keyindchartfdi");

                //actions for all
                $(".filteredKI").html("");
                $(".filteredCluster").html("");
                $(".filteredsimple").html("&nbsp;");
                $(".inindustry").html(" ");
                $(".overviewreset").hide();
                $(".filternoteCluster").show();
                $(".filternoteKI").show();
                $(".filteredcategoryFDI").html("");
                $(".filteredsimplefdi").html(" ");
                $(".clustersection").show(); //added 10/17/19
                $(".keyindsection").show(); //added 10/17/19
                checkCountriesFilter = 1;
                fdifiltertext = "";
                toggleClick = 1;
                toggleClickfdi = 1;
                overviewfilterapplied = "";
                top20overviewfilterapplied = "";
                makedashboard();
            }
        });
    }

    $(".selectedgeography").html("Phoenix MSA");
    $(".selectedgeographyFDI").html("Phoenix MSA"); //default MSA selected
    $(".addthe").html("the ");

    function GetDataGroupedByFields(data, flds) {
        var obj = {};
        var templateObj = {};

        flds.forEach(function (fld) {
            templateObj[fld] = "";
        });

        data.forEach(function (row) {

            var fldKey = "";

            flds.forEach(function (fld) {

                if (typeof row[fld] === 'string' || row[fld] instanceof String) {
                    fldKey += row[fld].toLowerCase(); //if string, added toLowerCase() so it's not case-sensitive
                } else {
                    fldKey += row[fld]; //else (KI Chart) normal
                }
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

            //Increment location
            obj[fldKey].Locations = obj[fldKey].Locations || 0;
            obj[fldKey].Locations++;
        });

        return Object.keys(obj).map(function (key) {
            if (obj[key].Employees < 10) {
                var rtnObj = {
                    Employees: obj[key].Employees,
                    Locations: obj[key].Locations,
                    EmployeesRAW: obj[key].Employees
                };
            } else {
                var rtnObj = {
                    Employees: Math.round(obj[key].Employees / 10) * 10,
                    Locations: obj[key].Locations,
                    EmployeesRAW: obj[key].Employees
                }; //Rounding if 10+ Employees
            }
            flds.forEach(function (fld) {
                rtnObj[fld] = obj[key][fld];
            });

            return rtnObj;
        });
    }

    function displayLoading(target) {
        var element = $(target);
        kendo.ui.progress(element, true);
        setTimeout(function () {
            kendo.ui.progress(element, false);
        }, 1000);
    }


    function makedashboard() {
        fdifilterquery = fdiquery;
        $(".fdireset").hide();

        function FDIcountrysection() {
            $(".FDIcountry").html(""); //reset filter label for FDI
            arcgisRest.queryFeatures({
                url: empUrl,
                where: fdifilterquery,
                returnGeometry: false,
                orderByFields: "Employees Desc",
                outFields: [
                    "EmpName", "Cluster", "Employees", "County", "UltimateParentCountry", "International",
                    "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr",
                    "UltimateParentName", "Jurisdiction"
                ]
            }).then(function (res) {
                var features = res.features;

                var data = features.map(function (feature) {
                    return feature.attributes;
                });

                var groupbyCountry = GetDataGroupedByFields(data, ["UltimateParentCountry"]);
                totalCountries = groupbyCountry.length;
                $("#totalFDICountries").html(kendo.toString(totalCountries, 'n0'));

                function dynamicfdicharttitle() {
                    if (totalCountries < 20) {
                        $("#fdicharttitle").html("Parent Countries");
                    } else {
                        $("#fdicharttitle").html("Top 20 Parent Countries");
                    }
                }
                dynamicfdicharttitle();

                var dsfdichart = new kendo.data.DataSource({
                    data: GetDataGroupedByFields(data, ["UltimateParentCountry"]),
                    pageSize: 20, //Top 20 FDI Parent Countries
                    sort: {
                        field: "EmployeesRAW",
                        dir: "desc"
                    },
                });

                var fdicountryfile = geoselected + " - FDI Parent Countries" + fdifiltertext;

                $("#fdichartgrid").kendoGrid({
                    dataSource: dsfdichart,
                    excel: {
                        fileName: fdicountryfile + ".xlsx",
                        allPages: true
                    },
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database, jobs 10+ rounded to nearest 10",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: fdicountryfile,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });
                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        fdipromises[1].resolve(e.workbook);
                        fdipromise[0].resolve(e.workbook);
                    },
                    columns: [{
                        field: "UltimateParentCountry",
                        title: "Parent Country",
                        attributes: {
                            style: "text-align:left;"
                        },
                        width: "75%",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }, {
                        field: "Employees",
                        title: "Jobs",
                        attributes: {
                            style: "text-align:left;"
                        },
                        template: "#=kendo.toString(Employees,'n0')#",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }]
                });

                function clickFDIcountrybar(e) {
                    if (toggleClickfdi == 1 || toggleClickfdi == 3) {
                        totalCountries = null;
                        checkCountriesFilter = null;
                        toggleClickfdi = 3;
                        $(".fdireset").show();
                        $(".fdifiltertype").html("Parent Country ")

                        var chart = $("#fdiChart").data("kendoChart");
                        for (i = 0; i < chart.options.series[0].data.length; i++) {
                            chart.options.series[0].data[i].userColor = "lightgray"; //#3866bf
                        }
                        e.dataItem.userColor = "#2FC4CD";
                        chart.refresh();

                        //dynamic text
                        var item = e.dataItem.UltimateParentCountry;
                        $(".FDIcountry").html("Parent Country: " + item);
                        var selectedparent = e.dataItem.UltimateParentCountry;
                        fdifiltertext = " - Filter: " + selectedparent;

                        //filter cluster FDI chart
                        var addand = " AND ";
                        var test1 = fdiquery + addand + "UltimateParentCountry='" + item + "'";
                        fdifilterquery = test1;
                        makeFDIclusterchart();
                        makeFDIkeyindchart();
                        calculateFDItotals();
                        gridsEmpParent();
                        $(".fdicountriesnumber").hide(); //placeholder-hide

                        displayLoading("#fdiGridshow");
                        displayLoading("#fdiparentGrid");
                        displayLoading("#clusterchartfdi");
                        displayLoading("#keyindchartfdi");
                    } else {}
                }

                function clickFDIcountryaxis(e) {
                    if (toggleClickfdi == 1 || toggleClickfdi == 3) {
                        totalCountries = null;
                        checkCountriesFilter = null;
                        toggleClickfdi = 3;
                        $(".fdireset").show();
                        $(".fdifiltertype").html("Parent Country ")

                        var chart = $("#fdiChart").data("kendoChart");
                        for (i = 0; i < chart.options.series[0].data.length; i++) {
                            chart.options.series[0].data[i].userColor = "lightgray"; //3866bf
                        }
                        e.dataItem.userColor = "#2baab1";
                        chart.refresh();

                        //dynamic text
                        var item = e.dataItem.UltimateParentCountry;
                        $(".FDIcountry").html(" (" + item + ")");
                        var selectedparent = e.dataItem.UltimateParentCountry;
                        fdifiltertext = " - Filter: " + selectedparent;

                        //filter cluster FDI chart
                        var addand = " AND ";
                        var test1 = fdiquery + addand + "UltimateParentCountry='" + item + "'";
                        fdifilterquery = test1;
                        makeFDIclusterchart();
                        makeFDIkeyindchart();
                        calculateFDItotals();
                        gridsEmpParent();
                        $(".fdicountriesnumber").hide(); //placeholder-hide

                        displayLoading("#fdiGridshow");
                        displayLoading("#fdiparentGrid");
                        displayLoading("#clusterchartfdi");
                        displayLoading("#keyindchartfdi");
                    } else {}
                }

                $("#fdiChart").kendoChart({
                    theme: "Office365",
                    seriesDefaults: {
                        type: "bar",
                    },
                    dataSource: dsfdichart,
                    chartArea: {
                        height: fdiChartHeight
                    },
                    seriesDefaults: {
                        type: "bar",
                        gap: 0.7,
                    },
                    series: [{
                        field: "EmployeesRAW",
                        color: "#3866bf",
                        colorField: "userColor"
                    }],
                    categoryAxis: {
                        field: "UltimateParentCountry",
                        minorGridLines: {
                            visible: false
                        },
                        majorGridLines: {
                            visible: false
                        },
                        labels: {
                            visible: true,
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    valueAxis: {
                        title: {
                            text: "Jobs",
                            font: "13px Open Sans, sans-serif"
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
                        template: "<strong>#=category #</strong><br>#=kendo.toString(dataItem.Employees,'n0')# Jobs"
                    }
                });
            });
        }
        FDIcountrysection();

        $(".fdireset").click(function () {
            checkCountriesFilter = 1;
            fdifilterclicked = 0;
            displayLoading("#fdiChart");
            displayLoading("#fdiGridshow");
            displayLoading("#fdiparentGrid");
            displayLoading("#clusterchartfdi");
            displayLoading("#keyindchartfdi");

            $(".fdireset").hide();
            $(".FDIcountry").html("");
            $(".filteredcategoryFDI").html("");
            $(".filteredsimplefdi").html(" ");
            fdifilterquery = fdiquery;
            makeFDIclusterchart();
            gridsEmpParent();
            makeFDIkeyindchart();
            calculateFDItotals();
            FDIcountrysection();
            toggleClickfdi = 1;
            $(".fdicountriesnumber").show();
            fdifiltertext = "";

            $(".fdiclustersection").show();
            $(".fdikeyindsection").show();
        });

        fdifilterquery = fdiquery;

        function gridsEmpParent() {
            arcgisRest.queryFeatures({
                url: empUrl,
                where: fdifilterquery, //Maricopa Only and 5+ Employees
                returnGeometry: false,
                orderByFields: "Employees Desc",
                outFields: [
                    "EmpName", "Cluster", "Employees", "County", "International",
                    "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction", "UltimateParentCountry", "UltimateParentName"
                ]
            }).then(function (res) {
                var features = res.features;
                var data = features.map(function (feature) {
                    return feature.attributes;
                });

                var dsfdi = new kendo.data.DataSource({
                    data: GetDataGroupedByFields(data, ["EmpName", "UltimateParentName", "UltimateParentCountry"]),
                    pageSize: 10,
                    sort: {
                        field: "EmployeesRAW",
                        dir: "desc"
                    },
                });

                var fdiempfile = geoselected + " - FDI Employers" + fdifiltertext;

                $("#fdiGridshow").kendoGrid({
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
                        width: "25%",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        },
                        headerTemplate: "<span title='Parent Country'>Parent Country<a href='#note' style='color:#2baab1;'>*</a></span>"
                    }, {
                        field: "Locations",
                        attributes: {
                            style: "text-align:left;"
                        },
                        template: "#=kendo.toString(Locations,'n0')#",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        },
                        headerTemplate: "<span title='Locations'>Locations</span>"
                    }, {
                        field: "Employees",
                        width: "13%",
                        title: "Jobs",
                        attributes: {
                            style: "text-align:left;"
                        },
                        template: "#=kendo.toString(Employees,'n0')#",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }],
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
                        field: "UltimateParentName",
                        title: "Parent Company",
                        attributes: {
                            style: "text-align:left;"
                        },
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }, {
                        field: "UltimateParentCountry",
                        title: "Parent Country",
                        attributes: {
                            style: "text-align:left;"
                        },
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }, {
                        field: "Locations",
                        attributes: {
                            style: "text-align:left;"
                        },
                        template: "#=kendo.toString(Locations,'n0')#",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }, {
                        field: "Employees",
                        width: "13%",
                        title: "Jobs",
                        attributes: {
                            style: "text-align:left;"
                        },
                        template: "#=kendo.toString(Employees,'n0')#",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }],
                    excel: {
                        fileName: fdiempfile + ".xlsx",
                        allPages: true
                    },
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database, jobs 10+ rounded to nearest 10",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: fdiempfile,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });
                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        fdipromise[0].resolve(e.workbook);
                        fdipromises[2].resolve(e.workbook);
                    },
                });

                var dsfdiparent = new kendo.data.DataSource({
                    data: GetDataGroupedByFields(data, ["UltimateParentName", "UltimateParentCountry"]),
                    pageSize: 5,
                    sort: {
                        field: "EmployeesRAW",
                        dir: "desc"
                    },
                });

                var fdiparentfile = geoselected + " - FDI Parent Companies" + fdifiltertext;

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
                        width: "25%",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        },
                        headerTemplate: "<span title='Parent Country'>Parent Country<a href='#note' style='color:#2baab1;'>*</a></span>"
                    }, {
                        field: "Locations",
                        attributes: {
                            style: "text-align:left;"
                        },
                        template: "#=kendo.toString(Locations,'n0')#",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        },
                        headerTemplate: "<span title='Locations'>Locations</span>"
                    }, {
                        field: "Employees",
                        title: "Jobs",
                        width: "13%",
                        attributes: {
                            style: "text-align:left;"
                        },
                        template: "#=kendo.toString(Employees,'n0')#",
                        headerAttributes: {
                            style: "font-weight:bold;"
                        }
                    }],
                    excel: {
                        fileName: fdiparentfile + ".xlsx",
                        allPages: true
                    },
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database, jobs 10+ rounded to nearest 10",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: fdiparentfile,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });
                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        fdipromise[0].resolve(e.workbook);
                        fdipromises[3].resolve(e.workbook);
                    },
                });
            });
        }
        gridsEmpParent();

        function calculateFDItotals() {
            arcgisRest.queryFeatures({
                url: empUrl,
                where: fdifilterquery, //Maricopa Only and 5+ Employees
                returnGeometry: false,
                orderByFields: "Employees Desc",
                outFields: [
                    "EmpName", "Cluster", "Employees", "County", "International",
                    "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction", "UltimateParentCountry"
                ]
            }).then(function (res) {
                var features = res.features;
                var data = features.map(function (feature) {
                    return feature.attributes;
                });

                var groupbyEmpName = GetDataGroupedByFields(data, ["EmpName"]);
                var totalBusFDI = groupbyEmpName.length;
                $("#totalbusinessesfdi").html(kendo.toString(totalBusFDI, 'n0'));

                var allemp = GetDataGroupedByFields(data, ["EmpName"]);
                allemp.sort(function (a, b) {
                    return b.EmployeesRAW - a.EmployeesRAW
                });
                var sumallemp = allemp.reduce(function (prev, cur) {
                    return prev + cur.EmployeesRAW;
                }, 0);
                if (sumallemp < 10) {
                    $("#totaljobsfdi").html(sumallemp);
                    totaljobsfdi = sumallemp;
                } else {
                    $("#totaljobsfdi").html(kendo.toString(Math.round(sumallemp / 10) * 10, 'n0'));
                    totaljobsfdi = Math.round(sumallemp / 10) * 10;
                }

                var parentCountriesTitle;
                if (checkCountriesFilter !== null) {
                    excelCountries = totalCountries;
                    parentCountriesTitle = "Parent Countries";
                } else {
                    parentCountriesTitle = null;
                }

                $("#fditotalsgrid").kendoGrid({
                    excel: {
                        fileName: "FDITotals.xlsx",
                        allPages: true
                    },
                    excelExport: function (e) {
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });
                        e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: "* 'Parent Country' refers to the origin country of the foreign-owned employer's parent company.",
                                    italic: false,
                                    fontSize: 12,
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: "Note: Jobs 10+ rounded to nearest 10",
                                    italic: false,
                                    fontSize: 12,
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: "Source: 2018 MAG Employer Database",
                                    italic: false,
                                    fontSize: 12,
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: totalCountries
                                }, {
                                    value: parentCountriesTitle,
                                }, ]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: totaljobsfdi
                                }, {
                                    value: "Jobs",
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({

                                cells: [{
                                    value: totalBusFDI
                                }, {
                                    value: "Employers",
                                }]
                            }),

                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: geoselected + " Foreign-Owned Businesses" + fdifiltertext,
                                    bold: true,
                                    // underline: true
                                }]
                            })


                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }

                        e.preventDefault();
                        fdipromises[0].resolve(e.workbook);
                    }
                });
            });
        }
        calculateFDItotals();

        function clickClusterfdi(e) {
            if (toggleClickfdi == 1 || toggleClickfdi == 2) {
                fdifilterclicked = 1;
                //filter calculate totals - add cluster filter
                $(".fdifiltertype").html("Cluster ")
                toggleClickfdi = 2;
                var selectedcluster = e.category;
                var addand = " AND ";
                var test1 = fdiquery + addand + "Cluster='" + selectedcluster + "'";
                fdifilterquery = test1;

                calculateFDItotals(); //filters totals
                makeFDIkeyindchart(); //filters key industries
                FDIcountrysection();
                gridsEmpParent();

                fdifiltertext = " - Filter: " + selectedcluster; //add filter to excel export

                //apply the filters
                $(".filteredcategoryFDI").html("Industry Cluster: " + e.category);
                $(".filteredsimplefdi").html(" " + e.category + " ");

                var chart = $("#clusterchartfdi").data("kendoChart");
                for (i = 0; i < chart.options.series[0].data.length; i++) {
                    chart.options.series[0].data[i].userColor = "lightgray";
                }
                e.dataItem.userColor = "#2baab1";
                chart.refresh();

                displayLoading("#fdiChart");
                displayLoading("#fdiGridshow");
                displayLoading("#fdiparentGrid");
                displayLoading("#keyindchartfdi");

                $(".fdireset").show();
                $(".fdikeyindsection").hide();
                checkCountriesFilter = 1;
            } else {}
        }

        function makeFDIclusterchart() {
            arcgisRest.queryFeatures({
                url: empUrl,
                where: fdifilterquery, //Maricopa Only and 5+ Employees
                returnGeometry: false,
                orderByFields: "Employees Desc",
                outFields: [
                    "EmpName", "Cluster", "Employees", "County", "International",
                    "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction", "UltimateParentCountry"
                ]
            }).then(function (res) {
                var features = res.features;
                var data = features.map(function (feature) {
                    return feature.attributes;
                });


                var dataclustersfdi = GetDataGroupedByFields(data, ["Cluster"]);
                dataclustersfdi.sort(function (a, b) {
                    return b.EmployeesRAW - a.EmployeesRAW
                });

                var fdiclusterexcel = geoselected + "- FDI Employment by Clusters" + fdifiltertext;

                $("#clustergridfdi").kendoGrid({
                    excel: {
                        fileName: fdiclusterexcel + ".xlsx",
                        allPages: false
                    },
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: fdiclusterexcel,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });
                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        fdipromise[0].resolve(e.workbook);
                        fdipromises[4].resolve(e.workbook);
                    },
                    dataSource: {
                        data: dataclustersfdi,
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
                        title: "Jobs",
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

                $("#clusterchartfdi").kendoChart({
                    theme: "Office365",
                    dataSource: dataclustersfdi,
                    seriesDefaults: {
                        type: "bar",
                        gap: 0.5,
                        labels: {
                            visible: false,
                            template: "#=kendo.toString(value,'n0')#",
                            font: "10px Open Sans, sans-serif"
                        }
                    },
                    chartArea: {
                        height: 500,
                        margin: {
                            left: 75,
                            right: 75
                        }
                    },
                    series: [{
                        field: "Employees",
                        color: "#9bbb59",
                        colorField: "userColor"
                    }],
                    valueAxis: {
                        labels: {
                            rotation: "auto",
                            font: "12px Open Sans, sans-serif",
                            format: "#,#"
                        },
                        title: {
                            text: "Jobs",
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    categoryAxis: {
                        field: "Cluster",
                        labels: {
                            visible: true,
                            font: "13px Open Sans, sans-serif",
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
                    },
                    seriesClick: clickClusterfdi
                });
            });
        }
        makeFDIclusterchart();

        function makeFDIkeyindchart() {
            arcgisRest.queryFeatures({
                url: empUrl,
                where: fdifilterquery, //Maricopa Only and 5+ Employees
                returnGeometry: false,
                orderByFields: "Employees Desc",
                outFields: [
                    "EmpName", "Cluster", "Employees", "County", "International",
                    "Aerospace", "Finance", "HealthCare", "InfoTech", "Manufacturing", "WhseDistr", "Jurisdiction", "UltimateParentCountry"
                ]
            }).then(function (res) {
                var features = res.features;
                var data = features.map(function (feature) {
                    return feature.attributes;
                });
                var keyind1 = GetDataGroupedByFields(data, ["Aerospace"]);
                var Aerospace = keyind1.pop();
                var AeroJobsRAW = Aerospace.EmployeesRAW * Aerospace.Aerospace;
                var AeroJobs = Aerospace.Employees * Aerospace.Aerospace;

                var keyind2 = GetDataGroupedByFields(data, ["Finance"]);
                var Finance = keyind2.pop();
                var FinJobsRAW = Finance.EmployeesRAW * Finance.Finance;
                var FinJobs = Finance.Employees * Finance.Finance;

                var keyind3 = GetDataGroupedByFields(data, ["HealthCare"]);
                var Healthcare = keyind3.pop();
                var HealthJobsRAW = Healthcare.EmployeesRAW * Healthcare.HealthCare;
                var HealthJobs = Healthcare.Employees * Healthcare.HealthCare;

                var keyind4 = GetDataGroupedByFields(data, ["InfoTech"]);
                var Infotech = keyind4.pop();
                var InfoJobsRAW = Infotech.EmployeesRAW * Infotech.InfoTech;
                var InfoJobs = Infotech.EmployeesRAW * Infotech.InfoTech;

                var keyind5 = GetDataGroupedByFields(data, ["Manufacturing"]);
                var Manufacturing = keyind5.pop();
                var ManufJobsRAW = Manufacturing.EmployeesRAW * Manufacturing.Manufacturing;
                var ManufJobs = Manufacturing.Employees * Manufacturing.Manufacturing;

                var keyind6 = GetDataGroupedByFields(data, ["WhseDistr"]);
                var Whsedistr = keyind6.pop();
                var WDJobsRAW = Whsedistr.EmployeesRAW * Whsedistr.WhseDistr;
                var WDJobs = Whsedistr.Employees * Whsedistr.WhseDistr;

                var keyindustriesfdi = [{
                        "name": "Aerospace",
                        "JobsRAW": AeroJobsRAW,
                        "Jobs": AeroJobs,
                        "field": "Aerospace"
                    },
                    {
                        "name": "Finance",
                        "JobsRAW": FinJobsRAW,
                        "Jobs": FinJobs,
                        "field": "Finance"
                    },
                    {
                        "name": "Health Care",
                        "JobsRAW": HealthJobsRAW,
                        "Jobs": HealthJobs,
                        "field": "HealthCare"
                    },
                    {
                        "name": "Information Technology",
                        "JobsRAW": InfoJobsRAW,
                        "Jobs": InfoJobs,
                        "field": "InfoTech"
                    },
                    {
                        "name": "Manufacturing",
                        "JobsRAW": ManufJobsRAW,
                        "Jobs": ManufJobs,
                        "field": "Manufacturing"
                    },
                    {
                        "name": "Warehouse and Distribution",
                        "JobsRAW": WDJobsRAW,
                        "Jobs": WDJobs,
                        "field": "WhseDistr"
                    }
                ];

                function clickKIfdi(e) {
                    if (toggleClickfdi == 1 || toggleClickfdi == 4) {

                        fdifilterclicked = 2;
                        //filter calculate totals - add cluster filter
                        $(".fdifiltertype").html("Key Industry ")
                        toggleClickfdi = 4;
                        var selectedKI = e.dataItem.field;
                        var selectedKIname = e.dataItem.name;
                        var addand = " AND ";
                        var test1 = fdiquery + addand + selectedKI + "=1";
                        fdifilterquery = test1;

                        calculateFDItotals(); //filters totals
                        makeFDIclusterchart(); //filters key industries
                        FDIcountrysection();
                        gridsEmpParent();

                        fdifiltertext = " - Filter: " + selectedKIname; //add filter to excel export

                        //apply the filters
                        $(".filteredcategoryFDI").html("Key Industry: " + e.category);
                        $(".filteredsimplefdi").html(" " + e.category + " ");

                        var chart = $("#keyindchartfdi").data("kendoChart");
                        for (i = 0; i < chart.options.series[0].data.length; i++) {
                            chart.options.series[0].data[i].userColor = "lightgray";
                        }
                        e.dataItem.userColor = "#2baab1";
                        chart.refresh();

                        //loading spinner
                        displayLoading("#fdiChart");
                        displayLoading("#fdiGridshow");
                        displayLoading("#fdiparentGrid");
                        displayLoading("#clusterchartfdi");

                        $(".fdireset").show();
                        $(".fdiclustersection").hide();
                        checkCountriesFilter = 1;
                    } else {}
                }

                var fdikeyindexcel = geoselected + " - FDI Employment by Key Industry" + fdifiltertext;

                $("#keyindgridfdi").kendoGrid({
                    excel: {
                        fileName: fdikeyindexcel + ".xlsx",
                        allPages: false
                    },
                    dataSource: keyindustriesfdi,
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
                    }],
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: fdikeyindexcel,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });

                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        fdipromise[0].resolve(e.workbook);
                        if (fdifilterclicked == 0) {
                            fdipromises[5].resolve(e.workbook);
                        } else if (fdifilterclicked == 2) {
                            fdipromises[4].resolve(e.workbook);
                        }
                    },
                });

                $("#keyindchartfdi").kendoChart({
                    theme: "Office365",
                    dataSource: {
                        data: keyindustriesfdi,
                        sort: {
                            field: "JobsRAW",
                            dir: "desc"
                        }
                    },
                    chartArea: {
                        height: 250,
                        margin: {
                            left: 100,
                            right: 100
                        }
                    },
                    seriesDefaults: {
                        type: "bar",
                        gap: 0.5
                    },
                    series: [{
                        field: "Jobs",
                        color: "#f79664",
                        colorField: "userColor"
                    }],
                    categoryAxis: {
                        field: "name",
                        labels: {
                            visible: true,
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    valueAxis: {
                        labels: {
                            rotation: "auto",
                            font: "12px Open Sans, sans-serif",
                            format: "#,#"
                        },
                        title: {
                            text: "Jobs",
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
                    },
                    seriesClick: clickKIfdi
                });
            });
        }
        makeFDIkeyindchart();

        var filterquery = overviewquery;

        function calculateTotals() {
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
                var data = features.map(function (feature) {
                    return feature.attributes;
                });

                var groupbyEmpName = GetDataGroupedByFields(data, ["EmpName"]);
                totalBus = groupbyEmpName.length;
                $("#totalbusinesses").html(kendo.toString(totalBus, 'n0'));

                var totallocations = data.length;
                $("#totallocations").html(kendo.toString(totallocations, 'n0'));

                var allemp = GetDataGroupedByFields(data, ["EmpName"]);
                allemp.sort(function (a, b) {
                    return b.EmployeesRAW - a.EmployeesRAW
                });

                var sumallemp = allemp.reduce(function (prev, cur) {
                    return prev + cur.EmployeesRAW;
                }, 0);

                if (sumallemp < 10) {
                    $("#totaljobs").html(sumallemp);
                    totaljobs = sumallemp;
                } else {
                    $("#totaljobs").html(kendo.toString(Math.round(sumallemp / 10) * 10, 'n0'));
                    totaljobs = Math.round(sumallemp / 10) * 10;
                }

                var top20emp = allemp.slice(0, 20);
                var sumtop20emp = top20emp.reduce(function (prev, cur) {
                    return prev + cur.EmployeesRAW;
                }, 0);

                var top20percent = sumtop20emp / sumallemp;

                $(".top20percent").html(kendo.toString(top20percent * 100, 'n0'));

                //export Totals TEST

                if (overviewfilterapplied !== "") {
                    filtertext = " - Filter: ";
                } else {
                    filtertext = "";
                }

                $("#totalsgrid").kendoGrid({
                    excel: {
                        fileName: "Totals.xlsx",
                        allPages: true
                    },
                    excelExport: function (e) {
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });

                        e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: "Note: Jobs 10+ rounded to nearest 10",
                                    italic: false,
                                    fontSize: 12,
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: "Source: 2018 MAG Employer Database, business locations with 5+ employees",
                                    italic: false,
                                    fontSize: 12,
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: totaljobs
                                }, {
                                    value: "Jobs",
                                    // background: "#717171",
                                    // color: "#ffffff",
                                    // bold: true,
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({

                                cells: [{
                                    value: totalBus
                                }, {
                                    value: "Employers",
                                    // background: "#717171",
                                    // color: "#ffffff",
                                    // bold: true,
                                }]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: totallocations
                                }, {
                                    value: "Business Locations",
                                    // background: "#717171",
                                    // color: "#ffffff",
                                    // bold: true,
                                }, ]
                            }),
                            e.workbook.sheets[0].rows.unshift({
                                cells: [{
                                    value: overviewgeography + " Totals" + filtertext + overviewfilterapplied,
                                    bold: true,
                                    // underline: true
                                }]
                            })


                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }

                        e.preventDefault();
                        promises[0].resolve(e.workbook);
                    }
                });

                //top20grid section
                testtop20data = GetDataGroupedByFields(data, ["EmpName"]);
                datagrid20all = new kendo.data.DataSource({
                    // data: GetDataGroupedByFields(data, ["EmpName"]),
                    data: testtop20data,
                    pageSize: 20,
                    sort: {
                        field: "EmployeesRAW",
                        dir: "desc"
                    },
                });

                filenametest = "Top 20" + top20overviewfilterapplied + " Employers - " + overviewgeography;

                //dynamic grid title
                if (totalBus < 20) {
                    $("#top20gridtitle").html("");
                    $(".overhundredpct").show();
                    $(".top20sharehide").hide();
                    $(".top20sharenotavailable").show();
                } else {
                    $("#top20gridtitle").html("Top 20");
                    $(".overhundredpct").hide();
                    $(".top20sharehide").show();
                    $(".top20sharenotavailable").hide();
                }
                //dynamic grid height
                if (totalBus == 1) {
                    top20height = 3.5 + 32 + 32 * totalBus;
                } else if (totalBus < 20) {
                    top20height = 32 + 32 * totalBus;
                } else {
                    top20height = 300;
                }

                $("#top20grid").kendoGrid({
                    excel: {
                        fileName: filenametest + ".xlsx",
                        allPages: false
                    },
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database, business locations with 5+ employees",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: filenametest,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });

                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        promises[1].resolve(e.workbook);
                        promise[0].resolve(e.workbook);
                    },
                    height: top20height,
                    dataSource: datagrid20all,
                    columns: [{
                        field: "EmpName",
                        title: "Employer Name",
                        width: "55%",
                        attributes: {
                            style: "text-align:left;"
                        },
                        headerAttributes: {
                            style: "font-weight:bold;"
                        },
                    }, {
                        field: "Locations",
                        template: "#=kendo.toString(Locations,'n0')#",
                        attributes: {
                            style: "text-align:right;"
                        },
                        headerAttributes: {
                            style: "font-weight:bold;text-align:center;"
                        },
                        headerTemplate: "<span title='Locations'>Locations</span>"
                    }, {
                        field: "Employees",
                        title: "Jobs",
                        template: "#=kendo.toString(Employees,'n0')#",
                        attributes: {
                            style: "text-align:right;"
                        },
                        headerAttributes: {
                            style: "font-weight:bold;text-align:center;"
                        },
                    }]
                });
            });
        };
        calculateTotals();

        //KeyIndustries
        function calculateKI() {
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
                var data = features.map(function (feature) {
                    return feature.attributes;
                });

                var keyind1 = GetDataGroupedByFields(data, ["Aerospace"]); //console.log(keyind1);
                var Aerospace = keyind1.pop(); //console.log(Aerospace);
                var AeroJobsRAW = Aerospace.EmployeesRAW * Aerospace.Aerospace;
                var AeroJobs = Aerospace.Employees * Aerospace.Aerospace;

                var keyind2 = GetDataGroupedByFields(data, ["Finance"]); //console.log(keyind2);
                var Finance = keyind2.pop(); //console.log(Finance);
                var FinJobsRAW = Finance.EmployeesRAW * Finance.Finance;
                var FinJobs = Finance.Employees * Finance.Finance;

                var keyind3 = GetDataGroupedByFields(data, ["HealthCare"]); //console.log(keyind3);
                var Healthcare = keyind3.pop(); //console.log(Healthcare);
                var HealthJobsRAW = Healthcare.EmployeesRAW * Healthcare.HealthCare;
                var HealthJobs = Healthcare.Employees * Healthcare.HealthCare;

                var keyind4 = GetDataGroupedByFields(data, ["InfoTech"]); //console.log(keyind4);
                var Infotech = keyind4.pop(); //console.log(Infotech);
                var InfoJobsRAW = Infotech.EmployeesRAW * Infotech.InfoTech;
                var InfoJobs = Infotech.Employees * Infotech.InfoTech;

                var keyind5 = GetDataGroupedByFields(data, ["Manufacturing"]); //console.log(keyind5);
                var Manufacturing = keyind5.pop(); //console.log(Manufacturing);
                var ManufJobsRAW = Manufacturing.EmployeesRAW * Manufacturing.Manufacturing;
                var ManufJobs = Manufacturing.Employees * Manufacturing.Manufacturing;

                var keyind6 = GetDataGroupedByFields(data, ["WhseDistr"]); //console.log(keyind6);
                var Whsedistr = keyind6.pop(); //console.log(Whsedistr);
                var WDJobsRAW = Whsedistr.EmployeesRAW * Whsedistr.WhseDistr;
                var WDJobs = Whsedistr.Employees * Whsedistr.WhseDistr;

                var keyindustries = [{
                        "name": "Aerospace",
                        "JobsRAW": AeroJobsRAW,
                        "Jobs": AeroJobs,
                        "field": "Aerospace"
                    },
                    {
                        "name": "Finance",
                        "JobsRAW": FinJobsRAW,
                        "Jobs": FinJobs,
                        "field": "Finance"
                    },
                    {
                        "name": "Health Care",
                        "JobsRAW": HealthJobsRAW,
                        "Jobs": HealthJobs,
                        "field": "HealthCare"
                    },
                    {
                        "name": "Information Technology",
                        "JobsRAW": InfoJobsRAW,
                        "Jobs": InfoJobs,
                        "field": "InfoTech"
                    },
                    {
                        "name": "Manufacturing",
                        "JobsRAW": ManufJobsRAW,
                        "Jobs": ManufJobs,
                        "field": "Manufacturing"
                    },
                    {
                        "name": "Warehouse and Distribution",
                        "JobsRAW": WDJobsRAW,
                        "Jobs": WDJobs,
                        "field": "WhseDistr"
                    }
                ]; //console.log(keyindustries);

                var keyindnametest = overviewfilterapplied + "Employment by Key Industry - " + overviewgeography;

                $("#keyindgrid").kendoGrid({
                    excel: {
                        fileName: keyindnametest + ".xlsx",
                        allPages: false
                    },
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
                    }],
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database, business locations with 5+ employees",
                                italic: false,
                                fontSize: 12,
                                background: "#ffffff",
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: keyindnametest,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });

                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        promise[0].resolve(e.workbook); //jQuery.Deferred exception: Cannot read property 'resolve' of undefined TypeError: Cannot read property 'resolve' of undefined
                        if (filterclicked == 0) {
                            promises[3].resolve(e.workbook);
                        } else if (filterclicked == 2) {
                            promises[2].resolve(e.workbook);
                        }
                    },
                });

                function clickKI(e) {
                    if (toggleClick == 1 || toggleClick == 3) {
                        filterclicked = 2;
                        $(".filternoteCluster").hide();
                        $(".overviewfiltertype").html("Key Industry ")
                        toggleClick = 3;
                        filterquery = overviewquery;
                        $("#keyindchart").data("kendoChart").refresh();
                        //filter calculate totals - add ki filter
                        var selectedKI = e.dataItem.field;
                        var selectedKIname = e.dataItem.name;
                        var addand = " AND ";
                        var test1 = overviewquery + addand + selectedKI + "=1";
                        filterquery = test1;
                        calculateTotals();
                        calculateClusters();
                        overviewfilterapplied = selectedKIname + " ";
                        top20overviewfilterapplied = " " + selectedKIname;

                        //apply the filters
                        $(".filteredKI").html("Key Industry: " + e.category);
                        $(".filteredsimple").html(" " + e.category + " ");
                        $(".inindustry").html(" in this industry ");
                        $(".within").html("within ");
                        $(".withinCluster").html("");

                        var chart = $("#keyindchart").data("kendoChart");
                        for (i = 0; i < chart.options.series[0].data.length; i++) {
                            chart.options.series[0].data[i].userColor = "lightgray"; //#f79664
                        }
                        e.dataItem.userColor = "#2baab1";
                        chart.refresh();

                        //clear previous selections
                        $("#keyindgrid").data("kendoGrid").clearSelection();
                        $("#keyindgrid").data("kendoGrid").refresh();

                        //Select KI grid row
                        $("#keyindgrid").data("kendoGrid").items().each(function () {
                            var data = $("#keyindgrid").data("kendoGrid").dataItem(this);
                            if (data.field == selectedKI) {
                                $("#keyindgrid").data("kendoGrid").select(this);
                            }
                        });

                        //spinner loading
                        displayLoading(".top20sharesection");
                        displayLoading("#top20grid");
                        displayLoading("#clusterchart");

                        $(".overviewreset").show();
                        $(".clustersection").hide();
                    } else {}
                }

                $("#keyindchart").kendoChart({
                    theme: "Office365",
                    dataSource: {
                        data: keyindustries,
                        sort: {
                            field: "JobsRAW",
                            dir: "desc"
                        }
                    },
                    chartArea: {
                        height: 250,
                        margin: {
                            left: 100,
                            right: 100
                        }
                    },
                    seriesDefaults: {
                        type: "bar",
                        gap: 0.5,
                        labels: {
                            visible: false,
                            template: "#=kendo.toString(value,'n0')#",
                            font: "bold 13px Open Sans, sans-serif"
                        }
                    },
                    series: [{
                        field: "Jobs",
                        color: "#f79664",
                        colorField: "userColor"
                    }],
                    categoryAxis: {
                        field: "name",
                        labels: {
                            visible: true,
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    valueAxis: {
                        labels: {
                            rotation: "auto",
                            font: "12px Open Sans, sans-serif",
                            format: "#,#"
                        },
                        title: {
                            text: "Jobs",
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
                    },
                    seriesClick: clickKI
                });
            })
        }
        calculateKI();

        function calculateClusters() {
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
                var data = features.map(function (feature) {
                    return feature.attributes;
                }); //console.log(data);

                var dataclusters = GetDataGroupedByFields(data, ["Cluster"]);
                dataclusters.sort(function (a, b) {
                    return b.EmployeesRAW - a.EmployeesRAW
                }); //console.log(dataclusters);

                function clickCluster(e) {
                    if (toggleClick == 1 || toggleClick == 2) {
                        filterclicked = 1;
                        $(".filternoteKI").hide();
                        $(".overviewfiltertype").html("Cluster ")
                        //filter calculate totals - add cluster filter
                        toggleClick = 2;
                        var selectedcluster = e.category;
                        var addand = " AND ";
                        var test1 = overviewquery + addand + "Cluster='" + selectedcluster + "'";
                        filterquery = test1;

                        calculateTotals(); //filters totals
                        calculateKI(); //filters key industries
                        overviewfilterapplied = selectedcluster + " ";
                        top20overviewfilterapplied = " " + selectedcluster;

                        $(".keyindsection").hide(); //TESTING HIDE

                        //apply the filters
                        $(".filteredCluster").html("Industry Cluster: " + e.category);
                        $(".filteredsimple").html(" " + e.category + " ");
                        $(".inindustry").html(" in this industry ");
                        $(".within").html("within the ");
                        $(".withinCluster").html(" Cluster");

                        var chart = $("#clusterchart").data("kendoChart");
                        for (i = 0; i < chart.options.series[0].data.length; i++) {
                            chart.options.series[0].data[i].userColor = "lightgray"; //#9bbb59
                        }
                        e.dataItem.userColor = "#2baab1";
                        chart.refresh();

                        //clear previous selections
                        $("#clustergrid").data("kendoGrid").clearSelection();
                        $("#clustergrid").data("kendoGrid").refresh();

                        //Select cluster grid row
                        $("#clustergrid").data("kendoGrid").items().each(function () {
                            var data = $("#clustergrid").data("kendoGrid").dataItem(this);
                            if (data.Cluster == selectedcluster) {
                                $("#clustergrid").data("kendoGrid").select(this);
                            }
                        });

                        //load spinner
                        displayLoading(".top20sharesection");
                        displayLoading("#top20grid");
                        displayLoading("#keyindchart");

                        $(".overviewreset").show();
                    } else {}
                }

                var clusternametest = overviewfilterapplied + "Employment by Clusters - " + overviewgeography;

                $("#clustergrid").kendoGrid({
                    excel: {
                        fileName: clusternametest + ".xlsx",
                        allPages: false
                    },
                    excelExport: function (e) {
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Note: Jobs 10+ rounded to nearest 10",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: "Source: 2018 MAG Employer Database, business locations with 5+ employees",
                                background: "#ffffff",
                                italic: false,
                                fontSize: 12,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        e.workbook.sheets[0].rows.unshift({
                            cells: [{
                                value: clusternametest,
                                background: "#ffffff",
                                bold: true,
                                colSpan: 1,
                                color: "#000000",
                                rowSpan: 1,
                            }]
                        })
                        //autowidth columns
                        var columns = e.workbook.sheets[0].columns;
                        columns.forEach(function (column) {
                            delete column.width;
                            column.autoWidth = true;
                        });
                        //number format cells
                        var sheet = e.workbook.sheets[0];
                        for (var rowIndex = 1; rowIndex < sheet.rows.length; rowIndex++) {
                            var row = sheet.rows[rowIndex];
                            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                                row.cells[cellIndex].format = "#,##"
                            }
                        }
                        e.preventDefault();
                        promises[2].resolve(e.workbook);
                        promise[0].resolve(e.workbook);
                    },
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
                        title: "Jobs",
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
                    theme: "Office365",
                    dataSource: dataclusters,
                    seriesDefaults: {
                        type: "bar",
                        gap: 0.5,
                        labels: {
                            visible: false,
                            template: "#=kendo.toString(value,'n0')#",
                            font: "bold 11px Open Sans, sans-serif"
                        }
                    },
                    chartArea: {
                        height: 500,
                        margin: {
                            left: 75,
                            right: 75
                        }
                    },
                    series: [{
                        field: "Employees",
                        color: "#9bbb59",
                        colorField: "userColor"
                    }],
                    valueAxis: {
                        labels: {
                            rotation: "auto",
                            font: "13px Open Sans, sans-serif",
                            format: "#,#"
                        },
                        title: {
                            text: "Jobs",
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    categoryAxis: {
                        field: "Cluster",
                        labels: {
                            visible: true,
                            font: "13px Open Sans, sans-serif"
                        }
                    },
                    tooltip: {
                        visible: true,
                        template: "<strong>#=category #</strong><br> #=kendo.toString(value,'n0')# Jobs"
                    },
                    seriesClick: clickCluster,
                });
            })
        }
        calculateClusters();

        $(".overviewreset").click(function () {
            filterclicked = 0;

            //spinner loading
            displayLoading(".top20sharesection");
            displayLoading("#top20grid");
            displayLoading("#clusterchart");
            displayLoading("#keyindchart");

            //dynamic text
            $(".filteredKI").html("");
            $(".filteredCluster").html("");
            $(".within").html("");
            $(".withinCluster").html("");
            $(".filteredsimple").html("&nbsp;");
            $(".inindustry").html(" ");

            //reset data
            filterquery = overviewquery;
            calculateTotals();
            calculateKI();
            calculateClusters();
            $(".overviewreset").hide();
            toggleClick = 1;
            $(".filternoteKI").show();
            $(".filternoteCluster").show();
            overviewfilterapplied = "";
            top20overviewfilterapplied = "";

            $(".clustersection").show();
            $(".keyindsection").show();
        });
    };
    makedashboard(); //initial page load: Phoenix MSA

    //Export Buttons

    var fdipromises = [$.Deferred(), $.Deferred(), $.Deferred(), $.Deferred(), $.Deferred()];

    function exportFDITab() {
        if (fdifilterclicked == 1) {
            fdipromises = [$.Deferred(), $.Deferred(), $.Deferred(), $.Deferred(), $.Deferred()];
            $("#fditotalsgrid").getKendoGrid().saveAsExcel();
            $("#fdichartgrid").getKendoGrid().saveAsExcel();
            $("#fdiGrid").getKendoGrid().saveAsExcel();
            $("#fdiparentGrid").getKendoGrid().saveAsExcel();
            $("#clustergridfdi").getKendoGrid().saveAsExcel();

            $.when.apply(null, fdipromises)
                .then(function (fdiTotalsWorkbook, countriesWorkbook, topfdiWorkbook, topparentWorkbook, fdiclusterWorkbook) {
                    // create a new workbook using the sheets 
                    var sheets = [
                        fdiTotalsWorkbook.sheets[0],
                        countriesWorkbook.sheets[0],
                        topfdiWorkbook.sheets[0],
                        topparentWorkbook.sheets[0],
                        fdiclusterWorkbook.sheets[0],
                    ];
                    sheets[0].title = "FDI Totals";
                    sheets[1].title = "Parent Countries";
                    sheets[2].title = "Foreign-Owned Employer List";
                    sheets[3].title = "Parent Companies";
                    sheets[4].title = "FDI Industry Clusters";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    // save the new workbook
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: geoselected + "_Foreign_Owned_Businesses" + ".xlsx"
                    })
                })
        } else if (fdifilterclicked == 2) {
            fdipromises = [$.Deferred(), $.Deferred(), $.Deferred(), $.Deferred(), $.Deferred()];
            $("#fditotalsgrid").getKendoGrid().saveAsExcel();
            $("#fdichartgrid").getKendoGrid().saveAsExcel();
            $("#fdiGrid").getKendoGrid().saveAsExcel();
            $("#fdiparentGrid").getKendoGrid().saveAsExcel();
            $("#keyindgridfdi").getKendoGrid().saveAsExcel();

            $.when.apply(null, fdipromises)
                .then(function (fdiTotalsWorkbook, countriesWorkbook, topfdiWorkbook, topparentWorkbook, fdikeyindWorkbook) {
                    // create a new workbook using the sheets 
                    var sheets = [
                        fdiTotalsWorkbook.sheets[0],
                        countriesWorkbook.sheets[0],
                        topfdiWorkbook.sheets[0],
                        topparentWorkbook.sheets[0],
                        fdikeyindWorkbook.sheets[0]
                    ];
                    sheets[0].title = "FDI Totals";
                    sheets[1].title = "Parent Countries";
                    sheets[2].title = "Foreign-Owned Employer List";
                    sheets[3].title = "Parent Companies";
                    sheets[4].title = "FDI Key Industries";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    // save the new workbook
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: geoselected + "_Foreign_Owned_Businesses" + ".xlsx"
                    })
                })
        } else if (fdifilterclicked == 0) {
            fdipromises = [$.Deferred(), $.Deferred(), $.Deferred(), $.Deferred(), $.Deferred(), $.Deferred()];
            $("#fditotalsgrid").getKendoGrid().saveAsExcel();
            $("#fdichartgrid").getKendoGrid().saveAsExcel();
            $("#fdiGrid").getKendoGrid().saveAsExcel();
            $("#fdiparentGrid").getKendoGrid().saveAsExcel();
            $("#clustergridfdi").getKendoGrid().saveAsExcel();
            $("#keyindgridfdi").getKendoGrid().saveAsExcel();

            $.when.apply(null, fdipromises)
                .then(function (fdiTotalsWorkbook, countriesWorkbook, topfdiWorkbook, topparentWorkbook, fdiclusterWorkbook, fdikeyindWorkbook) {
                    // create a new workbook using the sheets 
                    var sheets = [
                        fdiTotalsWorkbook.sheets[0],
                        countriesWorkbook.sheets[0],
                        topfdiWorkbook.sheets[0],
                        topparentWorkbook.sheets[0],
                        fdiclusterWorkbook.sheets[0],
                        fdikeyindWorkbook.sheets[0]
                    ];
                    sheets[0].title = "FDI Totals";
                    sheets[1].title = "Parent Countries";
                    sheets[2].title = "Foreign-Owned Employer List";
                    sheets[3].title = "Parent Companies";
                    sheets[4].title = "FDI Industry Clusters";
                    sheets[5].title = "FDI Key Industries";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    // save the new workbook
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: geoselected + "_Foreign_Owned_Businesses" + ".xlsx"
                    })
                })
        }
    }
    $(".FDIExcelExport").on('click', exportFDITab);

    var promises = [$.Deferred(), $.Deferred(), $.Deferred()];

    function exportOverviewTab() {
        if (filterclicked == 1) {
            promises = [$.Deferred(), $.Deferred(), $.Deferred()];
            // trigger export of grids
            $("#totalsgrid").data("kendoGrid").saveAsExcel();
            $("#top20grid").data("kendoGrid").saveAsExcel();
            $("#clustergrid").data("kendoGrid").saveAsExcel();
            // wait for exports to finish
            $.when.apply(null, promises)
                .then(function (totalsWorkbook, top20Workbook, clustersWorkbook) {
                    // create a new workbook using the sheets 
                    var sheets = [
                        totalsWorkbook.sheets[0],
                        top20Workbook.sheets[0],
                        clustersWorkbook.sheets[0],
                    ];
                    sheets[0].title = "Totals";
                    sheets[1].title = "Top 20 Employers";
                    sheets[2].title = "Industry Clusters";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    // save the new workbook
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Business_Jobs_Industry_Overview" + ".xlsx"
                    })
                })
        } else if (filterclicked == 2) {
            promises = [$.Deferred(), $.Deferred(), $.Deferred()];
            // trigger export of grids
            $("#totalsgrid").data("kendoGrid").saveAsExcel();
            $("#top20grid").data("kendoGrid").saveAsExcel();
            $("#keyindgrid").data("kendoGrid").saveAsExcel();
            // wait for exports to finish
            $.when.apply(null, promises)
                .then(function (totalsWorkbook, top20Workbook, keyindWorkbook) {
                    // create a new workbook using the sheets 
                    var sheets = [
                        totalsWorkbook.sheets[0],
                        top20Workbook.sheets[0],
                        keyindWorkbook.sheets[0],
                    ];
                    sheets[0].title = "Totals";
                    sheets[1].title = "Top 20 Employers";
                    sheets[2].title = "Key Industries";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    // save the new workbook
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Business_Jobs_Industry_Overview" + ".xlsx"
                    })
                })
        } else if (filterclicked == 0) {
            promises = [$.Deferred(), $.Deferred(), $.Deferred(), $.Deferred()]
            // trigger export of grids
            $("#totalsgrid").data("kendoGrid").saveAsExcel();
            $("#top20grid").data("kendoGrid").saveAsExcel();
            $("#clustergrid").data("kendoGrid").saveAsExcel();
            $("#keyindgrid").data("kendoGrid").saveAsExcel();
            // wait for exports to finish
            $.when.apply(null, promises)
                .then(function (totalsWorkbook, top20Workbook, clustersWorkbook, keyindWorkbook) {
                    // create a new workbook using the sheets 
                    var sheets = [
                        totalsWorkbook.sheets[0],
                        top20Workbook.sheets[0],
                        clustersWorkbook.sheets[0],
                        keyindWorkbook.sheets[0]
                    ];
                    sheets[0].title = "Totals";
                    sheets[1].title = "Top 20 Employers";
                    sheets[2].title = "Industry Clusters";
                    sheets[3].title = "Key Industries";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    // save the new workbook
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Business_Jobs_Industry_Overview" + ".xlsx"
                    })
                })
        }
    }
    $(".overviewExcelExport").on('click', exportOverviewTab);

    var promise = [$.Deferred()];

    $(".top20ExcelExport").kendoButton({
        click: function () {
            promise = [$.Deferred()]
            // trigger export of grids
            $("#top20grid").data("kendoGrid").saveAsExcel();
            // wait for exports to finish
            $.when.apply(null, promise)
                .then(function (top20Workbook) {
                    // create a new workbook using the sheets 
                    var sheets = [
                        top20Workbook.sheets[0],
                    ];
                    sheets[0].title = "Top 20 Employers";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    // save the new workbook
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Top_20_Employers" + ".xlsx"
                    })
                })
        }
    });

    $(".clusterExcelExport").kendoButton({
        click: function () {
            promise = [$.Deferred()]
            $("#clustergrid").getKendoGrid().saveAsExcel();
            $.when.apply(null, promise)
                .then(function (singleWorkbook) {
                    var sheets = [
                        singleWorkbook.sheets[0],
                    ];
                    sheets[0].title = "Industry Clusters";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Industry_Clusters" + ".xlsx"
                    })
                })
        }
    });

    $(".keyindExcelExport").kendoButton({
        click: function () {
            promise = [$.Deferred()]
            $("#keyindgrid").getKendoGrid().saveAsExcel();
            $.when.apply(null, promise)
                .then(function (singleWorkbook) {
                    var sheets = [
                        singleWorkbook.sheets[0],
                    ];
                    sheets[0].title = "Key Industries";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Key_Industries" + ".xlsx"
                    })
                })
        }
    });

    var fdipromise = [$.Deferred()];

    $(".fdicountriesExcelExport").kendoButton({
        click: function () {
            fdipromise = [$.Deferred()]
            $("#fdichartgrid").getKendoGrid().saveAsExcel();
            $.when.apply(null, fdipromise)
                .then(function (singleWorkbook) {
                    var sheets = [
                        singleWorkbook.sheets[0],
                    ];
                    sheets[0].title = "Parent Countries";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Parent_Countries" + ".xlsx"
                    })
                })
        }
    });

    $(".fdiEmployersExcelExport").kendoButton({
        click: function () {
            fdipromise = [$.Deferred()]
            $("#fdiGrid").getKendoGrid().saveAsExcel();
            $.when.apply(null, fdipromise)
                .then(function (singleWorkbook) {
                    var sheets = [
                        singleWorkbook.sheets[0],
                    ];
                    sheets[0].title = "Foreign-Owned Employer List";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Foreign_Owned_Employers" + ".xlsx"
                    })
                })
        }
    });

    $(".fdiParentExcelExport").kendoButton({
        click: function () {
            fdipromise = [$.Deferred()]
            $("#fdiparentGrid").getKendoGrid().saveAsExcel();
            $.when.apply(null, fdipromise)
                .then(function (singleWorkbook) {
                    var sheets = [
                        singleWorkbook.sheets[0],
                    ];
                    sheets[0].title = "Parent Companies";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_Parent_Companies" + ".xlsx"
                    })
                })
        }
    });

    $(".fdiclusterExcelExport").kendoButton({
        click: function () {
            fdipromise = [$.Deferred()]
            $("#clustergridfdi").getKendoGrid().saveAsExcel();
            $.when.apply(null, fdipromise)
                .then(function (singleWorkbook) {
                    var sheets = [
                        singleWorkbook.sheets[0],
                    ];
                    sheets[0].title = "FDI Industry Clusters";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_FDI_Clusters" + ".xlsx"
                    })
                })
        }
    });

    $(".fdikeyindExcelExport").kendoButton({
        click: function () {
            fdipromise = [$.Deferred()]
            $("#keyindgridfdi").getKendoGrid().saveAsExcel();
            $.when.apply(null, fdipromise)
                .then(function (singleWorkbook) {
                    var sheets = [
                        singleWorkbook.sheets[0],
                    ];
                    sheets[0].title = "FDI Key Industries";
                    var workbook = new kendo.ooxml.Workbook({
                        sheets: sheets
                    });
                    kendo.saveAs({
                        dataURI: workbook.toDataURL(),
                        fileName: overviewgeography + "_FDI_Key_Industries" + ".xlsx"
                    })
                })
        }
    });

});