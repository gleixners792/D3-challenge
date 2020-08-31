var svgWidth = 1000; // was 960
var svgHeight = 500; // was 500

var margin = {
    top: 20,
    right: 40,
    bottom: 100, // was 80
    left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
    .select("#scatter")
    .append("svg")
    .classed("chart", true)
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(behaveRiskData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(behaveRiskData, d => d[chosenXAxis]) * 0.98,
        d3.max(behaveRiskData, d => d[chosenXAxis]) * 1.0
        ])
        .range([0, width]);

    return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(behaveRiskData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(behaveRiskData, d => d[chosenYAxis]) * 0.85,
        d3.max(behaveRiskData, d => d[chosenYAxis]) * 1.10
        ])
        .range([height, 0]);

    return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

// function used for u// function used for updating xAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);


    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

//Updating circles group with a transition to
// new circles for X Axis
function renderXCircles(circlesXAttr, newXScale, chosenXAxis) {

    circlesXAttr.transition()
        .duration(500)
        .attr("cx", d => newXScale(d[chosenXAxis]));

    return circlesXAttr;
}

// function used for updating circles text group with a transition to
// new circles for X Axis
function renderXText(circlesXText, newXScale, chosenXAxis) {

    circlesXText.transition()
        .duration(500)
        .select("text")
        .attr("x", d => newXScale(d[chosenXAxis]));

    console.log
    return circlesXText;
}

//Updating circles group with a transition to
// new circles for Y Axis
function renderYCircles(circlesYAttr, newYScale, chosenYAxis) {

    circlesYAttr.transition()
        .duration(500)
        .attr("cy", d => newYScale(d[chosenYAxis]));

    return circlesYAttr;
}

// function used for updating circles text group with a transition to
// new circles for Y Axis
function renderYText(circlesYText, newYScale, chosenYAxis) {

    circlesYText.transition()
        .duration(500)
        .select("text")
        .attr("y", d => newYScale(d[chosenYAxis]));

    console.log
    return circlesYText;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    console.log("9.1-T-Tip ChosenXAxis --> ", chosenXAxis);
    console.log("9.2 -T-Tip ChosenYAxis --> ", chosenYAxis);
    //console.log("10-T-Tip CirclesGroup--> ", circlesGroup);

    var xlabel;
    var ylabel;
    var xtrailer = " ";

    if (chosenXAxis === "poverty") {
        xlabel = "Poverty:";
        xtrailer = "%"
    }
    else if (chosenXAxis === "age") {
        xlabel = "Age:";
    }
    else {
        xlabel = "Household Income:";
    }

    if (chosenYAxis === "healthcare") {
        ylabel = "Lacks Health Care:";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokers:";
    }
    else {
        ylabel = "Obese:";
    }


    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-15, 0])
        .html(function (d) {
            return (`${d.state}<br><br>${xlabel} ${d[chosenXAxis]}${xtrailer}<br>${ylabel} ${d[chosenYAxis]}%`);
        });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data);

        d3.select(this).select("circle")
            .transition()
            .duration(200)
            .style("stroke", "black");
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data);
            d3.select(this).select("circle")
                .transition()
                .duration(1000)
                .style("stroke", "#e3e3e3");
        });

    return circlesGroup;
}

// console.log("#1 Made it in - Starting Up")

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function (behaveRiskData, err) {
    if (err) throw err;

    // parse data
    behaveRiskData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });

    console.log("#2 Data in the CSV File>>>>", behaveRiskData);

    // xLinearScale function above csv import
    var xLinearScale = xScale(behaveRiskData, chosenXAxis);

    // xLinearScale function above csv import
    var yLinearScale = yScale(behaveRiskData, chosenYAxis);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .attr("transform", `translate(0, 0)`)
        .call(leftAxis);

    var circlesGroup = chartGroup
        .selectAll('circle')
        .data(behaveRiskData)
        .enter()
        .append("g")
        .classed("element-group", true);

    circleElem = circlesGroup
        .append('circle');

    // append initial circles
    var circlesAttr = circleElem
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("opacity", "1.0")
        .classed("stateCircle", true);

    // append initial text tags
    circlesGroup
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        //.attr("dx", -4.5)
        .attr("dy", ".35em")
        .attr("font-size", "7px")
        .text(function (d) {
            //   console.log(d.abbr);
            return d.abbr;
        });

    // Create group for all x-axis labels
    var xlabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var in_poverty_Label = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 18)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 36)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    var hiLabel = xlabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 54)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Household Income (Median)");

    var ylabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top / 2})`);

    var lchealthLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 45)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare") // value to grab for event listener
        .classed("active", true)
        .text("Lacks Health Care (%)");

    var smokesLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 65)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes") // value to grab for event listener
        .classed("inactive", true)
        .text("Smokers (%)");

    var obesityLabel = ylabelsGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 85)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity") // value to grab for event listener
        .classed("inactive", true)
        .text("Obese (%)");

    //console.log("7  ChosenXAxis --> ", chosenXAxis);
    //console.log("8 CirclesGroup--> ", circlesGroup);
    //console.log("8.5 Hello")
    //console.log("9 TextGroup--> ", textGroup);

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    // x axis labels event listener
    xlabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var value = d3.select(this).attr("value");

            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;

                console.log("3 Chosen-X Axis--> ", chosenXAxis);

                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(behaveRiskData, chosenXAxis);
                //console.log("4 xLinearScale--> ", xLinearScale);


                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);

                // updates circles with new x values
                circlesAttr = renderXCircles(circlesAttr, xLinearScale, chosenXAxis);

                // updates text for circles with new x values
                circlesGroup = renderXText(circlesGroup, xLinearScale, chosenXAxis);

                // updates tooltips with new info

                console.log("5 ChosenXAxis --> ", chosenXAxis);
                //console.log("6 CirclesGroup--> ", circlesGroup);  
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text

                if (chosenXAxis === "poverty") {
                    in_poverty_Label
                        .classed("active", true)
                        .classed("inactive", false);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    hiLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

                else if (chosenXAxis === "age") {
                    in_poverty_Label
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    hiLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

                else {
                    in_poverty_Label
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    hiLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }

            }

        });

    // y axis labels event listener
    ylabelsGroup.selectAll("text")
        .on("click", function () {
            // get value of selection
            var yvalue = d3.select(this).attr("value");

            if (yvalue !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = yvalue;

                console.log("3-y Chosen-y Axis--> ", chosenYAxis);

                // functions here found above csv import
                // updates y scale for new data
                yLinearScale = yScale(behaveRiskData, chosenYAxis);
                //console.log("4-y yLinearScale--> ", yLinearScale);

                // updates y axis with transition
                // Look at RenderAxes to see what is going on.
                yAxis = renderYAxes(yLinearScale, yAxis);

                // updates circles with new x values
                circlesAttr = renderYCircles(circlesAttr, yLinearScale, chosenYAxis);

                // updates text for circles with new x values
                circlesGroup = renderYText(circlesGroup, yLinearScale, chosenYAxis);

                // updates tooltips with new info

                console.log("5-y ChosenYAxis --> ", chosenYAxis);
                //console.log("6 CirclesGroup--> ", circlesGroup);  
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

                // changes classes to change bold text

                if (chosenYAxis === "healthcare") {
                    lchealthLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

                else if (chosenYAxis === "smokes") {
                    lchealthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }

                else {
                    lchealthLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }

            }

        });

}).catch(function (error) {
    console.log(error);
});
