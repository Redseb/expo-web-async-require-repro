import { Text } from 'react-native';

export default function LazyThing() {
  return <Text testID="lazy-thing">LazyThing loaded from a split chunk</Text>;
}
