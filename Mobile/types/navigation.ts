import { Destination } from '../components/Destinations';
export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Agencies: undefined;
  Destinations: undefined;
  Splash : undefined;
  Login : undefined;
  SignUp : undefined;
  ArticlePage: { place: Destination };
  ConversationListPage: undefined;
  Favourites:undefined;
  ConversationPage: {
    name: string;
    updateLastMessage: (id: string, message: string) => void;
    conversationId: string;
  }
};