import React from 'react';
import Chart from 'react-apexcharts';

// Hàm để loại bỏ các giá trị ngoại lai theo quy tắc IQR
const removeOutliers = (data) => {
    return data.map((series) => {
        const values = series.y;
        const Q1 = quantile(values, 0.25);
        const Q3 = quantile(values, 0.75);
        const IQR = Q3 - Q1;
        const lowerBound = Q1 - 1.5 * IQR;
        const upperBound = Q3 + 1.5 * IQR;

        const filteredData = values.filter((value) => value >= lowerBound && value <= upperBound);
        return { ...series, y: filteredData };
    });
};

// Hàm để tính toán quantile
const quantile = (arr, q) => {
    const sorted = arr.slice().sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

const BoxPlotChart = ({ data }) => {
    // Loại bỏ các giá trị ngoại lai
    const cleanedData = removeOutliers(data);

    const options = {
        chart: {
            type: 'boxPlot',
        },
        title: {
            text: 'BoxPlot Chart',
            align: 'left',
        },
        xaxis: {
            type: 'regional',
            categories: ['jp_kr_cn', 'africa', 'europe', 'america', 'southeast_asia'],
        },
        yaxis: {
            title: {
                text: 'Values',
            },
            labels: {
                formatter: (value) => {
                    return parseFloat(value).toFixed(2);
                },
            },
        },
        plotOptions: {
            boxPlot: {
                outliers: {
                    show: true,
                },
            },
        },
    };

    const series = [
        {
            name: 'BoxPlot',
            type: 'boxPlot',
            data: data,
        },
    ];

    return (
        <div>
            <Chart options={options} series={series} type="boxPlot" height={600} />
        </div>
    );
};

export default BoxPlotChart;
