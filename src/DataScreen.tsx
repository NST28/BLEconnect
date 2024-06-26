import React, {useState, useEffect, useContext} from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';

import Svg, { Path, G } from 'react-native-svg';
import * as d3 from 'd3-shape';
import { useNavigation} from '@react-navigation/native';
import { DataContext } from './Context';


const LiveChart = ({ data, width, height }) => {
  const line = d3.line().x((d, i) => i * (width / data.length)).y(d => height - d);

  const path = line(data);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <G>
          <Path d={path} fill="none" stroke="green" strokeWidth={2} />
        </G>
      </Svg>
    </View>
  );
};

const DataScreen = () => {
  const [heartRateData, setHeartRateData] = useState([0]);

  const addValue = () => {
    setHeartRateData(prevData => [...prevData, prevData[prevData.length - 1] + 100]);
  };

  const navigation = useNavigation()

  // Get sensor datas
  const liveData = useContext(DataContext);
  var liveDataObj = liveData.liveData;

  var newData = 0;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRateData(prevData => {        
        newData = liveDataObj[Object.keys(liveDataObj)[Object.keys(liveDataObj).length - 1]] * 0.4;
        // newData = Math.random() * 100;
        const chartData = [...prevData, newData];
        return chartData.slice(-100)
      });
    }, 0); // Set time interval

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chart}>

        {/* // Display Live chart */}
        <Text style={styles.chartName}>
          {"Signal chart"}
        </Text>

        <LiveChart data={heartRateData} width={300} height={300} />
      </View>   

      {/* Resemble data received button */}
      <TouchableOpacity
        onPress={addValue}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {"Add Value"}
        </Text>
      </TouchableOpacity>

      {/* Navigate to home screen button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {"Home Screen"}
        </Text>
      </TouchableOpacity>
        
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  chart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 25,
    marginBottom: 5,
    height: 50,    
  },
  chartName:{
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 150,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 25,
    marginBottom: 5,
    borderRadius: 8,
    padding: 10,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 20,
  },
});

export default DataScreen;