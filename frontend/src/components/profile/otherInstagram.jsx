import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faCircleQuestion,
  faComment,
  faEye,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faHeart,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import noMedia from "../../assets/noMedia.jpg";

const OtherInstagram = ({ otherProfile }) => {
  const [instagramProfile, setInstagramProfile] = useState([]);
  const [instagramMedia, setInstagramMedia] = useState([]);

  useEffect(() => {
    if (!otherProfile || !otherProfile.instagram_connected) return;

    const access = localStorage.getItem("access");

    const fetchInstagramProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/instagram/profile/read/${otherProfile.user.username}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        setInstagramProfile(response.data);
      } catch (error) {
        toast.error("Error fetching Instagram profile");
      }
    };

    const fetchInstagramMedia = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/instagram/media/read/${otherProfile.user.username}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );

        setInstagramMedia(response.data);
      } catch (error) {
        toast.error("Error fetching Instagram media");
      }
    };

    fetchInstagramProfile();
    fetchInstagramMedia();
  }, []);

  return (
    <div className="w-full">
      <Toaster />
      {otherProfile?.instagram_connected ? (
        <div className="my-5 center-vertical w-full divide-y">
          <div className="flex w-full">
            <div className="basis-1/2 center-vertical my-10">
              <div className="w-40 mb-10">
                <img
                  src={instagramProfile?.profile_data?.profile_picture_url}
                  className="rounded-full"
                />
              </div>
              <button
                className="button-54"
                onClick={() => {
                  const username = instagramProfile?.profile_data?.username;
                  if (username)
                    window.open(`https://instagram.com/${username}`, "_blank");
                }}
              >
                <FontAwesomeIcon icon={faInstagram} />
                {" @"}
                {instagramProfile?.profile_data?.username}
              </button>
            </div>

            <div className="basis-1/2 w-full">
              <div className="center-vertical w-full mb-3">
                <h1 className="font-bold text-xl">Profile details</h1>
                <div className="center-left w-full divide-y">
                  <h1 className="font-medium text-l w-full p-1">
                    Followers:{" "}
                    <span className="font-bold">
                      {instagramProfile?.profile_data?.followers}
                    </span>
                  </h1>
                  <h1 className="font-medium text-l w-full p-1">
                    Following:{" "}
                    <span className="font-bold">
                      {instagramProfile?.profile_data?.followings}
                    </span>
                  </h1>
                  <h1 className="font-medium text-l w-full p-1">
                    Total media:{" "}
                    <span className="font-bold">
                      {instagramProfile?.profile_data?.media_count}
                    </span>
                  </h1>
                </div>
              </div>

              <div className="center-vertical w-full">
                <h1 className="font-bold text-xl center">
                  Profile insights
                  <span className="ml-1 text-xs text-gray-400">(weekly)</span>
                </h1>
                <div className="center-left w-full divide-y">
                  {instagramProfile?.profile_data?.insights_raw.map((ins) => (
                    <h1
                      key={ins.id}
                      className="font-medium text-l w-full p-1 relative"
                    >
                      {ins.title}:{" "}
                      <span className="font-bold">{ins.total_value.value}</span>
                      <FontAwesomeIcon
                        icon={faCircleQuestion}
                        className="absolute right-1 cursor-pointer hover:text-[#655AC2]"
                        onClick={() => {
                          toast((t) => (
                            <div className="center-vertical">
                              <h1 className="font-bold text-l">{ins.title}</h1>
                              <p className="p-2 text-justify">
                                {ins.description}
                              </p>
                            </div>
                          ));
                        }}
                      />
                    </h1>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h1 className="font-bold text-2xl my-3 text-center">
              Recent posts
            </h1>
            <div className=" overflow-x-auto whitespace-nowrap">
              {instagramMedia?.media?.map((m) => (
                <div key={m.media_id} className="m-5 inline-block relative">
                  {m.media_type === "IMAGE" ? (
                    <img
                      src={m.media_url || noMedia}
                      alt="Instagram media"
                      className="rounded-xl w-[300px] h-[400px] object-cover"
                    />
                  ) : (
                    <video
                      className="rounded-xl w-[300px] h-[400px] object-cover"
                      autoPlay
                      loop
                      muted
                    >
                      <source src={m.media_url} />
                    </video>
                  )}
                  <div className="absolute bottom-1 left-1 bg-white px-2 py-1 rounded-lg center">
                    <span className="mr-2 center">
                      <FontAwesomeIcon
                        icon={faHeart}
                        className="text-red-500 mr-1"
                      />
                      <p className="text-xs">{m.like_count}</p>
                    </span>

                    <span className="mr-2 center">
                      <FontAwesomeIcon icon={faComment} className="mr-1" />
                      <p className="text-xs">{m.comments_count}</p>
                    </span>

                    {m.media_type === "IMAGE" ? (
                      <span className="center">
                        <FontAwesomeIcon
                          icon={faChartColumn}
                          className="mr-1"
                        />
                        <p className="text-xs">
                          {m.insights_raw.length > 0
                            ? m.insights_raw[0]?.values[0]?.value
                            : "-"}
                        </p>
                      </span>
                    ) : (
                      <span className="center">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        <p className="text-xs">
                          {m.insights_raw.length > 0
                            ? m.insights_raw[1]?.values[0]?.value
                            : "-"}
                        </p>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="center-vertical mt-10 text-xl font-bold">
          <FontAwesomeIcon icon={faTriangleExclamation} size={"3x"} />
          <h1>
            {otherProfile?.user.name} hasn't connected their Instagram yet!
          </h1>
        </div>
      )}
    </div>
  );
};

export default OtherInstagram;
