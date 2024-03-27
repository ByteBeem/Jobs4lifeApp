import React, {   useState } from 'react';
import { View, Text } from 'react-native'
import PageContainer from '../pageContainer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SIZES, FONTS } from '../../constants'
import Button from '../Button'
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';


export default function welcome() {

    const navigation = useNavigation();
    const [appVersion, setAppversion] = useState('1.0.0');

   

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>

                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: 'column',
                        marginHorizontal: 22,
                    }}
                >

                    <LottieView source={require("../../assets/json/animation.json")}
                        autoPlay
                        loop
                        style={{
                            width: SIZES.width * 0.7,
                            height: SIZES.width * 0.7,
                            marginVertical: 48,
                        }}
                    />

                    <Text
                        style={{
                            ...(SIZES.width <= 360
                                ? { ...FONTS.h2 }
                                : { ...FONTS.h1 }),
                            textAlign: 'center',
                            marginHorizontal: SIZES.padding * 0.8,
                        }}
                    >
                        Job hunting made easier , Find jobs near your location .
                    </Text>

                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Text
                            style={{
                                ...FONTS.body3,
                                marginVertical: 12,
                            }}
                        >
                            Terms and Privacy
                        </Text>

                        <Button
                            title="Launch Jobs4life"
                            onPress={() => navigation.navigate("Home")}
                            style={{
                                width: '100%',
                                paddingVertical: 12,
                                marginBottom: 48,
                            }}
                        >
                            
                        </Button>

                        <Text
                            style={{
                                ...FONTS.body3,
                                marginVertical: 12,
                            }}
                        >
                            {`version ${appVersion}`}
                        </Text>
                    </View>
                </View>

            </PageContainer>
        </SafeAreaView>
    )
}