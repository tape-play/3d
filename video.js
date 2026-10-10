        let url1;
        let statusInt = 0;
        let mode = 0;
        let fastForwardInterval = 0;

        openBtn.onclick = () => { fi.click() };
        fi.onchange = () => {
            if (fi.files.length == 0) { clearInterval(statusInt); statusP.innerHTML = 'No video'; return; };
            if (url1) { URL.revokeObjectURL(url1) };
            url1 = URL.createObjectURL(fi.files[0]);
            video.src = url1;
            statusInt = setInterval(() => {
                statusP.innerHTML = `${mode == 0 ? ' ' : mode == 1 ? '▶' : mode == 2 ? '⏸' : mode == 3 ? '⏪︎' : mode == 4 ? '⏩︎' : mode == 5 ? '⏪︎' : mode == 6 ? '⏩︎' : ' '} ${Math.floor(video.currentTime / 3600).toString().padStart(2, '0')}:${(Math.floor(video.currentTime / 60) - Math.floor(video.currentTime / 3600) * 60).toString().padStart(2, '0')}:${(Math.floor(video.currentTime) - (Math.floor(video.currentTime / 60) - Math.floor(video.currentTime / 3600) * 60) * 60).toString().padStart(2, '0')}`;
            });
video.onloadedmetadata = () => {
    const size = Math.max(
        video.videoWidth,
        video.videoHeight
    );

    videoCanvas.width = size;
    videoCanvas.height = size;

    walls[4].width = size;
    walls[4].height = size;

    // Initialize the canvas with black letterboxing.
    videoCtx.fillStyle = "black";
    videoCtx.fillRect(0, 0, size, size);

    if (typeof resizeVideoTexture === "function") {
        resizeVideoTexture();
    }
};
            //ac.resume();
        };
        playBtn.onclick = () => {
            clearInterval(fastForwardInterval)
            if (mode == 1) { return };
            video.play();
            mode = 1;
        }
        stopBtn.onclick = () => {
            clearInterval(fastForwardInterval);
            if (mode == 0) { return }
            video.pause();
            mode = 0;
        }
        pauseBtn.onclick = () => {
            if (mode == 1) {
                video.pause();
                mode = 2;
            } else if (mode == 2) {
                playBtn.click();
            }
        }
        rewBtn.onclick = () => {
            video.pause()
            if (mode != 3 && mode != 5) {
                if (mode == 1 || mode == 2 || mode == 4) { mode = 5 } else { mode = 3 }
                clearInterval(fastForwardInterval);
                fastForwardInterval = setInterval(() => { video.currentTime -= 0.2 }, 20);
            }
        }
        ffBtn.onclick = () => {
            video.pause()
            if (mode != 4 && mode != 6) {
                if (mode == 1 || mode == 2 || mode == 5) { mode = 6 } else { mode = 4 }
                clearInterval(fastForwardInterval);
                fastForwardInterval = setInterval(() => { video.currentTime += 0.2 }, 20);
            }
        }