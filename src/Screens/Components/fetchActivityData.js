// fetchSleepData.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../App';
import moment from 'moment';

const fetchActivityData = async (userId, date) => {
  try {
   


    //   const sleepDocRef  = collection(db, `user/${userId}/sleep`);

    // const sleepDocSnapshot = await getDoc(sleepDocRef);
    const activityDocRef = doc(db, `user/${userId}/activity/${date}/intraday/details`);
    
    const activityDocSnapshot = await getDoc(activityDocRef);

    if (activityDocSnapshot.exists()) {
      console.log("Found " +activityDocSnapshot.data())
      const data = activityDocSnapshot.data();
      const timeSeries = data?.activities;
      const timeArray = Array.from({ length: 1440 }).map(() => 0);
      //const timeArray = Array.from({ length: 1440 }).map((value, index) => { return { x: index, y: -1 } })
      timeSeries.forEach((data) => {

          const time = data?.time;
          const value = data?.level + 1;
          //get the index in timeArray from the time.
          const index = moment(time, "HH:mm:ss").diff(moment().startOf("d"), "minute");
          timeArray[index] = value;

      });     
      return timeArray;   
    } else {
      console.log('Activty data not found for the specified date.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching actitvity data:', error);
    return null;
  }
};

export default fetchActivityData;
