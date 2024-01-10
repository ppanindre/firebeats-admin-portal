// fetchSleepData.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../App';
import moment from 'moment';

const fetchSleepData = async (userId, date) => {
  try {
   


    //   const sleepDocRef  = collection(db, `user/${userId}/sleep`);

    // const sleepDocSnapshot = await getDoc(sleepDocRef);
    const sleepDocRef = doc(db, `user/${userId}/sleep/${date}`);
    
    const sleepDocSnapshot = await getDoc(sleepDocRef);

    if (sleepDocSnapshot.exists()) {
      console.log("Found " +sleepDocSnapshot.data())
      const data = sleepDocSnapshot.data();
                    const details = data.details;
                   
                    // if query date is today then we need to ignore all data points that are > current time.
                    let modifiedDetails = details.map((value, index) => {
                        const dataTime = moment(value.time, "HH:mm:ss").diff(moment().startOf("d"), "minute");
                        const ignore = moment("20:00:00", "HH:mm:ss").diff(moment().startOf("d"), "minute");
                        if (dataTime > ignore) {
                            return null;
                        }
                        //axlert(ignore)
                        // ignore values greater than 
                        return {
                            x: dataTime,
                            y: parseInt(value.sleepType)
                        }
                      })

                      console.log(modifiedDetails)
                      return modifiedDetails
    } else {
      console.log('Sleep data not found for the specified date.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching sleep data:', error);
    return null;
  }
};

export default fetchSleepData;
