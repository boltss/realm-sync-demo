import React, {useMemo, useEffect, useCallback, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AppProvider, createRealmContext, useApp} from '@realm/react';
import {Credentials, SyncConfiguration} from 'realm';

const RealmContext = createRealmContext({
	schema: [],
});
const {RealmProvider} = RealmContext;

const MONGO_ATLAS_APP_ID = 'ADD_YOUR_APP_ID_HERE'; // Change to your mongo atlas app id

const styles = StyleSheet.create({
	container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

const AppComponent = () => {
	const realmApp = useApp();
	const [user, setUser] = useState<Realm.User<any>>();

	const syncConfig: Partial<SyncConfiguration> | undefined = useMemo(
		() => (user ? {flexible: true, user: user} : undefined),
		[user],
	);

	const loginToRealm = useCallback(async () => {
		// Waiting 2 seconds until login as a test simulating logging in later in the app's user flow
		await new Promise(resolve => setTimeout(resolve, 2000));
		const credentials = Credentials.anonymous();
		try {
			const realmUser = await realmApp.logIn(credentials);
			console.log('Successfully logged in!', realmUser.id);
			setUser(realmUser);
		} catch (error) {
			console.error('Failed to log in', (error as any).message);
		}
	}, [realmApp]);

	useEffect(() => {
		loginToRealm();
	}, [loginToRealm]);

	return (
		<RealmProvider sync={syncConfig}>
			<View style={styles.container}>
				<Text>User {user?.id ?? 'not logged in'}</Text>
			</View>
		</RealmProvider>
	);
};

const App = () => {
	return (
		<AppProvider id={MONGO_ATLAS_APP_ID}>
			<AppComponent />
		</AppProvider>
	);
};

export default App;
