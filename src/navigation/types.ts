import { ProtocolId } from '../types';

export interface StartFastParams {
  protocolId: ProtocolId;
  preparationAccepted?: boolean;
  editMode?: boolean;
}

export const APP_VERSION = '1.2.0';

export type RootStackParamList = {
  MainTabs: { screen?: 'Home' | 'Protocols' | 'History' } | undefined;
  Preparation72h: { protocolId: '72h' };
  StartFast: StartFastParams;
  Refeed: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Protocols: undefined;
  History: undefined;
  Settings: undefined;
};
