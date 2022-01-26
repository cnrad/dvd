import type { NextPage } from "next";
import Head from "next/head";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
    const imageRef = useRef(null);
    const [start, setStart] = useState(false);
    const [imgSrc, setImgSrc] = useState("/dvd.png");
    const frameWidth = useRef(100);
    const frameHeight = useRef(100);
    const speed = useRef(1);

    const resizeWindow = () => {
        frameWidth.current = window.innerWidth;
        frameHeight.current = window.innerHeight;
    };

    useEffect(() => {
        frameWidth.current = window.innerWidth;
        frameHeight.current = window.innerHeight;

        window.addEventListener("resize", resizeWindow);
        window.addEventListener("keypress", (e: any) => (e.key === "+" ? speed.current++ : ""));

        return () => window.removeEventListener("resize", resizeWindow);
    }, []);

    let currentX = 0;
    let currentY = 0;
    let directionX = "right";
    let directionY = "down";

    const setImage = (event: any) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.addEventListener(
            "load",
            function () {
                setImgSrc(reader.result as string);
            },
            false
        );

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const moveImage = () => {
        let image = imageRef.current as unknown as HTMLImageElement;

        currentX <= 0 ? (directionX = "right") : "";
        currentX >= frameWidth.current - image.clientWidth ? (directionX = "left") : "";
        image.style.left = currentX + "px";
        directionX === "right" ? (currentX += speed.current) : (currentX -= speed.current);

        currentY <= 0 ? (directionY = "down") : "";
        currentY >= frameHeight.current - image.clientHeight ? (directionY = "up") : "";
        image.style.top = currentY + "px";
        directionY === "down" ? (currentY += speed.current) : (currentY -= speed.current);

        setTimeout(moveImage, 5);
    };

    useEffect(() => {
        start ? moveImage() : "";
    }, [start]);

    return (
        <>
            <Head>
                <title>cnrad's next.js template</title>
            </Head>
            {!start && (
                <div className="w-[100vw] h-[100vh] flex flex-col items-center justify-center text-white text-3xl font-semibold">
                    haha funny dvd
                    <motion.label
                        className="px-6 py-2 bg-indigo-900 text-white text-lg font-normal flex items-center justify-center rounded-md mt-7 cursor-pointer"
                        whileHover={{ scale: 0.97 }}
                        whileTap={{ scale: 0.9 }}
                        htmlFor="upload"
                    >
                        <input type="file" className="hidden" id="upload" onChange={setImage} />
                        Upload Image
                    </motion.label>
                    <motion.div
                        className="px-6 py-2 bg-indigo-900 text-white text-lg font-normal flex items-center justify-center rounded-md mt-7 cursor-pointer"
                        whileHover={{ scale: 0.97 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setStart(true)}
                    >
                        Go!
                    </motion.div>
                </div>
            )}

            {start && (
                <motion.img ref={imageRef} src={imgSrc} width={320} height={191} className="absolute top-0 left-0" />
            )}
        </>
    );
};

export default Home;
