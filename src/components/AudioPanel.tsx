import React, { useState, useEffect, useRef } from "react";
import "../styles/AudioPanel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { GrPlayFill, GrPauseFill } from "react-icons/gr";
import formatTimestamp from "../utils/formatTimestamp";

interface AudioPanelProps {
    audioFile: string;
    fileIsUploaded: boolean;
}

const AudioPanel = ({ audioFile, fileIsUploaded }: AudioPanelProps) => {
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0); 
    const [audioIsPlaying, setAudioIsPlaying] = useState(false);
    const [playheadPosition, setPlayheadPosition] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const timelineRef = useRef<HTMLDivElement>(null);

    audio?.addEventListener("loadedmetadata", (event) => {
        setAudioDuration(audio?.duration);
    });

    useEffect(() => {
        if(audioFile && fileIsUploaded) {
            setCurrentTime(0);
            const audioObject = new Audio(audioFile);
            setAudio(audioObject);
            if (audio){
                audio.currentTime = 0;
            }
            audioObject.addEventListener("timeupdate", (event) => {
                setCurrentTime(audioObject.currentTime);
                setPlayheadPosition((audioObject.currentTime / audioObject.duration) * 100);
            })
        }
        else{
            pauseAudio();
            setAudio(null);
            setCurrentTime(0);
            setPlayheadPosition(0);
        }
    }, [audioFile, fileIsUploaded]);

    function handleDrag(event: MouseEvent) {
        //This function will update the playhead position and the current audio time
        const timelineRect = timelineRef.current?.getBoundingClientRect();
        const timelineLeft = timelineRect?.left ?? 0;
        const timelineRight = timelineRect?.right ?? 0;
        const position = Math.min(Math.max(event.clientX - timelineLeft, 0), timelineRight - timelineLeft);
        console.log("dragging", position);
        setPlayheadPosition((position / (timelineRight - timelineLeft)) * 100);
    }
    
    function handleDragStart(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        event.preventDefault();
        console.log("drag start");
        setIsDragging(true);

        document.body.style.cursor = "grabbing";
        document.addEventListener("mousemove", handleDrag);
        document.addEventListener("mouseup", handleDragEnd);
    }


    function handleDragEnd(event: MouseEvent) {
        console.log("drag end");
        setIsDragging(false);
        document.removeEventListener("mousemove", handleDrag);
        document.removeEventListener("mouseup", handleDragEnd);
        document.body.style.cursor = "default";
    }

    function playAudio() {
        //This function will play the audio file
        if(audio){
            audio.play();
            setAudioIsPlaying(true);
        }
    }

    function pauseAudio() {
        //This function will pause the audio file
        if(audio){
            audio.pause();
            setAudioIsPlaying(false);
        }
    }



    return (
        <div id="audio-panel">

            {/* <button className="icon">
                <FontAwesomeIcon icon={faMicrophone} size="2x" />
            </button> */}
            {audioIsPlaying && fileIsUploaded? (
                <button id="pause-btn" onClick={pauseAudio}>
                    <GrPauseFill />
                </button>
            ) : (
                <button id="play-btn" className={!fileIsUploaded ? "icon disabled-button" : "icon"} onClick={playAudio}>
                    <GrPlayFill />
                </button>
            )}
        <div id="timeline">
            <div id="progress" ref={timelineRef}></div>
            <div id="playhead-padding" style={{ left: `${playheadPosition}%` }} onMouseDown={handleDragStart}>
                <div id="playhead"></div>
            </div>
        </div>
        {fileIsUploaded? <div id="timestamp">{formatTimestamp(currentTime)} / {formatTimestamp(audioDuration)}</div> : <div id="timestamp">- - / - -</div>}
        </div>
    );
};

export default AudioPanel;
