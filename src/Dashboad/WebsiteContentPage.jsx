import React from "react";

import HomeCarousalAssetController from "./HomeCarousalAssetController";
import SocialLinksManager from "./socialMedia";
import BlockedDatesTable from "./blockDate";
import AddAppBanner from "./AddAppBanner";

const Card = ({ children }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "16px",
      }}
    >
      {children}
    </div>
  );
};

const WebsiteContentPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card>
        <HomeCarousalAssetController />
      </Card>

      <Card>
        <SocialLinksManager />
      </Card>

      <div style={{ gridColumn: "1 / -1" }}>
        <Card>
          <BlockedDatesTable />
        </Card>
      </div>

      <div style={{ gridColumn: "1 / -1" }}>
        <Card>
          <AddAppBanner />
        </Card>
      </div>
    </div>
  );
};

export default WebsiteContentPage;