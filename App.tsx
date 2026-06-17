import {MaskitoOptions} from '@maskito/core';
import {StyleSheet, Text, TextInput, View} from 'react-native';

import {useMaskito} from './maskito-react-native';

// +1 (555) 123-45-67
const phoneMask: MaskitoOptions = {
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

export default function App() {
  const phone = useMaskito({options: phoneMask});
  const card = useMaskito({options: cardMask});

  return (
    <View style={styles.container}>
      <Text>Phone</Text>
      <TextInput
        {...phone}
        style={styles.input}
        placeholder="+1 (555) 123-45-67"
        placeholderTextColor="gray"
      />

      <Text>Card</Text>
      <TextInput
        {...card}
        style={styles.input}
        placeholder="1234 5678 9012 3456"
        placeholderTextColor="gray"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  input: {
    height: 40,
    padding: 5,
    marginHorizontal: 8,
    borderWidth: 1,
    marginBottom: 16
  }
});