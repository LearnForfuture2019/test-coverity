import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import * as echarts from 'echarts';


// function App() {
//     const [count, setCount] = React.useState(0);
//     const increment = () => {
//         setCount(count + 1)
//     }

//     const decrement = () => {
//         setCount(count - 1)
//     }

//     const getEchart = () => {
//         var chartDom = document.getElementById('main');
//         var myChart = echarts.init(chartDom);
//         var option;

//         option = {
//           title: {
//             text: 'Stacked Line'
//           },
//           tooltip: {
//             trigger: 'axis'
//           },
//           legend: {
//             data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
//           },
//           grid: {
//             left: '3%',
//             right: '4%',
//             bottom: '3%',
//             containLabel: true
//           },
//           toolbox: {
//             feature: {
//               saveAsImage: {}
//             }
//           },
//           xAxis: {
//             type: 'category',
//             boundaryGap: false,
//             data: ['FCP', 'LCP', 'TTI', 'SI', 'TBT']
//           },
//           yAxis: {
//             type: 'value'
//           },
//           series: [
//             {
//               name: 'Email',
//               type: 'line',
//               stack: 'Total',
//               data: [120, 132, 101, 134, 90, 230, 210]
//             },
//             {
//               name: 'Union Ads',
//               type: 'line',
//               stack: 'Total',
//               data: [220, 182, 191, 234, 290, 330, 310]
//             },
//             {
//               name: 'Video Ads',
//               type: 'line',
//               stack: 'Total',
//               data: [150, 232, 201, 154, 190, 330, 410]
//             },
//             {
//               name: 'Direct',
//               type: 'line',
//               stack: 'Total',
//               data: [320, 332, 301, 334, 390, 330, 320]
//             },
//             {
//               name: 'Search Engine',
//               type: 'line',
//               stack: 'Total',
//               data: [820, 932, 901, 934, 1290, 1330, 1320]
//             }
//           ]
//         };

//         option && myChart.setOption(option);
//     }

//     React.useEffect(() => {
//       getEchart()
//     },[]) 
//     return (
//         <>
//             <p>{count}</p>
//             <button onClick={increment}>Increment</button>
//             <button onClick={decrement}>Decrement</button>
//             <div id='main'></div>
//         </>
//     )
// }

// export default App
const option = {
  title: {
    text: 'Performance timing'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['SSR', 'CSR']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['FCP', 'LCP', 'TTI', 'SI', 'TBT']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'CSR',
      type: 'line',
      stack: 'single',
      data: [2.8, 3.6, 3.8, 2.9, 0.38]
    },
    {
      name: 'SSR',
      type: 'line',
      stack: 'Total',
      data: [1.5, 1.7, 5.9, 1.9, 0.17]
    }
  ]
};
class App extends Component {
  componentDidMount() {
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    option && myChart.setOption(option)
  }
    

  render() {
    return (
        <div id='main' style={{width: 600, height: 600}}>
        </div>
    );
  }


}

export default App;
