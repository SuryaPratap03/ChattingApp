import React, { useEffect, useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { uploadFile } from "../helper/uploadFile";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addUserDetails } from "../redux/userSlice";
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { LogoutUser } from "../../../backend/controllers/LogoutUser";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const Chat = () => {
  const navigate = useNavigate();

  const curruser = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [allMessages, setAllMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const fileref = useRef();
  const [data, setData] = useState({
    attachment: "",
    text: "",
    attachmentName: "",
  });
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment") {
      const currfile = await uploadFile(files[0]);
      setData((prev) => ({
        ...prev,
        attachment: currfile?.url,
        attachmentName: files[0].name, // Store file name
      }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveAttachment = () => {
    setData((prev) => ({ ...prev, attachment: "", attachmentName: "" }));
  };

  const getallUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_Backend_Url}/getAllOtherUsers`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      if(!response.ok){
        navigate('/login');
      }
      const data = await response.json();
      setContacts(data);
      setLoading(false);
    } catch (error) {
      // console.log("Problem in Get all users", error);
      setLoading(false);
    }
  };

  const getCurruserDetails = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_Backend_Url}/userDetails`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if(!response.ok){
        console.log('response',response);
        
        navigate('/login');
      }
      console.log('response',response);

      const data = await response.json();
      // console.log('Backend Data of user',data.user);
      
      // console.log(
      //   data?.user?._id,
      //   data?.user?.name,
      //   data?.user?.profile_pic
      // );
      dispatch(
        addUserDetails({
          userId: data?.user?._id,
          username: data?.user?.name,
          profile_pic: data?.user?.profile_pic,
        })
      );
    } catch (error) {
      console.log("Error getting currUser details", error);
    }
  };
  useEffect(() => {
    // console.log(curruser);
  }, [curruser]);
  useEffect(() => {
    getallUsers();
    getCurruserDetails();

    // Update view on window resize
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to handle different file previews based on file type
 // Function to handle different file previews based on file type
const renderAttachmentPreview = () => {
  const extension = data.attachmentName.split(".").pop().toLowerCase();

  if (data.attachment) {
    if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
      return (
        <img
          src={data.attachment}
          alt="Attachment"
          className="max-w-[150px] h-auto rounded-md"
        />
      );
    } else if (["mp4", "webm", "ogg"].includes(extension)) {
      return (
        <video controls className="max-w-[150px] h-auto rounded-md">
          <source src={data.attachment} type={`video/${extension}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (["pdf", "txt"].includes(extension)) {
      return (
        <div className="flex flex-col items-center">
          <p className="text-sm text-gray-700 mb-2">{data.attachmentName}</p>
          <a
            href={data.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            View File
          </a>
        </div>
      );
    } else if (["mp3", "wav", "ogg"].includes(extension)) {
      return (
        <audio controls className="max-w-[150px] h-auto rounded-md">
          <source src={data.attachment} type={`audio/${extension}`} />
          Your browser does not support the audio element.
        </audio>
      );
    } else {
      return (
        <p className="text-sm text-center mt-2 text-gray-700">
          {data.attachmentName}
        </p>
      );
    }
  }
  return null;
};


  //handling socket.io here
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io(`${import.meta.env.VITE_Backend_Url}`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      // console.log("Connected to the server", socketRef.current.id);
    });

    socketRef.current.on("receivedMessage", (msg) => {
      // console.log('receivedMessage',msg);

      setAllMessages((msgs) => [...msgs, msg]);
    });

    socketRef.current.on('allprevMessages',async(msgs)=>{
      const prevMessages = await JSON.parse(msgs);
      // console.log('prevMessages he ye to ',prevMessages);
      
      setAllMessages([
        ...prevMessages
      ])
    })
    return () => {
      socketRef.current.disconnect();
      console.log("Server disconnected");
    };
  }, []);

  useEffect(() => {
    // console.log('saare messages ',allMessages);
  }, [allMessages]);

  const handleSend = async () => {
    if (data.attachment || data.text) {
      // console.log("sender", curruser.userId);
      // console.log("receiver", selectedUser?._id);
      const body = {
        data: data,
        senderId: curruser?.userId,
        receiverId: selectedUser?._id,
      };

      socketRef.current.emit("message", JSON.stringify(body));
      setAllMessages((msgs) => [...msgs, body]);
      setData({
        attachment: "",
        text: "",
        attachmentName: "",
      })
    }
  };

  useEffect(() => {
    
      registerUser();
    
  }, [curruser?.userId]);

  const registerUser = () => {
    socketRef.current.emit("register", JSON.stringify(curruser?.userId));
    // console.log("User registered with ID:", curruser.userId);
  };

  const handleDownload = async (url, name) => {
    try {
      // Fetch the file from the URL
      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a temporary anchor element
      const link = document.createElement("a");

      // Create a URL for the Blob and set it as the href attribute
      const fileURL = URL.createObjectURL(blob);
      link.href = fileURL;

      // Set the download attribute with a default or custom filename
      link.download = name; // You can customize the file name

      // Append the anchor to the document body
      document.body.appendChild(link);

      // Trigger a click on the anchor to start the download
      link.click();

      // Clean up: Remove the anchor and revoke the Blob URL
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };
  const handleSelectedUser =(contact)=>{
    setAllMessages([])
    setSelectedUser(contact);
    
    socketRef.current.emit('getAllMessagesFromConversation',JSON.stringify({senderId:curruser.userId,receiverId:contact._id}))
    // console.log('Sending payload to Server',JSON.stringify({senderId:curruser.userId,receiverId:contact._id}));
  }
  const handleLogout = async () => {
    try {
      // Send logout request to the backend
      const response = await fetch(`${import.meta.env.VITE_Backend_Url}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // Show success toast
        toast.success('Logged out successfully!');
        navigate('/login'); // Navigate to login page after successful logout
      } else {
        // Show error toast
        const data = await response.json();
        toast.error(`Error: ${data.message || 'Logout failed!'}`);
      }
    } catch (error) {
      // console.log('Error while logging out:', error);
      // Show error toast in case of network or other issues
      toast.error('Error while logging out. Please try again later.');
    }
  };
  return (
    <div className="h-screen flex">
      {/* Contact List */}
      <div
        className={`${
          isMobileView && selectedUser ? "hidden" : "block"
        } w-full md:w-1/4 bg-blue-50 p-4 overflow-y-auto border-r`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-3 items-center">
            <RiLogoutCircleLine className="text-xl text-blue-500 cursor-pointer" onClick={()=>handleLogout()}/>
            <NavLink to={'/setting'}><IoMdSettings className="text-xl text-blue-500 cursor-pointer" /></NavLink>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">Contacts</h2>
        </div>
        {loading ? (
          <p className="text-center text-gray-500">Loading contacts...</p>
        ) : contacts.length > 0 ? (
          contacts.map((contact) => (
            <div
              key={contact._id}
              onClick={() => handleSelectedUser(contact)}
              className="flex items-center p-3 rounded-lg hover:bg-blue-100 cursor-pointer transition"
            >
              <img
                src={contact?.profile_pic}
                alt="Profile"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-gray-700">{contact.name}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No contacts available</p>
        )}
      </div>

      {/* Chat Area */}
      {(!isMobileView || selectedUser) && (
        <div className="w-full md:w-3/4 bg-white flex flex-col">
          {/* Header */}
          {selectedUser && (
            <div className="flex items-center p-4 border-b">
{window.innerWidth < 768 && (
  <a
    href={`${import.meta.env.VITE_Frontend_Url }/chat`}
    className="text-blue-500 text-3xl font-bold hover:text-blue-700 transition-all m-2"
  >
    {`<`}
  </a>
)}              <img
                src={selectedUser?.profile_pic}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold text-gray-700">
                  {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>
          )}

          {/* Message Area */}
          <div className="flex-1 bg-gray-100 overflow-y-auto p-4">
            
            { selectedUser ? (
              <div>
                {allMessages && allMessages.length > 0 &&
                  allMessages.map((msg, index) => {
                    const isSentByCurrentUser =
                      msg.senderId === curruser.userId;
                    const extension = msg?.data?.attachmentName
                      ?.split(".")
                      .pop()
                      .toLowerCase();

                    return (
                      <div
                        key={index}
                        className={`flex mb-4 ${
                          isSentByCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            isSentByCurrentUser
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-300 text-black rounded-bl-none"
                          }`}
                        >
                          {/* Image Attachment */}
                          {["jpg", "jpeg", "png", "gif"].includes(
                            extension
                          ) && (
                            <img
                              src={msg?.data?.attachment}
                              alt="Attachment"
                              className="max-w-full h-auto rounded-md mb-2"
                              height={300} width={300}
                            />
                          )}

                          {/* Audio Attachment */}
                          {["mp3", "wav", "ogg"].includes(extension) && (
                              <h3 className="bg-black text-white rounded-md p-2">{msg?.data?.attachmentName}</h3>
                            
                          )}

                          {/* Video Attachment */}
                          {["mp4", "webm"].includes(extension) && (
                            <video
                              controls
                              className="max-w-full h-auto rounded-md mb-2"
                              preload="metadata"
                              height={300} width={300}
                            >
                              <source
                                src={msg?.data?.attachment}
                                type={`video/${extension}`}
                              />
                              Your browser does not support the video tag.
                            </video>
                          )}

                          {/* PDF or TXT Attachment */}
                          {["txt", "pdf"].includes(extension) && (
                            <div className="max-w-full h-auto rounded-md mb-2 bg-black text-white border border-white border-solid">
                              {msg?.data?.attachmentName}
                              
                            </div>
                          )}

                          {/* File Download */}
                          {msg?.data?.attachment &&
                            [
                              "jpg",
                              "jpeg",
                              "png",
                              "gif",
                              "mp3",
                              "wav",
                              "ogg",
                              "mp4",
                              "webm",
                              'txt',
                              'pdf'
                            ].includes(extension) && (
                              <div className="flex justify-between items-center m-2">
                              <a
                                href={msg?.data?.attachment}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-black text-sm border-black bg-white p-2 rounded-lg "
                              >
                                View File
                              </a>
                              <div
                                onClick={() =>
                                  handleDownload(
                                    msg?.data?.attachment,
                                    msg?.data?.attachmentName
                                  )
                                }
                                className="cursor-pointer text-blue-200 underline"
                                >
                                <IoMdDownload className=" text-black text-3xl" />
                              </div>
                                </div>
                            )}

                          {/* Text Message */}
                          <p className="text-sm">{msg?.data?.text}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Select a contact to start chatting
              </p>
            )}
          </div>

          {/* Attachment Preview */}
          {data.attachment && (
            <div className="relative p-2 mb-4 bg-gray-200 rounded-md mx-4">
              {renderAttachmentPreview()}
              <button
                onClick={handleRemoveAttachment}
                className="absolute top-0 right-0 p-1 bg-black text-white rounded-full"
              >
                X
              </button>
              <p className="text-sm text-center mt-2 text-gray-700">
                {data.attachmentName}
              </p>
            </div>
          )}

          {/* Input Bar */}
          {selectedUser && (
            <div className="flex items-center p-4 border-t">
              <FaPlusCircle
                className="text-blue-500 text-xl cursor-pointer mr-3"
                onClick={() => fileref.current.click()}
              />
              <input
                type="file"
                name="attachment"
                ref={fileref}
                hidden
                onChange={handleChange}
              />
              <input
                type="text"
                name="text"
                value={data.text}
                onChange={handleChange}
                placeholder="Write a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <IoSend
                className="text-blue-500 text-xl cursor-pointer ml-3"
                onClick={handleSend}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
