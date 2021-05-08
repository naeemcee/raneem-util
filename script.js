async function fetchData() {
  const response =  await fetch('./data/RaneemSolar.csv')
  const data = await response.text()

  const table = data.split('\n').splice(1)
  const xLabel = []
  const solGenerated = []
  const solExported = []
  const solConsumed = []
  const KSEBImported = []

  table.forEach(line => {
    const dataRow = line.split(',')
    xLabel.push(dataRow[0])
    solGenerated.push(parseFloat(dataRow[1]))                   // Solar Generated
    solExported.push(parseFloat(dataRow[2]))                    // Solar Export
    KSEBImported.push(parseFloat(dataRow[3]))                   // KSEB Import

    solConsumed.push(solGenerated[solGenerated.length-1] - solExported[solGenerated.length-1]) // Delta = Solar consumed
  })

  console.log(xLabel, solGenerated, solExported, KSEBImported, solConsumed)
  return {xLabel, solGenerated, solExported, KSEBImported, solConsumed}
}

async function plotChart() {
  const data = await fetchData()

  var ctx1 = document.getElementById('chart1').getContext('2d');
  var chart1 = new Chart(ctx1, {
      type: 'bar',
      data: {
          labels: data.xLabel,
          datasets: [{
              label: 'Generated',
              data: data.solGenerated,
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
              ],
              borderWidth: 2,
              borderRadius: 5
          },
          {
            label: 'Exported',
            data: data.solExported,
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
            //     'rgba(255, 206, 86, 0.2)',
            //     'rgba(75, 192, 192, 0.2)',
            //     'rgba(153, 102, 255, 0.2)',
            //     'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
            //     'rgba(255, 206, 86, 1)',
            //     'rgba(75, 192, 192, 1)',
            //     'rgba(153, 102, 255, 1)',
            //     'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            borderRadius: 5
        }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          },
          plugins: {
            title: {
                display: true,
                text: 'Solar Generation & Export (kWhr)',
                padding: {
                  top: 10,
                  bottom: 5
                },
                font: {
                  size: 22
                }
            },
            legend: {
              display: true,
              borderRadius: 5
            }
          }
      }
  });

  var ctx2 = document.getElementById('chart2').getContext('2d');
  var chart2 = new Chart(ctx2, {
      type: 'bar',
      data: {
          labels: data.xLabel,
          datasets: [{
              label: 'Solar',
              data: data.solConsumed,
              backgroundColor: [
                'rgba(255, 206, 86, 0.8)',
          ],
              borderColor: [
                'rgba(255, 206, 86, 1)',
          ],
              borderWidth: 2,
              borderRadius: 5
          },
          {
            label: 'KSEB',
            data: data.KSEBImported,
            backgroundColor: [
                'rgba(75, 192, 192, 0.8)',
            //     'rgba(153, 102, 255, 0.2)',
            //     'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
            //     'rgba(153, 102, 255, 1)',
            //     'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 2,
            borderRadius: 5
        }]
      },
      options: {
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        },
        indexAxis: 'y',
        plugins: {
          title: {
              display: true,
              text: 'Total Consumption [Solar + KSEB] (kWhr)',
              padding: {
                top: 10,
                bottom: 5
              },
              font: {
                size: 22
              }
          }
        }
      }
  });

}

plotChart()

