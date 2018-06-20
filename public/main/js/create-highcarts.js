// Make monochrome colors
var pieColors = (function () {
    var colors = ['#ebc844','#ecaa38','#ef8b2c','#f16c20','#d94e1f','#c02e1d','#19be9f'],
        base = Highcharts.getOptions().colors[0],
        i;

    for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
    }
    return colors;
}());

// Build the chart
Highcharts.chart('container', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: ''
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: pieColors,
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                distance: -50,
                filter: {
                    property: 'percentage',
                    operator: '>',
                    value: 4
                }
            }
        }
    },                   
    series: [{
        name: 'Brands',
        data: [
            { name: '0.0005 $', y: 24 },
            { name: '0.0006 $', y: 20 },
            { name: '0.0007 $', y: 16 },
            { name: '0.0008 $', y: 13 },
            { name: '0.0009 $', y: 10 },
            { name: '0.00095 $', y: 17 }
            
        ]
    }]
});