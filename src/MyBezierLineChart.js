import React from 'react'
import {
  Text,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native'
import {
  LineChart
} from 'react-native-chart-kit'

import {
  Rect, 
  Text as TextSVG, 
  Svg,
  Line,
  Circle
} from 'react-native-svg'

import { useState, useEffect } from 'react'
import axios from 'axios'

const apiUrl = 'https://9bd5-115-73-218-247.ngrok-free.app/query'
const isNumber = value => !isNaN(parseFloat(value)) && isFinite(value)

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Month is zero-based, so we add 1
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();

  // Format the components with leading zeros if needed
  const formattedDate = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}  ${hour}:${minute}:${second}`;

  return formattedDate;
}

const  MyBezierLineChart = (props) => {

  const { label, sql } = props.props;

  const [xData, setXData] = useState([1])
  const [yData, setYData] = useState([1])
  const [flag, setFlag] = useState(true)
  const [selectedDataIndex, setSelectedDataIndex] = useState(null)
  
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    label,
    value: 0,
  });

  const fullUrl = `${apiUrl}?sql=${encodeURIComponent(sql)}`

  const fetchData = async () => {
    try {
      const response = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          Accept: 'application/json'
        }
      });
  
      if (!response.data) {
        throw new Error('Empty response data');
      }
  
      const dataArray = response.data;
  
      if (dataArray && Array.isArray(dataArray)) {
        const newData = dataArray.map(data => {
          const { value, timestamp } = data
          const timestampDate = new Date(timestamp)
          if (isNumber(value)) {
            return {
              x: timestampDate,
              y: label === 'Alkalinity (mg/l)' ?
                ((parseFloat(value) * 0.64) / 0.6).toFixed(2) : label === 'Salinity (‰)' ?
                  (parseFloat(value) * 0.00064).toFixed(2) : label === 'DO (mg/l)' ?
                    (parseFloat(value) * 1.33).toFixed(2) : parseFloat(value)
            };
          } else {
            return {
              x: timestampDate,
              y: parseFloat(4)
            };
          }
        });
  
        newData.sort((a, b) => a.x - b.x);
        setXData(newData.map(item => item.x));
        setYData(newData.map(item => item.y));
      }
    } catch (error) {
      console.error('Axios error:', error);
    }
  };

  useEffect(() => {
    fetchData()

    // set time to call api and get data
    const intervalId = setInterval(() => {
      setFlag(!flag)
    }, 500000)

    return () => {
      clearInterval(intervalId)
    }
    
  }, [flag])

  
  


  return (
    <>
      <Text style={styles.header}>{label}</Text>
      <LineChart
        data={{
          labels: [formatTimestamp(xData[0]), formatTimestamp(xData[xData.length - 1])],
          datasets: [
            {
              data: yData,
            },
            {
              data: [Math.min(...yData) - 0.1],
              color: () => 'transparent',
              strokeWidth: 0,
              withDots: false,
            },
            {
              data: [Math.max(...yData) + 0.1],
              color: () => 'transparent',
              strokeWidth: 0,
              withDots: false,
            },
          ],
        }}
        width={Dimensions.get('window').width - 16}
        height={220}
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "0",
            //strokeWidth: "2",
            stroke: "red"
          }
        }}
        withInnerLines={false} // hide the grid behind chart
        hideLegend={ true }
        bezier
        style={{
          marginVertical: 6,
          borderRadius: 16,
        }}
        decorator={() => {

          const rectWidth = label === 'pH' 
                            ? 100 : label === 'DO (mg/l)'
                            ? 125 : label === 'Temperature (°C)'
                            ? 160 : label === 'Turbidity (V)'
                            ? 130 : label === 'Alkalinity (mg/l)'
                            ? 180 : 130
          const rectHeight = 40
          const rectX = tooltipPos.x - 15
          const rectY = tooltipPos.y + 10

          return tooltipPos.visible ? (
            <View>
              <Svg>
                <Rect
                  x={rectX}
                  y={rectY}
                  width={rectWidth}
                  height={rectHeight}
                  fill="white"
                />
                <Line
                  x1={rectX}
                  y1={rectY + rectHeight / 2}
                  x2={rectX + rectWidth}
                  y2={rectY + rectHeight / 2}
                  stroke="black"
                  strokeWidth="0.3"
                />
                <TextSVG
                  x={rectX + rectWidth / 2}
                  y={rectY + rectHeight / 2 + 14}
                  fill="black"
                  fontSize="13"
                  textAnchor="middle">
                  {`${label} : ${tooltipPos.value}`}
                </TextSVG>
                <TextSVG
                  x={rectX + rectWidth / 2}
                  y={rectY + rectHeight / 2 - 5}
                  fill="black"
                  fontSize="13"
                  textAnchor="middle">
                  {`${tooltipPos.label}`}
                </TextSVG>
              </Svg>
            </View>
          ) : null;
        }}
        onDataPointClick={data => {
          let isSamePoint = tooltipPos.x === data.x && tooltipPos.y === data.y;
          isSamePoint
            ? setTooltipPos(previousState => {
                //setSelectedDataIndex(null)
                return {
                  ...previousState,
                  value: data.value,
                  label: formatTimestamp(xData[data.index]),
                  visible: !previousState.visible,
                };
              })
            : setTooltipPos({
                x: data.x,
                value: data.value,
                label: formatTimestamp(xData[data.index]),
                y: data.y,
                visible: true,
              });
              //setSelectedDataIndex(data.index)
        }}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20
  },
  header: {
    textAlign: 'center',
    fontSize: 18,
    padding: 10
  }
})


export default MyBezierLineChart;