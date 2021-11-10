var vData = [{
    title: "Start",
    skipHeader: true,
    icon: 'fa-arrow-circle-right',
    cost: null,
    f: function () {}
},
{
    title: "Atea",
    cost: 1000,
    headerBgColor: 'brown',
    rentalPrice: 100
},
{
    title: "Adcom",
    cost: 1500,
    headerBgColor: 'brown',
    rentalPrice: 200
},
{
    title: "Accenture",
    cost: 1600,
    headerBgColor: 'blue',
    rentalPrice: 300
},
{
    title: "Yahoo",
    cost: 1700,
    headerBgColor: 'blue',
    rentalPrice: 400
},
{
    title: "Free VPN",
    skipHeader: true,
    icon: 'fa-desktop',
    f: function (item) {
        var vPlayer = monopol.players.get(item.player_id);
        toastr.success(vPlayer.name + ' fikk gratis VPN. Han trenger ikke betale neste gang du lander et andres firma.');
        vPlayer.freeVPN = true;
    }
},
{
    title: "Snapchat",
    cost: 1800,
    headerBgColor: 'blue',
    rentalPrice: 500
},
{
    title: "Twitter",
    cost: 1900,
    headerBgColor: 'hotpink',
    rentalPrice: 600
},
{
    title: "Omega 365",
    cost: 2000,
    headerBgColor: 'hotpink',
    rentalPrice: 700
},
{
    title: "Duo",
    cost: 2100,
    headerBgColor: 'orange',
    rentalPrice: 800
},
{
    title: "Hacked",
    cost: null,
    skipHeader: true,
    icon: 'fa-user-secret',
    f: function (item) {
        var vPlayer = monopol.players.get(item.player_id);
        toastr.error(vPlayer.name + ' ble hacked og mistet et av sine firma.');

        var i = 0,
        vPlayerID = item.player_id;
        $.each(monopol.board.cards, function (index,c) {
            if (i == 0 && c.owner == vPlayerID) {
                c.owner = null;
                toastr.error(c.name + ' ble fjernet.');
                $(c.dom).parent().removeClass('boder-player' + vPlayerID);
                i = 1;
                return;
            }
        });
    }
},
{
    title: "Instagram",
    cost: 2200,
    headerBgColor: 'orange',
    rentalPrice: 900
},
{
    title: "Vips",
    cost: 2300,
    headerBgColor: 'orange',
    rentalPrice: 1000
},
{
    title: "IBM",
    cost: 2400,
    headerBgColor: 'red',
    rentalPrice: 1100
},
{
    title: "Apple",
    cost: 2500,
    headerBgColor: 'red',
    rentalPrice: 2000
},
{
    title: "Virus",
    skipHeader: true,
    icon: 'fa-virus',
    cost: null,
    f: function (item) {
        toastr.info('Dine firma har fått virus. Du må betale 100 $.');
        var vPlayer = monopol.board.currentplayer_id,
            PlayerCurrentCash = monopol.players.get(vPlayer).cash;
        monopol.players.cash.set(vPlayer, PlayerCurrentCash - 100);
    }
},
{
    title: "Youtube",
    cost: 2600,
    headerBgColor: 'yellow',
    headerFontColor: 'black',
    rentalPrice: 3000
},
{
    title: "Microsft",
    cost: 2700,
    headerBgColor: 'yellow',
    headerFontColor: 'black',
    rentalPrice: 3500
},
{
    title: "Google",
    cost: 3000,
    headerBgColor: 'green',
    rentalPrice: 4000
},
{
    title: "Facebook",
    cost: 3500,
    headerBgColor: 'green',
    rentalPrice: 5000
}
];

var monopol = {
    isDebug: true,
    userSession: {},
    board: {
        currentplayer_id: 1,
        init: function () {
            monopol.board.attachEvent('onRolledDice', function (n) {
                monopol.board.changePlayerPosition(n, monopol.board.currentplayer_id);
            });

            monopol.board.attachEvent('onBuy', function (item) {
                console.log(item);
                monopol.board.cards.close(item.card_id, true);
            });

            monopol.board.attachEvent('onPlayerChangedPosition', function (item) {
                var vCard = monopol.board.cards.get(item.card_id);
                if (vCard.f) {
                    vCard.f(item);
                    monopol.players.nextPlayer();
                    return;
                }

                monopol.board.cards.pay(item.player_id, item.card_id);

            });

            $(document).on('click', '#buyNow', function () {
                monopol.board.fireEvent('onBuy', {
                    player_id: monopol.board.currentplayer_id,
                    card_id: monopol.players.get(monopol.board.currentplayer_id).pos
                });

            });

            $('#Win').on('hidden.bs.modal', function () {
                window.location.reload();
            });

            var vAudio = new Audio('m.mp3');
            vAudio.play();
            $(document).on('click', '#buyNotNow', function () {
                monopol.board.cards.close(monopol.players.get(monopol.board.currentplayer_id).pos, false);
            });
        },
        changePlayerPosition(card_number, player_id) {
            monopol.board.fireEvent('onPlayerChangeingPosition', {
                card_number: monopol.players.get(player_id).pos,
                player_id: player_id
            });

            if (!monopol.players.get(player_id).pos) {
                monopol.players.get(player_id).pos = 0;
            }
            if (monopol.players.get(player_id).pos + card_number > 20) {
                monopol.players.get(player_id).pos = (monopol.players.get(player_id).pos + card_number) - 20;

            } else {
                monopol.players.get(player_id).pos += card_number;
            }

            $(monopol.board.cards.get(monopol.players.get(player_id).pos).dom).find('.players').append(monopol.players.get(player_id).dom);

            var vName = monopol.players.get(player_id).name;
            if (monopol.players.get(player_id).haveinit) {
                toastr.info(vName + ' trillet ' + card_number);

                if (!monopol.players.get(player_id).isComputer && monopol.board.cards.get(monopol.players.get(player_id).pos).cost && !monopol.board.cards.get(monopol.players.get(player_id).pos).owner) {
                    monopol.board.cards.open(monopol.players.get(player_id).pos);
                } else if (!monopol.players.get(player_id).isComputer && monopol.board.cards.get(monopol.players.get(player_id).pos).owner == player_id) {
                    monopol.players.nextPlayer();
                }

                monopol.board.fireEvent('onPlayerChangedPosition', {
                    card_id: monopol.players.get(player_id).pos,
                    player_id: player_id
                });

        
            } else {
                toastr.success(vName + ' joinet spliiet');
                monopol.players.get(player_id).haveinit = true;

            }
        },
        events: {
            onNextPlayer: [],
            onRollingDice: [],
            onRolledDice: [],
            onPlayerChangeingPosition: [],
            onPlayerChangedPosition: [],
            onBuy: []
        },
        attachEvent: function (name, f, arg) {
            monopol.board.events[name].push({
                f: f,
                arg: arg
            });
        },
        fireEvent: function (name, arg) {
            if (monopol.isDebug) {
                console.log('--------');
                console.log('Fire Event:' + name);
                console.log('Args:');
                for (var key in arg) {
                    console.log(`${key}: ${arg[key]}`);
                }
                console.log('--------');
            }

            $.each(monopol.board.events[name], function (index, item) {
                item.f(arg);
            });
        },
        dice: {
            canroll: true,
            randomizeNumber: function () {
                //Randimizes a number between 1 and 6
                var random = Math.floor((Math.random() * 6) + 1);
                return random;
            },
            rollDice: function (side, n) {
                //Removes old class and adds the new
                var dice = $('#dice');
                var currentClass = dice.attr('class');
                var newClass = 'show-' + side;

                dice.removeClass();
                dice.addClass(newClass);

                if (currentClass == newClass) {
                    dice.addClass('show-same');
                }
            },
            role: function () {
                if (!monopol.board.dice.canroll && !monopol.players.get(monopol.board.currentplayer_id).isComputer) {
                    return;
                }
                monopol.board.dice.canroll = true;
                monopol.board.fireEvent('onRollingDice');

                var number = monopol.board.dice.randomizeNumber();

                if (number == 1) {
                    monopol.board.dice.rollDice('front', number);
                } else if (number == 2) {
                    monopol.board.dice.rollDice('top', number);
                } else if (number == 3) {
                    monopol.board.dice.rollDice('left', number);
                } else if (number == 4) {
                    monopol.board.dice.rollDice('right', number);
                } else if (number == 5) {
                    monopol.board.dice.rollDice('bottom', number);
                } else if (number == 6) {
                    monopol.board.dice.rollDice('back', number);
                }
                monopol.board.fireEvent('onRolledDice', number);
            },

        },
        cards: {
            items: [],
            open: function (id) {
                var vCard = monopol.board.cards.get(id);
                if (vCard.f) {
                    return;
                }
                if (!vCard.cost) { return; }
                if (monopol.players.get(monopol.board.currentplayer_id).isComputer) {
                    return;
                }
                $('#buyTitme').text('Vil du kjøpe  ' + vCard.title + '?');
                $('#cost').text(vCard.cost + ' $');
                $('#buy').modal('show');
            },
            buy: function (id) {
                var vCard = monopol.board.cards.get(id);
                if (vCard.owner || !vCard.cost) {
                    return;
                }
                
                //$(vCard.dom).addClass('border-warning');
               
                var vPlayerID = monopol.board.currentplayer_id,
                    vPlayer = monopol.players.get(vPlayerID),
                    vCurrent = monopol.players.cash.get(vPlayerID);
                if (vPlayerID, vCurrent - vCard.cost <= 0) { return; }
                vCard.owner = monopol.board.currentplayer_id;
                $(vCard.dom).addClass('border-player' + vCard.owner.toString());

                monopol.players.cash.set(vPlayerID, vCurrent - vCard.cost);
                toastr.info(vPlayer.name + ' kjøpte ' + vCard.title);

            },
            close: function (id, yes) {
                if (yes) {
                    monopol.board.cards.buy(id);
                }
                $('#buy').modal('hide');
                monopol.players.nextPlayer();
            },
            pay: function (player_id, card_id) {
                var vCard = monopol.board.cards.get(card_id),
                vPlayer = monopol.players.get(player_id);
                if (!vCard.rentalPrice) { return; }

                var vRentalPrice = vCard.rentalPrice;
                
                if (!vCard.owner || vCard.owner == player_id) {
                    return;
                }
                if (vPlayer.freeVPN) {
                    toastr.success(vPlayer.name + ' bruke gratis VPN.');
                    vPlayer.freeVPN = null;
                    return;
                }
               
                 var vOwnerPlayer = monopol.players.get(vCard.owner),
                    vPlayerCash = vPlayer.cash;
                if (vPlayerCash - vRentalPrice <= 0) {
                    debugger;
                    $('#WinPlayer').text(vOwnerPlayer.name + ' vant!');
                    $('#Win').modal('show');

                    return;
                }

                toastr.error(vPlayer.name + ' betaler ' + vRentalPrice + ' $, for å parkere på ' + vCard.title);
                monopol.players.cash.set(player_id, vPlayerCash - vRentalPrice);
                monopol.players.cash.set(vCard.owner, vPlayerCash + vRentalPrice);
                var visComputer = monopol.players.get(player_id).isComputer;
                if (!visComputer) {
                    monopol.players.nextPlayer();
                }

            },
            get: function (id) {
                var vItem = null;
                $.each(monopol.board.cards.items, function (index, item) {
                    if (item.id == id) {
                        vItem = item;
                    }
                });
                return vItem;
            },
            add(item) {
                monopol.board.cards.items.push(item);
            }
        }
    },
    players: {
        dom: $('#players'),
        items: [],
        cash: {
            get: function (id) {
                return monopol.players.get(id).cash;
            },
            set: function (id, cash) {
                var vPlayer = monopol.players.get(id);
                vPlayer.cash = cash;
                $('[data-cash-id=' + id.toString() + ']').text(cash.toString() + ' $');
            }
        },
        nextPlayer: function () {
            if (monopol.board.currentplayer_id >= monopol.players.items.length) {
                monopol.board.currentplayer_id = 1;
            } else {
                monopol.board.currentplayer_id++;
            }
            monopol.board.fireEvent('onNextPlayer', { player_id: monopol.board.currentplayer_id });
        },
        get: function (id) {
            var vItem = null;
            $.each(monopol.players.items, function (index, item) {
                if (item.id == id) {
                    vItem = item
                }
            });
            return vItem;
        },
        add: function (playername, is_me, isComputer) {
            var vItem = {
                guid: playername.toString() + '-' + (monopol.players.items.length + 1).toString(),
                name: playername,
                id: (monopol.players.items.length + 1),
                current_card: 1,
                cash: 10000,
                isComputer: isComputer,
                dom: $('<i class="fas fa-car player' + (monopol.players.items.length + 1).toString() + '"></i>')
            };
            monopol.players.items.push(vItem);
            monopol.board.changePlayerPosition(1, (monopol.players.items.length));
            if (is_me) {
                monopol.userSession = vItem;
                return vItem;
            } else {
                $(monopol.players.dom).append('<div><i class="fas fa-car player' + vItem.id + '"></i> ' + playername + ' - ' + '<span data-cash-id="' + vItem.id.toString() + '">' + vItem.cash.toString() + '  $</span></div>');
            }
        }
    }
};

monopol.computer = {
    next: function () {
        var vRol = monopol.board.dice.role();
        monopol.board.dice.canroll = true;
    },
    init: function () {
        monopol.players.add('Computer', false, true);

        monopol.board.attachEvent('onPlayerChangedPosition', function (item) {
            if (monopol.players.get(monopol.board.currentplayer_id).isComputer) {
                monopol.board.dice.canroll = true;
                monopol.board.cards.buy(item.card_id);

                monopol.players.nextPlayer();
            }
        });

        monopol.board.attachEvent('onNextPlayer', function (item) {
            if (!monopol.players.get(item.player_id).isComputer) {
                monopol.board.dice.canroll = false;
                return;
            }
            monopol.board.dice.canroll = false;
            setTimeout(function () {
                monopol.computer.next();

            }, 3000);
        });
        monopol.board.dice.canroll = true;
    }
};



function createRows(to, row) {
    var vRow = $('<div class="row"></div>');

    var vCols = [1, 2, 3, 4, 5, 6];

    $.each(vCols, function (index, item) {
        var vIsVerticalRow = (row == 1 || row == 6),
            n;
        if ((!vIsVerticalRow && item == 6) || (vIsVerticalRow && item == 6)) {
            n = (6 + (row - 1));
        } else if (vIsVerticalRow && row == 6 && item < 6) {
            n = (6 + (row - 1)) - (item - (6));
        } else if (!vIsVerticalRow) {
            n = 22 + (-row);
        } else {
            n = item;
        }

        if ((item == 1 || item == 6) || vIsVerticalRow) {
            var vCss = '';

            if (vData[n - 1].headerBgColor) {
                vCss = 'background: ' + vData[n - 1].headerBgColor + ';';
            }
            if (vData[n - 1].headerFontColor) {
                vCss += ' color: ' + vData[n - 1].headerFontColor + ';';
            }


            var vHeader = '<div class="card-header" style="' + vCss + '">' + vData[n - 1].title + '</div>';


            var vCost = "0";
            if (vData[n - 1].cost) {
                vCost = vData[n - 1].cost.toString();
            }
            var vBody = '<div class="players" style="height: 10px"></div><br>Cost:' + vCost + '$';
            if (vData[n - 1].skipHeader != true) {
                vHeader = '<div class="card-header" style="' + vCss + '"><strong>' + n.toString() + ':</strong> ' + vData[n - 1].title + '</div>';

            } else {
                vBody = '<div class="players" style="height: 10px"></div><i style="color:red; font-size:30px" class="fas ' + vData[n - 1].icon + '"></i><br>';
            }

            var vCard = $('<div class="card"> ' + vHeader + '<div class="card-body">' + vBody + '</div></div>');
            monopol.board.cards.add({
                id: n,
                dom: vCard,
                owner: null,
                rentalPrice: vData[n - 1].rentalPrice,
                cost: vData[n - 1].cost,
                f: vData[n - 1].f,
                title: vData[n - 1].title
            });
            var vCol = $('<div class="col-ad-1" data-cardid="' + n + '"></div>');
            vCol.append(monopol.board.cards.get(n).dom);

            vRow.append(vCol);
        } else {
            vRow.append('<div class="col-ad-1"></div>');
        }
    });
    to.append(vRow);
}

function createBoard() {
    var vRows = [1, 2, 3, 4, 5, 6];

    $.each(vRows, function (index, item) {
        createRows($('#board'), item);
    });
}
createBoard();

/*Dice*/
$(document).ready(function () {
    $('#dice').on('click ', monopol.board.dice.role);
    $('#exampleModal').modal('show');

    $(document).on('click', '#StartGame', function () {
        var vName = $('#MyPlayerName').val();
        var vItem = monopol.players.add(vName, true);
        $('#myCar').addClass('player' + vItem.id.toString());
        $('#minCredit').text(vItem.cash.toString() + ' $');
        $('#exampleModal').modal('hide');
        monopol.computer.init();
        monopol.board.init();
    });


});

$(document).on('click', '#addUser', function (index, item) {
    monopol.players.add($('#playername').val());
});
