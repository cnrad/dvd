import type { NextPage } from "next";
import Head from "next/head";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Home: NextPage = () => {
    const imageRef = useRef(null);
    const [start, setStart] = useState(false);
    const [imgSrc, setImgSrc] = useState("/dvd.png");
    const [colorChanging, setColorChanging] = useState(true);

    const frameWidth = useRef(100);
    const frameHeight = useRef(100);
    const speed = useRef(1.5);

    const resizeWindow = () => {
        frameWidth.current = window.innerWidth;
        frameHeight.current = window.innerHeight;
    };

    useEffect(() => {
        frameWidth.current = window.innerWidth;
        frameHeight.current = window.innerHeight;

        window.addEventListener("resize", resizeWindow);
        window.addEventListener("keypress", (e: any) => (e.key === "=" || e.key === "+" ? (speed.current += 0.5) : ""));
        window.addEventListener("keypress", (e: any) => {
            if ((e.key === "_" || e.key === "-") && speed.current >= 0.5) speed.current -= 0.5;
        });

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

    let colorArr = ["red", "blue", "green", "yellow", "pink", "purple"];

    const changeColor = () => {
        if (colorChanging === false) return;
        if (imgSrc === "/dvd.png") {
            let choice = Math.floor(Math.random() * 6);
            (
                imageRef.current as unknown as HTMLImageElement
            ).style.filter = `opacity(0.1) drop-shadow(0 0 0.25px ${colorArr[choice]}) drop-shadow(0 0 0.25px ${colorArr[choice]}) drop-shadow(0 0 0.25px ${colorArr[choice]})`;
        } else {
            let deg = Math.floor(Math.random() * 360);
            (imageRef.current as unknown as HTMLImageElement).style.filter = `hue-rotate(${deg}deg)`;
        }
    };

    const moveImage = () => {
        let image = imageRef.current as unknown as HTMLImageElement;

        if (currentX <= 0) {
            directionX = "right";
            changeColor();
        }
        if (currentX >= frameWidth.current - image.clientWidth) {
            directionX = "left";
            changeColor();
        }
        image.style.left = currentX + "px";
        directionX === "right" ? (currentX += speed.current) : (currentX -= speed.current);

        if (currentY <= 0) {
            directionY = "down";
            changeColor();
        }
        if (currentY >= frameHeight.current - image.clientHeight) {
            directionY = "up";
            changeColor();
        }
        image.style.top = currentY + "px";
        directionY === "down" ? (currentY += speed.current) : (currentY -= speed.current);

        requestAnimationFrame(moveImage);
    };

    useEffect(() => {
        start ? moveImage() : "";
    }, [start]);

    return (
        <>
            <Head>
                <title>DVD Screensaver</title>
                <meta name="description" content="i wonder if it'll hit the corner" />
                <meta name="theme-color" content="#080a11" />
                <meta property="og:image" content="/dvd.png" />
            </Head>
            <AnimatePresence>
                {!start && (
                    <motion.div
                        key="main"
                        className="w-[100vw] h-[100vh] flex flex-col items-center justify-center text-white"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <h1 className="mb-1 font-semibold text-4xl">DVD Screensaver</h1>
                        <h2 className="mb-4 text-gray-600 font-normal text-xl">Because I was bored.</h2>
                        <motion.label
                            className="w-[12rem] bg-transparent rounded-full mt-7 cursor-pointer border-solid border-2 border-gray-700"
                            htmlFor="upload"
                        >
                            <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                className="hidden"
                                id="upload"
                                onChange={setImage}
                            />
                            <motion.div
                                className="py-3 rounded-full text-white text-lg font-normal flex items-center justify-center bg-gray-700 select-none"
                                style={{ transform: "translateX(-5px) translateY(-5px)" }}
                                whileTap={{ transform: "translateX(0px) translateY(0px)" }}
                            >
                                Upload Image
                            </motion.div>
                        </motion.label>
                        <motion.div
                            className="w-[12rem] bg-transparent rounded-full mt-7 cursor-pointer border-solid border-2"
                            style={{
                                borderColor: colorChanging ? "#369e60" : "#374151",
                                filter: colorChanging ? "drop-shadow(0 0 2px rgba(77, 209, 130, 0.5))" : "none",
                            }}
                            onClick={() => {
                                setColorChanging(!colorChanging);
                            }}
                        >
                            <motion.div
                                className="py-3 rounded-full text-white text-lg font-normal flex items-center justify-center select-none"
                                style={{
                                    transform: "translateX(-5px) translateY(-5px)",
                                    backgroundColor: colorChanging ? "#369e60" : "#374151",
                                }}
                                whileTap={{ transform: "translateX(0px) translateY(0px)" }}
                            >
                                Color Changing?
                            </motion.div>
                        </motion.div>
                        <motion.div className="w-[12rem] bg-transparent rounded-full mt-16 cursor-pointer border-solid border-2 border-green-800">
                            <motion.div
                                className="py-3 rounded-full text-white text-lg font-normal flex items-center justify-center bg-green-800 select-none"
                                style={{ transform: "translateX(-5px) translateY(-5px)" }}
                                whileTap={{ transform: "translateX(0px) translateY(0px)" }}
                                onClick={() => setStart(true)}
                            >
                                Go!
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.img ref={imageRef} src={imgSrc} className="absolute top-0 left-0 w-auto h-[20vh]" />
        </>
    );
};

export default Home;
