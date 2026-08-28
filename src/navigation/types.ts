import { ProtocolId } from '../types';

export interface StartFastParams {
  protocolId: ProtocolId;
  preparationAccepted?: boolean;
  editMode?: boolean;
}

export type ExtendedProtocolId = '48h' | '72h';

export const APP_VERSION = '1.4.0';

export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList } | undefined;
  PreparationExtended: { protocolId: ExtendedProtocolId };
  StartFast: StartFastParams;
  PhaseDetail: {
    protocolId: ExtendedProtocolId;
    phaseId: string;
    isCurrent?: boolean;
  };
  Refeed: { protocolId: ExtendedProtocolId };
  HeightForm: undefined;
  WeightForm: { entryId?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Protocols: undefined;
  Learn: undefined;
  Body: undefined;
  History: undefined;
  Settings: undefined;
};
