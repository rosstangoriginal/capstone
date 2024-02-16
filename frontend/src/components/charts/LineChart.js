import React from 'react';
import {Line} from 'react-chartjs-2';

function LineChart({chartData}) {
    return (
        <div className='chart-container'>
            {/* <h2 style={{textAlign: "center"}}>Line Chart</h2> */}
            <Line 
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: "Monthy Energy Usage Chart by kWh",
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