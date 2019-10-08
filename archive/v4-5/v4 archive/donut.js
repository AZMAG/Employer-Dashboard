var empUrl="https://geo.azmag.gov/arcgis/rest/services/maps/StateEmploymentDashboard2018/MapServer/0";
var overviewquery="(County='Pinal' OR County='Maricopa') AND Employees > 4";
var filterquery=overviewquery;

arcgisRest.queryFeatures({
    url: empUrl,
    // where: filterquery, //Maricopa Only and 5+ Employees
    where: "(County='Pinal' OR County='Maricopa') AND Employees > 4 AND (Employees < 25)",
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


    var groupbyEmpName = GetDataGroupedByFields(data, ["EmpName"]); //console.log(groupbyEmpName);
    var totalBus = groupbyEmpName.length; console.log(totalBus);
    var allemp = GetDataGroupedByFields(data, ["EmpName"]); //console.log(allemp);
    allemp.sort(function (a, b) {
        return b.Employees - a.Employees
    }); //console.log(allemp);
    var sumallemp = allemp.reduce(function (prev, cur) {
        return prev + cur.Employees;
    }, 0); console.log(sumallemp);



$("#donutsection").hide(); //delete this once the chart is ready
$("#donutchart").kendoChart({
            title: {
                position: "bottom",
                text: "Inner ring is locations; Outer ring is jobs"
            },
            legend: {
                visible: true,
                position: "top",
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "donut",
                startAngle: 150,
                padding: 0,
                //overlay:{gradient:"none"},
                holeSize: 100,
            },
            series: [{
                name: "locations", //inner ring
                data: [{
                    category: "Under 25",
                    value: 30.8,
                    color: "dodgerblue"
                }, {
                    category: "25-49",
                    value: 21.1,
                    color: "darkorange"
                }, {
                    category: "50-99",
                    value: 16.3,
                    color: "silver"
                }, {
                    category: "100+",
                    value: 17.6,
                    color: "gold"
                }]
            }, {
                name: "jobs",
                data: [{
                    category: "Under 25",
                    value: 20,
                    color: "dodgerblue"
                }, {
                    category: "25-49",
                    value: 15,
                    color: "darkorange"
                }, {
                    category: "50-99",
                    value: 25,
                    color: "silver"
                }, {
                    category: "100+",
                    value: 45,
                    color: "gold"
                }],
                labels: {
                    visible: false,
                    background: "transparent",
                    position: "outsideEnd",
                    template: "#= category #: \n #= value#%"
                }
            }],
            tooltip: {
                visible: true,
                template: "Employers with <strong>#= category # employees</strong><br>make up <strong>#= value #%</strong> of all #=series.name #."
            }
        });
    });//end arcgisRest