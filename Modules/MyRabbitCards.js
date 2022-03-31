import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, {useRef, useContext, useEffect, useState } from "react";
import { Fonts } from '../common/Fonts';

import {
  AppState,
  SafeAreaView,
    StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import { ScrollView } from 'react-native-virtualized-view';

import { SwipeListView } from "react-native-swipe-list-view";
import { connect, useDispatch, useSelector } from "react-redux";
import { LoadingContainer, Menu, PlayButton } from "../components/Button";
import { CreateIcon, UnderlineIcon } from "../components/icons";
import { getAllGolfers } from "../store/redux/golfers/actions";
import { updateDeviceToken } from "../store/redux/auth/actions";
import { BackButton, Button } from '../components/Button';

import {
  deleteRabbitCard,
  getAllTournaments,
  getRabbitCards,
} from "../store/redux/tournaments/actions";
import { handleNavigation } from "../utils/helpers";
import { w ,h} from "../utils/scale";
import { CommonColors, CommonStyles } from "./style";
var pageCount = 0 ;
const MyRabbitCards = ({ navigation }) => {
  const [deviceToken, setDeviceToken] = useState("");
  const isFocused = useIsFocused();
  const tournaments = useSelector((state) => state.tournaments);
  var myTournaments =[];
  tournaments.rabbitCards.forEach(element => {
    if(element.state == 1) myTournaments.push(element);
  });
  const golfers = useSelector((state) => state.golfers);
  const dispatch = useDispatch();
  if(pageCount === 0){
    tournaments.rabbitcardLoading = true;
    console.log("yyyyyyy",tournaments.rabbitcardLoading )
  }
  
  pageCount++;
  useEffect(async () => {
    if (isFocused) {
      fetch();
      const device_token = await AsyncStorage.getItem("device_token")
      setDeviceToken(device_token)
      console.log("device_token ====", device_token);
      const payload = {       
        device_token: device_token
      }
      dispatch(updateDeviceToken(payload));
      checkForNotification();
    }
  }, []);
  

  const checkForNotification = async () => {
    const mNotification = await AsyncStorage.getItem('notification');
    const notificationData = JSON.parse(mNotification);
    console.log("logged in notification", notificationData);
    if(notificationData !== null && Object.keys(notificationData).length>0){
      if(notificationData.hasOwnProperty("type")){
        handleNavigation(notificationData,true)
      }
    }else{
      console.log("null")
    }
  }

  const fetch = async () => {
    dispatch(getRabbitCards());
    dispatch(getAllTournaments());
    dispatch(getAllGolfers());
  };

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...tournaments.rabbitCards];
    const prevIndex = tournaments.rabbitCards.findIndex(
      (item) => item.id === rowKey
    );
    dispatch(deleteRabbitCard({ id: tournaments.rabbitCards[prevIndex].id }));
    newData.splice(prevIndex, 1);
    fetch();
  };

  const onRowDidOpen = (rowKey) => { };

  const onSwipeValueChange = (swipeData) => {
    // const { key, value } = swipeData;
    // rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };

  const renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack} key={`${rowMap}`}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(rowMap, data.item.id)}
        >
          <Text style={styles.backTextWhite}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const RabbitStatusNavigation = ({ item }) => {
    //console.log("Card status === = = = = = " , item.status)
    var item_status = item.status
    
    switch (item_status) {
      case "ready":
        return (
          <PlayButton
            onPress={() => {
              console.log("Card Item =========: ",tournaments.rabbitCards)
              navigation.navigate("Calc", { card: item })
            }}
            status="ready"
          />
        );
      case "played":
        return (
          <PlayButton
            onPress={() => {
              // RabbitCardSummaryPlayed
             // navigation.navigate("TieBreaker", { card:item })
              navigation.navigate("SummaryPlayed", { card: item })              
            }}
            status="played"
          />
        );
      case "in_progress":
        return (
          <PlayButton
            onPress={() =>
              navigation.navigate("SummaryInProgress", { card: item })
            }
            status="in_progress"
          />
        );
      case "selected":
        return (
          <PlayButton
            onPress={() => navigation.navigate("Countdown", { card: item })}
            status="selected"
          />
        );
      default:
        return <View />;
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.row} key={`card-${index}`}>

        <View style={[styles.left, { width: w(400) }]}>
          <Text style={CommonStyles.textInput}>{item.tournament.name}</Text>
          <Text style={CommonStyles.rowTitle}>Round {item.round}</Text>
          <Text style={CommonStyles.smallText}>
            {new Date(new Date(item.tournament.start_date).getTime() + 86400000 * (item.round-1)).toUTCString().substring(0,16) || ""} -{" "}
            {new Date(item?.tournament.end_date).toUTCString().substring(0,16)|| ""}
          </Text>
          {item.status === "selected" && <Text style={{fontWeight:'bold',fontFamily: Fonts.SourceSansRomanRegular,
                fontSize: w(24),
              lineHeight: w(28),
              color: CommonColors.Dark,}}>Selections are live at the end of the countdown.</Text>}
          
        </View>
        <View style={styles.right}>
          <RabbitStatusNavigation item={item} />
        </View>
      </View>
    );
  };

  return (
    <View style={CommonStyles.container}>   
    <SafeAreaView style={CommonStyles.container}>
    <StatusBar
        animated={true}
        backgroundColor="#61dafb"
        barStyle='dark-content'
        //  showHideTransition={statusBarTransition}
        hidden={false} />
      <Menu />
      {(tournaments.loading || golfers.loading) && <LoadingContainer />}
      {/* <ScrollView style={CommonStyles.container}> */}
        <View style={[CommonStyles.padding, { paddingTop: w(100),paddingRight:w(20), }]}>
          <Text style={CommonStyles.title}>My Rabbit Cards</Text>
          <View style={styles.padding20}>
            <UnderlineIcon />
          </View>
          <Text style={{fontWeight:'bold',fontFamily: Fonts.SourceSansRomanRegular,
                fontSize: w(30),
              lineHeight: w(36),
              color: CommonColors.Dark,}}>
                CURRENT RABBIT CARDS</Text>
          {/* <Text style={CommonStyles.sectionTitle}>deviceToken : {deviceToken}</Text> */}
          {/* <TouchableOpacity
            onPress={() => Clipboard.setString(deviceToken)}
          >
            <Text style={{ color: 'red' }}>Copy</Text>
          </TouchableOpacity> */}
          <View style={{height:h(700)}}>
            <SwipeListView
              data={myTournaments}
              renderItem={renderItem}            
              renderHiddenItem={renderHiddenItem}
              leftOpenValue={w(75)}
              rightOpenValue={-w(120)}
              previewRowKey={"0"}
              previewOpenValue={-40}
              previewOpenDelay={3000}
              onRowDidOpen={onRowDidOpen}
              keyExtractor={(item, index) => item.id}
              onSwipeValueChange={(item) => onSwipeValueChange(item)}
              disableRightSwipe={true}
              style = {{paddingRight:10}}
              // showsVerticalScrollIndicator = {false}
            />
            
          </View>        
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
      <TouchableOpacity
                  style={{backgroundColor:CommonColors.Green,flexDirection: "row",alignItems: "center",height:100}}
                  onPress={() => navigation.navigate("CreateRabbitCards")}
                >
                  
                  <CreateIcon  style = {{paddingLeft: 100}}/>
                  <Text style={[CommonStyles.rowTitle, { paddingLeft: 0 ,color: CommonColors.White,fontWeight:'bold'}]}>
                    Create New Rabbit Card
                  </Text>
          </TouchableOpacity>
    </View>

  );
};

const mapStateToProps = (state) => ({
  loading: state.tournaments.loading,
  error: state.tournaments.error,
});

export default connect(mapStateToProps, {
  getAllTournaments,
  getAllGolfers,
  getRabbitCards,
})(MyRabbitCards);

const styles = StyleSheet.create({
  padding20: {
    paddingVertical: w(20),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: w(20),
    backgroundColor: CommonColors.White,
  },
  left: {
    justifyContent: "center",
  },
  right: {
    justifyContent: "center",
  },
  createContent: {
    paddingVertical: w(40),
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    backgroundColor: CommonColors.White,
    flex: 1,
  },
  backTextWhite: {
    color: CommonColors.White,
  },
  rowFront: {
    alignItems: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    justifyContent: "center",
    height: 50,
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: CommonColors.LightGrey,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: w(15),
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: w(120),
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
});
