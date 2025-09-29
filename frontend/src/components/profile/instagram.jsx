import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import {
  faComment,
  faEye,
  faQuestionCircle,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faCircleQuestion,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  connectInstagram,
  disconnectInstagram,
  fetchInstagramMedia,
  fetchInstagramProfile,
  readInstagramMedia,
  readInstagramProfile,
} from "../../slices/profileSlice";
import toast, { Toaster } from "react-hot-toast";
import noMeida from "../../assets/noMedia.jpg"

const Instagram = () => {
  const { profile, instagramProfile, instagramMedia } = useSelector(
    (state) => state.profile
  );

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchInstagramData = (refetch = false) => {
    if (refetch) {
      dispatch(fetchInstagramProfile())
        .unwrap()
        .then(() => dispatch(readInstagramProfile(profile?.user.username)))
        .catch((error) =>
          toast.error(`Failed to fetch Instagram profile data: ${error}`)
        );
      dispatch(fetchInstagramMedia())
        .unwrap()
        .then(() => dispatch(readInstagramMedia(profile?.user.username)))
        .catch((error) =>
          toast.error(`Failed to fetch Instagram media data: ${error}`)
        );
    } else {
      dispatch(readInstagramProfile(profile?.user.username));
      dispatch(readInstagramMedia(profile?.user.username));
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fbConnected = params.get("facebook") === "connected";
    if (profile?.instagram_connected || !fbConnected) {
      return;
    }

    params.delete("facebook");

    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );

    dispatch(connectInstagram())
      .unwrap()
      .then(() => {
        toast.success("Instagram connected successfully!");
        fetchInstagramData(true);
      })
      .catch((error) => {
        toast.error(`Failed to connect Instagram: ${error}`);
      });
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!profile?.instagram_connected) return;
    fetchInstagramData();
  }, []);

  const facebookCheck = async () => {
    try {
      const access = localStorage.getItem("access");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/auth/facebook/check/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.data?.connected === true) {
        toast.success("You are connected to facebook");
      } else {
        toast.error(
          "You are not connected to facebook. Please connect your account."
        );
      }
    } catch (error) {
      toast.error("Failed to verify facebook connection");
    }
  };

  return (
    <div className="w-full">
      <Toaster />
      {profile?.instagram_connected ? (
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
            <div className="overflow-x-auto whitespace-nowrap">
              {instagramMedia?.media?.map((m) => (
                <div key={m.media_id} className="m-5 inline-block relative">
                  {m.media_type === "IMAGE" ? (
                    <img
                      src={m.media_url || noMeida}
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

          <div className="center mt-3 pt-3 w-full">
            <button
              className="button-54"
              onClick={() => fetchInstagramData(true)}
            >
              Refetch
            </button>
            <button className="button-54" onClick={facebookCheck}>
              Check connection
            </button>
            <button
              className="button-54"
              onClick={() => {
                dispatch(disconnectInstagram());
              }}
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <div className="my-5 center-vertical">
          <div className="p-5 center-vertical">
            <h1 className="font-bold text-xl mb-2">
              Showcase your influence with real-time Instagram insights
            </h1>
            <p className="text-gray-600 text-justify">
              Connecting your Instagram unlocks powerful analytics that help you
              stand out to businesses. When your profile is linked, brands can
              instantly see your follower count, engagement rate, reach, and
              media performance directly on Cloutgrid. This transparency builds
              trust, boosts your credibility, and dramatically increases your
              chances of securing meaningful collaborations.
            </p>
          </div>

          <div className="center-vertical my-5">
            <button
              className="button-54"
              onClick={() => {
                const access = localStorage.getItem("access");
                window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/facebook/start?token=${access}`;
              }}
            >
              Connect Instagram
            </button>
            <p className="text-xs text-gray-400">via Facebook login</p>
          </div>

          <div className="p-5">
            <h1 className="font-bold text-l mb-2">
              What you’ll get once connected:
            </h1>
            <ul className="list-disc ml-5">
              <li>
                Verified display of your follower count, followings, and media
                count.
              </li>
              <li>
                Insights into your reach, profile views, and audience engagement
                shown on your Cloutgrid profile.
              </li>
              <li>
                Access to detailed media insights (likes, comments, impressions,
                video views) that brands care about.
              </li>
              <li>
                A stronger, more credible profile that businesses can evaluate
                at a glance.
              </li>
            </ul>
          </div>

          <div className="p-5">
            <h1 className="font-bold text-l mb-2">
              What you need before connecting:
            </h1>
            <ul className="list-disc ml-5">
              <li>
                Your Instagram must be a Creator or Business account (personal
                accounts cannot connect).
              </li>
              <li>
                Your Instagram account must be linked to a Facebook Page (Meta
                requires this link for insights).
              </li>
              <li>
                You’ll log in with your Facebook credentials to complete the
                connection.
              </li>
            </ul>
          </div>

          <div className="p-5">
            <h1 className="font-bold text-l mb-2">How to connect:</h1>
            <ul className="list-disc ml-5">
              <li>
                Make sure your Instagram is switched to a Creator or Business
                account (you can change this in Instagram Settings → Account).
              </li>
              <li>
                Ensure your Instagram is linked to a Facebook Page you manage.
              </li>
              <li>Click “Connect Instagram” above and log in with Facebook.</li>
              <li>
                Grant the requested permissions (needed to pull your analytics
                securely).
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instagram;
