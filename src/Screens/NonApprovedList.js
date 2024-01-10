// NonApprovedList.js
import React from 'react';
import NotificationCard from './Components/NotificationCard';

const NonApprovedList = ({ notifications, onApprove, onReject }) => {
  return (
    <div>
      <h3>Non-Approved Notifications</h3>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.notificationId}
          userId={notification.userId}
          notificationId={notification.notificationId}
          data={notification.data}
          onApprove={onApprove}
          onReject={onReject}
          isApproved={false}
        />
      ))}
    </div>
  );
};

export default NonApprovedList;
