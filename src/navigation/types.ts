import { ProtocolId } from '../types';

export interface StartFastParams {
  protocolId: ProtocolId;
  preparationAccepted?: boolean;
  editMode?: boolean;
}

export const APP_VERSION = '1.3.0';

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList } | undefined;
  Preparation72h: { protocolId: '72h' };
  StartFast: StartFastParams;
  Refeed: undefined;
  HeightForm: undefined;
  WeightForm: { entryId?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Protocols: undefined;
  Body: undefined;
  History: undefined;
  Settings: undefined;
};
