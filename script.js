document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ 강구마켓 2단계 스테이지 스크립트 연결 완료!");

  // ================= [0. 상단 메인 빅 슬라이더 로직] =================
  const track = document.getElementById("sliderTrack");
  const prevBtn = document.getElementById("sliderPrev");
  const nextBtn = document.getElementById("sliderNext");
  const dots = document.querySelectorAll(".indicator-dot");
  const slides = document.querySelectorAll(".slide-slide");

  let currentIndex = 0;
  const totalSlides = slides.length;
  let autoSlideTimer = null;

  function updateSlider(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    if (track) {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      updateSlider(currentIndex + 1);
    }, 3500);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      updateSlider(currentIndex - 1);
      startAutoSlide();
    });

    nextBtn.addEventListener("click", () => {
      updateSlider(currentIndex + 1);
      startAutoSlide();
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const targetIndex = parseInt(e.target.dataset.index, 10);
      updateSlider(targetIndex);
      startAutoSlide();
    });
  });

  const sliderContainer = document.querySelector(".slider-container");
  if (sliderContainer) {
    sliderContainer.addEventListener("mouseenter", stopAutoSlide);
    sliderContainer.addEventListener("mouseleave", startAutoSlide);
  }

  startAutoSlide();


  // ================= [1. 본문 카드 스크롤 등장 효과] =================
  const popElements = document.querySelectorAll(".pop-card");

  function handleScrollAnimation() {
    const triggerBottom = window.innerHeight * 0.92;

    popElements.forEach(function (el) {
      const elTop = el.getBoundingClientRect().top;
      if (elTop < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }

  window.addEventListener("scroll", handleScrollAnimation);
  handleScrollAnimation();


  // ================= [2. 스크롤 시 광고 & 리뷰 팝업창 무작위 증식 (버튼 중앙 회피 & 클릭 전까지 계속 발생)] =================
  const popupContainer = document.getElementById("popupContainer");
  const popupPool = [
    { src: "img/ad_yogurt.png", title: "🚨 [단독] 그릭요거트 찹쌀떡 신메뉴!", width: 390, height: 310 },
    { src: "img/review.png", title: "💬 [Review] 홍*빈 님의 추천 후기", width: 340, height: 220 },
    { src: "img/ad_yoajung.png", title: "🍧 [SNS 폭발] 요거트 아이스크림의 정석! 요아정", width: 390, height: 300 },
    { src: "img/ad_pikmin.png", title: "🌱 [한정판] 피크민 아크릴 키링 전 9종!", width: 370, height: 410 },
    { src: "img/review2.png", title: "⭐ [Review] 별점 5.0 만점 폭발!", width: 340, height: 230 },
    { src: "img/ad_yeopduk.png", title: "🔥 [대유행] 화끈한 매운맛! 동대문 엽기떡볶이", width: 390, height: 300 },
    { src: "img/ad_figure.png", title: "✨ [신상] 화면 위 귀여움 피규어!", width: 370, height: 420 },
    { src: "img/ad_earphone.png", title: "🎧 [Y2K 감성] 다시 유행하는 빈티지 줄 이어폰!", width: 370, height: 410 },
    { src: "img/review3.png", title: "💬 [Review] 실물 파괴력 대박 인정", width: 330, height: 220 },
    { src: "img/ad_keycap.png", title: "🐾 [대란] 톡톡 동물 키캡 키링!", width: 350, height: 500 },
    { src: "img/review4.png", title: "🔥 [Review] 품절 직전 겟 성공!", width: 340, height: 230 },
    { src: "img/ad_band.png", title: "⚡ [특가] MOVEN LAB 코어핏 홈트 저항 밴드!", width: 400, height: 310 },
    { src: "img/review5.png", title: "🎁 [Review] 지인들한테 강제 영업 중", width: 330, height: 220 }
  ];

  let isPurchaseClicked = false; // 구매 버튼을 누른 '직후'에만 팝업 생성 완전 차단
  let lastSpawnScrollY = 0;
  let lastSpawnTime = 0;
  let spawnIndex = 0;
  const maxPopups = 34;
  let currentSpawnCount = 0;

  const scrollThreshold = 170;
  const cooldownMs = 450;

  function checkScrollForPopups() {
    // 버튼 누르기 전까지는 스크롤 끝(버튼 주변)에 도달해도 팝업이 계속 생성됨
    if (isPurchaseClicked) return;

    const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
    const now = Date.now();

    if (Math.abs(currentScrollY - lastSpawnScrollY) > scrollThreshold && (now - lastSpawnTime > cooldownMs) && currentSpawnCount < maxPopups) {
      lastSpawnScrollY = currentScrollY;
      lastSpawnTime = now;

      const burstCount = Math.floor(Math.random() * 2) + 2; // 한 번에 2~3개씩
      for (let i = 0; i < burstCount; i++) {
        if (currentSpawnCount >= maxPopups) break;
        setTimeout(() => {
          if (!isPurchaseClicked) {
            spawnRandomPopup(currentScrollY);
          }
        }, i * 130);
      }
    }
  }

  function spawnRandomPopup(scrollY) {
    if (!popupContainer || isPurchaseClicked) return;

    const data = popupPool[spawnIndex % popupPool.length];
    const isMobile = window.innerWidth <= 768;
    const containerWidth = popupContainer.clientWidth || window.innerWidth;

    // 1) 팝업 크기 결정 (모바일에서는 화면 64~74% 비율로 아담하게 조정하여 좌우 치우침 가능하게 함)
    let popupWidth = data.width || 350;
    let popupHeight = data.height || 300;

    if (isMobile) {
      const mobileWidthRatio = 0.64 + Math.random() * 0.10; // 64% ~ 74%
      popupWidth = Math.floor(Math.min(275, containerWidth * mobileWidthRatio));
      popupHeight = Math.floor(popupWidth * ((data.height || 300) / (data.width || 350)));
    }

    // 2) 팝업 세로 위치 결정 (교수님 피드백: 위쪽, 중간, 아래쪽 골고루 분산 배치)
    const minTopRatio = isMobile ? 0.04 : 0.07;
    const maxTopRatioRange = isMobile ? 0.82 : 0.74;
    const randomTopOffset = window.innerHeight * (minTopRatio + Math.random() * maxTopRatioRange);
    let topPos = scrollY + randomTopOffset;

    // Stage 1 영역 벗어나지 않도록 하단 클램핑
    const stage1 = document.getElementById("stage1");
    const stage1Height = stage1 ? stage1.offsetHeight : 2200;
    if (topPos + popupHeight > stage1Height - 20) {
      topPos = Math.max(0, stage1Height - popupHeight - 20);
    }

    // 3) 구매 버튼 위치 계산 (popupContainer 기준 좌표)
    const buyBtn = document.getElementById("finalBuyBtn") || document.querySelector(".stage1-bottom-cta");
    let btnBox = null;
    if (buyBtn && popupContainer) {
      const bRect = buyBtn.getBoundingClientRect();
      const cRect = popupContainer.getBoundingClientRect();
      btnBox = {
        top: bRect.top - cRect.top,
        bottom: bRect.bottom - cRect.top,
        left: bRect.left - cRect.left,
        right: bRect.right - cRect.left,
        width: bRect.width,
        height: bRect.height
      };
    }

    // 세로 방향으로 버튼과 겹치는지 체크
    const vMargin = 20;
    const isVerticalOverlapWithBtn = btnBox && !(topPos + popupHeight < btnBox.top - vMargin || topPos > btnBox.bottom + vMargin);

    // 4) 팝업 가로 위치(left) 결정 (교수님 피드백: 왼쪽, 오른쪽, 중앙 편향 무작위 배치)
    let leftPx = 20;

    if (isMobile) {
      // 모바일: 배경 가로 마스킹(overflow:hidden)과 함께 좌/우/중앙으로 다채롭게 배치!
      const skewType = Math.random();

      if (skewType < 0.38) {
        // [A. 왼쪽 치우침]: 왼쪽 화면 끝에 바짝 붙거나 살짝(-18px ~ +12px) 걸침
        leftPx = Math.floor(Math.random() * 30) - 18;
      } else if (skewType < 0.76) {
        // [B. 오른쪽 치우침]: 오른쪽 화면 끝에 바짝 붙거나 살짝 걸침
        const rightBase = containerWidth - popupWidth;
        leftPx = Math.floor(rightBase + (Math.random() * 30 - 12));
      } else {
        // [C. 중앙 약간 편향]: 중앙 부근에서 좌우로 유동적 분산
        const centerBase = (containerWidth - popupWidth) / 2;
        leftPx = Math.floor(centerBase + (Math.random() * 40 - 20));
      }

      // 구매 버튼과 겹칠 경우 버튼 가림 방지
      if (isVerticalOverlapWithBtn && btnBox) {
        topPos = Math.max(0, btnBox.top - popupHeight - 20);
      }
    } else {
      // 데스크톱: 버튼 회피 및 좌우 무작위 분산
      const hMargin = 30; // 버튼 좌우 안전 거리 (px)

      if (isVerticalOverlapWithBtn && btnBox) {
        const leftZoneMax = btnBox.left - popupWidth - hMargin;
        const canPlaceLeft = leftZoneMax >= 15;

        const rightZoneMin = btnBox.right + hMargin;
        const rightZoneMax = containerWidth - popupWidth - 15;
        const canPlaceRight = rightZoneMax >= rightZoneMin;

        if (canPlaceLeft && canPlaceRight) {
          if (Math.random() < 0.5) {
            leftPx = Math.floor(Math.random() * Math.max(1, leftZoneMax - 15)) + 15;
          } else {
            leftPx = Math.floor(Math.random() * Math.max(1, rightZoneMax - rightZoneMin)) + rightZoneMin;
          }
        } else if (canPlaceLeft) {
          leftPx = Math.floor(Math.random() * Math.max(1, leftZoneMax - 15)) + 15;
        } else if (canPlaceRight) {
          leftPx = Math.floor(Math.random() * Math.max(1, rightZoneMax - rightZoneMin)) + rightZoneMin;
        } else {
          topPos = Math.max(0, btnBox.top - popupHeight - 25);
          leftPx = Math.floor(Math.random() * Math.max(1, containerWidth - popupWidth - 30)) + 15;
        }
      } else {
        const maxLeft = Math.max(15, containerWidth - popupWidth - 25);
        leftPx = Math.floor(Math.random() * (maxLeft - 15)) + 15;
      }
    }

    spawnIndex++;
    currentSpawnCount++;

    const win = document.createElement("div");
    win.className = "popup-window";
    win.style.width = popupWidth + "px";
    win.style.left = leftPx + "px";
    win.style.top = topPos + "px";

    const randomRotate = (Math.random() * 8 - 4).toFixed(1);
    win.style.transform = `rotate(${randomRotate}deg)`;

    // 교수님 피드백: x버튼 대신 어디든 클릭/터치하면 닫히도록 구성
    win.innerHTML = `
      <div class="popup-titlebar">
        <span class="popup-title-text">${data.title}</span>
        <span class="popup-close-hint">탭하여 닫기</span>
      </div>
      <div class="popup-body">
        <img src="${data.src}" alt="${data.title}" class="popup-img">
      </div>
    `;

    // 팝업 어디든 클릭/터치하면 즉시 부드럽게 축소 및 제거
    win.addEventListener("click", function () {
      win.style.transition = "transform 0.15s ease, opacity 0.15s ease";
      win.style.transform = "scale(0.85)";
      win.style.opacity = "0";
      setTimeout(() => {
        win.remove();
        currentSpawnCount = Math.max(0, currentSpawnCount - 1);
      }, 150);
    });

    popupContainer.appendChild(win);
  }

  window.addEventListener("scroll", checkScrollForPopups);


  // ================= [3. 핵심 반전: 버튼 누르면 두 번째 배경으로 전체 전환] =================
  const buyBtn = document.getElementById("finalBuyBtn");
  const stage2 = document.getElementById("stage2");
  const backToTopBtn = document.getElementById("backToTopBtn");

  if (buyBtn && stage2) {
    buyBtn.addEventListener("click", function () {
      // 1) [중요] 버튼을 누른 바로 그 순간 팝업창 추가 생성 완전 차단
      isPurchaseClicked = true;

      // 2) 두 번째 어두운 배경(STAGE 2) 전체 화면 활성화
      stage2.classList.add("active");

      // 3) 첫 번째 배경을 지나 두 번째 배경의 진실 영역으로 스무스 스크롤 이동
      setTimeout(function () {
        stage2.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    });
  }


  // ================= [4. STAGE 2 : 진실 폭로 5단계 심층 인터랙션] =================

  // [1단계: 사용자 의심 유발 버튼 인터랙션]
  const btnChoiceSelf = document.getElementById("btnChoiceSelf");
  const btnChoiceAlgo = document.getElementById("btnChoiceAlgo");
  const choiceFeedback = document.getElementById("choiceFeedback");
  const choiceFeedbackText = document.getElementById("choiceFeedbackText");
  const truthSec2 = document.getElementById("truthSec2");

  function handleChoice(type) {
    if (btnChoiceSelf) btnChoiceSelf.classList.remove("active");
    if (btnChoiceAlgo) btnChoiceAlgo.classList.remove("active");

    if (type === "self") {
      if (btnChoiceSelf) btnChoiceSelf.classList.add("active");
      if (choiceFeedbackText) {
        choiceFeedbackText.innerHTML = `💭 <strong>“내가 선택했다”</strong>고 생각하셨나요?<br>하지만 우리는 매일 알고리즘이 정교하게 배치한 수백 번의 노출 속에서 선택을 '유도'당하고 있습니다.<br>실제 다른 소비자들의 통계는 어떨까요? 아래에서 확인해 보세요.`;
      }
    } else {
      if (btnChoiceAlgo) btnChoiceAlgo.classList.add("active");
      if (choiceFeedbackText) {
        choiceFeedbackText.innerHTML = `💡 <strong>“알고리즘의 영향이다”</strong>라고 직감하셨군요!<br>현대 이커머스는 소비자가 스스로 원했다고 믿게 만들면서 은밀한 반복 노출을 설계합니다.<br>실제 통계 조사 결과를 함께 살펴보겠습니다.`;
      }
    }

    if (choiceFeedback) {
      choiceFeedback.classList.add("visible");
    }
    // [중요 개선] 강제 자동 스크롤을 완전히 제거하여, 글을 편안하게 끝까지 읽을 수 있도록 보장!
  }

  if (btnChoiceSelf) {
    btnChoiceSelf.addEventListener("click", () => handleChoice("self"));
  }
  if (btnChoiceAlgo) {
    btnChoiceAlgo.addEventListener("click", () => handleChoice("algo"));
  }

  // 글을 다 읽은 후 사용자가 직접 클릭해서 내려가거나, 스크롤해서 내려갈 수 있도록 지원
  const btnNextToStats = document.getElementById("btnNextToStats");
  if (btnNextToStats && truthSec2) {
    btnNextToStats.addEventListener("click", function () {
      truthSec2.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }


  // [2단계: 3개 통계 순차 카운트업 (0% -> 목표치)]
  const statCards = document.querySelectorAll(".stat-card");
  let statsAnimated = false;

  function runCounter(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    const countValSpan = el.querySelector(".count-val");
    if (!countValSpan) return;

    const duration = 1600;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeProgress * target;

      countValSpan.textContent = currentVal.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        countValSpan.textContent = target.toFixed(decimals);
      }
    }

    requestAnimationFrame(update);
  }

  function checkStatsScroll() {
    const triggerY = window.innerHeight * 0.82;

    statCards.forEach((card) => {
      if (card.classList.contains("visible")) return;
      const rect = card.getBoundingClientRect();
      if (rect.top < triggerY && rect.bottom > 0) {
        card.classList.add("visible");
        runCounter(card);
      }
    });
  }

  window.addEventListener("scroll", checkStatsScroll);


  // [3단계: 구매 노출 횟수 클릭 인터랙티브 막대 그래프 & 호버 반복 노출 시뮬레이션]
  const chartBars = document.querySelectorAll(".chart-bar-col");
  const graphDetailPct = document.getElementById("graphDetailPct");
  const graphDetailSub = document.getElementById("graphDetailSub");
  const graphDetailNote = document.getElementById("graphDetailNote");
  const previewIcons = document.getElementById("previewIcons");
  const previewCountText = document.getElementById("previewCountText");

  const sampleAdThumbnails = [
    "img/ad_yogurt.png",
    "img/ad_pikmin.png",
    "img/ad_earphone.png",
    "img/ad_yeopduk.png",
    "img/ad_yoajung.png",
    "img/ad_figure.png",
    "img/ad_keycap.png",
    "img/ad_band.png"
  ];

  function updateHoverPreview(reps, label) {
    if (!previewIcons || !previewCountText) return;
    previewCountText.textContent = `${label} 반복 노출 시뮬레이션 (${reps}회 연속 노출)`;
    previewIcons.innerHTML = "";

    const count = Math.min(reps, 12);
    for (let i = 0; i < count; i++) {
      const img = document.createElement("img");
      img.src = sampleAdThumbnails[i % sampleAdThumbnails.length];
      img.className = "preview-mini-thumb";
      img.style.animationDelay = (i * 0.05) + "s";
      previewIcons.appendChild(img);
    }
  }

  chartBars.forEach((bar) => {
    bar.addEventListener("click", function () {
      chartBars.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      const pct = this.getAttribute("data-pct");
      const label = this.getAttribute("data-label");
      const desc = this.getAttribute("data-desc");
      const reps = parseInt(this.getAttribute("data-reps") || "4", 10);

      if (graphDetailPct) graphDetailPct.textContent = pct + "%";
      if (graphDetailSub) graphDetailSub.textContent = label + " 노출 후 구매했다고 응답한 비율";
      if (graphDetailNote) graphDetailNote.textContent = desc;

      updateHoverPreview(reps, label);
    });

    bar.addEventListener("mouseenter", function () {
      const reps = parseInt(this.getAttribute("data-reps") || "4", 10);
      const label = this.getAttribute("data-label");
      updateHoverPreview(reps, label);
    });
  });

  // 초기 4~5회 기본 프리뷰 세팅
  updateHoverPreview(5, "4~5회");


  // ================= [4-1. 마케팅 심리 체험: 반복 노출 인터랙티브 시뮬레이터] =================
  const repProdBtns = document.querySelectorAll(".rep-prod-btn");
  const repStageBtns = document.querySelectorAll(".rep-stage-btn");
  const repMeterVal = document.getElementById("repMeterVal");
  const repMeterFill = document.getElementById("repMeterFill");
  const repThoughtText = document.getElementById("repThoughtText");
  const repDynamicCard = document.getElementById("repDynamicCard");
  const repBadge = document.getElementById("repBadge");
  const repCardImg = document.getElementById("repCardImg");
  const repCardTitle = document.getElementById("repCardTitle");
  const repCardSubtitle = document.getElementById("repCardSubtitle");
  const repCardExtra = document.getElementById("repCardExtra");
  const btnNextRepStage = document.getElementById("btnNextRepStage");
  const btnResetRepStage = document.getElementById("btnResetRepStage");

  const repStages = {
    1: {
      meter: 20,
      badge: "1단계 · 1회 노출 (스침)",
      thought: `"어? 이런 상품도 피드에 올라왔네..."`,
      thoughtSub: "(0.2초 찰나의 스침 / 무관심 & 인지 단계)",
      sub: "피드 구석 작은 배너 (시각적 자극 최소)",
      extra: "작은 크기 · 주목도 20%"
    },

    2: {
      meter: 50,
      badge: "2단계 · 3회 노출 (“어디서 봤는데?”)",
      thought: `"어라? 어디서 많이 본 것 같은데? 요즘 유행하나?"`,
      thoughtSub: "(뇌가 '낯섦'을 지우고 '친숙함'을 형성하기 시작)",
      sub: "친구 추천 게시물 아래 재등장 (호기심 유발)",
      extra: "보통 크기 · 친숙도 50%"
    },
    3: {
      meter: 80,
      badge: "3단계 · 5회 노출 (“사볼까?”)",
      thought: `"인스타에서도 계속 뜨네? 후기도 좋던데 나도 하나 사볼까?"`,
      thoughtSub: "(반복 노출이 긍정적 호감과 구매 욕구로 진화)",
      sub: "⭐ 5.0 만점 리뷰와 함께 대형 피드 광고로 노출",
      extra: "확대 크기 · 호감도 80%"
    },
    4: {
      meter: 100,
      badge: "4단계 · 10회 노출 (각인 완료!)",
      thought: `"이건 무조건 사야 해! 내 취향에 딱이야!"`,
      thoughtSub: "(알고리즘이 주입한 충동을 '내 고유한 취향'으로 착각 완료)",
      sub: "🚨 전 국민 대란템! 지금 안 사면 품절 (완전한 심리적 각인)",
      extra: "초대형 네온 발광 · 구매 확신 100%"
    }
  };

  let currentRepStage = 1;

  function updateRepetitionUI(stageNum) {
    currentRepStage = stageNum;
    const data = repStages[stageNum];
    if (!data) return;

    // 단계 버튼 활성화 표시
    repStageBtns.forEach(btn => {
      if (parseInt(btn.dataset.stage, 10) === stageNum) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // 게이지 업데이트
    if (repMeterVal) repMeterVal.textContent = data.meter + "%";
    if (repMeterFill) repMeterFill.style.width = data.meter + "%";

    // 독백 말풍선 갱신
    if (repThoughtText) {
      repThoughtText.innerHTML = `${data.thought} <span class="thought-sub">${data.thoughtSub}</span>`;
    }

    // 카드 스타일 및 텍스트 갱신
    if (repDynamicCard) {
      repDynamicCard.className = `rep-dynamic-card stage-${stageNum}`;
    }
    if (repBadge) repBadge.textContent = data.badge;
    if (repCardSubtitle) repCardSubtitle.textContent = data.sub;
    if (repCardExtra) repCardExtra.textContent = data.extra;
  }

  // 노출 단계 탭 클릭
  repStageBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const stage = parseInt(this.dataset.stage, 10);
      updateRepetitionUI(stage);
    });
  });

  // 다음 노출 버튼 클릭
  if (btnNextRepStage) {
    btnNextRepStage.addEventListener("click", function () {
      const nextStage = currentRepStage >= 4 ? 1 : currentRepStage + 1;
      updateRepetitionUI(nextStage);
    });
  }

  // 리셋 버튼 클릭
  if (btnResetRepStage) {
    btnResetRepStage.addEventListener("click", function () {
      updateRepetitionUI(1);
    });
  }

  // 상품 변경 탭 클릭
  repProdBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      repProdBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      const imgSrc = this.dataset.src;
      const prodName = this.dataset.name;

      if (repCardImg) repCardImg.src = imgSrc;
      if (repCardTitle) repCardTitle.textContent = prodName;
    });
  });


  // [4-2. 마케팅 심리 체험: 시간 압박 체험 10초 카운트다운 타이머]
  const countdownNumber = document.getElementById("countdownNumber");
  const timerProgressFill = document.getElementById("timerProgressFill");
  const timerMessage = document.getElementById("timerMessage");
  const btnDemoBuy = document.getElementById("btnDemoBuy");
  const btnDemoReset = document.getElementById("btnDemoReset");
  const demoFeedback = document.getElementById("demoFeedback");
  const truthSec4 = document.getElementById("truthSec4");

  let timerDuration = 10.0;
  let timerRemaining = 10.0;
  let timerInterval = null;
  let timerStarted = false;
  let timerPurchased = false;

  function updateTimerUI() {
    if (countdownNumber) {
      countdownNumber.textContent = Math.max(0, timerRemaining).toFixed(1);
    }
    if (timerProgressFill) {
      const pct = Math.max(0, (timerRemaining / timerDuration) * 100);
      timerProgressFill.style.width = pct + "%";
    }

    if (!timerPurchased && timerMessage) {
      if (timerRemaining > 7.0) {
        timerMessage.innerHTML = `⏳ <strong>[10초 타이머 작동]</strong> "정말 필요한가?" 고민할 틈조차 주지 않는 시간 압박`;
        timerMessage.style.color = "var(--truth-text-secondary)";
      } else if (timerRemaining > 3.5) {
        timerMessage.innerHTML = `🚨 <strong>[마감 임박 경고]</strong> "지금 창을 닫으면 혜택 영구 소멸!" 조급함 유발`;
        timerMessage.style.color = "var(--truth-text-primary)";
      } else if (timerRemaining > 0.0) {
        timerMessage.innerHTML = `🔥 <strong>[품절 직전 비상!]</strong> 3초 남음! 다른 사람이 먼저 결제하고 있습니다!`;
        timerMessage.style.color = "var(--truth-accent)";
      } else {
        timerMessage.innerHTML = `⏱️ <strong>[시간 종료]</strong> 10초 동안 "놓치면 어떡하지?"라는 불안이 들지 않았나요?<br>이것이 바로 이커머스가 설계한 '손실 회피(FOMO)' 마케팅입니다.`;
        timerMessage.style.color = "var(--truth-text-primary)";
      }
    }
  }

  function startCountdown() {
    clearInterval(timerInterval);
    timerRemaining = 10.0;
    timerPurchased = false;
    if (demoFeedback) demoFeedback.innerHTML = "";
    if (btnDemoBuy) {
      btnDemoBuy.disabled = false;
      btnDemoBuy.style.opacity = "1";
    }
    updateTimerUI();

    timerInterval = setInterval(() => {
      timerRemaining -= 0.1;
      if (timerRemaining <= 0) {
        timerRemaining = 0;
        clearInterval(timerInterval);
        timerInterval = null;
      }
      updateTimerUI();
    }, 100);
  }

  if (btnDemoBuy) {
    btnDemoBuy.addEventListener("click", function () {
      if (timerRemaining <= 0) return;
      clearInterval(timerInterval);
      timerPurchased = true;
      const boughtAt = (10.0 - timerRemaining).toFixed(1);

      if (demoFeedback) {
        demoFeedback.innerHTML = `⚡ <strong>${boughtAt}초 만에 구매 버튼을 누르셨습니다!</strong><br>“정말 필요한가?”보다 “놓치면 어떡하지?”라는 심리적 조급함이 먼저 이성적 판단을 가로막았습니다.`;
        demoFeedback.style.color = "var(--truth-accent)";
      }
      btnDemoBuy.disabled = true;
      btnDemoBuy.style.opacity = "0.6";
    });
  }

  if (btnDemoReset) {
    btnDemoReset.addEventListener("click", function () {
      startCountdown();
    });
  }

  // 체험 2 타이머 카드가 화면에 도달했을 때 정확히 10초 카운트다운 시작
  const timerDemoCard = document.querySelector(".timer-demo-card");
  function checkTimerScroll() {
    if (timerStarted || !timerDemoCard) return;
    const rect = timerDemoCard.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.78 && rect.bottom > 0) {
      timerStarted = true;
      startCountdown();
    }
  }

  window.addEventListener("scroll", checkTimerScroll);


  // 처음으로 돌아가기 버튼 클릭 시 다시 상단으로 스무스 스크롤
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});
