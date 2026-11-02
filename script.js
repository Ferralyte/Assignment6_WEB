$(document).ready(function() {

  const initialPartyData = [
    {
      roomName: "Balcony",
      floor: 2,
      guests: [
        { name: "Aigerim", color: "blue", time: "20:45", isAitu: true, items: ["cup", "crumbs"] },
        { name: "Aliya", color: "yellow", time: "21:15", isAitu: false, items: ["phone", "bag"] },
        { name: "Madina", color: "green", time: "22:10", isAitu: true, items: ["phone", "bag"] },
        { name: "Ivan", color: "black", time: "20:10", isAitu: true, items: ["bag"] }
      ]
    },
    {
      roomName: "Hall",
      floor: 2,
      guests: [
        { name: "Arman", color: "yellow", time: "20:35", isAitu: false, items: ["bag", "cup"] },
        { name: "Sophia", color: "blue", time: "21:20", isAitu: true, items: ["phone"] },
        { name: "Dias", color: "green", time: "19:45", isAitu: true, items: [] },
        { name: "Bekzat", color: "purple", time: "20:55", isAitu: true, items: ["bag", "glasses", "cup"] },
        { name: "Aruzhan", color: "blue", time: "21:50", isAitu: false, items: ["phone"] },
        { name: "Saule", color: "green", time: "21:25", isAitu: false, items: ["glasses"] }
      ]
    },
    {
      roomName: "Kitchen",
      floor: 1,
      guests: [
        { name: "Nurlan", color: "red", time: "19:40", isAitu: true, items: ["bag"] },
        { name: "Emma", color: "black", time: "20:15", isAitu: false, items: ["glasses"] },
        { name: "Timur", color: "green", time: "21:05", isAitu: true, items: ["phone", "bag"] },
        { name: "Sergey", color: "yellow", time: "20:50", isAitu: true, items: [] },
        { name: "Yerlan", color: "pink", time: "21:40", isAitu: true, items: ["glasses", "phone"] },
        { name: "Kamila", color: "black", time: "20:05", isAitu: false, items: ["bag"] }
      ]
    },
    {
      roomName: "Living room",
      floor: 1,
      guests: [
        { name: "Daniel", color: "orange", time: "19:55", isAitu: true, items: ["glasses"] },
        { name: "Zarina", color: "green", time: "21:10", isAitu: false, items: ["bag", "glasses", "crumbs"] },
        { name: "Natasha", color: "yellow", time: "20:30", isAitu: true, items: [] },
        { name: "Askar", color: "purple", time: "21:00", isAitu: true, items: ["bag"] },
        { name: "Inkar", color: "purple", time: "20:20", isAitu: false, items: ["bag"] }
      ]
    }
  ];

  let partyData = JSON.parse(JSON.stringify(initialPartyData));

  const itemIcons = {
    phone: "📱",
    glasses: "👓",
    bag: "👜",
    cup: "🥤",
    crumbs: "🍰"
  };

  function buildPage(dataToUse = partyData) {
    $(".guests-container").empty();

    dataToUse.forEach(room => {
      const $roomContainer = $(`[data-room="${room.roomName}"] .guests-container`);

      room.guests.forEach(guest => {
        const avatarUrl = `https://api.dicebear.com/9.x/open-peeps/svg?seed=${guest.name}`;
        const itemsStr = guest.items.join(",");
        const iconsHtml = guest.items.map(i => itemIcons[i] || "").join("");
        const aituBadge = guest.isAitu ? `<div class="aitu-badge">AITU</div>` : "";

        const $card = $(`
          <div class="guest-card" 
               data-name="${guest.name}"
               data-color="${guest.color}"
               data-time="${guest.time}"
               data-aitu="${guest.isAitu}"
               data-items="${itemsStr}">
            <div class="avatar-wrapper color-${guest.color}">
              <img class="avatar-img" src="${avatarUrl}" alt="${guest.name}">
              ${aituBadge}
            </div>
            <div class="guest-name">${guest.name}</div>
            <div class="guest-time">${guest.time}</div>
            <div class="guest-items">${iconsHtml}</div>
          </div>
        `);

        $roomContainer.append($card);
      });
    });
  }

  buildPage();

  function resetAndHighlight($targetGuests, $targetRooms = $()) {
    $(".guest-card, .room").stop(true, true).removeClass("highlight highlight-room").css("opacity", 1);

    $targetGuests.addClass("highlight").animate({ top: "-10px" }, 150).animate({ top: "0px" }, 150);
    $targetRooms.addClass("highlight-room");

    if ($targetGuests.length > 0) {
      $(".guest-card").not($targetGuests).stop(true, true).fadeTo(300, 0.2);
    } else if ($targetRooms.length > 0) {
      $(".room").not($targetRooms).find(".guest-card").stop(true, true).fadeTo(300, 0.2);
    }

    const names = $targetGuests.map((_, el) => $(el).data("name")).get().join(", ");
    if ($targetRooms.length > 0 && $targetGuests.length === 0) {
      const roomNames = $targetRooms.map((_, el) => $(el).data("room")).get().join(", ");
      $("#result-text").text(`Found Rooms (${$targetRooms.length}): ${roomNames}`);
    } else {
      $("#result-text").text(`Found (${$targetGuests.length}): ${names || "None"}`);
    }
  }

  const caseChains = {
    1: () => $('#hall .guest-card'),
    2: () => $('.guest-card[data-color="yellow"], .guest-card[data-color="purple"]'),
    3: () => $('[data-floor="2"] .guest-card[data-aitu="true"]'),
    4: () => $('.guest-card[data-items*="glasses"], .guest-card[data-items*="bag"]'),
    5: () => $('.guest-card[data-items=""]'),
    6: () => $('.guest-card[data-items*="phone"]:not([data-items*="bag"])'),
    7: () => $('.guest-card').filter(function() {
      const t = $(this).data('time');
      return t >= "20:30" && t <= "21:00";
    }),
    8: () => $('.guest-card[data-aitu="false"]').filter(function() {
      return $(this).data('time') > "21:00";
    }),
    9: () => $('.guest-card[data-name="Askar"]').siblings('.guest-card'),
    10: () => $('.guests-container .guest-card:last-child'),
    11: () => $('.guests-container .guest-card:nth-child(3)'),
    12: () => $('.guest-card[data-name="Timur"]').nextAll('.guest-card'),
    13: () => $('.guest-card[data-color="black"]').prev('.guest-card'),
    14: () => $('.guest-card[data-name="Aruzhan"]').closest('.room'),
    15: () => $('.room').filter(function() {
      return $(this).find('.guest-card').length < 6;
    }),
    16: () => $('.room').has('.guest-card[data-items*="cup"]').not(':has(.guest-card[data-items*="glasses"])'),
    17: () => $('.guests-container .guest-card:first-child'),
    18: () => {
      const mirasHtml = `
        <div class="guest-card" data-name="Miras" data-color="blue" data-time="21:20" data-aitu="true" data-items="phone" style="display:none;">
          <div class="avatar-wrapper color-blue">
            <img class="avatar-img" src="https://api.dicebear.com/9.x/open-peeps/svg?seed=Miras" alt="Miras">
            <div class="aitu-badge">AITU</div>
          </div>
          <div class="guest-name">Miras</div>
          <div class="guest-time">21:20</div>
          <div class="guest-items">📱</div>
        </div>`;
      const $miras = $(mirasHtml);
      $('.guest-card[data-name="Askar"]').after($miras);
      $miras.fadeIn(500);
      return $miras;
    },
    19: () => {
      const $natasha = $('.guest-card[data-name="Natasha"]');
      $natasha.fadeOut(500, function() {
        $(this).remove();
      });
      return $natasha;
    },
    20: () => {
      return $('[data-floor="1"] .guest-card')
        .filter(function() {
          const t = $(this).data('time');
          const items = $(this).data('items') || "";
          return t > "21:00" && t < "21:30" && items.includes('crumbs') && !items.includes('cup');
        })
        .filter(function() {
          return $(this).prev('.guest-card[data-aitu="true"]').length > 0 ||
                 $(this).next('.guest-card[data-aitu="true"]').length > 0;
        });
    }
  };

  $(".btn-case").click(function() {
    const caseNum = $(this).data("case");
    buildPage();

    const result = caseChains[caseNum]();
    if (result.hasClass && result.hasClass("room")) {
      resetAndHighlight($(), result);
    } else {
      resetAndHighlight(result);
    }
  });

  $("#btn-clear").click(function() {
    $(".guest-card, .room").stop(true, true).removeClass("highlight highlight-room").css("opacity", 1);
    $("#result-text").text("Spotlight cleared.");
  });

  let $activeCard = null;

  $(document).on("click", ".guest-card", function(e) {
    e.stopPropagation();
    const $card = $(this);
    $activeCard = $card;

    const name = $card.data("name");
    const color = $card.data("color");
    const time = $card.data("time");
    const isAitu = $card.data("aitu");
    const items = ($card.data("items") || "").toString().split(",").filter(Boolean);

    $("#modal-name").text(name);
    $("#modal-time").text(`Came at: ${time}`);
    $("#modal-astu").text(isAitu ? "Status: AITU student" : "Status: Guest");
    $("#modal-items").text(`Items: ${items.length ? items.join(", ") : "None"}`);
    $("#modal-color").text(`Clothing color: ${color}`);

    const currentRoom = $card.closest(".room").data("room");
    const $moveContainer = $("#move-buttons").empty();

    ["Balcony", "Hall", "Kitchen", "Living room"].forEach(r => {
      if (r !== currentRoom) {
        $moveContainer.append(`<button class="btn-move-to" data-target="${r}">Move to ${r}</button>`);
      }
    });

    const avatarOffset = $card.find(".avatar-img").offset();
    const $modal = $("#guest-modal");
    
    $("#modal-overlay").fadeIn(200);

    $modal.stop(true, true).css({
      top: avatarOffset.top,
      left: avatarOffset.left,
      opacity: 0,
      transform: "scale(0.2)",
      display: "block"
    }).animate({
      top: ($(window).height() - $modal.outerHeight()) / 2 + $(window).scrollTop(),
      left: ($(window).width() - $modal.outerWidth()) / 2,
      opacity: 1
    }, {
      duration: 300,
      step: function(now, fx) {
        if (fx.prop === "opacity") {
          const scale = 0.2 + 0.8 * now;
          $(this).css("transform", `scale(${scale})`);
        }
      }
    });
  });

  function closeModal() {
    if (!$activeCard || !$activeCard.length) {
      $("#modal-overlay").fadeOut(200);
      return;
    }
    const avatarOffset = $activeCard.find(".avatar-img").offset();
    
    $("#guest-modal").stop(true, true).animate({
      top: avatarOffset.top,
      left: avatarOffset.left,
      opacity: 0
    }, {
      duration: 250,
      step: function(now, fx) {
        if (fx.prop === "opacity") {
          const scale = 0.2 + 0.8 * now;
          $(this).css("transform", `scale(${scale})`);
        }
      },
      complete: function() {
        $("#modal-overlay").hide();
        $(this).css("transform", "scale(1)");
      }
    });
  }

  $("#modal-close").click(closeModal);

  $(document).click(function(e) {
    if ($(e.target).is("#modal-overlay")) closeModal();
  });

  $(document).keydown(function(e) {
    if (e.key === "Escape") closeModal();
  });

  $(document).on("click", ".btn-move-to", function() {
    const targetRoomName = $(this).data("target");
    const $guest = $activeCard;
    closeModal();

    if (!$guest || !$guest.length) return;

    const $targetContainer = $(`[data-room="${targetRoomName}"] .guests-container`);

    const startPos = $guest.offset();
    const $clone = $guest.clone().appendTo("body").css({
      position: "absolute",
      top: startPos.top,
      left: startPos.left,
      zIndex: 2000,
      margin: 0
    });

    $guest.css("visibility", "hidden").animate({ width: 0, padding: 0 }, 300);

    const $placeholder = $('<div class="guest-card" style="width:0; padding:0; opacity:0;"></div>');
    $targetContainer.append($placeholder);
    $placeholder.animate({ width: "85px", padding: "6px" }, 300);

    setTimeout(() => {
      const targetPos = $placeholder.offset();
      $clone.animate({
        top: targetPos.top,
        left: targetPos.left
      }, 500, function() {
        $clone.remove();
        $placeholder.replaceWith($guest.css({ visibility: "visible", width: "85px", padding: "6px" }));
      });
    }, 300);
  });

  const isSorted = {};

  $(".btn-sort").click(function() {
    const $room = $(this).closest(".room");
    const roomName = $room.data("room");
    const $container = $room.find(".guests-container");
    const $cards = $container.children(".guest-card").toArray();

    isSorted[roomName] = !isSorted[roomName];

    if (isSorted[roomName]) {
      $cards.sort((a, b) => $(a).data("time").localeCompare($(b).data("time")));
    } else {
      const origRoom = partyData.find(r => r.roomName === roomName);
      const origOrder = origRoom ? origRoom.guests.map(g => g.name) : [];
      $cards.sort((a, b) => origOrder.indexOf($(a).data("name")) - origOrder.indexOf($(b).data("name")));
    }

    $cards.forEach(card => {
      const $c = $(card);
      $c.stop(true, true).css("position", "relative").animate({ left: "10px" }, 100).animate({ left: "0px" }, 100);
      $container.append($c);
    });
  });

});
