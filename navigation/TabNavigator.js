import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ focused, label, icon }) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.activeIndicator, focused && styles.activeIndicatorVisible]} />
      <View style={styles.iconShell}>{icon}</View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      detachInactiveScreens={false}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        sceneStyle: { backgroundColor: '#000000' },
        tabBarStyle: [styles.tabBar, { height: 86 + insets.bottom, paddingBottom: 10 + insets.bottom }],
      }}
    >
      <Tab.Screen
        name="Sessions"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="SESSIONS"
              icon={<Ionicons name="alarm" size={26} color={focused ? '#FFFFFF' : '#B5B5B5'} />}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Deep Work"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="DEEP WORK"
              icon={<MaterialCommunityIcons name="target" size={24} color={focused ? '#FFFFFF' : '#B5B5B5'} />}
            />
          ),
        }}
      >
        {() => <PlaceholderScreen title="Deep Work" />}
      </Tab.Screen>
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="ANALYTICS"
              icon={
                <MaterialCommunityIcons
                  name="chart-bar"
                  size={24}
                  color={focused ? '#FFFFFF' : '#B5B5B5'}
                />
              }
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="PROFILE"
              icon={<Ionicons name="person" size={24} color={focused ? '#FFFFFF' : '#B5B5B5'} />}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderTopColor: '#1A1A1A',
    borderTopWidth: 1,
    height: 86,
    paddingTop: 12,
    paddingBottom: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 88,
    height: 72,
  },
  activeIndicator: {
    width: 56,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 14,
  },
  activeIndicatorVisible: {
    backgroundColor: '#FFFFFF',
  },
  iconShell: {
    width: 34,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },
  tabLabel: {
    color: '#B5B5B5',
    fontSize: 32 / 3,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  tabLabelFocused: {
    color: '#FFFFFF',
  },
});
