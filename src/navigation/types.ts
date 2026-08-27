export type RootStackParamList = {
  MainTabs: { screen?: 'Home' | 'Protocols' | 'History' } | undefined;
  Preparation72h: { protocolId: '72h' };
  Refeed: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Protocols: undefined;
  History: undefined;
  Settings: undefined;
};
