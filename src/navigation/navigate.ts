import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { RootStackParamList, StartFastParams } from './types';

export function navigateToStartFast(
  navigation: NavigationProp<ParamListBase>,
  params: StartFastParams
) {
  const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
    if (parent) {
    parent.navigate('StartFast', params);
    return;
  }
  (navigation as NativeStackNavigationProp<RootStackParamList>).navigate('StartFast', params);
}
