const datastore = {};
const columns = ['car_year', 'make', 'model', 'subseries', 'color', 'condition_grade', 'mileage']

function showFinal() {
    // console.log(datastore)
    let final_car = `${datastore['car_year']} ${datastore['make']} ${datastore['model']} ${datastore['subseries']}`
    let final_info = `Color: ${datastore['color']}, Condition Grade: ${datastore['condition_grade']}, Mileage: ${datastore['mileage']}`
    d3.select(`#final_result`)
        .select('h4')
        .html(`${final_car}</br>${final_info}`)
}

function optionChanged(category, option) {
    if (category == 'car_year') {
        for (let i = 1; i < columns.length; i++) {
            curCol = columns[i]
            d3.select(`#${curCol}`).selectAll('option').remove()
            d3.select(`#${curCol}`).append('option')
                .attr("value", `${curCol}`)
                .text('Fetching Data...')
        }
        let car_year = option
        datastore['car_year'] = car_year;
        d3.json(`/data/${car_year}/make`).then(function(make_list) {
            optionChanged('make', make_list[0])
            let selector = d3.select(`#make`)
            selector.selectAll('option').remove()
            for (let i = 0; i < make_list.length; i++) {
                let current_option = make_list[i]
                selector.append('option')
                    .attr("value", current_option)
                    .attr("id", 'make')
                    .text(current_option)
            };
        });
    } else if (category == 'make') {
        for (let i = 2; i < columns.length; i++) {
            curCol = columns[i]
            d3.select(`#${curCol}`).selectAll('option').remove()
            d3.select(`#${curCol}`).append('option')
                .attr("value", `${curCol}`)
                .text('Fetching Data...')
        }
        let make = option
        datastore['make'] = make;
        let car_year = datastore['car_year'];
        d3.json(`/data/${car_year}/${make}/model`).then(function(model_list) {
            optionChanged('model', model_list[0])
            let selector = d3.select(`#model`)
            selector.selectAll('option').remove()
            for (let i = 0; i < model_list.length; i++) {
                let current_option = model_list[i]
                selector.append('option')
                    .attr("value", current_option)
                    .attr("id", 'model')
                    .text(current_option)
            };
        });
    } else if (category == 'model') {
        for (let i = 3; i < columns.length; i++) {
            curCol = columns[i]
            d3.select(`#${curCol}`).selectAll('option').remove()
            d3.select(`#${curCol}`).append('option')
                .attr("value", `${curCol}`)
                .text('Fetching Data...')
        }
        let model = option
        datastore['model'] = model;
        let car_year = datastore['car_year'];
        let make = datastore['make'];
        d3.json(`/data/${car_year}/${make}/${model}/subseries`).then(function(subseries_list) {
            optionChanged('subseries', subseries_list[0])
            let selector = d3.select(`#subseries`)
            selector.selectAll('option').remove()
            for (let i = 0; i < subseries_list.length; i++) {
                let current_option = subseries_list[i]
                selector.append('option')
                    .attr("value", current_option)
                    .attr("id", 'subseries')
                    .text(current_option)
            };
        });
    } else if (category == 'subseries') {
        for (let i = 4; i < columns.length; i++) {
            curCol = columns[i]
            d3.select(`#${curCol}`).selectAll('option').remove()
            d3.select(`#${curCol}`).append('option')
                .attr("value", `${curCol}`)
                .text('Fetching Data...')
        }
        let subseries = option
        datastore['subseries'] = subseries;
        let car_year = datastore['car_year'];
        let make = datastore['make'];
        let model = datastore['model'];
        d3.json(`/data/${car_year}/${make}/${model}/${subseries}/info`).then(function(info_dict) {
            // Color
            let color_list = info_dict['color']
            datastore['color'] = color_list[0]
            let color_selector = d3.select(`#color`)
            color_selector.selectAll('option').remove()
            for (let i = 0; i < color_list.length; i++) {
                let current_option = color_list[i]
                color_selector.append('option')
                    .attr("value", current_option)
                    .attr("id", 'color')
                    .text(current_option)
            };
            // Condition Grade
            let condition_grade_list = info_dict['condition_grade']
            datastore['condition_grade'] = condition_grade_list[0]
            let condition_grade_selector = d3.select(`#condition_grade`)
            condition_grade_selector.selectAll('option').remove()
            for (let i = 0; i < condition_grade_list.length; i++) {
                let current_option = condition_grade_list[i]
                condition_grade_selector.append('option')
                    .attr("value", current_option)
                    .attr("id", 'condition_grade')
                    .text(current_option)
            };
            // Mileage
            let mileage_list = info_dict['mileage']
            datastore['mileage'] = mileage_list[0]
            let mileage_selector = d3.select(`#mileage`)
            mileage_selector.selectAll('option').remove()
            for (let i = 0; i < mileage_list.length; i++) {
                let current_option = mileage_list[i]
                mileage_selector.append('option')
                    .attr("value", current_option)
                    .attr("id", 'mileage')
                    .text(current_option)
            };
            showFinal()
        });
    } else if ((category == 'color') || (category == 'condition_grade') || (category == 'mileage')) {
        for (let i = 5; i < columns.length; i++) {
            curCol = columns[i]
            if (curCol == category) { continue }            
            d3.select(`#${curCol}`).selectAll('option').remove()
            d3.select(`#${curCol}`).append('option')
                .attr("value", `${curCol}`)
                .text('Fetching Data...')
        }
        let car_year = datastore['car_year'];
        let make = datastore['make'];
        let model = datastore['model'];
        let subseries = datastore['subseries'];
        d3.json(`/data/${car_year}/${make}/${model}/${subseries}/${category}/${option}`).then(function(info_dict) {
            if (category == 'color') {
                // Condition Grade
                let condition_grade_list = info_dict['condition_grade']
                datastore['condition_grade'] = condition_grade_list[0]
                let condition_grade_selector = d3.select(`#condition_grade`)
                condition_grade_selector.selectAll('option').remove()
                for (let i = 0; i < condition_grade_list.length; i++) {
                    let current_option = condition_grade_list[i]
                    condition_grade_selector.append('option')
                        .attr("value", current_option)
                        .attr("id", 'condition_grade')
                        .text(current_option)
                };
                // Mileage
                let mileage_list = info_dict['mileage']
                datastore['mileage'] = mileage_list[0]
                let mileage_selector = d3.select(`#mileage`)
                mileage_selector.selectAll('option').remove()
                for (let i = 0; i < mileage_list.length; i++) {
                    let current_option = mileage_list[i]
                    mileage_selector.append('option')
                        .attr("value", current_option)
                        .attr("id", 'mileage')
                        .text(current_option)
                };
            } else if (category == 'condition_grade') {
                // Color
                let color_list = info_dict['color']
                datastore['color'] = color_list[0]
                let color_selector = d3.select(`#color`)
                color_selector.selectAll('option').remove()
                for (let i = 0; i < color_list.length; i++) {
                    let current_option = color_list[i]
                    color_selector.append('option')
                        .attr("value", current_option)
                        .attr("id", 'color')
                        .text(current_option)
                };
                // Mileage
                let mileage_list = info_dict['mileage']
                datastore['mileage'] = mileage_list[0]
                let mileage_selector = d3.select(`#mileage`)
                mileage_selector.selectAll('option').remove()
                for (let i = 0; i < mileage_list.length; i++) {
                    let current_option = mileage_list[i]
                    mileage_selector.append('option')
                        .attr("value", current_option)
                        .attr("id", 'mileage')
                        .text(current_option)
                };
            } else if (category == 'mileage') {
                // Color
                let color_list = info_dict['color']
                datastore['color'] = color_list[0]
                let color_selector = d3.select(`#color`)
                color_selector.selectAll('option').remove()
                for (let i = 0; i < color_list.length; i++) {
                    let current_option = color_list[i]
                    color_selector.append('option')
                        .attr("value", current_option)
                        .attr("id", 'color')
                        .text(current_option)
                };
                // Condition Grade
                let condition_grade_list = info_dict['condition_grade']
                datastore['condition_grade'] = condition_grade_list[0]
                let condition_grade_selector = d3.select(`#condition_grade`)
                condition_grade_selector.selectAll('option').remove()
                for (let i = 0; i < condition_grade_list.length; i++) {
                    let current_option = condition_grade_list[i]
                    condition_grade_selector.append('option')
                        .attr("value", current_option)
                        .attr("id", 'condition_grade')
                        .text(current_option)
                };
            }
        });
    }
    showFinal()
};

optionChanged('car_year', 2020);