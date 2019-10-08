var empUrl="https://geo.azmag.gov/arcgis/rest/services/maps/StateEmploymentDashboard2018/MapServer/0";
var fdiquery="(County='Pinal' OR County='Maricopa') AND International=1";
var fdifilterquery=fdiquery; 


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
        
        //Increment location
        obj[fldKey].Locations = obj[fldKey].Locations || 0;
        obj[fldKey].Locations++;
    });

    return Object.keys(obj).map(function (key) {
        if (obj[key].Employees<10){
            var rtnObj = {Employees: obj[key].Employees, Locations: obj[key].Locations}; 
        }
        else{
        var rtnObj = {Employees: Math.round(obj[key].Employees/10)*10, Locations: obj[key].Locations}; //TEST ROUNDING
        }
        flds.forEach(function (fld) {
            rtnObj[fld] = obj[key][fld];
        });

        return rtnObj;
    });
}

arcgisRest.queryFeatures({
    url: empUrl,
    where: fdifilterquery, 
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
        // if (feature.attributes.Employees>10){ //TESTING IMPORT ROUND 10
        //     val
        // }
        return feature.attributes;
    });

var fullfdidata = new kendo.data.DataSource({
            data: GetDataGroupedByFields(data, ["EmpName", "UltimateParentCountry","UltimateParentName"]),
            // pageSize: 10,
            group:{field:"UltimateParentCountry",
            aggregates:[
                {field:"Locations",aggregate:"sum"},
                {field:"Employees",aggregate:"sum"},
                {field:"EmpName",aggregate:"count"},
                {field:"UltimateParentName",aggregate:"count"}
            ]
            },
            aggregates:[
                {field:"UltimateParentCountry",aggregate:"sum"},
                {field:"Employees",aggregate:"sum"},
                {field:"EmpName",aggregate:"count"},
                {field:"UltimateParentName",aggregate:"count"}
            ],
            sort: {
                field: "Employees",
                dir: "desc"
            },
        });

        $("#fullfdigrid").kendoGrid({
            dataSource: fullfdidata,
            groupable:true,
            height: 600,
            sortable:true,
            dataBound: function (e) {
                var grid = this;
                $(".k-grouping-row").each(function (e) {
                    grid.collapseGroup(this);
                });
            },
            columns: [{
                field: "UltimateParentCountry",
                title: "Parent Country",
                attributes: {
                    style: "text-align:left;"
                },
                width: "35%",
                headerAttributes: {
                    style: "font-weight:bold;"
                },
                groupHeaderTemplate:"#=value #",
            },{
                field: "UltimateParentName",
                title: "Parent Companies",
                attributes: {
                    style: "text-align:left;"
                },
                width: "45%",
                headerAttributes: {
                    style: "font-weight:bold;"
                },
                groupHeaderTemplate:"#=value #",
                aggregates:["count"],
                groupHeaderColumnTemplate:"#=count #"
            }, {
                field: "EmpName",
                title: "Employers",
                groupable:false, //prevent group by Employer
                attributes: {
                    style: "text-align:left;"
                },
                width: "45%",
                headerAttributes: {
                    style: "font-weight:bold;"
                },
                aggregates:["count"],
                groupHeaderColumnTemplate:"#=count #"
            }, {
                field: "Employees",
                groupable:false, //prevent group by Employees
                title:"Jobs",
                attributes: {
                    style: "text-align:left;"
                },
                width: "15%",
                template: "#=kendo.toString(Employees,'n0')#",
                headerAttributes: {
                    style: "font-weight:bold;"
                },
                aggregates:["sum"],
                groupHeaderColumnTemplate:"#=sum #"
            }, {
                field: "Locations",
                groupable:false, //prevent group by Employees
                attributes: {
                    style: "text-align:left;"
                },
                width: "15%",
                template: "#=kendo.toString(Locations,'n0')#",
                headerAttributes: {
                    style: "font-weight:bold;"
                },
                aggregates:["sum"],
                groupHeaderColumnTemplate:"#=sum #"
            }]
        });
    });