import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const kebabCase = (string) =>
  string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();

function Notification({
  id,
  username,
  event,
  target,
  status,
  time,
  markAsRead,
}) {
  const [fullName, setFullName] = useState("");
  const [postTitlePreview, setPostTitlePreview] = useState("");
  const [postImagePreview, setPostImagePreview] = useState("");
  const [groupNamePreview, setGroupNamePreview] = useState("");
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    fetch("src/users.json")
      .then((response) => response.json())
      .then((users) => {
        users.forEach((user) => {
          if (user.username === username) {
            setFullName(user.fullName);
          }
        });
      });
  }, [username]);

  useEffect(() => {
    fetch("src/posts.json")
      .then((response) => response.json())
      .then((posts) => {
        posts.forEach((post) => {
          if (post.id === target) {
            setPostTitlePreview(post.title);
            if (post.picture) {
              setPostImagePreview(post.picture);
            }
          }
        });
      });
  }, [target]);

  useEffect(() => {
    fetch("src/groups.json")
      .then((response) => response.json())
      .then((groups) => {
        groups.forEach((group) => {
          if (group.id === target) {
            setGroupNamePreview(group.name);
          }
        });
      });
  }, [target]);

  useEffect(() => {
    fetch("src/messages.json")
      .then((response) => response.json())
      .then((messages) => {
        messages.forEach((message) => {
          if (message.id === target) {
            setMessageText(message.text);
          }
        });
      });
  }, [target]);

  return (
    <article
      className={`flex py-3.5 px-3 mb-3 gap-3 rounded-xl text-sm md:text-[0.95rem] ${
        status === "unread" ? "bg-[#f7fafd] hover:cursor-pointer" : ""
      }`}
      onClick={() => markAsRead(id)}
    >
      <a href={username} className="shrink-0">
        <img
          className="w-10 h-10 hover:cursor-pointer"
          src={`src/assets/images/avatar-${kebabCase(fullName)}.webp`}
          alt="User avatar"
        ></img>
      </a>
      <div>
        <a
          href={username}
          className="font-bold text-[#1c202b] mr-[0.2rem] hover:text-[#0a317b]"
        >
          {fullName}
        </a>
        <span className={`text-[#5e6778] ${target ? "mr-1" : ""}`}>
          {event}{" "}
        </span>
        <a
          href={target}
          className={`font-bold ${
            target[0] == "p"
              ? "text-[#5e6778] hover:text-[#0a317b]"
              : target[0] == "g"
              ? "text-[#0a317b]"
              : ""
          } ${status === "unread" ? "mr-1.5" : ""}`}
        >
          {target[0] == "p"
            ? postTitlePreview
            : target[0] == "g"
            ? groupNamePreview
            : ""}
        </a>
        <span
          className={`${
            status === "unread"
              ? "bg-[#f65351] w-2 h-2 rounded-full inline-block align-middle"
              : ""
          }`}
        ></span>
        <p className="text-[#939dae] mt-0.5">{time} ago </p>
        <a
          href={target}
          className={`${
            messageText
              ? "border-[#dde7ee] border-[1.2px] text-[#5e6778] rounded-md mt-2.5 p-3.5 inline-block hover:cursor-pointer hover:bg-[#e5effa]"
              : ""
          }`}
        >
          {messageText}
        </a>
      </div>
      <a href={target} className={`${postImagePreview ? "grow shrink-0" : ""}`}>
        <img
          src={postImagePreview}
          className={`${
            postImagePreview
              ? "rounded-lg outline-[2.5px] outline-[#e5effa] w-10 h-10  hover:cursor-pointer hover:outline object-contain float-right mr-3"
              : ""
          }`}
        ></img>
      </a>
    </article>
  );
}

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  const numberOfNotifications = notifications.filter(
    (notification) => notification.status === "unread"
  ).length;

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => {
        if (notification.id === id) {
          return {
            ...notification,
            status: "read",
          };
        }
        return notification;
      })
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        status: "read",
      }))
    );
  };

  useEffect(() => {
    fetch("src/notifications.json")
      .then((response) => response.json())
      .then((data) => {
        let newNotifications = [];
        data.forEach((notification) => {
          newNotifications = [...newNotifications, notification];
        });
        setNotifications(newNotifications);
      });
  }, []);

  return (
    <main className="md:bg-[#f7fafd] min-h-screen flex justify-center md:items-center">
      <section className="px-6 rounded-2xl max-w-2xl md:bg-white md:shadow-sm md:my-4">
        <header className="flex justify-between py-6 items-center">
          <div>
            <h1 className="text-xl inline-block font-extrabold">
              Notifications
            </h1>
            <mark className="bg-[#0a317b] text-white rounded-md ml-1.5 px-2.5 pt-0.5 pb-1 font-extrabold align-text-bottom">
              {numberOfNotifications}
            </mark>
          </div>
          <p
            onClick={() => markAllAsRead()}
            className="text-[#5e6778] text-[0.9rem] hover:cursor-pointer hover:text-[#0a317b]"
          >
            Mark all as read
          </p>
        </header>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            id={notification.id}
            username={notification.username}
            event={notification.event}
            target={notification.target}
            status={notification.status}
            time={notification.time}
            markAsRead={markNotificationAsRead}
          />
        ))}
      </section>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<NotificationPage />);
