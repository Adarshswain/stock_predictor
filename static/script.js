async function loadChartData(company) {
    const response = await fetch(`/api/company/${company}?_=${new Date().getTime()}`);
    const data = await response.json();

    if (response.ok) {
        // Update Chart
        const ctx = document.getElementById('stockChart').getContext('2d');
        if (window.myChart) window.myChart.destroy();

        // Create chart for volume only
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Volume'],
                datasets: [{
                    label: `Average Volume for ${company}`,
                    data: [data.chartData.volume],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Update Table
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';
        data.tableData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.open_index_value}</td>
                <td>${row.high_index_value}</td>
                <td>${row.low_index_value}</td>
                <td>${row.closing_index_value}</td>
                <td>${row.points_change}</td>
                <td>${row.change_percent}</td>
                <td>${row.volume}</td>
                <td>${row.turnover_rs_cr}</td>
            `;
            tableBody.appendChild(tr);
        });
    } else {
        alert(data.error);
    }
}
