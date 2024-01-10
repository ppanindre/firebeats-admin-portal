// NotificationApproval.js
import React, { useCallback, useEffect, useState } from "react";
import { db } from "../App";
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  where,
  query,
  limit,
} from "firebase/firestore";
import ApprovedList from "./ApprovedList";
import NonApprovedList from "./NonApprovedList";
import RejectedList from "./RejectedList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const loaderStyle = {
  fontSize: "24px",
  margin: "16px",
};

const NotificationApproval = () => {
  const [loading, setLoading] = useState(true);
  const [tabSwitching, setTabSwitching] = useState(false);
  const [approvedNotifications, setApprovedNotifications] = useState([]);
  const [nonApprovedNotifications, setNonApprovedNotifications] = useState([]);
  const [selectedTab, setSelectedTab] = useState("approved");
  const [filter, setFilter] = useState({
    Hypertension: true,
    SLEEP: true,
  });
  const [page, setPage] = useState(1); // State for pagination
  const [rejectedNotifications, setRejectedNotifications] = useState([]);
  const [startDate, setStartDate] = useState(0);
  const [endDate, setEndDate] = useState(0);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleFilterChange = (event) => {
    const { name, checked } = event.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: checked,
    }));
  };

  // const handleApprovalFilter = (event) => {
  //   console.log(event);
  // }
  console.log("fetch data");

  const fetchData = useCallback(async () => {
    console.log("fetch data");
    try {
      setLoading(true);

      const userCollection = collection(db, "user");
      const usersSnapshot = await getDocs(userCollection);

      const notificationsData = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const notificationsRef = collection(
          db,
          `user/${userId}/notification/summary/notifications`
        );

        let approvalStatus = "";
        if (selectedTab === "approved") {
          approvalStatus = true;
        } else if (selectedTab === "nonApproved") {
          approvalStatus = "pending";
        } else {
          approvalStatus = false;
        }

        // Modify the filter logic based on the checkbox state
        const queriedDate = query(
          notificationsRef,
          where(
            "type",
            "in",
            Object.keys(filter).filter((key) => filter[key])
          ),
          where("approved", "==", approvalStatus),
          where("timestamp", ">=", parseInt(startDate.getTime())),
          where("timestamp", "<=", parseInt(endDate.getTime())),
          limit(page * 1)
        );

        // if (startDate && endDate) {
        //   console.log(startDate.getTime())
        //   queriedDate = query(
        //     queriedDate,

        //   );
        // }

        const notificationsSnapshot = await getDocs(queriedDate);

        notificationsSnapshot.forEach((notificationDoc) => {
          const notificationData = notificationDoc.data();
          notificationsData.push({
            userId: userId,
            notificationId: notificationDoc.id,
            data: notificationData,
          });
        });
      }

      updateApprovedNonApprovedLists(notificationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setTabSwitching(false);
    }
  }, [filter, page, endDate, startDate, selectedTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Include 'page' in the dependency array

  const updateApprovedNonApprovedLists = (notificationsData) => {
    const approved = [];
    const nonApproved = [];
    const rejected = [];

    notificationsData.forEach((notification) => {
      if (notification.data.approved === true) {
        approved.push(notification);
      } else if (notification.data.approved === false) {
        rejected.push(notification);
      } else {
        nonApproved.push(notification);
      }
    });

    setApprovedNotifications(approved);
    setNonApprovedNotifications(nonApproved);
    setRejectedNotifications(rejected);
  };

  const handleApprove = async (userId, notificationId, notificationData) => {
    try {
      const notificationRef = doc(
        db,
        `user/${userId}/notification/summary/notifications`,
        notificationId
      );

      await updateDoc(notificationRef, {
        ...notificationData,
        approved: "pending",
      });

      setTabSwitching(true);
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleReject = async (userId, notificationId, notificationData) => {
    try {
      const notificationRef = doc(
        db,
        `user/${userId}/notification/summary/notifications`,
        notificationId
      );

      await updateDoc(notificationRef, {
        ...notificationData,
        approved: false,
      });

      setTabSwitching(true);
      fetchData();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const renderNotifications = () => {
    switch (selectedTab) {
      case "approved":
        return (
          <ApprovedList
            notifications={approvedNotifications}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      case "nonApproved":
        return (
          <NonApprovedList
            notifications={nonApprovedNotifications}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      case "rejected":
        return (
          <RejectedList
            notifications={rejectedNotifications}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      default:
        return null;
    }
  };

  const hasMoreData = true; // Determine if there is more data based on your pagination strategy

  return (
    <div style={containerStyle}>
      <h2>Notification List</h2>

      <div>
        <label>Start Date: </label>
        <DatePicker selected={startDate} onChange={handleStartDateChange} />

        <label>End Date: </label>
        <DatePicker selected={endDate} onChange={handleEndDateChange} />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Filter:</label>
        {Object.keys(filter).map((key) => (
          <label key={key} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              name={key}
              checked={filter[key]}
              onChange={handleFilterChange}
            />
            {key}
          </label>
        ))}
      </div>

      {/* <div style={{ marginBottom: '16px' }}>
        <label>Filter:</label>
        
          <label  style={{ marginRight: '10px' }}>
            <input type="checkbox" name={"approved"} checked={filter[key]} onChange={handleFilterChange} />
            {key}
          </label>
      
      </div> */}

      {(loading || tabSwitching) && <div style={loaderStyle}>Loading...</div>}

      {!loading && !tabSwitching && (
        <div style={{ marginBottom: "16px" }}>
          <button onClick={() => handleTabChange("approved")}>
            Approved ({approvedNotifications.length})
          </button>
          <button onClick={() => handleTabChange("nonApproved")}>
            Non-Approved ({nonApprovedNotifications.length})
          </button>
          <button onClick={() => handleTabChange("rejected")}>
            Rejected ({rejectedNotifications.length})
          </button>
        </div>
      )}

      {!loading && !tabSwitching && (
        <div>
          {renderNotifications()}

          {hasMoreData && (
            <button onClick={() => setPage((prevPage) => prevPage + 1)}>
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationApproval;
