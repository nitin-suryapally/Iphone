"use client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "@/app/constants";
import { pauseImg, playImg, replayImg } from "@/app/utils";
import Image from "next/image";

const VideoCarousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const videoArr = [
    "./highlight-first.mp4",
    "./hightlight-sec.mp4",
    "./hightlight-third.mp4",
    "./hightlight-fourth.mp4",
  ];

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<any[]>([]);
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prev) => ({
          ...prev,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
    // console.log("1");
  }, [videoId, isEnd]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          // console.log(progress)
          if (progress !== currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                    ? "10vw"
                    : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });

            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        const currentVideo = videoRef.current[videoId]?.currentTime;
        const videoDuration = hightlightsSlides[videoId]?.videoDuration;

        if (currentVideo && videoDuration) {
          anim.progress(currentVideo / videoDuration);
          //   console.log(currentVideo, videoDuration);
        }
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }

    console.log("from progress");
  }, [videoId, startPlay]);

  useEffect(() => {
    if (!isPlaying) {
      videoRef.current[videoId]?.pause();
    } else {
      startPlay && videoRef.current[videoId]?.play();
    }

    // console.log("3");
  }, [startPlay, videoId, isPlaying]);

  const handleProcess = (type: string, i: number) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({ ...pre, isEnd: true, videoId: i + 1 }));
        break;

      case "video-last":
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;

      case "video-reset":
        setVideo((pre) => ({ ...pre, videoId: 0, isLastVideo: false }));
        break;

      case "pause":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      case "play":
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;

      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i: number, e: any) => {
    console.log(`Metadata loaded for video ${i}`, e);
    setLoadedData((pre) => [...pre, e]);
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black ">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  className={`${list.id === 2 && "translate-x-44"
                    } pointer-events-none`}
                  muted
                  onEnded={() =>
                    i !== 3
                      ? handleProcess("video-end", videoId)
                      : handleProcess("video-last", videoId)
                  }
                  ref={(el) => {
                    // console.log(`Video element ${i}:`, el);
                    videoRef.current[i] = el;
                  }}
                  onPlay={() =>
                    setVideo((pre) => ({ ...pre, isPlaying: true }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  onLoadedData={() => console.log(`Video ${i} loaded data`)}
                  onError={(e) => console.log(`Error loading video ${i}`, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-center mt-10 relative">
        <div className="flex-center px-7 py-5 bg-gray-300 rounded-full backdrop-blur">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => {
                videoDivRef.current[i] = el;
              }}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => {
                  videoSpanRef.current[i] = el;
                }}
              ></span>
            </span>
          ))}
        </div>

        <button className="control-btn">
          <Image
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={() => {
              if (isLastVideo) {
                handleProcess("video-reset", videoId);
              } else if (!isPlaying) {
                handleProcess("play", videoId);
              } else {
                handleProcess("pause", videoId);
              }
            }}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
