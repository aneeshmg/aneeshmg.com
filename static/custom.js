const aneeshAudio = new Audio('/audio/aneesh.mp3')
const gangadharAudio = new Audio('/audio/gangadhar.mp3')

let links

const init = () => {

    const aneeshAudioButton = document.getElementById('aneesh')
    const gangadharAudioButton = document.getElementById('gangadhar')

    aneeshAudioButton.onclick = () => aneeshAudio.play()
    gangadharAudioButton.onclick = () => gangadharAudio.play()


    google.charts.load('current', {'packages':['timeline']})
    google.charts.setOnLoadCallback(drawChart)
    function drawChart() {
        const container = document.getElementById('timeline')
        const chart = new google.visualization.Timeline(container)
        let dataTable = new google.visualization.DataTable()

        dataTable.addColumn({ type: 'string', id: 'Role' })
        dataTable.addColumn({ type: 'string', id: 'Institution' })
        dataTable.addColumn({ type: 'date', id: 'Start' })
        dataTable.addColumn({ type: 'date', id: 'End' })

        dataTable.addRows([
            [ 'Undergrad', 'National Institute of Engineering, Mysore', new Date(2011, 8, 4), new Date(2015, 5, 29) ],
            [ 'Software Engineer', 'Tesco Bengaluru, Bangalore', new Date(2015, 8, 7),  new Date(2018, 3, 29) ],
            [ 'Grad School', 'Arizona State University',  new Date(2018, 7, 15),  new Date(2020, 4, 12) ]
        ])

        const options = {
            backgroundColor: 'azure',
            colors: ['mediumpurple', 'lightsalmon', 'maroon'],
            timeline: {
                barLabelStyle: { fontSize: 14 }
            }
        }

        chart.draw(dataTable, options)
    }

    const languagesSvg = dimple.newSvg("#languages", 625, 450)
    const languagesData = [
        { "Language":"Javascript", "Expertise":9 },
        { "Language":"Java", "Expertise":7.5 },
        { "Language":"PHP", "Expertise":7 },
        { "Language":"Python", "Expertise":8 },
        { "Language":"C++", "Expertise":6 },
        { "Language":"SQL", "Expertise":7.5 },
        { "Language":"CSS", "Expertise":8 },
        { "Language":"HTML", "Expertise":9.5 },
        { "Language":"C", "Expertise":6.5 }
    ]

    let languagesChart = new dimple.chart(languagesSvg, languagesData)
    languagesChart.setBounds(80, 10, '80%', '90%')
    languagesChart.addCategoryAxis("y", "Language")
    languagesChart.addMeasureAxis("x", "Expertise")
    languagesChart.addColorAxis("Expertise", ["#DA9694", "#C4D79B"])
    languagesChart.addSeries(null, dimple.plot.bar)
    languagesChart.draw()

    const skillsSvg = dimple.newSvg("#skills", 625, 450)

    d3.csv('/skills.csv', data => {
        let skillsChart = new dimple.chart(skillsSvg, data)
        skillsChart.setBounds(200, 10, '60%', '90%')
        skillsChart.addCategoryAxis("x", "Proficiency")
        skillsChart.addCategoryAxis("y", "Confidence")
        skillsChart.addMeasureAxis("z", "Number of Projects")
        skillsChart.assignClass("Jenkins", "l")
        skillsChart.addLegend(40, 10, 50, 400, "left")
        skillsChart.addSeries("Technology", dimple.plot.bubble)
        skillsChart.draw()
    })

    document.getElementById('interesting').onclick = () => window.open(links[Math.floor(Math.random() * (links.length + 1) + 0)], "_blank")

}

fetch("https://gist.githubusercontent.com/aneeshmg/7282d2a9af0f4a3036293aa9afe9df3b/raw/01bce2531ad6e43fa62e50a045fe8039fb3b7534/boredom-sites")
    .then(async res => {
        links = await res.json()
    })

setTimeout(init, 500)