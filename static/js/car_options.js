// Initialize Data
function init() {
    d3.json('/filters').then(function(data) {
        // Car Years
        let car_years = data.car_year
        d3.select('#car_years_dropdown')
            .selectAll('option')
            .data(car_years).enter()
            .append('option')
                .text(function (d) { return d; });

        // Make
        let make = data.make
        d3.select('#make_dropdown')
            .selectAll('option')
            .data(make).enter()
            .append('option')
                .text(function (d) { return d; });

        // Model
        let model = data.model
        d3.select('#model_dropdown')
            .selectAll('option')
            .data(model).enter()
            .append('option')
                .text(function (d) { return d; });

        // Subseries
        let subseries = data.subseries
        d3.select('#subseries_dropdown')
            .selectAll('option')
            .data(subseries).enter()
            .append('option')
                .text(function (d) { return d; });

        // Color
        let color = data.color
        d3.select('#color_dropdown')
            .selectAll('option')
            .data(color).enter()
            .append('option')
                .text(function (d) { return d; });

        // Condition Grade
        let condition_grade = data.condition_grade
        d3.select('#condition_grade_dropdown')
            .selectAll('option')
            .data(condition_grade).enter()
            .append('option')
                .text(function (d) { return d; });
                
        // Mileage
        let mileage = data.mileage
        d3.select('#mileage_dropdown')
            .selectAll('option')
            .data(mileage).enter()
            .append('option')
                .text(function (d) { return d; });
                
    });
};

init();