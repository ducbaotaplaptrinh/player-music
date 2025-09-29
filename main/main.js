const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const dashBoard = $(".dashboard");
const name = $(".db-top__info--name");
const audio = $(".music");
const thumbCd = $(".img-cd");
const progress = $(".progress");
const play = $(".db-control__play");
const iconPlay = $(".fa-play");
const iconPause = $(".fa-pause");
const cd = $(".db__cd");
const nextRightBtn = $(".db-control__next--right");
const nextLeftBtn = $(".db-control__next--left");
const shuffleBtn = $(".db-control__shuffle");
const replayBtn = $(".db-control__replay");
const controlsBtn = $$(".db-control__icon");
const listPlayer = $(".list-player");
const app = {
    currentIndex: 0,
    isRandom: false,
    isPlaying: false,
    songs: [
        {
            name: "Mặt mộc ",
            singer: "Phạm Nguyên Ngọc x Ân Nhi",
            path: "./assets/audio/matmoc.mp3",
            img: "./assets/img/matmoc.jpg",
        },
        {
            name: "Vô tình",
            singer: "HOAPRO x XESI",
            path: "./assets/audio/votinh.mp3",
            img: "./assets/img/votinh.jpg",
        },
        {
            name: "kết thúc lâu rồi",
            singer: "Lê Bảo Bình ",
            path: "./assets/audio/ketthuclauroi.mp3",
            img: "./assets/img/ketthuclauroi.jpg",
        },
        {
            name: "Summer Time",
            singer: "Summer Time",
            path: "./assets/audio/summertime.mp3",
            img: "./assets/img/summertime.jpg",
        },
        {
            name: "Nắng ấm xa dần",
            singer: "Sơn Tùng MTP",
            path: "./assets/audio/nangamxadan.mp3",
            img: "./assets/img/nangamxadan.jpg",
        },
        {
            name: "Em là cô gái vùng cao ",
            singer: "Mai Chi",
            path: "./assets/audio/emlacogaivungcao.mp3",
            img: "./assets/img/emlacogaivungcao.png",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song) => {
            return ` 
                    <section class="list-card" >
                        <div>
                            <div class="img-item">
                                <img
                                    class ="card-img"
                                    src="${song.img}"
                                    alt="avt"
                                />
                            </div>
                            <div class="info-item">
                                <p class="card-title line-clamp-1">${song.name}</p>
                                <h4 class="card-singer line-clamp-1" title="Tác giả">${song.singer}</h4>
                            </div>
                        </div>
                        <div class="option">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                    </section>`;
        });
        $(".list-item").innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvent: function () {
        const cardTitle = $$(".card-title");
        const cardSinger = $$(".card-singer");
        const cardImg = $$(".card-img");
        const cardTitle_main = $(".card-title-main");
        const cardSinger_main = $(".card-singer-main");
        const cardImg_main = $(".card-img-main");
        const _this = this;
        const deleteActive = function () {
            controlsBtn.forEach((btn) => {
                {
                    btn.classList.remove("active");
                }
            });
        };

        const topPlayer = dashBoard.offsetHeight + 10;
        //xử lý khi phóng to thu nhỏ
        const cdWidth = cd.offsetWidth;
        window.onscroll = function () {
            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            const newTop = topPlayer - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            listPlayer.style.top = newTop > 196 ? newTop + "px" : 196 + "px";
            cd.style.opacity = newCdWidth / cdWidth;
            if (newTop <= 196) {
                listPlayer.style.height = window.innerHeight - 192 + "px";
            } else {
                listPlayer.style.overflowY = "auto";
            }
        };
        //xử lý cd quay
        const thumbCDaAnimate = thumbCd.animate(
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000, //10s
                iterations: Infinity,
            }
        );

        thumbCDaAnimate.pause();
        //xử lý nut play khi dang phat
        const playingBtn = function () {
            iconPause.classList.remove("hidden");
            iconPlay.classList.add("hidden");
            thumbCDaAnimate.play();
        };
        //xử lý nut play khi nhac ngừng
        const pauseBtn = function () {
            iconPause.classList.toggle("hidden");
            iconPlay.classList.toggle("hidden");
            thumbCDaAnimate.pause();
        };
        //xử lý khi click play
        play.addEventListener("click", function () {
            if (audio.paused) {
                audio.play();
                thumbCDaAnimate.play();
            } else {
                audio.pause();
                thumbCDaAnimate.pause();
            }
            iconPause.classList.toggle("hidden");
            iconPlay.classList.toggle("hidden");
        });

        //------Card
        const cards = $$(".list-card");
        cards[this.currentIndex].classList.add("active");
        //xứ ly active bài hat đang phát
        const activeCard = function () {
            cards.forEach((c) => {
                c.classList.remove("active");
            });
            cards[_this.currentIndex].classList.add("active");
        };
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                    (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }

            //Xử lý  khi tua
            progress.onchange = (e) => {
                const seekTime = (audio.duration / 100) * e.target.value;
                audio.currentTime = seekTime;
            };
        };

        //xử lý khi click vào card
        cards.forEach((card, index) => {
            card.addEventListener("click", (e) => {
                if (e.target.closest(".list-card.active")) {
                } else if (e.target.closest(".option")) {
                } else {
                    let random = false;
                    random = !random;
                    _this.currentIndex = index;
                    _this.loadCurrentSong();
                    cards.forEach((c) => {
                        c.classList.remove("active");
                    });
                    card.classList.toggle("active", random);
                    playingBtn();
                    audio.play();
                    cardView();
                }
            });
        });
        const cardView = function () {
            cards[_this.currentIndex].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        };
        //xử lý khi chuyển bài
        nextRightBtn.addEventListener("click", () => {
            if (this.isRandom) {
                this.shuffleSong();
            } else {
                this.nextSong();
            }

            activeCard();
            playingBtn();
            cardView();
            audio.play();
        });
        //xử lý khi quay lại bài cũ
        nextLeftBtn.addEventListener("click", () => {
            if (this.isRandom) {
                this.shuffleSong();
            } else {
                this.prevSong();
            }

            activeCard();
            playingBtn();
            cardView();
            audio.play();
        });
        //xử lý khi click tự chuyển bài
        shuffleBtn.addEventListener("click", () => {
            deleteActive();
            _this.isRandom = !_this.isRandom;
            shuffleBtn.classList.toggle("active", _this.isRandom);
        });
        //xử lý khi click tự phát lại
        replayBtn.addEventListener("click", function () {
            _this.isRandom = !_this.isRandom;
            _this.isPlaying = !_this.isPlaying;
            deleteActive();
            replayBtn.classList.toggle("active", _this.isRandom);
        });
        //xứ lý khi hết bài
        audio.onended = () => {
            if (this.isPlaying) {
                _this.rePlaySong();
            } else {
                nextRightBtn.click();
                pauseBtn();
            }
        };
        // xử lý lý khi bài hat phát
        audio.onplay = () => {
            playingBtn();
        };
    },

    loadCurrentSong: function () {
        name.textContent = this.currentSong.name;
        audio.src = this.currentSong.path;
        thumbCd.src = this.currentSong.img;
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    shuffleSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;

        this.loadCurrentSong();
    },
    rePlaySong: function () {
        let newIndex = this.currentIndex;
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        audio.play();
    },

    // scrollCard: function () {
    //     this.handleEvent.cards.scrollIntoView({
    //         behavior: "smooth",
    //         block: "center",
    //     });
    //     console.log(this.handleEvent.cards);
    // },
    //set chieu cao cua list player

    start: function () {
        //Định nghĩa thuôc tính ojb
        this.defineProperties();
        //Tải thông tin bài hát đầu tiên
        this.loadCurrentSong();
        this.render();
        // Lắng nghe xử lý các sựu kiện (DOM events )
        this.handleEvent();
    },
};
app.start();
