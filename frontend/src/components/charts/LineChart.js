import React from 'react';
import {Line} from 'react-chartjs-2';

function LineChart({chartData}) {
    return (
        <div className='chart-container'>
            <Line 
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Energy Usage for On Peak, Off Peak, and Mid Peak",
                            font: {
                                size: 24
                            }
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    );
}

export default LineChart;