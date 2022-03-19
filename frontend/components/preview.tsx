import {createRef, useEffect, useMemo, useState} from "react";
import Image from "next/image";
import styled from "styled-components";

type Props = {
    url: string;
}

export default function Preview({url}: Props) {
    const videoRef = createRef<HTMLVideoElement>();
    const extension = useMemo(() => getFileExtension(url), [url])
    const mediaType = useMemo(() => getFileType(extension), [url])

    useEffect(() => {
        if (mediaType === 'video') {
            videoRef.current?.load();
        }
    }, [url])

    return (
        <Container>
            {mediaType === 'video' && (
                <Video ref={videoRef} controls autoPlay={true} loop={true} crossOrigin="cross-origin">
                    <source src={url} type={`video/${extension}`}/>
                </Video>
            )}
            {mediaType === 'image' && (
                <Image layout="fill" objectFit="contain" src={url} alt="Renderer scene"/>
            )}
            {mediaType === null && (
                <span>Unsupported media</span>
            )}
        </Container>
    )
}

type FileType = "image" | "video";

function getFileExtension(url: string) {
    try {
        const {pathname} = new URL(url);
        return pathname.split('.').at(-1)
    } catch (e) {
        return undefined;
    }
}

function getFileType(extension: string | undefined): FileType | null {
    if (!extension) {
        return null;
    }
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return "image";
    }
    if (['mp4', 'mov'].includes(extension)) {
        return "video"
    }
    return null;
}

const Container = styled.div`
    position: relative;
    height: 100%;
`;

const Video = styled.video`
    width: 100%;
    height: 100%;
`;