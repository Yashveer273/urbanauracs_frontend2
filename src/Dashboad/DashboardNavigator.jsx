import React, { useEffect, useState } from "react";
import {
  Package2Icon,
  LayoutDashboardIcon,
  BarChart2Icon,
  UserCheckIcon,
  DollarSignIcon,
  TagIcon,
  GlobeIcon,
  TicketIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";

import { Menu, X } from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseCon";

const DashboardNavigator = ({ activeTab, handleTabClick, handleLogout }) => {
  const [counts, setCounts] = useState({});
  const [open, setOpen] = useState(false);

  // Only these tabs will have counts
  const countTabs = ["auth", "sales", "Ticket"];

  const tabs = [
    { tab: "auth", label: "Users", icon: LayoutDashboardIcon },
    { tab: "services", label: "Services", icon: Package2Icon },
    { tab: "Export-Sales", label: "Export Sales Data", icon: BarChart2Icon },
    { tab: "Notification", label: "Notification Controller", icon: BarChart2Icon },
    { tab: "Banner", label: "Banner Management", icon: BarChart2Icon },
    { tab: "VandersSection", label: "Vanders Section", icon: UserCheckIcon },
    { tab: "sales", label: "Sales", icon: DollarSignIcon },
    { tab: "Coupon-Manager", label: "Coupon Manager", icon: TagIcon },
    { tab: "Website-Content", label: "Website Content", icon: GlobeIcon },
    { tab: "Ticket", label: "Ticket", icon: TicketIcon },
    { tab: "dashboard-controller", label: "Dashboard Controller", icon: SettingsIcon },
  ];

 
  useEffect(() => {
    const ref = collection(firestore, "notificationCounters");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const newCounts = {};
      snapshot.forEach((doc) => {
        if (countTabs.includes(doc.id)) {
          newCounts[doc.id] = doc.data().unreadCount || 0;
        }
      });
     
      countTabs.forEach((tab) => {
        if (newCounts[tab] === undefined) newCounts[tab] = 0;
      });

      setCounts(newCounts);
    });

    return () => unsubscribe();
  }, []);

  const handleTabClickWithReset = async (tab) => {
    handleTabClick(tab);
setOpen(false);

    if (countTabs.includes(tab) && counts[tab] > 0) {
      const docRef = doc(firestore, "notificationCounters", tab);

      try {
        await updateDoc(docRef, { unreadCount: 0 });
      } catch (err) {
        console.log(err);
        await setDoc(docRef, { unreadCount: 0 });
      }
    }
  };

return (
  <>
    {/* Mobile Top Bar */}
    <div className="md:hidden flex items-center justify-between p-4 bg-white shadow sticky top-0 z-40">
      <button onClick={() => setOpen(true)}>
        <Menu className="w-6 h-6 text-gray-800" />
      </button>

      <h1 className="font-bold text-lg">Dashboard</h1>
    </div>

    {/* Sidebar */}
    <aside
      className={`
      fixed md:relative top-0 left-0 h-full md:h-auto
      w-64 bg-white shadow-xl p-6
      transform transition-transform duration-300
      ${open ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
      z-50
    `}
    >
      {/* Close Button (mobile only) */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h2 className="font-bold text-lg">Menu</h2>
        <button onClick={() => setOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center">
          <Package2Icon className="w-8 h-8 mr-2 text-indigo-600" />
          Dashboard
        </h1>

        <nav>
          <ul>
            {tabs.map((tabItem) => {
              const Icon = tabItem.icon;
              const count = counts[tabItem.tab];

              return (
                <li className="mb-1 md:mb-2" key={tabItem.tab}>
                  <a
                    href="#"
                    onClick={() => handleTabClickWithReset(tabItem.tab)}
                    className={`flex items-center justify-between p-2 md:p-3 text-sm md:text-base rounded-lg transition-colors duration-200 ${
                      activeTab === tabItem.tab
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {tabItem.label}
                    </div>

                    {countTabs.includes(tabItem.tab) && count > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {count}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            onClick={handleLogout}
            className="
            flex items-center px-4 md:px-5 py-2 text-sm md:text-base bg-red-500 text-white font-semibold rounded-lg
            shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 mt-4
          "
          >
            <LogOutIcon className="w-5 h-5 mr-2" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  </>
);
};

export default DashboardNavigator;