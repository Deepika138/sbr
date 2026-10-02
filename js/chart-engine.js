if (window.Chart) {
Chart.defaults.font.family = "'Courier New', Courier, monospace";
Chart.defaults.animation = false;
Chart.defaults.plugins.tooltip.enabled = false;
}

window.renderTrendChart = function(canvasId, dataset1, dataset2) {
var canvas = document.getElementById(canvasId);
if (!canvas) {
console.error("Canvas element not found: " + canvasId);
return null;
}

var ctx = canvas.getContext('2d');

var labels = [];
var maxLength = dataset1 ? dataset1.length : 0;
if (dataset2 && dataset2.length > maxLength) {
    maxLength = dataset2.length;
}
for (var i = 0; i < maxLength; i++) {
    labels.push(i.toString());
}

var chartData = {
    labels: labels,
    datasets: []
};

if (dataset1) {
    chartData.datasets.push({
        label: 'Process Variable',
        data: dataset1,
        borderColor: '#2c5282',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0
    });
}

if (dataset2) {
    chartData.datasets.push({
        label: 'Setpoint',
        data: dataset2,
        borderColor: '#7a8084',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0
    });
}

return new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                display: true,
                grid: {
                    display: true,
                    drawBorder: true,
                    borderColor: '#111111',
                    color: '#cfd4d8'
                },
                ticks: {
                    display: false
                }
            },
            y: {
                display: true,
                grid: {
                    display: true,
                    drawBorder: true,
                    borderColor: '#111111',
                    color: '#cfd4d8'
                },
                ticks: {
                    color: '#111111'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#111111'
                }
            }
        }
    }
});
};