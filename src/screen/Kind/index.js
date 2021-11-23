import React from "react";
import {
	Text,
	View,
	Alert,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
	Image,
	StyleSheet,
	ScrollView,
	TextInput,
	Platform,
	Dimensions
} from "react-native";
import { Actions } from "react-native-router-flux";
import { SliderBox } from "react-native-image-slider-box";
import api from './../api'
import * as RootNavigation from './../../navigation/RootNavigation.js';
import { func, string, bool, object } from "prop-types";
import { connect } from "react-redux";
// import Carousel from 'react-native-looped-carousel';
import Carousel, { Pagination } from "react-native-snap-carousel";
import { select_style } from "./../../reducer/users";
import NoneUser from "./components/NoneUser";
import UserNonHeader from "./components/UserNonHeader";
import UserHeaderBoth from "./components/UserHeaderBoth";

class Kind extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				image: 'aaa',
				style: 0,
				cards:
				[
					require('./../../../assets/images/0.png'),
					require('./../../../assets/images/1.png'),
					require('./../../../assets/images/2.png'),
				],
				// [
				//   { id: 0, source: require('./../../../assets/images/0.png') },
				//   { id: 1, source: require('./../../../assets/images/1.png') },
				//   { id: 2, source: require('./../../../assets/images/2.png') },
				// ],
				// [
				//     { id: 0, source: { uri: "http://i.imgur.com/XP2BE7q.jpg" } },
				//     { id: 1, source: { uri: "http://i.imgur.com/XP2BE7q.jpg" } },
				//     { id: 2, source: { uri: "http://i.imgur.com/5nltiUd.jpg" } },
				// ],
			}
		}

		_renderItem = ({item, index}) => {
			return <View style={styles.carousel}>
			{
				index === 0 ?
					<NoneUser />
				: index === 1 ?
					<UserNonHeader />
				: index === 2 ?
					<UserHeaderBoth />
				:
					<></>
			}
			</View>
		}

		select_style(style){
			const { id } = this.props.route.params;
			console.log(id);
			const fd = new FormData();
			fd.append("id", id);
			fd.append("style", style);

			this.setState({progressVisible:true})
			api.post('https://he11o.com/id/api/style.php', fd,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				},
			})
			.then(response => {
				console.log(response)
				this.setState({progressVisible:true})
				if (response.data.status == 200) {
					this.props.navigation.navigate('bottomtab', { screen: 'home' });
				} else {
					Alert.alert("Error", JSON.stringify(response.data.message))
				}
			}).catch(err => {
				console.log('err')
			})
		 }

		render() {
				const { style } = this.state;
				const { id } = this.props.route.params;
				const { select_style } = this.props;
				const { width } = Dimensions.get('screen');
				const sliderWidth = width;
				const itemWidth = 0.87 * sliderWidth;
				if (this.state.progressVisible) {
						return (
								<View style={[styles.containerLoader, styles.horizontal]}>
										{/* <Image source={Images.loginLogo} style={styles.logoStyle}/> */}
										<ActivityIndicator size="large" color="grey"/>
								</View>
						);
				} else
						return (
								<SafeAreaView style={{backgroundColor:'#F2F2F2', flex:1}}>
										<View>
												<View style={{
														height:50, alignItems:'center', backgroundColor:'white', justifyContent:'center'
												}}>
														<Text style={{fontFamily: 'BuenosAires'}}>Select Your Style</Text>
												</View>

												<View style={{backgroundColor:'#F2F2F2', height:'80%'}}>
														<View style={{
																height: '100%',
																width:'100%',
																marginTop: 0,
																elevation:4,
																shadowColor: 'black',
																shadowOpacity: 0.3,
																shadowOffset: { width: 0, height: 3 },
																shadowRadius: 2,
																padding:10,
																alignItems:'center'
														}}>

															<Carousel
																ref={(c) => { this._carousel = c; }}
																data={[1, 2, 3]}
																renderItem={this._renderItem}
																sliderWidth={sliderWidth}
																itemWidth={itemWidth}
																onSnapToItem={(index) => {this.setState({style: index});}}
															/>
															<Pagination
																dotsLength={3}
																activeDotIndex={style}
																containerStyle={{}}
																dotColor={'gray'}
																dotStyle={{}}
																inactiveDotColor={'lightgray'}
																inactiveDotOpacity={1}
																inactiveDotScale={1}
																carouselRef={this._carousel}
																tappableDots={!!this._carousel}
															/>

														</View>
												</View>

												<View style={styles.lastrow}>
														<TouchableOpacity onPress={() => select_style(style, id)} style={styles.save_btn}>
																<Text style={{color:'white', fontFamily: 'BuenosAires'}}>SELECT STYLE</Text>
														</TouchableOpacity>
												</View>
										</View>
								</SafeAreaView>
						);
		}
}

const styles = StyleSheet.create({

		label: {
				color:'#B9B9B9',
				fontSize:12,
				marginLeft:5
		},
		containerLoader: {
			flex: 1,
			justifyContent: "center"
		},
		card: {
			flex: 1,
			borderRadius: 4,
			borderWidth: 2,
			borderColor: "#E8E8E8",
			justifyContent: "center",
			backgroundColor: "white"
		},
		carousel: {
			backgroundColor: 'rgba(255,255,255,0.75)',
			height: '100%',
			width: '100%',
			padding: 0,
			flexDirection: 'column',
			justifyContent: 'space-between',
			shadowColor: "#cccccc",
			shadowOffset: {
					width: 4,
					height: 4,
			},
			shadowOpacity: 0.5,
			shadowRadius: 3.84,
			elevation: 4,
		},
		text: {
			textAlign: "center",
			fontSize: 50,
			backgroundColor: "transparent"
		},
		lastrow: {
			alignItems:'center',
			justifyContent:'center',
			height:50,
			bottom: 40
		},
		save_btn: {
			width:'70%',
			height:40,
			borderRadius:20,
			alignItems:'center',
			justifyContent:'center',
			backgroundColor:'#35197c',
				marginTop: 80
	}
});

Kind.propTypes = {
	select_style: func,
	progressVisible: bool,
	users: object,
};

const mapDispatchToProps = dispatch => ({
	select_style: (style, id) => dispatch(select_style(style, id)),
});

const mapStateToProps = ({ users }) => ({
	progressVisible: users.progressVisible,
	users: users.users,
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(Kind);
