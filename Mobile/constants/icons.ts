export const getIconName = (item: string) => {
    switch (item) {
      case 'Flight':
        return 'airplane';
      case 'Hotels':
        return 'bed';
      case 'Guide':
        return 'map';
      case 'Destination':
        return 'location';
      case 'Agency':
        return 'business';
      default:
        return 'help-circle';
    }
  };
  
  export const getBottomIconName = (item: string) => {
    switch (item) {
      case 'Home':
        return 'home';
      case 'Chats':
        return 'chatbubbles';
      case 'favourites':
        return 'heart';
      case 'Account':
        return 'person';
      default:
        return 'help-circle';
    }
  };