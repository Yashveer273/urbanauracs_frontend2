import React, { useEffect, useRef, useState } from "react";
import { notificationSound } from "./sound";
import { NavLink } from "react-router-dom";
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
  MessageCircle,
  Bell,
  GalleryHorizontal,
  Menu,
  X,
} from "lucide-react";

import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebaseCon";
import ImageUploadPopup from "./ImageUploadPopup";

const countTabs = ["auth", "sales"];

const tabs = [
  {
    path: "/Dashboard/users",
    counterKey: "auth",
    label: "Users",
    icon: LayoutDashboardIcon,
  },
  {
    path: "/Dashboard/ticket",
    counterKey: "Ticket",
    label: "Ticket",
    icon: TicketIcon,
  },
  {
    path: "/Dashboard/sales",
    counterKey: "sales",
    label: "Sales",
    icon: DollarSignIcon,
  },
  {
    path: "/Dashboard/venders",
    counterKey: "VandersSection",
    label: "Vanders",
    icon: UserCheckIcon,
  },
  {
    path: "/Dashboard/services",
    counterKey: "services",
    label: "Services",
    icon: Package2Icon,
  },
  {
    path: "/Dashboard/chat-controller",
    counterKey: "Chat-Controller",
    label: "Chat Box",
    icon: MessageCircle,
  },
  {
    path: "/Dashboard/banner",
    counterKey: "Banner",
    label: "Banner",
    icon: GalleryHorizontal,
  },
  {
    path: "/Dashboard/coupon-manager",
    counterKey: "Coupon-Manager",
    label: "Coupon Manager",
    icon: TagIcon,
  },
  {
  path: "/Dashboard/website-content",
  counterKey: "Website-Content",
  label: "Website Content",
  icon: GlobeIcon,
},
  {
    path: "/Dashboard/export-sales",
    counterKey: "Export-Sales",
    label: "Export Sales Data",
    icon: BarChart2Icon,
  },
  {
    path: "/Dashboard/notification",
    counterKey: "Notification",
    label: "Notification Controller",
    icon: Bell,
  },
  {
    path: "/Dashboard/dashboard-controller",
    counterKey: "dashboard-controller",
    label: "Dashboard Controller",
    icon: SettingsIcon,
  },
];

const DashboardNavigator = ({ handleLogout }) => {
  const [counts, setCounts] = useState({});
  const [open, setOpen] = useState(false);
  const [chatUnread, setChatUnread] = useState(0);
  const [ticketNewCount, setTicketNewCount] = useState(0);
  const [ticketUnreadIds, setTicketUnreadIds] = useState([]);
  const [chatUserIds, setChatUserIds] = useState([]);
  const [unreadPerUser, setUnreadPerUser] = useState({});

  const unreadPrevRef = useRef({ auth: 0, sales: 0, chat: 0, ticket: 0 });
  const unsubscribersRef = useRef([]);


  useEffect(() => {
    const ref = collection(firestore, "notificationCounters");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const newCounts = {};

      snapshot.forEach((snap) => {
        if (countTabs.includes(snap.id)) {
          newCounts[snap.id] = snap.data().unreadCount || 0;
        }
      });

      countTabs.forEach((tab) => {
        if (newCounts[tab] === undefined) {
          newCounts[tab] = 0;
        }
      });

      setCounts((prev) => ({ ...prev, ...newCounts }));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCounts((prev) => ({ ...prev, "Chat-Controller": chatUnread }));
  }, [chatUnread]);

useEffect(() => {
  const currentUnread = {
    auth: counts.auth || 0,
    sales: counts.sales || 0,
    chat: counts["Chat-Controller"] || 0,
    ticket: ticketNewCount || 0,
  };

  const hasNewUnread = Object.keys(currentUnread).some(
    (key) => currentUnread[key] > (unreadPrevRef.current[key] || 0)
  );

  if (hasNewUnread) {
    notificationSound.stop();
    notificationSound.play();
  }

  unreadPrevRef.current = currentUnread;
}, [counts, ticketNewCount]);

  useEffect(() => {
    const usersUnsub = onSnapshot(
      collection(firestore, "User"),
      (usersSnapshot) => {
        const users = usersSnapshot.docs.map((snap) => ({
          id: snap.id,
          ...snap.data(),
        }));

        const nextUserIds = users.map((u) => u.id).sort();

        setChatUserIds((prev) => {
          if (
            prev.length === nextUserIds.length &&
            prev.every((id, index) => id === nextUserIds[index])
          ) {
            return prev;
          }

          return nextUserIds;
        });

        setUnreadPerUser((prev) => {
          const nextUnread = {};

          nextUserIds.forEach((id) => {
            nextUnread[id] = prev[id] || 0;
          });

          if (
            Object.keys(prev).length === Object.keys(nextUnread).length &&
            Object.keys(nextUnread).every((id) => prev[id] === nextUnread[id])
          ) {
            return prev;
          }

          return nextUnread;
        });
      }
    );

    return () => usersUnsub();
  }, []);

  useEffect(() => {
    unsubscribersRef.current.forEach((unsub) => unsub());
    unsubscribersRef.current = [];

    chatUserIds.forEach((userId) => {
      const chatId = `${userId}_admin_1`;
      const messagesRef = collection(firestore, "chats", chatId, "messages");

      const q = query(
        messagesRef,
        where("senderRole", "==", "user"),
        where("seen", "==", false)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        setUnreadPerUser((prev) => {
          if (prev[userId] === snapshot.size) return prev;
          return { ...prev, [userId]: snapshot.size };
        });
      });

      unsubscribersRef.current.push(unsub);
    });

    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
    };
  }, [chatUserIds]);

  useEffect(() => {
    const total = Object.values(unreadPerUser).reduce(
      (sum, count) => sum + count,
      0
    );

    setChatUnread((prev) => (prev === total ? prev : total));
  }, [unreadPerUser]);

useEffect(() => {
  const ticketsRef = collection(firestore, "homeCleaningTicket");
  const ticketsQuery = query(ticketsRef, where("data.status", "==", "New"));

  const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => {
    const unreadTickets = snapshot.docs.filter(
      (docSnap) => docSnap.data()?.adminRead !== true
    );

    setTicketUnreadIds(unreadTickets.map((docSnap) => docSnap.id));
    setTicketNewCount(unreadTickets.length);
  });

  return () => unsubscribe();
}, []);

 const handleRouteClickWithReset = async (counterKey) => {
  setOpen(false);

  // Users / Sales counter reset
  if (countTabs.includes(counterKey) && counts[counterKey] > 0) {
    const docRef = doc(firestore, "notificationCounters", counterKey);

    try {
      await updateDoc(docRef, { unreadCount: 0 });
    } catch (err) {
      console.log(err);
      await setDoc(docRef, { unreadCount: 0 });
    }

    setCounts((prev) => ({ ...prev, [counterKey]: 0 }));
  }

  // Chat counter reset
  if (counterKey === "Chat-Controller" && chatUnread > 0) {
    setChatUnread(0);

    const docRef = doc(firestore, "notificationCounters", "Chat-Controller");

    try {
      await updateDoc(docRef, { unreadCount: 0 });
    } catch (err) {
      console.log(err);
      await setDoc(docRef, { unreadCount: 0 });
    }
  }

  // Ticket counter reset
  if (counterKey === "Ticket" && ticketUnreadIds.length > 0) {
    try {
      await Promise.all(
        ticketUnreadIds.map((ticketId) =>
          updateDoc(doc(firestore, "homeCleaningTicket", ticketId), {
            adminRead: true,
          })
        )
      );

      setTicketNewCount(0);
      setTicketUnreadIds([]);
    } catch (err) {
      console.log("Unable to mark tickets as read:", err);
    }
  }
};

  return (
    <>
     <div className="md:hidden flex items-center justify-between p-4 bg-transparent backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
  <button
    onClick={() => setOpen(true)}
    className="h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center shadow-sm"
  >
    <Menu className="w-5 h-5 text-gray-800" />
  </button>

  
</div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

    <aside
  className={`
    fixed md:relative top-0 left-0 z-50
    h-screen w-[248px]
    bg-white border-r border-slate-200
    transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>
  <div className="flex h-full flex-col">
    <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
          <Package2Icon className="h-4.5 w-4.5 text-white" />
        </div>

        <div>
          <h1 className="text-sm font-semibold text-slate-900 leading-none">
            Dashboard
          </h1>
          <p className="mt-1 text-[11px] text-slate-400">Admin Panel</p>
        </div>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>

    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        Menu
      </div>

      <ul className="space-y-0.5">
        {tabs.map((tabItem) => {
          const Icon = tabItem.icon;

          const count =
            tabItem.counterKey === "Ticket"
              ? ticketNewCount
              : counts[tabItem.counterKey];

          return (
            <li key={tabItem.path}>
              <NavLink
                to={tabItem.path}
                onClick={() => handleRouteClickWithReset(tabItem.counterKey)}
                className={({ isActive }) =>
                  `relative flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-slate-100 text-slate-950"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 h-5 w-[3px] rounded-full ${
                        isActive ? "bg-slate-900" : "bg-transparent"
                      }`}
                    />

                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? "text-slate-900" : "text-slate-400"
                      }`}
                    />

                    <span className="flex-1 truncate">{tabItem.label}</span>

                    {((tabItem.counterKey === "Ticket" &&
                      ticketNewCount > 0) ||
                      ((countTabs.includes(tabItem.counterKey) ||
                        tabItem.counterKey === "Chat-Controller") &&
                        count > 0)) && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                        {count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>

    <div className="border-t border-slate-100 p-3">
      <button
        onClick={handleLogout}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-[13px] font-medium text-red-600 transition hover:bg-red-50"
      >
        <LogOutIcon className="h-4 w-4" />
        Logout
      </button>
    </div>
  </div>
</aside>
    </>
  );
};

export default DashboardNavigator;