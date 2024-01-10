import React, { useEffect, useState } from 'react';
import { db } from '../App';
import { getDocs, collection, updateDoc, doc, where, query, limit } from 'firebase/firestore';
import NotificationCard from './Components/NotificationCard';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const loaderStyle = {
  fontSize: '24px',
  margin: '16px',
};

const NotificationApproval = () => {
  const [loading, setLoading] = useState(true);
  const [tabSwitching, setTabSwitching] = useState(false);
  const [approvedNotifications, setApprovedNotifications] = useState([]);
  const [nonApprovedNotifications, setNonApprovedNotifications] = useState([]);
  const [selectedTab, setSelectedTab] = useState('approved');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1); // State for pagination

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const userCollection = collection(db, 'user');
      const usersSnapshot = await getDocs(userCollection);

      const notificationsData = [];

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const notificationsRef = collection(db, `user/${userId}/notification/summary/notifications`);
        const queriedDate = filter === 'All'
          ? query(notificationsRef, where('type', '!=', ''), limit(page * 50))
          : query(notificationsRef, where('type', '==', filter), limit(page * 50));

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
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setTabSwitching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter, page]); // Include 'page' in the dependency array

  const updateApprovedNonApprovedLists = (notificationsData) => {
    const approved = [];
    const nonApproved = [];

    notificationsData.forEach((notification) => {
      if (notification.data.approved) {
        approved.push(notification);
      } else {
        nonApproved.push(notification);
      }
    });
    setApprovedNotifications(approved);
    setNonApprovedNotifications(nonApproved);
  };

  useEffect(() => {
    fetchData();
  }, [selectedTab, page]); // Include 'page' in the dependency array

  const handleApprove = async (userId, notificationId, notificationData) => {
    try {
      const notificationRef = doc(db, `user/${userId}/notification/summary/notifications`, notificationId);

      await updateDoc(notificationRef, {
        ...notificationData,
        approved: true,
      });

      setTabSwitching(true);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleReject = (notificationId) => {
    console.log(`Notification ${notificationId} rejected`);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const renderNotifications = () => {
    return selectedTab === 'approved' ? approvedNotifications : nonApprovedNotifications;
  };

  const hasMoreData = /* Determine if there is more data based on your pagination strategy */ true;

  return (
    <div style={containerStyle}>
      <h2>Notification List</h2>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="filter">Filter:</label>
        <select id="filter" onChange={handleFilterChange} value={filter}>
          <option value="All">All</option>
          <option value="Hypertension">Hypertension</option>
          <option value="SLEEP">Sleep</option>
        </select>
      </div>

      {(loading || tabSwitching) && <div style={loaderStyle}>Loading...</div>}

      {!loading && !tabSwitching && (
        <div style={{ marginBottom: '16px' }}>
          <button onClick={() => handleTabChange('approved')}>Approved ({approvedNotifications.length})</button>
          <button onClick={() => handleTabChange('nonApproved')}>Non-Approved ({nonApprovedNotifications.length})</button>
        </div>
      )}

      {!loading && !tabSwitching && (
        <div>
          <h3>{selectedTab === 'approved' ? 'Approved Notifications' : 'Non-Approved Notifications'}</h3>

          {renderNotifications().map((notification) => (
            <NotificationCard
              key={notification.notificationId}
              userId={notification.userId}
              notificationId={notification.notificationId}
              data={notification.data}
              onApprove={handleApprove}
              onReject={handleReject}
              isApproved={selectedTab === 'approved'}
            />
          ))}

          {hasMoreData && <button onClick={() => setPage((prevPage) => prevPage + 1)}>Load More</button>}
        </div>
      )}
    </div>
  );
};

export default NotificationApproval;
