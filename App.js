import React from 'react'
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';


import MyBezierLineChart  from './src/MyBezierLineChart.js';


const pH = {
  label: 'pH',
  upperLimit: 9,
  lowerLimit: 7,
  sql: 'SELECT * FROM sensorParserSmartWater WHERE sensor = "PH" ORDER BY id DESC LIMIT 30'
}
const DO = {
  label: 'DO (mg/l)',
  upperLimit: null,
  lowerLimit: 3.5,
  sql: 'SELECT * FROM sensorParserSmartWater WHERE sensor = "DO" ORDER BY id DESC LIMIT 30'
}
const Temperature = {
  label: 'Temperature (°C)',
  upperLimit: 33,
  lowerLimit: 18,
  sql: 'SELECT * FROM sensorParserSmartWater WHERE sensor = "WT" ORDER BY id DESC LIMIT 30'
}
const Turbidity = {
  label: 'Turbidity (V)',
  upperLimit: 4.2,
  lowerLimit: 2.5,
  sql: 'SELECT * FROM sensorParserSmartWater WHERE sensor = "TUR" ORDER BY id DESC LIMIT 30'
}
const Alkalinity = {
  label: 'Alkalinity (mg/l)',
  upperLimit: 180,
  lowerLimit: 60,
  sql: 'SELECT * FROM sensorParserSmartWater WHERE sensor = "COND" ORDER BY id DESC LIMIT 30'
}
const Salinity = {
  label: 'Salinity (‰)',
  upperLimit: 35,
  lowerLimit: 5,
  sql: 'SELECT * FROM sensorParserSmartWater WHERE sensor = "COND" ORDER BY id DESC LIMIT 30'
}

function App() {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View style={styles.container}>
          <View>
            <MyBezierLineChart props={pH}/>
            <MyBezierLineChart props={DO}/>
            <MyBezierLineChart props={Temperature}/>
            <MyBezierLineChart props={Turbidity}/>
            <MyBezierLineChart props={Alkalinity}/>
            <MyBezierLineChart props={Salinity}/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default App;

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