import React, {useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';

import Svg, { Path, G } from 'react-native-svg';
import * as d3 from 'd3-shape';

import { useNavigation } from '@react-navigation/native';

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
  const [isIncreasing, setIsIncreasing] = useState(true);

  const addValue = () => {
    setHeartRateData(prevData => [...prevData, prevData[prevData.length - 1] + 100]);
  };

  const navigation = useNavigation()

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartRateData(prevData => {
        // const newValue = isIncreasing ? 50 : 0;
        const newValue = 0;
        const newData = [...prevData, newValue];
        return newData.slice(-75)
      });
      setIsIncreasing(prev => !prev);
    }, 0); // Change value every 5 seconds

    return () => clearInterval(interval);
  }, [isIncreasing]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.chart}>
        {/* // Display Live */}
        <LiveChart data={heartRateData} width={300} height={500} />
      </View>   

      <TouchableOpacity
        onPress={addValue}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {"Add Value"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {"To Home Screen"}
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
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 25,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginHorizontal: 20,
    
  },
  chartContainer: {
    marginBottom: 20,
  },
});

export default DataScreen;