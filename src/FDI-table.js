$(document).ready(function() {

    var empUrl="https://geo.azmag.gov/arcgis/rest/services/maps/StateEmploymentDashboard2018/MapServer/0";
    var fdiquery="(County='Pinal' OR County='Maricopa') AND International=1";
    var fdifilterquery=fdiquery; 
    var data;


    function GetDataGroupedByFields(data, flds) {
        var obj = {};
        var templateObj = {};

        flds.forEach(function (fld) {
            templateObj[fld] = "";
        });

        data.forEach(function (row) {

            var fldKey = "";

            flds.forEach(function (fld) {

                if (typeof row[fld]==='string'||row[fld] instanceof String){
                    fldKey += row[fld].toLowerCase(); //if string, added toLowerCase() so it's not case-sensitive
                }
                else{
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

        data = features.map(function(feature) {
            // if (feature.attributes.Employees>10){ //TESTING IMPORT ROUND 10
            //     val
            // }
            return feature.attributes;
        });

    var fullfdidata = new kendo.data.DataSource({
                data: GetDataGroupedByFields(data, ["UltimateParentCountry","UltimateParentName"]),
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
                height: 600,
                sortable: true,
                // pageable: true,
                detailInit: function(e){
                    $("<div/>").appendTo(e.detailCell).kendoGrid({
                        dataSource: {
                            data:GetDataGroupedByFields(data, ["EmpName", "UltimateParentCountry","UltimateParentName"]),
                            // serverPaging: true,
                            // serverSorting: true,
                            // serverFiltering: true,
                            pageSize: 10,
                            filter: { field: "UltimateParentName", operator: "eq", value: e.data.UltimateParentName},
                            sort: {
                                field: "Employees",
                                dir: "desc"
                            },
                        },
                        scrollable: false,
                        sortable: true,
                        // pageable: true,
                        columns: [
                            // {field: "UltimateParentCountry",title:"Parent Country",headerAttributes: {style: "font-weight:bold;"},},
                            {field: "UltimateParentName",title:"Parent Company",},
                            {field: "EmpName",title:"Employer Name",},
                            {field:"Locations",width:"15%",template:"#=kendo.toString(Locations,'n0') #",headerAttributes: {style: "text-align:center;"},attributes: {style: "text-align:right;"}},
                            {field:"Employees",title:"Jobs",width:"15%",template:"#=kendo.toString(Employees,'n0') #",headerAttributes: {style: "text-align:center;"},attributes: {style: "text-align:right;"}}
                        ]
                    });
                },
                // dataBound: function() {
                //     this.expandRow(this.tbody.find("tr.k-master-row").first());
                // },
                dataBound: function (e) {
                    var grid = this;
                    $(".k-grouping-row").each(function (e) {
                        grid.collapseGroup(this);
                    });

                    $(".k-grouping-row").click(function(){
                        console.log("hello");
                        // $( ".k-grouping-row" ).each(function( index ) {
                        //     grid.expandRow(this);
                        //   });
                    });
                },
                groupExpand: function(e) {
                    // for (let i = 0; i < e.group.items.length; i++){
                    //   var expanded = e.group.items[i].value
                    //   e.sender.expandGroup(".k-grouping-row:contains("+expanded+")");
                    // }
                    console.log("testing");
                  },
                columns: [{
                    field: "UltimateParentCountry",
                    sortable: false,
                    title: "Parent Country",
                    attributes: {
                        style: "text-align:left;"
                    },
                    width: "25%",
                    headerAttributes: {
                        style: "font-weight:bold;"
                    },
                    groupHeaderTemplate:"<strong>#=value #</strong>",
                },{
                    field: "UltimateParentName",
                    title: "Parent Companies",
                    attributes: {
                        style: "text-align:left;"
                    },

                    headerAttributes: {
                        style: "font-weight:bold;"
                    },
                    groupHeaderTemplate:"#=value #",
                    aggregates:["count"],
                    groupHeaderColumnTemplate:"<div style='text-align:right'><strong>#=kendo.toString(count,'n0') #</strong></div>"
                }, {
                    field: "Locations",
                    groupable:false, //prevent group by Employees
                    attributes: {
                        style: "text-align:right;"
                    },
                    width: "17%",
                    template: "#=kendo.toString(Locations,'n0')#",
                    headerAttributes: {
                        style: "font-weight:bold;text-align:center;"
                    },
                    aggregates:["sum"],
                    groupHeaderColumnTemplate:"<div style='text-align:right'><strong>#=kendo.toString(sum,'n0') #</strong></div>"
                },{
                    field: "Employees",
                    groupable:false, //prevent group by Employees
                    title:"Jobs",
                    attributes: {
                        style: "text-align:right;"
                    },
                    width: "15%",
                    template: "#=kendo.toString(Employees,'n0')#",
                    headerAttributes: {
                        style: "font-weight:bold;text-align:center;"
                    },
                    aggregates:["sum"],
                    groupHeaderColumnTemplate:"<div style='text-align:right'><strong>#=kendo.toString(sum,'n0') #</strong></div>"
                }]
            });
        });
        
        $('#expand').click(function(e){
            var grid = $("#fullfdigrid").data("kendoGrid");
            $( ".k-grouping-row" ).each(function( index ) {
                grid.expandRow(this);
            });
        });
        
        $('#collapse').click(function(e){
            var grid = $("#fullfdigrid").data("kendoGrid");
            $( ".k-master-row" ).each(function( index ) {
                grid.collapseRow(this);
            });
            $( ".k-grouping-row" ).each(function( index ) {
                grid.collapseRow(this);
            });
        });
    });