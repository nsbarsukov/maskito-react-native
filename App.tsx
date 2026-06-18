import {StyleSheet, Text, TextInput, View} from 'react-native';
import {MaskitoOptions} from '@maskito/core';
import {maskitoDate, maskitoNumber, maskitoTime} from '@maskito/kit';
import {maskitoPhone} from '@maskito/phone';
import metadata from 'libphonenumber-js/min/metadata';

import {useMaskito} from './maskito-react-native';

const numberMask = maskitoNumber({
  maximumFractionDigits: 2,
  min: 0,
  max: 100,
  postfix: '%',
});

const dateMask = maskitoDate({locale: 'lt-LT'});

const timeMask = maskitoTime({mode: 'HH:MM'});

// +1 (555) 123-45-67
const usaPhoneMask: MaskitoOptions = {
  mask: Array.from('+1 (###) ###-##-##').map(x => x === '#' ? /\d/ : x)
};

// 1234 5678 9012 3456
const cardMask: MaskitoOptions = {
  mask: [
    ...Array<RegExp>(4).fill(/\d/),
    ' ',
    ...Array<RegExp>(4).fill(/\d/),
    ' ',
    ...Array<RegExp>(4).fill(/\d/),
    ' ',
    ...Array<RegExp>(4).fill(/\d/),
  ],
};

const autoPhoneMask = maskitoPhone({
    metadata,
    strict: false,
    countryIsoCode: 'RU',
});


export default function App() {
  const number = useMaskito({options: numberMask, defaultValue: '42%'});
  const date = useMaskito({options: dateMask});
  const time = useMaskito({options: timeMask});
  const usaPhone = useMaskito({options: usaPhoneMask});
  const card = useMaskito({options: cardMask});
  const anyPhone = useMaskito({options: autoPhoneMask});

  return (
    <View style={styles.container}>
      <Text>Number</Text>
      <TextInput {...number} style={styles.input} />

      <Text>Date</Text>
      <TextInput 
        {...date} 
        style={styles.input} 
        placeholder="yyyy/mm/dd"
        placeholderTextColor="gray" 
      />

      <Text>Time</Text>
      <TextInput 
        {...time} 
        style={styles.input} 
        inputMode="decimal"
        placeholder="HH:MM"
        placeholderTextColor="gray" 
      />

      <Text>USA Phone</Text>
      <TextInput
        {...usaPhone}
        style={styles.input}
        placeholder="+1 (___) ___-__-__"
        placeholderTextColor="gray"
      />

      <Text>Card</Text>
      <TextInput
        {...card}
        style={styles.input}
        placeholder="0000 0000 0000 0000"
        placeholderTextColor="gray"
      />

      <Text>Any country phone number</Text>
      <TextInput {...anyPhone} style={styles.input} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
    padding: 8,
    paddingTop: 64,
  },
  input: {
    height: 40,
    padding: 5,
    marginHorizontal: 8,
    borderWidth: 1,
    marginBottom: 16
  }
});