import React, {useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import DeviceModal from '../DeviceConnectionModal';
import PulseIndicator from '../PulseIndicator';
import useBLE from '../useBLE';

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

const Home = () => {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const scanForDevices = () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        scanForPeripherals();
      }
    });
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

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
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <>
            <PulseIndicator />
            <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
            <Text style={styles.heartRateText}>{heartRate} bpm</Text>
          </>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please Connect to a Bluetooth device
          </Text>
        )}
      </View> 

      <TouchableOpacity
        onPress={() => navigation.navigate("DataScreen")}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {"To Data Screen"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={connectedDevice ? disconnectFromDevice : openModal}
        style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>
          {connectedDevice ? 'Disconnect' : 'Connect'}
        </Text>
      </TouchableOpacity>

      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  chartContainer: {
    marginBottom: 20,
  },
});

export default Home;