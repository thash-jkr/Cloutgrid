import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faComment,
  faEye,
  faThumbsUp,
} from "@fortawesome/free-regular-svg-icons";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const OtherYoutube = ({ otherProfile }) => {
  const [youtubeChannel, setYoutubeChannel] = useState({});
  const [youtubeMedia, setYoutubeMedia] = useState([]);

  useEffect(() => {
    if (!otherProfile || !otherProfile.youtube_connected) return;

    const access = localStorage.getItem("access");

    const readYoutubeChannel = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/youtube/channel/read/${otherProfile?.user.username}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        setYoutubeChannel(response.data.channel_data);
      } catch (error) {
        toast.error("Failed to read this user's channel details");
      }
    };

    const readYoutubeMedia = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/youtube/media/read/${otherProfile?.user.username}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        setYoutubeMedia(response.data.media_data || []);
      } catch (error) {
        toast.error("Failed to read this user's media details");
      }
    };

    readYoutubeChannel();
    readYoutubeMedia();
  }, []);

  return (
    <div className="w-full">
      <Toaster />
      {otherProfile?.youtube_connected ? (
        <div className="my-5 center-vertical w-full divide-y">
          <div className="flex w-full">
            <div className="basis-1/2 center-vertical my-10 mx-5">
              <div className="w-full relative mb-12">
                <img
                  src={
                    youtubeChannel?.banner_url ||
                    "https://placehold.co/600x400?text=Channel+banner"
                  }
                  className="w-full rounded-2xl"
                />

                <div className="absolute bottom-2 left-2">
                  <img
                    src={
                      youtubeChannel?.profile_picture_url ||
                      "https://placehold.co/400?text=profile"
                    }
                    className="rounded-full w-16"
                  />
                </div>
              </div>
              <button
                className="button-54"
                onClick={() => {
                  const channelId = youtubeChannel?.channel_id;
                  if (channelId)
                    window.open(
                      `https://youtube.com/channel/${channelId}`,
                      "_blank"
                    );
                }}
              >
                <FontAwesomeIcon icon={faYoutube} /> {youtubeChannel?.title}
              </button>
            </div>

            <div className="basis-1/2 w-full">
              <div className="center-vertical w-full mb-3">
                <h1 className="font-bold text-xl">Channel details</h1>
                <div className="center-left w-full divide-y">
                  <h1 className="font-medium text-l w-full p-1">
                    Subscribers:{" "}
                    <span className="font-bold">
                      {youtubeChannel?.subscriber_count}
                    </span>
                  </h1>
                  <h1 className="font-medium text-l w-full p-1">
                    Total media:{" "}
                    <span className="font-bold">
                      {youtubeChannel?.video_count}
                    </span>
                  </h1>
                  <h1 className="font-medium text-l w-full p-1">
                    Total views:{" "}
                    <span className="font-bold">
                      {youtubeChannel?.view_count}
                    </span>
                  </h1>
                </div>
              </div>

              {/* <div className="center-vertical w-full">
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
              </div> */}
            </div>
          </div>

          <div className="w-full">
            <h1 className="font-bold text-2xl my-3 text-center">
              Recent posts
            </h1>
            <div className="overflow-x-auto whitespace-nowrap">
              {youtubeMedia.map((m) => (
                <div key={m.media_id} className="m-5 inline-block relative">
                  <img
                    src={
                      m.thumbnail_url ||
                      "https://placehold.co/600x400?text=youtube+media"
                    }
                    alt="Youtube media"
                    className="rounded-xl w-[300px] h-[400px] object-cover"
                  />

                  <div className="absolute bottom-1 left-1 bg-white px-2 py-1 rounded-lg center">
                    <span className="mr-2 center">
                      <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
                      <p className="text-xs">{m.likes}</p>
                    </span>
                    <span className="mr-2 center">
                      <FontAwesomeIcon icon={faComment} className="mr-1" />
                      <p className="text-xs">{m.comments}</p>
                    </span>
                    <span className="mr-2 center">
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      <p className="text-xs">{m.views}</p>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="center-vertical mt-10 text-xl font-bold">
          <FontAwesomeIcon icon={faTriangleExclamation} size={"3x"} />
          <h1>{otherProfile?.user.name} hasn't connected their Youtube yet!</h1>
        </div>
      )}
    </div>
  );
};

export default OtherYoutube;
