import React, { useEffect, useState } from "react";
import fetchSleepData from "./fetchSleepData";
import Chart from "./Chart";
// import moment from 'moment';
import moment from "moment-timezone";
import SleepChart from "./SleepChart";
import fetchActivityData from "./fetchActivityData";
import ActivityLineChart from "./ActivityLineChart";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../App";

const cardStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "16px",
  margin: "8px auto", // Center the cards horizontally
  maxWidth: "400px", // Increase the width of the cards
};

const NotificationCard = ({
  userId,
  notificationId,
  data,
  onApprove,
  onReject,
  isApproved,
}) => {
  // console.log(date.concat(`-${data.device}`))

  const [sleepData, setSleepData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [Date, setDate] = useState("");
  const [userDetails, setUserDetails] = useState(null);

  const fetchSleep = async (date) => {
    const fetchedSleepData = await fetchSleepData(userId, date);
    console.log("fetched");
    // console.log(fetchedSleepData)
    setSleepData(fetchedSleepData);
  };

  const fetchUserDetails = async () => {
    try {
      const userDocRef = doc(db, "user", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log(userDoc.data());
        setUserDetails(userDoc.data());
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchActivity = async (date) => {
    const fetchedActivityData = await fetchActivityData(userId, date);
    console.log(fetchedActivityData);

    if (!data?.heartRates) {
      return;
    }

    const startIndexTime = moment(
      data?.heartRates[0].timeStamp,
      "HH:mm:ss"
    ).diff(moment().startOf("d"), "minute");
    const endIndexTime = moment(
      data?.heartRates[data?.heartRates.length - 1].timeStamp,
      "HH:mm:ss"
    ).diff(moment().startOf("d"), "minute");
    const adjustedStartIndex = Math.max(startIndexTime, 0);
    const adjustedEndIndex = endIndexTime + 1;

    console.log(adjustedEndIndex + " " + adjustedStartIndex);

    let adjustedActivityData = (fetchedActivityData ?? [])
      .slice(adjustedStartIndex, adjustedEndIndex)
      .map((data, index) => {
        return {
          x: moment()
            .startOf("d")
            .add(adjustedStartIndex + index, "minute")
            .toDate()
            .getTime(),
          y: data,
        };
      });

    if (
      adjustedActivityData.length === 0 ||
      (adjustedActivityData.length !== 0 &&
        adjustedActivityData.reduce((a, b) => a + parseInt(b.y), 0) === 0)
    ) {
      adjustedActivityData = (data.heartRates ?? []).map((val) => {
        return {
          x: moment(val?.timeStamp, "HH:mm:ss").toDate().getTime(),
          y: 1,
        };
      });
    }

    setActivityData(adjustedActivityData);
    console.log(adjustedActivityData);
  };

  useEffect(() => {
    const timezone = moment.tz.guess();

    let date = data?.chartdate
      ? moment(data.chartdate).format("YYYY-MM-DD")
      : moment.tz(data.timestamp, "gmt").tz(timezone).format("YYYY-MM-DD");

    if (data.device) {
      date = `${date}-${data.device}`;
    }

    setDate(date);

    fetchUserDetails();

    if (date && data?.type === "SLEEP") {
      fetchSleep(date);
    } else {
      fetchActivity(date);
    }
  }, [userId, data]);

  return (
    <div key={notificationId} style={cardStyle}>
      <h3>User ID: {userId}</h3>
      <p>Notification ID: {notificationId}</p>
      <p>Notification Message: {data.message}</p>
      <p>Email : {userDetails?.email}</p>
      {userDetails?.profileData ? (
        <>
          <p>Height : {userDetails?.profileData.height}</p>
          <p>Weight : {userDetails?.profileData.height}</p>
          <p>Gender : {userDetails?.profileData.gender}</p>
          <p>Conditions : {userDetails?.profileData.selectedConditionsValue}</p>
        </>
      ) : (
        <></>
      )}

      <p>Date : {Date}</p>

      {/* <p>Data: {JSON.stringify(data.heartRates)}</p> */}
      <Chart heartRates={data.heartRates} />

      {data.type === "SLEEP" ? (
        sleepData?.length > 0 ? (
          <SleepChart data={sleepData} />
        ) : (
          <p>Sleep Data Not found</p>
        )
      ) : activityData?.length > 0 ? (
        <ActivityLineChart
          data={activityData}
          useTimestamp={true}
          loading={false}
          isNotification={true}
        />
      ) : (
        <p>Activity Data not found</p>
      )}

      {!isApproved && (
        <div style={{ marginTop: "8px" }}>
          <button onClick={() => onApprove(userId, notificationId, data)}>
            Approve
          </button>
          <button onClick={() => onReject(userId, notificationId, data)}>
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
